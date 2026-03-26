# React 最佳实践：性能优化

这是一份面向 React 与 Next.js 应用的综合性能优化指南，包含 40+ 条按影响等级组织的规则，目的是帮助开发者消除性能瓶颈并遵循更稳妥的最佳实践。

## 适用场景

在以下情况下使用这份 skill：

- 优化 React 或 Next.js 应用性能
- 做性能导向的代码审查
- 重构现有组件以获得更好的性能
- 在实现新功能时将性能纳入设计
- 排查渲染慢或加载慢的问题
- 缩减 bundle 体积
- 消除请求瀑布

## 核心覆盖范围

- **消除瀑布请求（CRITICAL）**：避免顺序异步操作
- **包体积优化（CRITICAL）**：减少首屏 JavaScript 负载
- **服务端性能（HIGH）**：优化 RSC 与数据获取
- **客户端数据获取（MEDIUM-HIGH）**：使用高效缓存模式
- **重渲染优化（MEDIUM）**：减少不必要的重新渲染
- **渲染性能（MEDIUM）**：优化浏览器渲染流程
- **JavaScript 性能（LOW-MEDIUM）**：针对热点路径做微优化
- **高级模式（LOW）**：处理边缘场景的专项技巧

## 快速参考

### 关键优先级

1. **把 `await` 延后到真正需要时**：把等待移动到具体分支
2. **使用 `Promise.all()`**：并行化互不依赖的异步任务
3. **避免 barrel imports**：直接从源文件导入
4. **使用动态导入**：惰性加载重量级组件
5. **策略性使用 `Suspense`**：在展示布局的同时流式输出内容

### 常见模式

**并行数据获取：**

```ts
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments(),
]);
```

**直接导入：**

```tsx
// ❌ 会加载整个库
import { Check } from 'lucide-react';

// ✅ 只加载需要的部分
import Check from 'lucide-react/dist/esm/icons/check';
```

**动态组件：**

```tsx
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
  () => import('./monaco-editor'),
  { ssr: false }
);
```

## 指南使用方式

完整的性能指南位于本 references 目录中，适合在需要深入分析时按章节检索。

每条规则通常应包含：

- 错误与正确写法对比
- 具体影响说明
- 适用场景
- 真实项目中的落地示例

## 分类总览

### 1. 消除瀑布请求（CRITICAL）

瀑布请求是最常见的性能杀手。每一个顺序 `await` 都会额外引入完整的网络延迟。

- 延后 `await` 到使用点
- 基于依赖关系做并行化
- 防止 API Route 中形成瀑布链
- 对独立任务使用 `Promise.all()`
- 策略性设置 `Suspense` 边界

### 2. 包体积优化（CRITICAL）

减小首屏 bundle 体积可以改善 TTI 与 LCP。

- 避免从 barrel 文件导入
- 按条件加载模块
- 推迟非关键第三方库
- 对重量级组件使用动态导入
- 根据用户意图做预加载

### 3. 服务端性能（HIGH）

优化服务端渲染与数据获取路径。

- 跨请求 LRU 缓存
- 减少 RSC 边界上的序列化成本
- 通过组件组合做并行数据获取
- 使用 `React.cache()` 做单请求级去重

### 4. 客户端数据获取（MEDIUM-HIGH）

关注自动去重与高效数据获取模式。

- 去重全局事件监听器
- 使用 SWR 做自动去重

### 5. 重渲染优化（MEDIUM）

减少不必要的重渲染，避免浪费计算与布局成本。

- 把 state 读取推迟到真正使用的位置
- 抽出为记忆化组件
- 收窄 effect 依赖项
- 订阅派生状态而不是整块状态
- 使用惰性 state 初始化
- 对非紧急更新使用 transition

### 6. 渲染性能（MEDIUM）

优化浏览器渲染过程。

- 动画作用在 SVG 包裹层，而不是 SVG 元素本身
- 对长列表使用 CSS `content-visibility`
- 提升静态 JSX
- 优化 SVG 精度
- 在不闪烁的前提下避免 hydration mismatch
- 使用 Activity 组件进行显隐控制
- 显式使用条件渲染

### 7. JavaScript 性能（LOW-MEDIUM）

用于热点路径的微优化。

- 批量处理 DOM CSS 变更
- 为重复查找建立索引映射
- 在循环中缓存属性访问
- 缓存重复函数调用结果
- 缓存存储 API 的调用结果
- 合并多次数组遍历
- 数组比较前先做长度判断
- 函数中尽早返回
- 将 RegExp 创建提升到循环或渲染外部
- 用循环求 min/max，避免为此排序
- 对 O(1) 查询使用 `Set` / `Map`
- 使用 `toSorted()` 代替会变异原数组的 `sort()`

### 8. 高级模式（LOW）

适用于边缘场景的专项技巧。

- 将事件处理器存入 refs
- 使用 `useLatest` 保持 callback ref 稳定

## 实施方法

当你准备优化一个 React 应用时：

1. **先做性能画像**：使用 React DevTools Profiler 和浏览器性能工具识别瓶颈
2. **聚焦关键路径**：优先消除瀑布请求和缩减首屏包体积
3. **量化影响**：通过 LCP、TTI、FID 等指标验证收益
4. **渐进式应用**：避免过早优化和一次性过度重构
5. **充分测试**：确保优化不会破坏功能或交互

## 需要持续跟踪的关键指标

- **TTI（Time to Interactive）**：页面完全可交互的时间
- **LCP（Largest Contentful Paint）**：主要内容可见的时间
- **FID（First Input Delay）**：用户首次交互的响应延迟
- **CLS（Cumulative Layout Shift）**：视觉稳定性
- **Bundle 体积**：首屏 JavaScript 负载大小
- **服务端响应时间**：服务端渲染内容的 TTFB

## 常见误区

❌ **不要这样做：**

- 从大型库的 barrel 文件导入
- 用顺序 `await` 阻塞本可并行的操作
- 只更新局部却让整棵树重新渲染
- 在关键路径中加载埋点或分析脚本
- 用 `.sort()` 改写数组而不是使用 `.toSorted()`
- 在 render 中创建 RegExp 或重量级对象

✅ **推荐这样做：**

- 直接从源文件导入
- 对独立异步任务使用 `Promise.all()`
- 对昂贵组件做 memo 化
- 惰性加载非关键代码
- 使用不可变数组方法
- 把静态对象提升到组件外

## 参考资源

- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org)
- [SWR Documentation](https://swr.vercel.app)
- [Vercel Bundle Optimization](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [Vercel Dashboard Performance](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
- [better-all Library](https://github.com/shuding/better-all)
- [node-lru-cache](https://github.com/isaacs/node-lru-cache)

## 版本记录

**v0.1.0**（2026 年 1 月）

- Vercel Engineering 初始发布
- 覆盖 8 个分类下的 40+ 条性能规则
- 包含较完整的代码示例与影响分析

## 原始元信息

- 版本：`1.0.0`
- 作者：`Vercel Engineering`
- 许可证：`MIT`
- 标签：`React`、`Next.js`、`Performance`、`Optimization`、`Best Practices`、`Bundle Size`、`Rendering`、`Server Components`
