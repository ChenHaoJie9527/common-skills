#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function usage() {
  console.log(
    "Usage: node scaffold-go-service.js <target-dir> [module-name]\n" +
      "Example: node scaffold-go-service.js ./demo github.com/acme/demo"
  );
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileOnce(filePath, content) {
  if (fs.existsSync(filePath)) {
    throw new Error(`Refusing to overwrite existing file: ${filePath}`);
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function main() {
  const [, , targetDirArg, moduleNameArg] = process.argv;
  if (!targetDirArg) {
    usage();
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), targetDirArg);
  const moduleName = moduleNameArg || "example.com/go-service";

  ensureDir(targetDir);

  writeFileOnce(
    path.join(targetDir, "go.mod"),
    `module ${moduleName}

go 1.22
`
  );

  writeFileOnce(
    path.join(targetDir, "cmd", "server", "main.go"),
    `package main

import (
    "context"
    "log/slog"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "${moduleName}/internal/api"
    "${moduleName}/internal/middleware"
)

func main() {
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

    mux := http.NewServeMux()
    mux.HandleFunc("/health", api.HealthHandler)

    srv := &http.Server{
        Addr:    ":8080",
        Handler: middleware.Logging(logger, middleware.Recovery(mux)),
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

    if err := srv.Shutdown(ctx); err != nil {
        logger.Error("shutdown failed", "error", err)
    }
}
`
  );

  writeFileOnce(
    path.join(targetDir, "internal", "api", "health.go"),
    `package api

import "net/http"

func HealthHandler(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    _, _ = w.Write([]byte("ok"))
}
`
  );

  writeFileOnce(
    path.join(targetDir, "internal", "middleware", "logging.go"),
    `package middleware

import (
    "log/slog"
    "net/http"
    "time"
)

func Logging(logger *slog.Logger, next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        logger.Info("request completed",
            "method", r.Method,
            "path", r.URL.Path,
            "duration", time.Since(start).String(),
        )
    })
}
`
  );

  writeFileOnce(
    path.join(targetDir, "internal", "middleware", "recovery.go"),
    `package middleware

import (
    "log/slog"
    "net/http"
)

func Recovery(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if err := recover(); err != nil {
                slog.Error("panic recovered", "error", err)
                http.Error(w, "internal server error", http.StatusInternalServerError)
            }
        }()

        next.ServeHTTP(w, r)
    })
}
`
  );

  console.log(`Scaffold created at ${targetDir}`);
}

main();
