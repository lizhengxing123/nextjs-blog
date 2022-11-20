---
title: 'React 18 新特性'
excerpt: '学习 React 18 的使用'
coverImage: '/assets/blog/react/react18-1.png'
date: '2022-11-20 21:59:32'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/react/react18-1.png'
type: 'React'
---

## 学习

- [bilibili 视频](https://www.bilibili.com/video/BV1BG4y1b74H/?p=3&spm_id_from=pageDriver&vd_source=97e4871747b6e43793eaa0ddb1bb5191)
- [官方文档](https://zh-hans.reactjs.org/docs/getting-started.html)

## 新特性

### render API 改变

React 18 写法

```js
import React from 'react'
import ReactDom from 'react-dom/client'

ReactDom.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
```

React 17 写法

```js
import React from 'react'
import ReactDom from 'react-dom'

ReactDom.render(<App />, document.getElementById("root"))
```

### 自动批量更新 State

React将多个状态更新分组到一个重新渲染中以获得更好的性能。之前版本只能在 React 事件处理函数进行批处理，v18支持的批处理：

- React 事件处理函数
- setTimeout
- Promise
- 原生事件处理函数

> 需要关闭严格模式测试

使用 flushSync 可以将批量更新的 State 分开更新

```js
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";

const Demo = () => {
  const [name, setName] = useState("Zhengxing");
  const [age, setAge] = useState(19);

  useEffect(() => {
    document.body.addEventListener(
      "click",
      () => {
        flushSync(() => {
          setName("vfgs");
        });
        setAge(123);
      },
      false
    );
  }, []);
  return (
    <div>
      {name} - {age}
    </div>
  );
};

export default Demo;
```

### 并发模式

并发模式提供了可中断的能力，是一种底层的设计，它使 React 能够同时准备多个版本的 UI。

在同步渲染过程中，一旦更新开始渲染，在用户可以在屏幕上看到结果之前，没有什么可以中断它。

在并发渲染过程中，React 可能会开始呈现更新，在中间暂停，然后稍后继续；也可能完全放弃正在执行的更新，去执行更高优先级的更新任务。

- useTransition

React 中的状态更新有两种：

1、紧急更新：反映了直接交互，例如输入、单击、按下等，需要立即响应

2、过渡更新：将 UI 从一个视图转换到另一个视图，可以有延迟，不需要立即响应

```js
// startTransition 
import {startTransition} from 'react';
// 紧急
setInputValue(input);
// 过渡
startTransition(() => {
  setSearchQuery(input);
});

// useTransition
import {useTransition} from 'react';

const [isPending, startTransition] = useTransition()
// 紧急
setInputValue(input);
// 过渡
startTransition(() => {
  setSearchQuery(input);
});
```

包裹在 startTransition 里面的更新是非紧急更新，如果出现了紧急更新，则会被中断，React 会清除旧的渲染工作并执行紧急更新。

useTransition 还会返回一个是否在的等待紧急更新的状态值，如果是 true 就表示正在执行紧急更新。

**默认情况下，所有的更新都是紧急更新**

- useDeferredValue

这个方法返回一个延迟响应的值，可以让一个 state 延迟响应，只有当前没有紧急更新任务时，这个值才会变为最新值，它也相当于标记了一个非紧急任务更新。

```js
// useTransition
import {useDeferredValue} from 'react';

const [isPending, startTransition] = useTransition()
// 紧急
setInputValue(input);
// 过渡
useDeferredValue(query);
```

startTransition 是将更新状态的方法变为延迟更新；而 useDeferredValue 是将状态变为延迟的状态。

## Suspense 组件

- 配合 lazy 懒加载进行代码分割

```js
import React from "react";

const Component = React.lazy(() => import("pathname"));

<React.Suspense fallback={<div>Loading ...</div>}>
    <Component />
</React.Suspense>
```

- [请求接口时使用](https://17.reactjs.org/docs/concurrent-mode-suspense.html)

[查看视频详解](https://www.bilibili.com/video/BV1BG4y1b74H?p=9&spm_id_from=pageDriver&vd_source=97e4871747b6e43793eaa0ddb1bb5191)

```js
// wrapPromise.js
// 我们组件中请求接口的方法需要用这个方法包裹
const wrapPromise = (promise) => {
  let status = "pending";
  let result;
  let suspend = promise().then(
    (res) => {
      status = "success";
      result = res;
    },
    (err) => {
      status = "error";
      result = err;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspend;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
};

// 例如 - 请求用户
const fetchUser = () => {
    return new Promise((resolve) => {
        resolve({
            name: "Zhengxing"
        })
    })
}

// 在组件中需要调用这个方法
export const fetchData = () => {
    const promise = fetchUser();
    return {
        user: wrapPromise(promise);
    }
}

// User.jsx
import React from "react"
import {fetchData} from "./wrapPromise.js"
// 组件中调用
const source = fetchData()
// 获取数据
export default function User() {
    const data = source.user.read()
    return (
        <React.Suspense fallback={<div>Loading ...</div>}>
            <div>{data.name}</div>
        </React.Suspense>
    )
}
```
