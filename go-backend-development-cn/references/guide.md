# Go Backend Guide

这份参考资料把原始三个文档压缩成一套更容易检索的中文提纲，适合在需要背景知识时按需读取。

## 1. 技能定位

Go 很适合做后端，核心原因有：
- goroutine 轻量，适合高并发
- channel / select / context 原生支持并发协作与取消
- 标准库对 HTTP、网络、编码支持完整
- 编译快，单二进制部署简单
- 内存占用和吞吐表现通常都不错

适合的场景：
- REST API、gRPC、WebSocket
- 微服务与云原生后端
- worker pool、pipeline、流式处理
- 数据库驱动业务系统
- 消息消费、事件驱动、后台任务

## 2. 核心能力地图

### 并发

- goroutine：轻量级并发执行单元
- channel：goroutine 间通信和同步
- select：等待多个 channel 事件
- context：超时、取消、请求级别信息传播
- WaitGroup：等待一组 goroutine 完成
- Mutex / RWMutex：保护共享状态

### Web 服务

- `net/http` 作为基础能力
- handler + middleware 组成请求处理链
- 请求超时、取消、鉴权、日志、恢复、CORS 等都适合作为 middleware

### 数据库

- `database/sql` 管理连接池
- 用 `QueryRowContext`、`QueryContext`、`ExecContext` 传递超时与取消
- 显式设置事务边界
- 区分 `sql.ErrNoRows` 与系统错误

### 工程与生产

- 错误包装：`fmt.Errorf("...: %w", err)`
- 表驱动测试、benchmark、`httptest`
- structured logging
- health check、readiness、liveness
- graceful shutdown
- rate limiting
- 配置外置化

## 3. 推荐项目结构

```text
cmd/                 应用入口
internal/api/        HTTP / gRPC handler
internal/service/    业务逻辑
internal/repository/ 数据访问
internal/middleware/ 中间件
pkg/                 可复用公共组件
api/                 协议定义，如 OpenAPI / protobuf
migrations/          数据库迁移
config/              配置
docker/              容器部署文件
```

## 4. 推荐开发流程

1. 初始化模块：`go mod init`
2. 先搭最小可运行主链路
3. 补单测、表驱动测试、HTTP 测试
4. 运行：
   - `go test ./...`
   - `go test -race ./...`
   - `go fmt ./...`
   - `go vet ./...`
5. 构建并检查生产参数

## 5. 生产检查清单

- 所有关键路径有超时控制
- 健康检查可用于容器编排
- 支持 graceful shutdown
- 有结构化日志
- 有限流或基本防滥用保护
- 数据库连接池参数合理
- 输入校验完整
- 错误响应不泄露敏感信息
- 测试通过，race 风险已检查

## 6. 常见坑

- for 循环变量被 goroutine 闭包捕获
- nil map 直接写入
- 没有接收者的 unbuffered channel 导致死锁
- goroutine 没有退出路径，造成泄漏
- 忘记关闭 `rows`
- 没处理 `rows.Err()`
- 事务失败后没有正确回滚
- 向客户端暴露内部错误细节

## 7. 实用判断原则

- 能顺序执行就不要盲目并发
- 能用 context 控制生命周期就不要靠约定
- 能在 service 层封装业务规则，就不要把逻辑散落在 handler
- 能清楚表达错误语义时，才引入自定义错误类型
- 先把 API 做稳定，再做微服务拆分
