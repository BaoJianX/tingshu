# 听书 · Tingshu

一个**有声书 / 音频内容平台**。后端为 Spring Cloud 微服务架构，前端为 uni-app 编译的微信小程序。

平台覆盖「创作者上传专辑与声音 → 平台内容审核 → 上架并同步检索 → 用户收听 / 购买 / 订阅」
的完整链路，并提供排行榜、收听进度续播、VIP 与充值支付等能力。

---

## 一、功能概览

### 内容服务 `service-album`
- **专辑管理**：创建 / 修改 / 上下架，专辑标签、三级分类、统计信息维护
- **声音管理**：音频上传、腾讯云 VOD 转码、声音列表与详情
- **文件上传**：MinIO 对象存储（封面、图片等）
- **内容审核**：接入 TMS（文本）/ IMS（图片）/ VOD（音视频）三套审核，审核结果经 MQ 回写

### 检索服务 `service-search`
- 专辑上架 / 下架同步 Elasticsearch，**热度分**参与排序
  （`播放 ×1 + 订阅 ×2 + 购买 ×5 + 评论 ×3`）
- 标题自动补全索引（`suggestinfo`），支持前缀联想
- 高级检索：关键字高亮、多级分类筛选、标签筛选，支持按热度 / 播放量 / 发布时间排序
- 专辑详情聚合：专辑信息 + 统计信息 + 分类信息 + 主播信息**并行拉取**
- 首页排行榜写入 Redis

### 用户服务 `service-user`
- 微信小程序登录（openid 换 token），登录态存 Redis
- 用户信息、VIP 服务配置
- 收听进度记录与续播、用户统计

### 账户与交易 `service-account` / `service-order` / `service-payment`
- 账户余额与充值记录
- 订单与优惠
- 微信支付

### 数据同步 `service-cdc`
- 基于 **Canal** 订阅 MySQL binlog，监听 `user_info`、`album_info` 变更并删除对应 Redis 缓存，
  以「至少一次」+ 删除缓存的幂等策略保证最终一致

### 基础设施
- **网关** `server-gateway`：统一入口 + 跨域
- **消息**：RabbitMQ 延迟消息、Confirm / Return 可靠投递与重试
- **缓存**：Redis + Redisson 分布式锁、布隆过滤器防缓存穿透、随机 TTL 防雪崩

---

## 二、技术栈

| 分类 | 组件 | 版本 |
| --- | --- | --- |
| 语言 | Java | 17 |
| 基础框架 | Spring Boot | 3.0.5 |
| 微服务 | Spring Cloud | 2022.0.2 |
| 微服务 | Spring Cloud Alibaba | 2022.0.0.0-RC1 |
| 注册中心 / 配置中心 | Nacos | — |
| 持久层 | MyBatis-Plus | 3.5.3.1 |
| 数据库 | MySQL | 8.0.30 |
| 缓存 | Redis / Redisson | Redisson 3.20.0 |
| 消息队列 | RabbitMQ（`spring-cloud-starter-bus-amqp`） | — |
| 搜索引擎 | Elasticsearch（Spring Data Elasticsearch） | — |
| 数据同步 | Canal（`canal-spring-boot-starter`） | 0.0.17 |
| 对象存储 | MinIO | 8.2.0 |
| 音视频处理 | 腾讯云 VOD（`vod_api`） | 2.1.4 |
| 任务调度 | XXL-Job | 2.4.0 |
| 支付 | 微信支付（`wxpay-sdk`） | 0.0.3 |
| 接口文档 | Knife4j（OpenAPI 3） | 4.1.0 |
| 工具库 | Lombok、Hutool、Guava、fastjson、pinyin4j | — |

---

## 三、工程结构

```
tingshu
├── tingshu-parent/                 后端（Maven 多模块）
│   ├── common/                     通用层
│   │   ├── common-util             纯工具：Result、AuthContextHolder、MD5、MongoUtil 等
│   │   ├── common-log              日志切面 @Log + LogAspect
│   │   ├── service-util            MyBatis-Plus / Redis / Knife4j 配置、全局异常处理、
│   │   │                           登录切面 @GuiGuLogin、缓存切面 @GuiGuCache、Feign 拦截器
│   │   └── rabbit-util             RabbitService（延迟消息 + 可靠投递）、MqConst
│   ├── model/                      实体 / VO / Query，按业务分包
│   ├── service-client/             Feign 客户端及各自降级类
│   ├── server-gateway/             网关服务
│   └── service/                    业务微服务
│       ├── service-album           专辑 / 声音 / 上传 / 内容审核
│       ├── service-search          Elasticsearch 检索 / 排行榜
│       ├── service-user            用户 / 登录 / 收听进度
│       ├── service-account         账户 / 充值
│       ├── service-order           订单
│       ├── service-payment         微信支付
│       ├── service-dispatch        XXL-Job 调度
│       └── service-cdc             Canal 数据同步
└── mp-weixin/                      前端（uni-app 编译产物的微信小程序工程）
```

