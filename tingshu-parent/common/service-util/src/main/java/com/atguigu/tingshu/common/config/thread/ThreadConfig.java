package com.atguigu.tingshu.common.config.thread;

import com.atguigu.tingshu.common.zipkin.ZipkinHelper;
import com.atguigu.tingshu.common.zipkin.ZipkinTaskDecorator;
import jdk.jfr.SettingDescriptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.*;

@Configuration
public class ThreadConfig {


    @Bean
    public Executor threadPoolExecutor(){

        int cpuCount = Runtime.getRuntime().availableProcessors();
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                cpuCount * 2,
                cpuCount * 2,
                10,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(200),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.CallerRunsPolicy()
        );
        executor.prestartCoreThread();
        return executor;
    }

    /**
     * 新增线程池：ThreadPoolTaskExecutor 版
     * <p>
     * 与上面 threadPoolExecutor 的区别：这是 Spring 管理的线程池，
     * 支持优雅关闭（关闭时先等任务跑完，再销毁其他 Bean，避免任务还在跑而数据库连接池已关闭）。
     * <p>
     * 注意：容器里现在有两个 Executor 类型的 Bean，按类型注入会有歧义，
     * 所以注入时要靠字段名区分，例如 {@code @Autowired private Executor threadPoolTaskExecutor;}
     */

    @Autowired
    private ZipkinHelper zipkinHelper;

    @Bean
    public Executor threadPoolTaskExecutor() {
        // 线程数：CPU 核数 * 2 + 1
        int count = Runtime.getRuntime().availableProcessors();
        int threadCount = count * 2 + 1;

        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        // 核心池大小
        taskExecutor.setCorePoolSize(threadCount);
        // 最大线程数
        taskExecutor.setMaxPoolSize(threadCount);
        // 队列程度
        taskExecutor.setQueueCapacity(300);
        // 线程空闲时间
        taskExecutor.setKeepAliveSeconds(0);
        // 线程前缀名称
        taskExecutor.setThreadNamePrefix("sync-tingshu-Executor--");
        // 该方法用来设置 线程池关闭 的时候 等待 所有任务都完成后，再继续 销毁 其他的 Bean，
        // 这样这些 异步任务 的 销毁 就会先于 数据库连接池对象 的 销毁。
        taskExecutor.setWaitForTasksToCompleteOnShutdown(true);
        // 任务的等待时间 如果超过这个时间还没有销毁就 强制销毁，以确保应用最后能够被关闭，而不是阻塞住。
        taskExecutor.setAwaitTerminationSeconds(300);
        // 线程不够用时由调用的线程处理该任务
        taskExecutor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        //设置装饰器
        taskExecutor.setTaskDecorator(new ZipkinTaskDecorator(zipkinHelper));
        // 不需要手动调 initialize()：ThreadPoolTaskExecutor 实现了 InitializingBean，
        // 注册成 Bean 后 Spring 会自动调用 afterPropertiesSet() -> initialize()；
        // 手动再调一次会重复创建底层线程池，把前一个线程池泄漏掉。
        return taskExecutor;
    }

}
