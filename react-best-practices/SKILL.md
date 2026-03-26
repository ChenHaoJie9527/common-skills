---
name: "react-best-practices"
description: "React 与 Next.js 性能优化指南。用于优化 React 应用性能、做性能导向代码审查、重构组件、排查页面卡顿、渲染慢、首屏慢、加载慢、交互延迟、重复渲染、请求瀑布、包体积过大、SSR 或 RSC 数据获取低效等问题；也适用于在实现新功能时提前做性能设计与最佳实践检查。"
---

# React 性能最佳实践

面向 React 与 Next.js 的性能优化 skill，聚焦高影响优化项，帮助在真实项目里更快定位瓶颈并采用更稳妥的最佳实践。

## 快速使用

- 优先阅读 `references/react-performance-guidelines.md` 获取完整中文指南。
- 先做性能画像，再动手优化，避免无依据的“感觉式优化”。
- 默认优先级：
  1. 消除请求瀑布
  2. 缩减首屏 JavaScript 体积
  3. 优化服务端数据获取与 RSC 边界
  4. 减少不必要的重新渲染

## 核心检查项

### 关键优先级

1. 延后 `await`，只在真正需要结果的分支中等待
2. 对独立异步任务使用 `Promise.all()`
3. 避免从大型库的 barrel 文件导入
4. 对重量级组件使用动态导入
5. 用合适的 `Suspense` 边界做流式渲染

### 常见模式

并行获取数据：

```ts
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments(),
]);
```

直接导入：

```tsx
// ❌ 会把整库一起带进来
import { Check } from 'lucide-react';

// ✅ 只加载需要的图标
import Check from 'lucide-react/dist/esm/icons/check';
```

动态组件：

```tsx
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
  () => import('./monaco-editor'),
  { ssr: false }
);
```

## 工作方式

在使用这个 skill 优化 React 应用时：

1. 先使用 React DevTools Profiler 与浏览器性能工具确认瓶颈位置
2. 先处理高收益问题，再考虑细粒度微优化
3. 通过 LCP、TTI、FID、CLS、包体积、服务端响应时间验证效果
4. 渐进式落地优化，避免一次性重写造成行为回归
5. 每次优化后验证功能正确性与交互稳定性

## 参考资料

- 完整中文指南：`references/react-performance-guidelines.md`