---

## 四、环境依赖

运行需要准备以下中间件：

| 中间件 | 用途 |
| --- | --- |
| **Nacos** | 服务注册发现 + 配置中心（**必需**，不通则所有服务起不来） |
| **MySQL** 8.0 | 业务数据库，库名按业务划分（如 `tingshu_album`、`tingshu_user`） |
| **Redis** | 缓存、分布式锁、登录态、排行榜、布隆过滤器 |
| **RabbitMQ** | 上下架通知、统计数据同步、审核结果回写 |
| **Elasticsearch** | 专辑检索、标题联想 |
| **Canal Server** | 订阅 MySQL binlog（仅 `service-cdc` 需要） |
| **MinIO** | 对象存储（仅 `service-album` 上传需要） |
| **XXL-Job** | 任务调度（仅 `service-dispatch` 需要） |

---

## 五、快速开始

### 1. 准备环境

```bash
java -version   # 需要 JDK 17
mvn -v
```

### 2. 准备 Nacos 配置

> **重要**：本仓库**不包含任何服务端配置**。

各模块 `src/main/resources/` 下只有 `bootstrap.properties`，内容仅包含 **Nacos 地址**和**应用名**：

```properties
spring.application.name=service-album
spring.profiles.active=dev
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
spring.cloud.nacos.config.server-addr=127.0.0.1:8848
spring.cloud.nacos.config.prefix=${spring.application.name}
spring.cloud.nacos.config.file-extension=yaml
spring.cloud.nacos.config.shared-configs[0].data-id=common.yaml
```

**端口、数据源、Redis、RabbitMQ、Elasticsearch、网关路由，以及腾讯云 / MinIO / 微信支付等第三方密钥，
全部存放在 Nacos 中。** 首次运行需要在 Nacos 控制台准备：

- 共享配置 `common.yaml`（`DEFAULT_GROUP`）
- 各服务配置 `${spring.application.name}.yaml` 与 `${spring.application.name}-dev.yaml`（`profile=dev`）

如果 Nacos 不在本机，修改各模块 `bootstrap.properties` 里的 `server-addr` 即可。

### 3. 构建

```bash
cd tingshu-parent
mvn clean install -DskipTests
```

### 4. 启动

先启动 **Nacos 与各中间件**，再按需启动服务：

```
server-gateway          # 统一入口，先起
service-album / service-search / service-user
service-account / service-order / service-payment / service-dispatch / service-cdc
```

参考端口（实际以 Nacos 配置为准）：

| 服务 | 端口 |
| --- | --- |
| `server-gateway` | 8500 |
| `service-album` | 8501 |
| `service-search` | 8502 |
| `service-user` | 8503 |

### 5. 前端

用**微信开发者工具**导入 `mp-weixin` 目录，然后修改接口地址：

```js
// mp-weixin/config/confjg.js
```

将 `baseUrl` 指向网关地址（本地默认 `http://127.0.0.1:8500`）。

> `mp-weixin` 是 uni-app 的**编译产物**，可直接导入运行；若要修改源码请回到上游 uni-app 工程重新编译。

---

## 六、接口文档

每个服务集成了 **Knife4j**，启动后访问：

```
http://<host>:<port>/doc.html
```

例如网关 `http://127.0.0.1:8500/doc.html`、专辑服务 `http://127.0.0.1:8501/doc.html`。

`docs/` 目录下另有部分接口约定文档。

---

## 七、开发进度

| 模块 | 状态 |
| --- | --- |
| `service-album` | 专辑 / 声音 CRUD、MinIO 上传、腾讯云 VOD、内容审核 |
| `service-search` | 上下架同步 ES、标题联想、高级检索、排行榜、专辑详情聚合 |
| `service-user` | 微信登录、用户信息、收听进度续播 |
| `service-cdc` | Canal 监听并删除缓存（用户、专辑） |
| `service-account` | 账户初始化；充值 / 查询待完善 |
| `service-order` | 待完善 |
| `service-payment` | 微信支付 V3 配置就绪，业务逻辑待完善 |
| `service-dispatch` | XXL-Job 任务待接入 |

---

## 八、说明

- 项目处于**持续开发中**，部分服务为骨架实现。
- 数据库**建表脚本未随仓库提供**，需要自行准备。
- 请勿将 Nacos 中的第三方密钥提交到本仓库。
