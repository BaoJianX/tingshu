package com.atguigu.tingshu.common.login;

import java.lang.annotation.*;


/**
 * @Target({ElementType.METHOD}) 方法级别   @Target({ElementType.TYPE}) 类级别
 * @Retention(RetentionPolicy.RUNTIME) : 表示运行时保留该注解， 默认值为RetentionPolicy.CLASS : 表示编译时保留该注解
 * @Inherited : 表示子类可以继承父类的注解
 * @Documented : 表示该注解会生成文档
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface GuiGuLogin {

    boolean required() default true;

}
