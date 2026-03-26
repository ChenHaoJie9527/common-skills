---
name: golang-style
description: 在编写或修改任何 Go（`.go`）文件之前使用此技能。适用于即将创建、修改或向 `.go` 文件添加代码的场景。强制遵循 happy path 编码、错误包装、哨兵错误、godoc 风格注释以及 `go doc` 文档查询习惯。
---

# Go 编码约定

## Proverbs

尽量遵循这些 Go 箴言：

> Go Proverbs
> Simple, Poetic, Pithy
> 不要通过共享内存来通信，而要通过通信来共享内存。
> 并发不是并行。
> Channel 负责编排，mutex 负责串行化。
> 接口越大，抽象越弱。
> 让零值有用。
> `interface{}` 什么也没说明。
> `gofmt` 的风格可能不是任何人的最爱，但它是所有人的最爱。
> 少一点复制，胜过少一点依赖。
> `syscall` 必须始终由 build tags 保护。
> `cgo` 必须始终由 build tags 保护。
> `cgo` 不是 Go。
> 使用 `unsafe` 包时，没有任何保证。
> 清晰胜过巧妙。
> 反射从不清晰。
> 错误是值。
> 不要只检查错误，要优雅地处理错误。
> 设计架构，命名组件，记录细节。
> 文档是写给用户的。
> 不要 panic。

编写 Go 代码时，严格遵守以下约定。

## Happy Path Coding

组织代码时，让成功路径自然地一路向下流动。先立即处理错误，再继续主流程。

```go
// 正确：happy path 自然向下展开。
func ProcessUser(id string) (*User, error) {
    user, err := db.GetUser(id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err)
    }

    if err := user.Validate(); err != nil {
        return nil, fmt.Errorf("validate user %s: %w", id, err)
    }

    return user, nil
}

// 错误：主逻辑被嵌套在条件里。
func ProcessUser(id string) (*User, error) {
    user, err := db.GetUser(id)
    if err == nil {
        if err := user.Validate(); err == nil {
            return user, nil
        } else {
            return nil, err
        }
    }
    return nil, err
}
```

## Error Wrapping

始终使用 `%w` 为错误补充上下文。上下文中要包含操作以及相关标识信息。

```go
// 正确：带上下文包装错误。
if err != nil {
    return fmt.Errorf("create order for customer %s: %w", customerID, err)
}

// 错误：没有上下文。
if err != nil {
    return err
}
```

## Sentinel Errors

对于可预期的错误条件，在包级别定义哨兵错误，并使用 `errors.Is()` 判断。

```go
// 在包级别定义。
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
    ErrInvalidInput = errors.New("invalid input")
)

// 返回哨兵错误。
func GetUser(id string) (*User, error) {
    user := db.Find(id)
    if user == nil {
        return nil, ErrNotFound
    }
    return user, nil
}

// 使用 errors.Is() 检查。
user, err := GetUser(id)
if errors.Is(err, ErrNotFound) {
    // 处理未找到场景。
}
```

## Comments

所有注释都要以句号结尾。

```go
// ProcessOrder handles order creation and validation.
func ProcessOrder(o *Order) error {
    // Validate the order before processing.
    if err := o.Validate(); err != nil {
        return err
    }
    // Continue with order processing.
    return nil
}
```

## Naming Conventions

不要把 Go 预声明标识符用作变量名或参数名。这些名称包括内建函数、常量和类型，虽然可以被遮蔽，但不应这样做。

```go
// 错误：遮蔽了内建标识符。
func process(new string, len int, make bool) error {
    copy := "data"
    return nil
}

// 正确：改用更具描述性的名称。
func process(name string, length int, shouldCreate bool) error {
    dataCopy := "data"
    return nil
}
```

需要避免的预声明标识符：

- 函数：`new`、`make`、`len`、`cap`、`append`、`copy`、`delete`、`close`、`panic`、`recover`、`print`、`println`、`complex`、`real`、`imag`、`clear`、`min`、`max`
- 常量：`true`、`false`、`iota`、`nil`
- 类型：`error`、`bool`、`string`、`int`、`int8`、`int16`、`int32`、`int64`、`uint`、`uint8`、`uint16`、`uint32`、`uint64`、`uintptr`、`float32`、`float64`、`complex64`、`complex128`、`byte`、`rune`、`any`、`comparable`

## Line Length

单行最大长度为 120 个字符。超过时，在合适的逻辑位置换行。

```go
// 正确：在逻辑边界处换行。
func ProcessOrderWithValidation(
    ctx context.Context,
    order *Order,
    validator OrderValidator,
) (*Result, error) {
    return nil, fmt.Errorf(
        "process order %s for customer %s: %w",
        order.ID,
        order.CustomerID,
        err,
    )
}
```

## Documentation Lookup

使用 `go doc` 查询标准库和包文档：

```bash
go doc fmt.Errorf
go doc errors.Is
go doc context
```

## Einride

如果项目属于 Einride 组织，始终使用项目中由 Sage 生成的 Makefile（`.sage` 目录）。
