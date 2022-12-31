---
title: 'Map 和 Set'
excerpt: 'Map 和 Set'
coverImage: '/assets/blog/javascript/js.png'
date: '2022-12-31 15:23:00'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/javascript/js.png'
type: 'Javascript'
---

## Map 和 Set

### Map

`Map` 对象是键值对的集合。`Map` 中的一个键只能出现一次，它在 `Map` 的集合中是独一无二的。

使用 `for...of` 迭代时，每次迭代都会返回 `[key, value]` 形式的数组。迭代的顺序，就是使用 `set()` 方法插入的顺序。

`Map` 中键的相等性判断：
  - `NaN === NaN`
  - `+0 === -0`
  - 其他全等 `===` 判断相同

#### 与 Object 比较

- 1、意外的键
  - `Map` 默认不包含任何键，只包含显式插入的键
  - `Object` 原型上的键名可能和创建的对象上的键名产生冲突
- 2、键的类型
  - `Map` 的键可以是任意值，包括函数、对象和任意基本类型
  - `Object` 的键只能是 `String` 或 `Symbol`
- 3、键的顺序
  - `Map` 的键是有序的，迭代时按照插入的顺序返回
  - `Object` 的键目前是有序的。许多迭代对象属性的方法，只包含了对象属性的不同子集，比如：
    - `for...in` 仅包含自身可枚举的字符串属性，包含原型上的可枚举属性
    - `Object.keys` 仅包含对象自身的、可枚举的、字符串属性
    - `Object.getOwnPropertyNames` 仅包含自身的字符串属性，包括不可枚举属性
    - `Object.getOwnPropertySymbols` 仅包含自身的 `Symbol` 属性，包括不可枚举属性
- 4、`Size`
  - `Map` 的键的个数通过 `size` 属性获取
  - `Object` 的键的个数只能通过手动计算
- 5、迭代
  - `Map` 可以使用 `for...of` 直接进行迭代，每次迭代返回 `[key, value]` 数组
  - `Object` 不能使用 `for...of` 迭代，但可以使用其他方式进行迭代，比如：
    - `for...in` 迭代自身可枚举的字符串属性，包含原型上的可枚举属性
    - `Object.keys` 返回自身的、可枚举的、字符串属性数组
    - `object.values` 返回自身的、可枚举的、字符串属性对应的值数组
    - `object.entries` 返回自身的、可枚举的、字符串属性对应的 `[key, value]` 数组
- 6、性能
  - `Map` 在频繁的增删键值对的场景下表现更好
  - `Object` 在频繁的增删键值对的场景下未做优化
- 7、序列化和解析
  - `Map` 没有元素的序列化和解析支持
  - `Object` `JSON.stringify` 和 `JSON.parse`

```js
// Map 序列化和解析
const replacer =  (key, value) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}
const reviver = (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
const originalValue = new Map([['a', 1]]);
const str = JSON.stringify(originalValue, replacer);
const newValue = JSON.parse(str, reviver);
```

#### 构造函数

`new Map()` 可以传入二维数组

#### 实例属性

`Map.prototype.size` 返回 `Map` 键值对数量

#### 实例方法

- `Map.prototype.clear()` 清空 `Map` 所有键值对
- `Map.prototype.delete()` 移除 `Map` 指定的键值对，返回布尔值
- `Map.prototype.get()` 返回与键关联的值，没有则返回 `undefined`
- `Map.prototype.has()` 返回是否含有与键关联的值，返回布尔值
- `Map.prototype.set()` 设置 `Map` 键值对
- `Map.prototype.keys()` 返回 `Map` 所有键数组，以插入顺序排列
- `Map.prototype.values()` 返回 `Map` 所有值数组，以插入顺序排列
- `Map.prototype.entries()` 返回 `Map` 所有`[key, value]`数组，以插入顺序排列

```js
const map = new Map()

const keyString = "a"
const keyUndefined = undefined
const keyNull = null
const keyObject = {b: 2}
const keyFunc = () => {}

map.set(keyString, "string")
map.set(keyUndefined, "undefined")
map.set(keyNull, "null")
map.set(keyObject, "object")
map.set(keyFunc, "function")
console.log(map);
map.get(undefined) === map.get(keyUndefined) // true
map.get(null) === map.get(keyNull) // true
map.get(keyObject) === map.get({b: 2}) // false
map.get(keyFunc) === map.get(() => {}) // false

// 0
map.set(-0, "-0")
map.get(-0) === map.get(+0) === map.get(0) // true 都是 “-0“

// NaN
map.set(NaN, "NaN")
map.get(NaN) === map.get(Number("abc")) // true 都是 “NaN”
```

#### 迭代

```js
// for...of
for(const [key, value] of map) {
  console.log(`${key} - ${value}`)
}

for(const key of map.keys()) {
  console.log(key)
}

for(const value of map.values()) {
  console.log(value)
}

for(const [key, value] of map.entries()) {
  console.log(`${key} - ${value}`)
}

// forEach
map.forEach((value, key) => {
  console.log(`${key} - ${value}`)
})
```

#### 与数组的关系

