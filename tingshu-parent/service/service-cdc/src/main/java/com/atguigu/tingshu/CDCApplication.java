package com.atguigu.tingshu;


import io.xzxj.canal.spring.annotation.EnableCanalListener;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@EnableCanalListener
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class CDCApplication {

    public static void main(String[] args) {
        SpringApplication.run(CDCApplication.class, args);
    }

}
