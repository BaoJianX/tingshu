package com.atguigu.tingshu.user.api;

import com.atguigu.tingshu.common.login.GuiGuLogin;
import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.common.util.AuthContextHolder;
import com.atguigu.tingshu.model.user.UserListenProcess;
import com.atguigu.tingshu.user.service.UserListenProcessService;
import com.atguigu.tingshu.vo.user.UserListenProcessVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@Tag(name = "用户声音播放进度管理接口")
@RestController
@RequestMapping("api/user")
@SuppressWarnings({"all"})
public class UserListenProcessApiController {

    @Autowired
    private UserListenProcessService userListenProcessService;

    @GuiGuLogin(required = false)
    @Operation(summary = "根据trackId获取用户中断播放的时间")
    @GetMapping("userListenProcess/getTrackBreakSecond/{trackId}")
    public Result<BigDecimal> getTrackBreakSecond(@PathVariable Long trackId) {
        //1.获取当前用户id
        Long userId = AuthContextHolder.getUserId();
        //2.如果用户ID有值，则查询用户播放进度
        if (userId != null) {
            BigDecimal breakSecond = userListenProcessService.getTrackBreakSecond(userId, trackId);
            return Result.ok(breakSecond);
        }
        return Result.ok(BigDecimal.ZERO);
    }

    /**
     * 更新播放进度
     * @param userListenProcessVo
     * @return
     */
    @GuiGuLogin(required = false)
    @Operation(summary = "更新播放进度")
    @PostMapping("userListenProcess/updateListenProcess")
    public Result updateListenProcess(@RequestBody UserListenProcessVo userListenProcessVo){
        //1.获取用户ID
        Long userId = AuthContextHolder.getUserId();
        //2.调用service方法
        userListenProcessService.updateListenProcess(userId,userListenProcessVo);
        return Result.ok();
    }

    /**
     * 获取用户最近一次播放记录
     * <p>
     * 前端播放页在“不带 albumId/trackId 参数”进入时（底部导航、我的页面）会调用本接口，
     * 拿到上次听的声音继续播放。因此这里必须：
     * 1) 用 required = false —— 未登录返回 208 时前端 res.data 为 null，会导致 data.trackId 抛错把 onLoad 打断；
     * 2) 任何查不到的情况都返回空对象，绝不返回 null。
     */
    @GuiGuLogin(required = false)
    @Operation(summary = "获取用户最近一次播放记录")
    @GetMapping("userListenProcess/getLatelyTrack")
    public Result<UserListenProcess> getLatelyTrack() {
        Long userId = AuthContextHolder.getUserId();
        if (userId == null) {
            return Result.ok(new UserListenProcess());
        }
        return Result.ok(userListenProcessService.getLatelyTrack(userId));
    }

}

