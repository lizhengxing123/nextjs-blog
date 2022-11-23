---
title: 'React Hooks 概览'
excerpt: '学习 React Hooks'
coverImage: '/assets/blog/react/hooks.png'
date: '2022-11-23 09:08:14'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/react/hooks.png'
type: 'React'
---

## Hooks

### useState

```js
const [num, setNum] = useState(0)
```

返回一个 state，以及一个更新 state 的函数。

#### 函数式更新

更新 state 的函数可以接收一个新的 state，也可以接收一个函数，该函数接收先前的 state 作为参数，返回一个新的 state。

```js
// 接收一个新的 state
setNUm(1)
// 接收一个函数
setNum(prevState => prevState + 1)
// 如果是一个对象，可以进行合并
setObj(prevState => ({...prevState, ...newState}))
```

#### 惰性初始 state

初始 state 可以接收一个函数，在函数计算中返回初始的 state

```js
const [num, setNum] = useState(() => {
    // 一些计算
    return initialState
})
```

### useEffect

```js
useEffect(() => {
    // 每次渲染需要做的
    return () => {
        // 组件卸载需要做的
    }
}, [/* 依赖项 */])
```

该 Hook 接收一个包含命令式，且可能有副作用的函数。默认情况下，在 useEffect 内的函数会在每次渲染后执行（不传第二个参数），也可以在第二个参数的数组中指定值，只有指定的值变化时才执行。如果第二个参数是空数组，那么只有在初次渲染才会执行。

#### 清除 effect

useEffect 第一个参数是函数，其返回的函数就是清除函数，会在组件卸载时执行。另外，如果组件多次渲染，每次执行 effect 之前，上次的 effect 就已被清除。

### useContext

```js
const value = useContext(MyContext)
```

接收 `React.createContext()` 的返回值，并返回当前 context 的值。当距离组件最近的 Provider 中的 value 变化时，该 Hook 回触发重渲染，并使用最新的值。

### useReducer

```js
const [state, dispatch] = useReducer(reducer, initialArg, init)
```

接收一个 reducer 返回当前的状态以及配套的 dispatch 方法。

使用第二个参数可以指定初始状态

```js
const [state, dispatch] = useReducer(reducer, {count: 0})
```

使用第三个参数可以惰性指定初始状态，它是一个函数，参数为第二个参数（初始状态）

```js
const [state, dispatch] = useReducer(reducer, initialArg, (initialArg) => {
    return initialState
})
```

### useCallback

```js
const memoizedCallback = useCallback(() => { doSomething(a, b) }, [a, b])
```

把内联回调函数及依赖项数组作为参数传入 useCallback，返回该回调函数的 memoized 版本，该回调函数只在依赖项变化的时候才会更新

### useMemo

```js
const memoizedValue = useMemo(() => doSomething(a, b) , [a, b])
```

把创建函数及依赖项数组作为参数传入 useMemo，它仅会在依赖项变化的时候重新计算 memoized 值。如果没有提供依赖项数组，useMemo 会在每次渲染的时候计算新的值。useMemo 中的函数会在渲染期间执行，不能在函数内部执行不应在渲染期间执行的操作。

### useRef

```js
const ref = useRef(null)
```

useRef 返回一个可变的 ref 对象，ref.current 为绑定的 DOM 节点。useRef 在每次渲染的时候都会返回同一个对象。current 变化的时候，不会引发组件重新渲染。

如果想要在绑定或解绑 ref 时执行某些代码，则需要使用回调 ref 实现

```js
function Example() {
  const [height, setHeight] = useState(0);
  // 在加载和卸载组件时执行
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

### useImperativeHandle

```js
useImperativeHandle(ref, createHandle, [deps])
```

用于父组件操作子组件（函数组件）使用，配合 forwardRef 一起使用

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
// 父组件中
<FancyInput ref={inputRef} /> 
inputRef.current.focus()
```

### useLayoutEffect

```js
useLayoutEffect(effect)
```

会在所有的 DOM 变更之后同步调用 effect，可以使用它来读取 DOM 布局并同步触发重渲染

### useDebugValue

```js
useDebugValue(value)
```

用于在开发工具中显示自定义 Hook 的标签

### useDeferredValue

```js
const deferredValue = useDeferredValue(value)
```

将这个值标记为非紧急更新，只有当紧急更新都完成后，才会去更新这个值。

### useTransition

```js
const [isPending, startTransition] = useTransition()
```

返回一个等待状态，以及一个启动过渡任务的函数

```js
function Counter() {
  const [query, setQuery] = useState("");
  const [deferredQuery, setDeferredQuery] = useState("");
  // 使用useDeferredValue
  // const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();

  // Memoizing 告诉 React 仅当 deferredQuery 改变，
  // 而不是 query 改变的时候才重新渲染
  const suggestions = useMemo(() => {
    const arr = new Array(50000).fill("");
    return (
      <ul>
        {arr.map((i, j) => (
          <li key={j}>
            {deferredQuery}--{j}
          </li>
        ))}
      </ul>
    );
  }, [deferredQuery]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    startTransition(() => {
      setDeferredQuery(e.target.value);
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      <div>{`${isPending}`}</div>
      <Suspense fallback="Loading results...">{suggestions}</Suspense>
    </>
  );
}
```

### useId

```js
const id = useId() // :r1:
```