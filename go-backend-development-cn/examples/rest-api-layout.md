# REST API Layout Example

适合场景：
- 从零起一个标准 Go HTTP 服务
- 给现有项目梳理分层
- 统一 handler / service / repository 结构

推荐目录：

```text
cmd/server/main.go
internal/api/health.go
internal/api/user_handler.go
internal/service/user_service.go
internal/repository/user_repository.go
internal/middleware/logging.go
internal/middleware/recovery.go
internal/config/config.go
```

职责拆分：
- `main.go`：装配依赖、注册路由、启动服务、处理优雅停机
- `api/`：HTTP handler，做参数解析和响应编码
- `service/`：业务规则
- `repository/`：数据访问
- `middleware/`：日志、鉴权、恢复、限流等横切能力
- `config/`：环境变量或配置加载

最小主链路建议：
1. `/health`
2. 一个业务 handler
3. 一个 service
4. 一个 repository 接口
5. 请求日志 + recovery
6. `context.WithTimeout`

最小 `main.go` 结构：

```go
func main() {
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    mux := http.NewServeMux()

    mux.HandleFunc("/health", healthHandler)

    srv := &http.Server{
        Addr:    ":8080",
        Handler: loggingMiddleware(recoveryMiddleware(mux)),
    }

    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            logger.Error("server failed", "error", err)
        }
    }()

    sigCh := make(chan os.Signal, 1)
    signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
    <-sigCh

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    _ = srv.Shutdown(ctx)
}
```
