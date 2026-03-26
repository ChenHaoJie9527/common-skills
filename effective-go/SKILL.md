---
name: effective-go
description: 根据官方 Effective Go 指南应用 Go 最佳实践、惯用法和编码约定。用于编写、审查或重构 Go 代码，帮助产出符合 Go 社区习惯、清晰且高效的实现。
---

# Effective Go

依据官方 [Effective Go 指南](https://go.dev/doc/effective_go) 编写清晰、地道、符合 Go 惯用法的代码。

## 核心要求

重点遵循 https://go.dev/doc/effective_go 中的约定，尤其注意以下几项：

- **格式化**：始终使用 `gofmt`，这是硬性要求
- **命名**：避免下划线；导出标识符使用 `MixedCaps`，未导出标识符使用 `mixedCaps`
- **错误处理**：始终检查错误；优先返回错误，不要滥用 `panic`
- **并发**：通过通信共享内存，优先使用 channel 组织协作
- **接口**：保持接口小而精，理想情况下控制在 1 到 3 个方法；接收接口，返回具体类型
- **文档**：为所有导出符号编写注释，并以符号名开头

## 使用方式

在处理 Go 代码时：

1. 先按 Go 惯例审视整体设计，再落到具体实现
2. 优先选择标准库和清晰、直接的写法，而不是炫技式抽象
3. 保持控制流简单，尽量减少嵌套和不必要的复杂度
4. 对导出 API、错误路径、并发逻辑和命名一致性做重点检查
5. 在提交前运行 `gofmt`，必要时补充文档和测试

## 参考资料

- 官方指南：https://go.dev/doc/effective_go
- Code Review Comments：https://github.com/golang/go/wiki/CodeReviewComments
- 标准库：优先参考标准库中的惯用实现模式