```js
// 通过二维数组初始化
const arr = [["a", "1"], ["b", "2"]]
const map = new Map(arr)

console.log(Array.from(map)); // 输出和arr相同
console.log([...map]) // 输出和arr相同
console.log([...map.keys()]); // 展开keys
```

#### 复制和合并

```js
// 复制
const original = new Map([
  [1, 'one'],
]);
const clone = new Map(original);
clone.get(1) // 'one'
original !== clone // true

// 合并
const first = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

const second = new Map([
  [1, 'uno'],
  [2, 'dos']
]);
// 重复的键后面的会覆盖前面的
const merge = new Map([...first, ...second]) //  {1 => 'uno', 2 => 'dos', 3 => 'three'}
```

### WeakMap

`WeakMap` 的键必须是对象类型，只可以是任意类型。其键被弱引用，也就是说：当键所指对象没有被其他地方所引用的时候，就会被回收掉。

**正由于其键是弱引用的，这意味着在没有其他地方引用存在时，垃圾回收能正确进行。`WeakMap` 的 `key` 在没有被回收时才是有效的，因此，其 `key` 是不可枚举的。如果 `key` 是可枚举的话，其列表将会受垃圾回收机制影响，从而得到不确定的结果。**

#### 与 Map 比较

- 没有 `size` 属性
- 没有 `keys()`、`values()`、`entries()`、`clear()` 方法
- `WeakMap` 是不可迭代的

### Set

`Set` 对象允许存储任何类型的唯一值，无论是原始值或者是对象引用


#### 值的相等

`Set` 对象是值的集合，可以按照插入的顺序进行迭代。`Set` 中的元素只会出现一次，是唯一的。

- `+0 === -0`
- `NaN === NaN`

#### 构造函数

`Set()` 可以传入数组初始化

#### 实例属性

`Set.prototype.size` 返回 `Set` 对象中值的个数

#### 实例方法

- `Set.prototype.add(value)` 在 `Set` 对象尾部添加一个元素，返回该 `Set` 对象
- `Set.prototype.clear()` 移除 `Set` 对象内的所有元素
- `Set.prototype.delete(value)` 移除 `Set` 对象内值为 `value` 的元素，返回布尔值
- `Set.prototype.has(value)` 返回布尔值，表示该值是否存在于 `Set` 对象内
- `Set.prototype.keys()` 返回按照插入顺序排列的所有元素数组
- `Set.prototype.values()` 返回按照插入顺序排列的所有元素数组
- `Set.prototype.entries()` 返回按照插入顺序排列的所有元素 `[value, value]` 数组

```js
const set = new Set([1, "3", undefined])
set.add(+0)
set.add(-0)
set.add(0)
set.add(NaN)
set.add(NaN)
console.log('set: ', set); // {0, 1, '3', undefined, NaN}
set.size // 5

// 迭代
for(const item of set) {
  console.log(item); // 按顺序输出 0 1 '3' undefined NaN
}

for(const key of set.keys()) {
  console.log(item); // 按顺序输出 0 1 '3' undefined NaN
}

for(const value of set.values()) {
  console.log(value); // 按顺序输出 0 1 '3' undefined NaN
}

for(const [key, value] of set.entries()) {
  console.log(key); // 按顺序输出 0 1 '3' undefined NaN
}
```

#### 基本的集合操作

```js
// set 是否包含 subset 里的所有元素
function isSuperset(set, subset) {
  for (let elem of subset) {
      if (!set.has(elem)) {
          return false;
      }
  }
  return true;
}
// setA 和 setB 的并集 - 将两个集合合并
function union(setA, setB) {
    return new Set([...setA, ...setB])
}
// setA 和 setB 的交集 - setA 和 setB 中都有的元素
function intersection(setA, setB) {
    return new Set([...setA].filter(i => setB.has(i)))
}
// setA 和 setB 的对称差集 - 去除两个里面相同的元素
function symmetricDifference(setA, setB) {
    return new Set([...difference(setA, setB), ...difference(setB, setA)])
}
// setA 相对于 setB 的差集 - 去除 setA 中和 setB 相同的元素
function difference(setA, setB) {
    return new Set([...setA].filter(i => !setB.has(i)))
}

//Examples
let setA = new Set([1, 2, 3, 4]),
    setB = new Set([2, 3]),
    setC = new Set([3, 4, 5, 6]);

isSuperset(setA, setB);          // => true
union(setA, setC);               // => Set [1, 2, 3, 4, 5, 6]
intersection(setA, setC);        // => Set [3, 4]
symmetricDifference(setA, setC); // => Set [1, 2, 5, 6]
difference(setA, setC);          // => Set [1, 2]
```

![集合](/assets/blog/javascript/set.jpg)

### WeakSet

`WeakSet` 中的元素都是弱引用的对象，每个对象只能在集合中出现一次，是唯一的。

如果其中的对象没有其他地方的引用，那么其就会被垃圾回收掉。**`WeakSet`是不可枚举的**

#### 与 Set 比较

- 没有 `size` 属性
- 没有 `keys()`、`values()`、`entries()`、`clear()` 方法
- `WeakSet` 是不可迭代的