---
title: '深拷贝'
excerpt: '深拷贝'
coverImage: '/assets/blog/javascript/js.png'
date: '2022-12-28 16:20:00'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/javascript/js.png'
type: 'Javascript'
---

## 深拷贝

对象的深拷贝是指其属性与其拷贝的源对象的属性不共享相同的引用的副本。因此，当修改副本或者源对象时，可以确保不会导致其他对象也发生更改。

在对象的浅拷贝中，由于两个对象可能共享相同的引用，因此，当修改副本或者源对象时，可能导致其他对象的更改。

### 浅拷贝方法

- 展开运算符：`...`
- `Array.prototype.concat()`
- `Array.prototype.slice()`
- `Array.from()`
- `Object.assign()`
- `Object.create()`

```js
const obj = {
  a: 1,
  b: {
    c: 2
  }
}
const arr = [1, 2, {d: 3}]
const arr1 = arr.concat()
console.log(arr === arr1, arr[2] === arr1[2]) // false true
const arr2 = arr.slice()
console.log(arr === arr2, arr[2] === arr2[2]) // false true
const arr3 = Array.from(arr)
console.log(arr === arr3, arr[2] === arr3[2]) // false true
const obj1 = Object.assign({}, obj)
console.log(obj === obj1, obj.b === obj1.b) // false true
const obj2 = Object.create(obj)
console.log(obj === obj2, obj.b === obj2.b) // false true
```

### 深拷贝方法

#### JSON序列化

```js
JSON.parse(JSON.stringify(obj))
```

问题：

1. 函数、`Symbol`、`DOM`、`undefined` 无法进行拷贝
2. 循环引用会导致报错

#### 手写 deepClone 函数

- 基础版本

```js
const deepClone = (source, map = new Map()) => {
  if (typeof source === "object" && source !== null) {
    // 处理循环引用
    if(map.has(source)) {
      return map.get(source)
    }
    const target = Array.isArray(source) ? [] : {}
    map.set(source, target)
    for(const key in source) {
      target[key] = deepClone(source[key], map)
    }
    return target
  } else {
    return source
  }
}
```

- 进阶版本

```js
const deepClone = (source, map = new WeakMap()) => {
  if (typeof source === "object" && source !== null) {
    // 处理循环引用
    if(map.has(source)) {
      return map.get(source)
    }
    const target = Array.isArray(source) ? [] : {}
    map.set(source, target)
    if(Array.isArray(source)) {
      for (const key in source) {
        target[key] = deepClone(source[key], map)
      }
    } else {
      // 处理 Symbol
      const keys = [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]
      for (const key of keys) {
        target[key] = deepClone(source[key], map)
      }
    }
    return target
  } else {
    return source
  }
}
```

#### window.structuredClone

使用结构化克隆算法将给定的值进行深拷贝

```js
const copy = window.structuredClone(value, { transfer })
```

- `value`：被克隆的对象，支持`Array`、`ArrayBuffer`、`Boolean`、`DateView`、`Date`、`Error`、`Map`、`Object`、除`Symbol`以外的基本类型、`RegExp`、`Set`、`String`、`TypedArray`
- `transfer`：可转移对象的数组，里面的值并没有被克隆，而是被转移到被拷贝对象上


#### window.MessageChannel

创建消息通道来发送数据

```js
const deepClone = (source) => {
  return new Promise((resolve, reject) => {
    const {port1, port2} = new window.MessageChannel()
    port1.postMessage(o)
    port2.onmessage = (msg) => {
      resolve(msg.data)
    }
  })
}
```

> 不能拷贝`Symbol`、函数和`DOM`