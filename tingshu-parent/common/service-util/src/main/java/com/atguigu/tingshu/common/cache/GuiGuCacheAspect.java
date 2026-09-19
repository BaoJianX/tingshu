package com.atguigu.tingshu.common.cache;


import cn.hutool.core.util.RandomUtil;
import com.atguigu.tingshu.common.constant.RedisConstant;
import com.atguigu.tingshu.common.execption.GuiguException;
import com.atguigu.tingshu.common.login.GuiGuLogin;
import com.atguigu.tingshu.common.result.ResultCodeEnum;
import com.atguigu.tingshu.common.util.AuthContextHolder;
import com.atguigu.tingshu.vo.user.UserInfoVo;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.annotation.Annotation;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Component
@Aspect
public class GuiGuCacheAspect{

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RedissonClient redissonClient;

    @Around("@annotation(guiGuCache) ")
    public Object doBasicProfiling(ProceedingJoinPoint pjp , GuiGuCache guiGuCache) throws Throwable {

        try {
            //1.从redis获取数据
            //1.1 构建Redis业务缓存key
            //1.1.1 获取注解中指定前缀
            String prefix = guiGuCache.prefix();
            //1.1.2获取方法参数作为key一部分
            String params = "";
            Object[] args = pjp.getArgs();
            if(args != null && args.length > 0){
                params = Arrays.asList(args)
                        .stream().map(arg->arg.toString())
                        .collect(Collectors.joining("_"));
            }else{
                MethodSignature methodSignature = (MethodSignature) pjp.getSignature();
                params = methodSignature.getMethod().getName();
            }
            //1.2拼接redis缓存key
            String redisKey = prefix + params;
            //1.3 查询redis业务数据
            Object result = redisTemplate.opsForValue().get(redisKey);
            if(result != null){
                return result;
            }
            //2.尝试获取分布式锁
            //2.1构建锁key
            String lockKey = redisKey + RedisConstant.CACHE_LOCK_SUFFIX;
            //2.2创建分布式锁对象
            RLock lock = redissonClient.getLock(lockKey);
            //2.3 尝试获取分布式锁
            boolean flag = lock.tryLock(RedisConstant.ALBUM_LOCK_EXPIRE_PX2, TimeUnit.SECONDS);
            if(flag){
                try {
                    //3.1 执行目标方法
                    result = pjp.proceed();
                    //3.2 将业务数据放入redis缓存
                    long ttl = guiGuCache.ttl() + RandomUtil.randomInt(60, 600);
                    redisTemplate.opsForValue().set(redisKey, result, ttl, guiGuCache.timeUnit());
                    //3.3 响应结果
                    return result;
                } finally {
                    lock.unlock();
                }
            }
            else{
                try {
                    //4.获取不到锁自旋
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                return doBasicProfiling(pjp, guiGuCache);
            }
        } catch (Throwable e) {
            log.error("redis服务暂不可用，执行兜底处理方案，直接查库:",e);
            return pjp.proceed();
        }


    }

}
