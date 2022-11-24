---
title: '在 React 中使用 Jest 测试'
excerpt: '学习 Jest 测试'
coverImage: '/assets/blog/react/jest.png'
date: '2022-11-24 11:32:19'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/react/jest.png'
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
        return Promise.resolve({
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

### mock 模块

有些模块可能在测试环境中不能很好的工作，或者对测试本身不是很重要，使用虚拟数据来 mock 这些模块可以让测试编写更容易。

```js
// 组件 - map.js
import React from "react";
import { LoadScript, GoogleMap } from "react-google-maps";

export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// 组件 - contact.js
import React from "react";
import Map from "./map";

export default function Contact(props) {
  return (
    <div>
      <address>
        联系 {props.name}，通过{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        或者他们的 <a data-testid="site" href={props.site}>
          网站
        </a>。
      </address>
      <Map center={props.center} />
    </div>
  );
}

// 测试 - contact.test.js
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'

import Map from './map.js'
import Contact from './contact.js'

// mock map 组件，它对于 Contact 的测试并不是很重要
jest.mock('./map.js', () => {
    return function dummyMap(props) {
        return (
            <div data-testid="map">
                {props.map.lat}:{props.map.long}
            </div>
        )
    }
})

// 渲染容器
let container = null

beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
})

afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    container = null
})

it("信息渲染正确", () => {
    // 执行渲染操作
    act(() => {
        <Contact 
            name="lzx"
            email="email@address.com"
            site="http://www.baidu.com"
            center={{lat: 0, long: 0}}
        />,
        container
    })
    // 断言
    expect(
        document.querySelector('[data-testid="email"]').getAttribute("href")
    ).toEqual("email@address.com")

    expect(
        document.querySelector('[data-testid="site"]').getAttribute("href")
    ).toEqual("http://www.baidu.com")

    expect(
        document.querySelector('[data-testid="map"]').textContent
    ).toEqual("0:0")
})
```

### Events

在 DOM 元素上触发真正的 DOM 事件，然后对结果进行断言

```js
// 组件 - toggle.js
import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        // 调用的时候 state 的值还没变
        // 第一次点击的时候 state === false
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state ? "Turn off" : "Turn on"}
    </button>
  );
}

// 测试 - toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("点击更新值", () => {
    // 模拟函数
    const onChange = jest.fn()
    // 渲染组件
    act(() => {
        <Toggle onChange={onChange} />,
        container
    })
    // 获取按钮元素
    const button = document.querySelector("[data-testid=toggle]")
    expect(button.innerHTML).toBe("Turn on")
    // 触发点击事件
    act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true /* 允许冒泡 */ }))
    })
    //断言
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(button.innerHTML).toBe("Turn off")
})
```

因为 React 会自动将事件委托给 root，所以我们得允许每个事件冒泡到 root 节点，每个事件得指定 `{ bubbles: true /* 允许冒泡 */ }`

### 计时器

使用 setTimeout 

```js
// 组件 - card.js
// 超过 5 秒参数为 null
import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}

// 测试 - card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Card from "./card";

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
  // 使用模拟计时器
  jest.useFakeTimers();
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  // 恢复到真实的计时器
  jest.useRealTimers();
});

it("超时后应选择 null", () => {
  // 模拟函数 
  const onSelect = jest.fn();
  // 渲染组件
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // 将时间往前推 100 ms
  act(() => {
    jest.advanceTimersByTime(100);
  });
  // onSelect 不会被调用
  expect(onSelect).not.toHaveBeenCalled();

  // 将时间往前推 5000 ms
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  // onSelect 被调用，参数为 null
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("移除时应进行清理", () => {
  // 模拟函数
  const onSelect = jest.fn();
  // 渲染组件
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });
  // 将时间往前推 100 ms
  act(() => {
    jest.advanceTimersByTime(100);
  });
  // onSelect 不会被调用
  expect(onSelect).not.toHaveBeenCalled();

  // 卸载应用程序 - 定时器应被清除
  act(() => {
    render(null, container);
  });
  // 将时间往前推 5000 ms
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  // 模拟函数不会被调用
  expect(onSelect).not.toHaveBeenCalled();
});

it("应接受选择", () => {
  // 模拟函数
  const onSelect = jest.fn();
  // 渲染组件
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });
  // 派发点击事件
  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  // 函数被调用，参数为指定的参数
  expect(onSelect).toHaveBeenCalledWith(2);
});
```

### 快照测试

使用 toMatchSnapshot / toMatchInlineSnapshot 保存数据的快照。有了这些，我们可以保存渲染的组件输出，并确保对它的更新作为对快照的更新显式提交。

```js
// 组件 - hello.js
import React from "react";

export default function Hello(props) {
    return <div>Hello {props.name ? props.name : '陌生人'}</div>
}
// 测试 - hello.test.js
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
// 对渲染的 HTML 进行格式化，然后将其保存为内联快照
import pretty from "pretty";
import Hello from "./hello";

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("应渲染问候语", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... 由 jest 自动填充 ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... 由 jest 自动填充 ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... 由 jest 自动填充 ... */
});
```

### 多渲染器

使用多个渲染器在组件上运行测试

```js
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```