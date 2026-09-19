package com.atguigu.tingshu.common.cache;


import com.atguigu.tingshu.common.constant.RedisConstant;

import java.lang.annotation.*;
import java.util.concurrent.TimeUnit;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface GuiGuCache {

    String prefix() default "";

    long ttl() default RedisConstant.ALBUM_TIMEOUT;

    TimeUnit timeUnit () default TimeUnit.SECONDS;


}
