---
name: "git-commit"
description: "Git 提交信息规范 skill。应在执行任何 git commit 命令之前使用；当即将运行 `git commit`、准备提交代码、需要生成提交信息、编写 commit message、整理提交说明，或检查提交信息是否符合 Conventional Commits 规范时触发。"
---

# Git 提交信息规范

按照 Conventional Commits 规范编写提交信息。

## 格式

```text
<type>(<scope>): <description>

[可选正文]

[可选页脚]
```

## 类型

| 类型 | 用途 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 修复缺陷 |
| `docs` | 仅文档变更 |
| `style` | 代码风格调整（格式化，不改逻辑） |
| `refactor` | 既不是修复缺陷，也不是新增功能的代码修改 |
| `perf` | 性能优化 |
| `test` | 新增或修正测试 |
| `build` | 构建系统或外部依赖相关变更 |
| `ci` | CI 配置变更 |
| `chore` | 维护类任务 |
| `revert` | 回滚之前的提交 |

## 规则

1. 描述使用祈使语气，例如“add feature”，而不是“added feature”。
2. 描述末尾不要加句号。
3. 描述尽量控制在 72 个字符以内。
4. 标题和正文之间空一行。
5. 正文用于解释变更意图、细节、注意点或背景，不要只是复述 diff。

## 破坏性变更

可以在 type 或 scope 后加 `!`，或者在页脚中加入 `BREAKING CHANGE:`：

```text
feat(api)!: remove deprecated endpoints

BREAKING CHANGE: The /v1/users endpoint has been removed.
```

## Scope

可选。用于标明变更影响范围，例如 `api`、`ui`、`auth`、`db`。

## 使用建议

- 在准备执行 `git commit` 前先整理本次变更的核心意图。
- 如果改动跨多个模块，优先选最主要的变更类型与范围。
- 如果需要，我应该先根据改动内容帮你生成 1 到 3 条候选提交信息，再决定最终版本。
