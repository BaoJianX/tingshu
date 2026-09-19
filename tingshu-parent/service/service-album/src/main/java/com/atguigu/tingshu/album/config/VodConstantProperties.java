package com.atguigu.tingshu.album.config;


import com.qcloud.vod.VodUploadClient;
import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.ims.v20201229.ImsClient;
import com.tencentcloudapi.tms.v20201229.TmsClient;
import com.tencentcloudapi.vod.v20180717.VodClient;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "vod") //读取节点
@Data
public class VodConstantProperties {

    private Integer appId;
    private String secretId;
    private String secretKey;
    //https://cloud.tencent.com/document/api/266/31756#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8
    private String region;
    private String tempPath;

    @Bean
    public VodUploadClient vodUploadClient() {
        return new VodUploadClient(secretId, secretKey);
    }

    @Bean
    public Credential credential(){
        return new Credential(secretId, secretKey);
    }

    @Bean
    public VodClient vodClient(){
        return new VodClient(credential(), region);
    }

    @Bean
    public TmsClient tmsClient() {
        // 内容安全（文本/图片）不支持重庆地域，硬编码为广州
        return new TmsClient(credential(), "ap-guangzhou");
    }

    @Bean
    public ImsClient imsClient() {
        // 内容安全（文本/图片）不支持重庆地域，硬编码为广州
        return new ImsClient(credential(), "ap-guangzhou");
    }

}
