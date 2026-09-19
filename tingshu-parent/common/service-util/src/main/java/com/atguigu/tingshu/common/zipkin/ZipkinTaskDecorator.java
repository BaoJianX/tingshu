package com.atguigu.tingshu.common.zipkin;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.task.TaskDecorator;

/**

 * @Author: chenyangu

 * @Date: 2021/8/16 17:05

 * @Description: zipkin装饰器

 */

@Slf4j

public class ZipkinTaskDecorator implements TaskDecorator {

    private ZipkinHelper zipkinHelper;

    public ZipkinTaskDecorator(ZipkinHelper zipkinHelper) {

        this.zipkinHelper = zipkinHelper;

    }

    @Override

    public Runnable decorate(Runnable runnable) {

        return zipkinHelper.wrap(runnable);

    }

}
