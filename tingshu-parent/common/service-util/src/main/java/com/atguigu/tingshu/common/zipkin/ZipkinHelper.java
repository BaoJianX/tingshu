package com.atguigu.tingshu.common.zipkin;

import brave.Span;
import brave.Tracer;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.concurrent.Callable;

@Component
public class ZipkinHelper {
    @Autowired(required = false)
    private Tracer tracer;

    public ZipkinHelper() {
    }

    public Runnable wrap(Runnable runnable) {
        Span currentSpan = this.tracer.currentSpan();
        return () -> {
            Tracer.SpanInScope scope = this.tracer.withSpanInScope(currentSpan);
            Throwable var4 = null;

            try {
                Span span = this.tracer.nextSpan();
                MDC.put("X-B3-TraceId", span.context().traceIdString());
                MDC.put("X-B3-SpanId", span.context().spanIdString());
                MDC.put("X-B3-ParentSpanId", span.context().parentIdString());
                span.name("new_thread_started").kind(Span.Kind.SERVER).tag("thread_id", Thread.currentThread().getId() + "").tag("thread_name", Thread.currentThread().getName() + "");
                span.start();

                try {
                    Tracer.SpanInScope ws = this.tracer.withSpanInScope(span);
                    Throwable var7 = null;

                    try {
                        runnable.run();
                    } catch (Throwable var44) {
                        var7 = var44;
                        throw var44;
                    } finally {
                        if (ws != null) {
                            if (var7 != null) {
                                try {
                                    ws.close();
                                } catch (Throwable var43) {
                                    var7.addSuppressed(var43);
                                }
                            } else {
                                ws.close();
                            }
                        }

                    }
                } catch (Error | RuntimeException var46) {
                    span.error(var46);
                    throw var46;
                } finally {
                    span.finish();
                }
            } catch (Throwable var48) {
                var4 = var48;
                throw var48;
            } finally {
                if (scope != null) {
                    if (var4 != null) {
                        try {
                            scope.close();
                        } catch (Throwable var42) {
                            var4.addSuppressed(var42);
                        }
                    } else {
                        scope.close();
                    }
                }

            }

        };
    }

    public <T> Callable<T> wrap(Callable<T> callable) {
        Span currentSpan = this.tracer.currentSpan();
        return () -> {
            Tracer.SpanInScope scope = this.tracer.withSpanInScope(currentSpan);
            Throwable var4 = null;

            T var8;
            try {
                Span span = this.tracer.nextSpan();
                MDC.put("X-B3-TraceId", span.context().traceIdString());
                MDC.put("X-B3-SpanId", span.context().spanIdString());
                MDC.put("X-B3-ParentSpanId", span.context().parentIdString());
                span.name("new_thread_started").kind(Span.Kind.SERVER).tag("thread_id", Thread.currentThread().getId() + "").tag("thread_name", Thread.currentThread().getName() + "");
                span.start();

                try {
                    Tracer.SpanInScope ws = this.tracer.withSpanInScope(span);
                    Throwable var7 = null;

                    try {
                        var8 = callable.call();
                    } catch (Throwable var45) {
                        var8 = (T) var45;
                        var7 = var45;
                        throw var45;
                    } finally {
                        if (ws != null) {
                            if (var7 != null) {
                                try {
                                    ws.close();
                                } catch (Throwable var44) {
                                    var7.addSuppressed(var44);
                                }
                            } else {
                                ws.close();
                            }
                        }

                    }
                } catch (Error | RuntimeException var47) {
                    span.error(var47);
                    throw var47;
                } finally {
                    span.finish();
                }
            } catch (Throwable var49) {
                var4 = var49;
                throw var49;
            } finally {
                if (scope != null) {
                    if (var4 != null) {
                        try {
                            scope.close();
                        } catch (Throwable var43) {
                            var4.addSuppressed(var43);
                        }
                    } else {
                        scope.close();
                    }
                }
            }
            return var8;
        };
    }
}
