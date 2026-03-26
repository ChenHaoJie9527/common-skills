# Go Backend Patterns

这份参考资料提炼自原始示例库，适合在实现时快速定位模式。

## 1. 基础 HTTP 服务

适用：
- 简单 API
- health endpoint
- 内部管理接口

关注点：
- handler 是否清晰
- 状态码是否准确
- 是否设置 `Content-Type`

## 2. JSON REST API

适用：
- CRUD 接口
- 微服务 HTTP 接口

关注点：
- JSON 编解码
- 路由与方法分发
- 输入校验
- 统一错误响应

## 3. Middleware Chain

常见中间件：
- logging
- auth
- recovery
- CORS
- request id
- rate limiting

原则：
- 横切能力放 middleware
- 业务逻辑不要塞进 middleware

## 4. Context Timeout

适用：
- 下游 RPC / HTTP / DB 调用
- 搜索、导出、聚合接口

原则：
- 从 `r.Context()` 派生
- 创建 timeout 后立刻 `defer cancel()`
- 返回时区分超时与普通错误

## 5. Worker Pool

适用：
- 批处理
- 后台任务
- 并发消费队列

原则：
- 固定 worker 数量
- jobs / results 分离
- 用 WaitGroup 或关闭结果通道完成收口

## 6. Pipeline

适用：
- 分阶段数据处理
- ETL
- 流式转换

原则：
- 每一阶段只做一件事
- 输出通道在发送方关闭
- 提前退出时支持 done/context 取消

## 7. Fan-Out / Fan-In

适用：
- 并行计算
- 多 worker 竞争消费
- 聚合多个来源结果

原则：
- fan-out 共享输入
- fan-in 用 WaitGroup 合并输出
- 明确取消逻辑，避免 goroutine 泄漏

## 8. 数据库 CRUD 与事务

适用：
- repository 层
- 金额转账、库存扣减等原子操作

原则：
- 所有数据库操作优先带 context
- 查询多行后处理 `rows.Err()`
- 事务里所有操作共享同一个 `tx`
- `defer tx.Rollback()`，成功时 `Commit()`

## 9. Graceful Shutdown

适用：
- 所有生产 HTTP / gRPC 服务

原则：
- 单独 goroutine 启动服务
- 监听 `SIGINT` / `SIGTERM`
- `Shutdown(ctx)` 给已有请求留出完成时间

## 10. 生产增强模式

包括：
- structured logging
- health / readiness / liveness
- rate limiting
- panic recovery
- config loading

判断标准：
- 故障时是否可观测
- 服务是否能被平台正确摘流和重启
- 请求是否能被限速和隔离

## 11. 微服务模式

包括：
- gRPC service
- caching layer
- service discovery
- circuit breaker
- event-driven architecture
- message queue consumer
- API gateway

适用判断：
- 只有在服务边界、流量模式或独立部署需求明确时才拆分
- 先保证接口契约和可观测性，再考虑复杂治理能力

## 12. 最常用的默认组合

对于大多数 Go 后端需求，优先从这套最小组合开始：
- `net/http` + middleware chain
- `context` timeout
- service + repository 分层
- `database/sql` 连接池
- structured logging
- `/health` + graceful shutdown
- 单测 + `httptest` + `go test -race`
