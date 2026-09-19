package com.atguigu.tingshu.album.service.impl;

import cn.hutool.core.date.DateUnit;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.io.unit.DataUnit;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.atguigu.tingshu.album.config.MinioConstantProperties;
import com.atguigu.tingshu.album.service.AuditSetvice;
import com.atguigu.tingshu.album.service.FileUploadService;
import com.atguigu.tingshu.common.execption.GuiguException;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.Buffer;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    @Autowired
    private MinioConstantProperties minioConstantProperties;

    @Autowired
    private MinioClient minioClient;

    @Autowired
    private AuditSetvice auditSetvice;
    
    @Override
    public String fileUpload(MultipartFile multipartFile) {

        //校验图片大小是否合法
        try{
            BufferedImage bufferedImage = ImageIO.read(multipartFile.getInputStream());
            if(bufferedImage == null) {
                throw new GuiguException(400,"文件格式有误");
            }
            //业务校验
            int width = bufferedImage.getWidth();
            int height = bufferedImage.getHeight();
            if(width > 900 || height > 900){
                throw new GuiguException(400,"文件大小有误");
            }
        } catch (Exception e) {
            throw new GuiguException(400,"文件格式大小有误");
        }

        //对图片进行审核
        String suggestion = auditSetvice.audit_image(multipartFile);
        if(StrUtil.isNotBlank(suggestion)){
            if("block".equals(suggestion) || "review".equals(suggestion)){
                throw new GuiguException(500,"图片存在违规");
            }
        }

        try {
            //3.将文件上传到MINIO
            String folder = "/"+ DateUtil.today();
            String fileName = IdUtil.randomUUID();
            String extName = FileNameUtil.extName(multipartFile.getOriginalFilename());
            String objName = folder +"/" +fileName + "." + extName;
            //调用上传方法
            String bucketName = minioConstantProperties.getBucketName();
            minioClient.putObject(
                    PutObjectArgs.builder().bucket(bucketName).object(objName).stream(
                            multipartFile.getInputStream(),
                            multipartFile.getSize(),
                            -1)
                            .contentType(multipartFile.getContentType())
                            .build());
            //3.3拼接文件的上传地址
            return minioConstantProperties.getEndpointUrl()+"/"+bucketName+objName;
        } catch (Exception e) {
            throw new GuiguException(500,"文件上传失败");
        }


    }
}
