# tingshu-parent 项目说明

atguigu（尚硅谷）"听书"微服务培训项目。Spring Cloud 微服务后端 + uni-app 微信小程序前端，**处于半成品状态**。

## 一、技术栈与版本（根 pom.xml 锁定）

- Spring Boot 3.0.5 / Spring Cloud 2022.0.2 / Spring Cloud Alibaba 2022.0.0.0-RC1 / Java 17
- MyBatis-Plus 3.5.3.1 / MySQL 8.0.30 / Knife4j 4.1.0 / Redisson 3.20.0
- XXL-Job 2.4.0 / MinIO 8.2.0 / 腾讯云 vod_api 2.1.4 / spring-kafka 3.0.4 / wxpay-sdk

## 二、模块结构

```
tingshu-parent
├── common              通用层
│   ├── common-log      日志切面 @Log + LogAspect
│   ├── common-util     Result/AuthContextHolder/MD5/MongoUtil 等纯工具
│   ├── service-util    MyBatis-Plus/Redis/Knife4j 配置、全局异常、@GuiGuLogin 登录切面、FeignInterceptor
│   └── rabbit-util     RabbitService(延迟消息+Confirm/Return 重试)、MqConst
├── model               实体/Query/VO，按 album/user/account/order/payment/search/dispatch/comment/live/system 分包
├── server-gateway      网关(CorsConfig + AuthGlobalFilter 空壳，未鉴权)
├── service             7 个微服务
│   ├── service-album    ✅ 已实现：专辑/声音 CRUD + MinIO + 腾讯云 VOD + TMS/IMS/VOD 内容审核
│   ├── service-user     🟡 微信登录已实现；UserListenProcess/VipServiceConfig/UserPaidTrack 空壳
│   ├── service-search   🟡 ES 上下架已实现(统计量用随机数模拟)；itemApi 空壳
│   ├── service-account  🔴 仅 MQ 初始化账户；充值/查询空壳
│   ├── service-order    🔴 空壳(仅 SignHelper 签名工具)
│   ├── service-payment  🔴 空壳(V3 配置 Bean 就绪，逻辑未写)
│   └── service-dispatch 🔴 空壳(XXL-JOB 未接任务)
└── service-client      5 个 Feign client(均带降级类)；SearchFeignClient 是唯一被实际调用的
```

## 三、关键配置信息

- **Nacos**：`192.168.200.6:8848`（服务发现 + 配置中心），profile=`dev`，共享 `common.yaml` + 各服务 `${spring.application.name}.yaml`
- **本地只有 `bootstrap.properties`**：仅含 Nacos 地址和应用名。**端口、数据源、Redis、RabbitMQ、路由、腾讯云密钥、微信支付参数全部在 Nacos，本地无明文**。查不到端口/密码属正常，不要在本地硬编码。
- **前端**：`e:\Develop\WXDevelopTool\mp-weixin`（uni-app Vue3 编译产物，非源码），API base `http://127.0.0.1:8500`（`config/confjg.js`，文件名拼错），appid `wx4ed590d73aeef317`
- **Mapper XML**：各服务 `src/main/resources/mapper/*.xml`；**项目无 .sql 建表脚本**
- **网关端口**：前端写死 8500，实际端口在 Nacos `server-gateway.yaml`，需对齐否则前端连不上

## 四、文档查阅规则（重要）

`docs/` 目录存放项目文档（如 `api.md` 接口文档、数据库设计、业务流程等）。执行任务时遵守：

1. **先查文档再动手**：涉及接口对接、业务流程、数据结构、字段约定、状态码的任务，必须先用 Read/Grep 查阅 `docs/` 下相关文档，再编码。不要凭代码反推后自行变更已文档化的约定。
2. **以文档为准**：文档与代码冲突时，先以文档为准并向用户确认，不要静默改接口路径/字段/状态码。
3. **缺文档先问**：`docs/` 下缺少相关文档导致无法准确执行时，先向用户确认，不要臆测接口或字段。
4. **改完同步文档**：修改了接口/业务逻辑且该内容已在 `docs/` 文档中记录，同步更新对应文档。
5. **新增文档**：完成复杂功能后，若涉及对外接口或核心流程，主动建议在 `docs/` 补文档。

## 五、项目特有约定

- **前端是编译产物**：`mp-weixin` 是 uni-app 编译输出，原工程 `ListenToBooks-master`（本机可能不存在）。直接改编译产物不可靠，改前端需回原工程；在编译产物上只做定位/排查。
- **大量空壳是培训留白**：新增功能前先确认是否已有半成品骨架（空 Controller/Service）可填充，避免重复创建。
- **Nacos 是硬依赖**：`192.168.200.6:8848` 不通则所有服务起不来，本地无兜底配置。
