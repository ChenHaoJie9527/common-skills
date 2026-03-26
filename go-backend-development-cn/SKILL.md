---
name: go-backend-development-cn
description: 中文 Go 后端开发技能，覆盖并发、HTTP 服务、数据库集成、微服务与生产部署实践。Use when Codex needs to design, implement, review, or refactor Go backend systems, including REST API, gRPC service, worker pool, pipeline, middleware, health check, graceful shutdown, rate limiting, database CRUD/transactions, and production hardening.
---

# Go Backend Development CN

## Overview

用这个技能处理 Go 后端相关任务，目标是优先产出可上线、可测试、可维护的实现，而不是只给语法示例。

先按任务类型判断工作重心：
- HTTP / REST / middleware：优先梳理路由、请求生命周期、超时、鉴权、日志和错误响应。
- 并发 / worker / pipeline：优先定义 goroutine 生命周期、channel 方向、退出条件和取消机制。
- 数据库 / repository：优先设计连接池、上下文超时、事务边界和错误语义。
- 微服务 / gRPC / integration：优先明确接口契约、依赖隔离、重试/熔断和可观测性。
- 生产化治理：优先检查 health check、graceful shutdown、rate limiting、structured logging、配置外置和测试覆盖。

## Workflow

1. 先识别任务属于哪一类：API、并发、数据库、微服务、生产治理。
2. 先搭主干，再补横切能力：核心 handler/service/repository 完成后，再补 middleware、日志、超时、限流。
3. 默认传递 `context.Context`，并把它作为第一个参数。
4. 优先 happy path coding：异常尽早返回，减少嵌套。
5. 用 `%w` 包装错误，保留调用链；只有确实需要分支处理时才定义 sentinel error 或自定义错误类型。
6. 明确 goroutine 的退出机制，避免泄漏；默认用 context 或 done channel 控制取消。
7. 对共享状态显式加锁；能用 channel 转移所有权时，优先避免共享可变状态。
8. 在数据库访问中显式处理超时、事务、`rows.Close()`、`rows.Err()` 和 `sql.ErrNoRows`。
9. 面向生产补齐健康检查、优雅停机、结构化日志、配置管理和基础安全措施。
10. 交付前至少检查格式化、测试、race 风险和关键路径错误处理。

## Default Conventions

- 用标准库优先：`net/http`、`context`、`database/sql`、`sync`。
- goroutine 只在有明确收益时引入，不为“看起来并发”而并发。
- channel 由发送方关闭，不由接收方关闭。
- 循环里启动 goroutine 时显式传参，避免闭包捕获循环变量。
- 对外响应不要泄露敏感错误细节；内部日志保留足够上下文。
- 生产代码优先 `return error`，不要用 `panic` 代替常规错误处理。
- 写测试时优先表驱动测试；HTTP handler 用 `httptest`；性能热点补 benchmark。

## Reference Map

- 需要整体路线、项目结构、开发流程、上线清单时，读 [references/guide.md](./references/guide.md)。
- 需要快速套用常见模式时，读 [references/patterns.md](./references/patterns.md)。
- 需要直接参考代码片段时，读 `examples/` 目录下的示例文件。
- 需要生成基础项目骨架或输出生产检查清单时，运行 `scripts/` 目录下的脚本。

## Trigger Prompts

这些提示词可以直接复用，用来稳定触发这个 skill。

- `Use $go-backend-development-cn to design a production-grade Go backend service for <requirement>.`
- `用 $go-backend-development-cn 帮我实现一个 Go 后端功能：<需求>。`
- `使用 $go-backend-development-cn review 这段 Go 后端代码，重点关注并发、错误处理、超时和生产可用性。`
- `用 $go-backend-development-cn 重构这段 Go 后端代码，保持行为不变，但提升结构和可维护性。`
- `Use $go-backend-development-cn to build a REST API in Go for <business case>, including routing, middleware, validation, and error handling.`
- `用 $go-backend-development-cn 设计一个 Go REST API，包含 handler、service、repository 分层。`
- `用 $go-backend-development-cn 给我实现一个用户 CRUD API，要求带 JSON 响应、参数校验和统一错误处理。`
- `Use $go-backend-development-cn to implement a Go repository layer with database/sql, connection pooling, and context-aware queries.`
- `用 $go-backend-development-cn 帮我写一个 Go 数据访问层，要求支持事务和超时控制。`
- `用 $go-backend-development-cn 重构这段 SQL 访问代码，重点处理 rows.Close、rows.Err 和 sql.ErrNoRows。`
- `Use $go-backend-development-cn to implement a worker pool in Go for <job type>, with cancellation and error collection.`
- `用 $go-backend-development-cn 帮我设计一个 pipeline 并发处理流程，要求可取消、不会泄漏 goroutine。`
- `使用 $go-backend-development-cn review 这段 Go 并发代码，重点检查 race、channel 死锁和 goroutine 泄漏。`
- `Use $go-backend-development-cn to add logging, recovery, auth, and rate limiting middleware to this Go service.`
- `用 $go-backend-development-cn 给这个 Go 服务补 middleware，包含请求日志、panic recovery 和 request timeout。`
- `Use $go-backend-development-cn to harden this Go service for production, including health checks, graceful shutdown, structured logging, and timeouts.`
- `用 $go-backend-development-cn 检查这个 Go 服务离生产还差什么。`
- `用 $go-backend-development-cn 输出这个 Go 后端的 production checklist。`
- `Use $go-backend-development-cn to review this Go backend PR, prioritize bugs, regressions, race risks, and missing tests.`
- `用 $go-backend-development-cn 审查这段 Go 后端代码，先列问题，再给修改建议。`
- `Use $go-backend-development-cn to scaffold a minimal Go service with /health, middleware, and graceful shutdown.`
- `用 $go-backend-development-cn 帮我生成一个最小 Go 服务骨架，包含 cmd/server、internal/api、internal/middleware。`
- `Use $go-backend-development-cn to design a Go gRPC service for <business case>, including service boundaries, context handling, and error mapping.`
- `用 $go-backend-development-cn 设计一个 Go 微服务，说明 API 边界、数据库访问和缓存策略。`

## Output Expectations

产出 Go 后端方案或代码时，默认包含这些判断：
- 为什么选择当前并发/路由/数据访问模式。
- 超时、取消、错误传播是否完整。
- 是否具备最基本的生产可用性。
- 是否还缺测试、限流、日志、健康检查或 shutdown 处理。

如果用户只要总结或学习材料，优先给结构化说明；如果用户要落地实现，直接写代码并按上述约束收口。
