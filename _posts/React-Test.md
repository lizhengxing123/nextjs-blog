---
title: '在 React 中使用 Jest 测试'
excerpt: '学习 Jest 测试'
coverImage: '/assets/blog/react/advanced.png'
date: '2022-11-24 21:33:14'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/react/advanced.png'
type: 'React'
---

## 使用 Jest 测试

### 创建/清除

对于每个测试，开始时，我们都需要将 React 树渲染给附加到 document 的 DOM 元素中，以便它能接收 DOM 事件，当测试结束后，我们需要清理并从 document 中卸载树。

常见方法是使用一对 beforeEach 和 afterEach 块，以便它们一直运行，并隔离测试本身造成的影响。

```js
import { unmountComponentAtNode } from "react-dom"

let container = null

beforeEach(() => {
    // 创建元素，作为渲染容器
    container = document.createElement('div')
    document.body.appendChild(container)
})

afterEach(() => {
    // 移除元素，卸载组件
    unmountComponentAtNode(container)
    document.body.removeChild(container)
    container = null
})
```

### act()

可以将渲染、用户事件或数据获取等任务视为与用户界面交互的单元。可以在 act 中处理这些单元，它能确保在进行任何断言之前，与这些单元相关的更新都已处理并应用到 DOM 上。

```js
import { act } from 'react-dom/test-utils';

act(() => {
    // 执行一些'单元'操作
})
// 进行断言
```

### 渲染

测试组件对于给定的 props 是否渲染准确

```js
// 组件 - hello.js
export default function Hello(props) {
    return <div>Hello {props.name ? props.name : '陌生人'}</div>
}
// 测试 - hello.tst.js
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Hello from "./hello.js"

let container = null

beforeEach(() => {
    // 创建元素，作为渲染容器
    container = document.createElement('div')
    document.body.appendChild(container)
})

afterEach(() => {
    // 移除元素，卸载组件
    unmountComponentAtNode(container)
    document.body.removeChild(container)
    container = null
})

it("是否根据 props 渲染", () => {
    act(() => {
        // 渲染组件
        render(<Hello />, container)
    })
    // 断言
    expect(container.textContent).toBe('Hello 陌生人')

    act(() => {
        // 渲染组件
        render(<Hello name="李正星" />, container)
    })
    // 断言
    expect(container.textContent).toBe('Hello 李正星')
})
```

### 数据获取

可以使用假数据来 mock 请求，而不是在测试中调用真实的 API。使用 mock 可以防止由于后端不可以导致的测试不稳定，并使它们运行的更快。

```js
// 组件 - user.js
import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);
  
  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "加载中...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> 岁
      <br />
      住在 {user.address}
    </details>
  );
}
// 测试 - user.test.js
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null

beforeEach(() => {
    document.createElement('div')
    document.body.appendChild(container)
})

afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    container = null
})

it("渲染用户数据", () => {
    const fakeUser = {
        name: "李正星",
        age: "24",
        address: "兰州市"
    }
    // 模拟 fetch
    jest.spyOn(global, 'fetch').mockImplementation(() => {
        Promise.resolve({
            json: () => Promise.resolve(fakeUser)
        })
    })

    // 异步渲染
    await act(async () => {
        render(<User id="2" />, container)
    })

    // 断言
    expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
    expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
    expect(container.textContent).toContain(fakeUser.address);

    // 将模拟 fetch 恢复为原始值
    global.fetch.mockRestore()
})
```