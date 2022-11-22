---
title: 'React 高级概念'
excerpt: '学习 React 高级概念使用'
coverImage: '/assets/blog/react/react18-1.png'
date: '2022-11-22 21:33:14'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/react/react18-1.png'
type: 'React'
---

## Context

[官方文档](https://zh-hans.reactjs.org/docs/context.html)
[优秀博客](http://www.ptbird.cn/react-createContex-useContext.html)

- 使用 React.createContext 创建上下文，由于子组件消费的时候也需要这个 Context，所以我们可以新建一个文件管理所有的 Context

```js
// contextManager.js
export const MyContext = React.crateContext(/* defaultValue */)
```

- 使用 Provider 提供上下文

```js
// app.jsx
import { MyContext } from './contextManager.js'
export default function() {
    return (
        <MyContext.Provider value="val">
            <Child />
        </MyContext.Provider>
    )
}
```

- 在 class 组件中，声明静态属性 contextType 拿到 Context 提供的值

```js
// child.jsx
import { MyContext } from './contextManager.js'
export default class Child extends React.Component {
    // MyContent 这个值是创建的 Content 实例
    static contextType = MyContent
    render() {
        return <div>{ this.context /* 这个值就是 Provider 提供的 value -> 'val' */}</div>
    }
}
```

- 在 function 组件中，使用 useContext 拿到 Context 提供的值

```js
// child.jsx
import { useContext } from 'react'
import { MyContext } from './contextManager.js'
export default function Child() {
    // MyContent 这个值是创建的 Content 实例
    const value = useContext(MyContext)
    return <div>{ value /* 这个值就是 Provider 提供的 value -> 'val' */}</div>
}
```

## Ref 转发

Ref 转发允许某些组件接收 ref，并将其向下传递给子组件

```js
const FancyButton = React.forwardRef((props, ref) => {
    return <div>
        <button ref={ref}>{props.children}</button>
    </div>
})

const ref = React.createRef()
<FancyButton ref={ref} />
// 现在 ref.current 就是 button
```

### 在高阶组件中转发 refs

```js
// 高阶组件
function logProps(WrappedComponent) {
    class LogProps extends React.Component {
        componentDidUpdate(prevProps) {
            console.log('prevProps: ', prevProps);
            console.log('currentProps: ', this.props);
        }

        render() {
            const {forwardRef, ...rest} = this.props
            return <WrappedComponent {...rest} ref={forwardRef} />
        }
    }

    // 转发 ref 函数
    function forwardRef(props, ref) {
        return <LogProps {...props} forwardRef={ref} />
    }

    // 给 forwardRef 函数设置 displayName，可以在 devTools 中显示
    const name = WrappedComponent.displayName || WrappedComponent.name
    forwardRef.displayName = `LogProps-${name}`

    // 返回新的组件
    return React.forwardRef(forwardRef)
}

// 使用
const LogFancyButton = logProps(FancyButton)

<LogFancyButton ref={ref} />
```

转发流程梳理：

-  LogFancyButton 的 ref 转发给 LogProps 的父组件，也就是 forwardRef 函数
-  LogProps 的父组件拿到 ref 重命名为 forwardRef，将 forwardRef 作为 prop 传递给 LogProps
-  LogProps 从 props 中解析 forwardRef，将 forwardRef 作为 ref 传递给 WrappedComponent，也就是 FancyButton
-  FancyButton 继续将 ref 转发到 button 按钮上
-  在 LogFancyButton 组件中就可以拿到 button 元素

## 高阶组件

- 高阶组件是参数为组件，返回值还是组件的函数
- 高阶组件将一个组件转换为另一个组件，并且不会改变原始组件，是一个纯函数
- 高阶组件返回的组件应该和原始组件保持类似的接口，不应该将无关的 prop 传递给被包装组件

## Portals

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀方案

```js
ReactDOM.createPortal(child, container);
```

## Profiler

Profiler 测量一个 React 应用多久渲染一次，以及渲染一次的代价，它的目的是识别出应用中渲染较慢的部分

```js
import {Profiler} from 'react'

const onRenderCallback = (
    id, // 发生提交的 Profiler 树的 “id”
    phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
    actualDuration, // 本次更新 committed 花费的渲染时间
    baseDuration, // 估计不使用 memoization 的情况下渲染整棵子树需要的时间
    startTime, // 本次更新中 React 开始渲染的时间
    commitTime, // 本次更新中 React committed 的时间
    interactions // 属于本次更新的 interactions 的集合
) => {
    console.log("id: ", id);
    console.log("phase: ", phase);
    console.log("actualDuration: ", actualDuration);
    console.log("baseDuration: ", baseDuration);
    console.log("startTime: ", startTime);
    console.log("commitTime: ", commitTime);
    console.log("interactions: ", interactions);
};

<Profiler id="Navigation" onRender={onRenderCallback}>
    <Navigation />
</Profiler>
```

## 在函数组件中使用 Ref

默认情况下，在函数组件上不能使用 ref，因为它没有实例。但在函数组件内部可以使用 ref，只有它只想一个 DOM 元素或者 Class 组件。如果要在函数组件上使用 ref，可以配合 forwardRef 和 useImperativeHandle 使用。

```js
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const Example = (props, ref) => {
  const inputRef = useRef(null);
  const [num, setNum] = useState(0);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setNum(0);
    },
  }));

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <div>{num}</div>
      <button onClick={() => setNum(num + 1)}>++++</button>
      <br />
      <input type="text" ref={inputRef} />
    </div>
  );
};

const ExampleWrapper = forwardRef(Example);

export default ExampleWrapper;

// 父组件中使用
<ExampleWrapper ref={parentRef} />
// 可以调用 reset 将值重置
parentRef.current.reset()
```