package com.atguigu.tingshu.common.login;

import com.atguigu.tingshu.common.constant.RedisConstant;
import com.atguigu.tingshu.common.execption.GuiguException;
import com.atguigu.tingshu.common.result.ResultCodeEnum;
import com.atguigu.tingshu.common.util.AuthContextHolder;
import com.atguigu.tingshu.model.user.UserInfo;
import com.atguigu.tingshu.vo.user.UserInfoVo;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.data.redis.core.RedisTemplate;

@Component
@Aspect
public class GuiGuLoginAspect {

    @Autowired
    private RedisTemplate redisTemplate;


    @Around("execution(* com.atguigu.tingshu.*.api.*.*(..)) && @annotation(guiGuLogin) ")
    public Object doBasicProfiling(ProceedingJoinPoint pjp ,GuiGuLogin guiGuLogin) throws Throwable {
        //一、前置通知
        //1.获取请求头中的token
        //1.1 获取请求对象
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        ServletRequestAttributes sra = (ServletRequestAttributes) requestAttributes;
        HttpServletRequest request = sra.getRequest();
        //1.2 获取请求头中的token
        String token = request.getHeader("token");

        //2.构建Redis中的key
        //2.1 构建登录信息key
        String loginKey = RedisConstant.USER_LOGIN_KEY_PREFIX + token;
        //2.2 获取Redis中的信息
        UserInfoVo userInfoVo = (UserInfoVo) redisTemplate.opsForValue().get(loginKey);

        //3.如果接口上的GuiGuLogin注解的required属性为true，且用户信息为空，抛出异常，208，引导用户登录
        if(guiGuLogin.required() && userInfoVo == null){
            throw new GuiguException(ResultCodeEnum.LOGIN_AUTH);
        }

        //4.如果有值，存入ThreadLocal
        if(userInfoVo != null){
            AuthContextHolder.setUserId(userInfoVo.getId());
        }

        //5.执行目标方法
        //二、执行目标方法
        Object retVal = pjp.proceed();


        //三、后置通知
        //6.清理ThreadLocal，造成内存泄漏
        AuthContextHolder.removeUserId();
        return retVal;
    }

}
