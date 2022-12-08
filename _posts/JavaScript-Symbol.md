---
title: 'Symbol'
excerpt: 'JavaScript Symbol'
coverImage: '/assets/blog/javascript/symbol.png'
date: '2022-12-06 14:25:34'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/javascript/symbol.png'
type: 'Javascript'
---

## Symbol

`symbol` 是一种基本数据类型。`Symbol()` 函数会返回 `symbol` 类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象，它的静态方法会暴露全局的 `symbol` 注册，且类似于内建对象类。但作为构造函数来说它并不完整，因为它不支持语法： `new Symbol()`。

### 语法

```js
Symbol([description])
```
- `description`：可选参数，接收一个字符串，如果传入其他类型的数据，会转换为字符串。该参数表示对 `symbol` 的描述，可用于调试但不是访问 `symbol` 本身。

每个从 `Symbol()` 返回的 `symbol` 值都是唯一的。一个 `symbol` 值能作为对象属性的标识符；这是该数据类型仅有的目的。

### 描述

```js
const sym1 = Symbol()
const sym2 = Symbol('foo')
const sym3 = Symbol('bar')
```

由于每个从 `Symbol()` 返回的 `symbol` 值都是唯一的，所以：

```js
Symbol() !== Symbol()
Symbol('foo') !== Symbol('foo')
```

使用 `Object()` 函数创建一个 `Symbol` 包装器对象。

```js
const sym = Symbol('foo')
const symObject = Object(sym)
```

使用 `Object.getOwnPropertySymbols()` 方法在对象中查找 `Symbol` 属性，返回一个 `symbol` 类型的数组

```js
Object.getOwnPropertySymbols(Array)
// [Symbol(Symbol.species)]
```

### 属性

- `Symbol.length`：长度属性，值为0
- `Symbol.prototype`：`Symbol` 的原型对象

#### 内置通用 symbol

迭代器相关：

- `Symbol.iterator`：迭代器方法，被 `for...of` 使用
- `Symbol.asyncIterator`：迭代器方法，被 `for await of` 使用

正则表达式相关：

- `Symbol.match`：对字符串进行匹配的方法，被 `String.prototype.match()` 使用
- `Symbol.replace`：替换匹配字符串的子串的方法，被 `String.prototype.replace()` 使用
- `Symbol.search`：返回一个字符串中与正则表达式相匹配的索引的方法，被 `String.prototype.search()` 使用
- `Symbol.split`：在匹配正则表达式的索引处拆分一个字符串的方法，被 `String.prototype.split()` 使用

其他：

- `Symbol.hasInstance`：确定一个构造器对象识别的对象是否为它的实例的方法，被 `instanceof` 使用
- `Symbol.isConcatSpreadable`：布尔值，表明一个对象是否应该 `flattened` 为它的数组元素，被 `Array.prototype.concat()` 使用
- `Symbol.unscopables`：拥有和继承属性名的一个对象的值被排除在与环境绑定的相关对象外
- `Symbol.species`：用于创建派生对象的构造器函数
- `Symbol.toPrimitive`：将对象转化为基本数据类型的方法
- `Symbol.toStringTag`：对象的默认描述的字符串值，被 `Object.prototype.toString()` 使用

### 方法

- `Symbol.for(key)`：使用给定的 `key` 搜索现有的 `symbol`，如果找到则返回该 `symbol`。否则将使用给定的 `key` 在全局 `symbol` 注册表中创建一个新的 `symbol`

```js
Symbol.for("foo"); // 创建一个 symbol 并放入 symbol 注册表中，键为 "foo"
Symbol.for("foo"); // 从 symbol 注册表中读取键为"foo"的 symbol


Symbol.for("bar") === Symbol.for("bar"); // true，证明了上面说的
Symbol("bar") === Symbol("bar"); // false，Symbol() 函数每次都会返回新的一个 symbol


const sym = Symbol.for("mario");
sym.toString();
// "Symbol(mario)"，mario 既是该 symbol 在 symbol 注册表中的键名，又是该 symbol 自身的描述字符串
```

- `Symbol.keyFor(sym)`：从全局 `symbol` 注册表中，为给定的 `symbol` 检索一个共享的 `symbol key`

```js
// 创建一个全局 Symbol
const globalSym = Symbol.for("foo");
Symbol.keyFor(globalSym); // "foo"

const localSym = Symbol();
Symbol.keyFor(localSym); // undefined，

// 以下 Symbol 不是保存在全局 Symbol 注册表中
Symbol.keyFor(Symbol.iterator) // undefined
```

### 原型

实例属性：

- `Symbol.prototype.description`：一个只读的字符串，意为对该 `Symbol` 对象的描述

实例方法：

- `Symbol.prototype.toSource`：返回该 `Symbol` 对象的源代码。该方法重写了 `Object.prototype.toSource` 方法
- `Symbol.prototype.toString`：返回一个包含着该 `Symbol` 对象描述的字符串。该方法重写了 `Object.prototype.toString` 方法
- `Symbol.prototype.valueOf`：返回该 `Symbol` 对象。该方法重写了 `Object.prototype.valueOf` 方法
- `Symbol.prototype[@@toPrimitive]`：返回该 `Symbol` 对象。

### 示例

使用 `typeof`

```js
typeof Symbol() === 'symbol'
typeof Symbol('foo') === 'symbol'
typeof Symbol.iterator === 'symbol'
```

不能与数字或字符串一起使用 `+ -` 操作符

使用 `for...in` 迭代的时候，`Symbol` 类型的属性不可枚举

```js
const obj = {};

obj[Symbol("a")] = "a";
obj[Symbol.for("b")] = "b";
obj["c"] = "c";
obj.d = "d";

for (var i in obj) {
   console.log(i); // c d
}

Object.getOwnPropertySymbols(obj)
// [Symbol(a), Symbol(b)]
```

当使用 `JSON.stringify()` 时，以 `symbol` 值作为键的属性会被完全忽略：

```js
JSON.stringify({[Symbol("foo")]: "foo"});
// '{}'
```

当一个 `Symbol` 包装器对象作为一个属性的键时，这个对象将被强制转换为它包装过的 `symbol` 值：

```js
const sym = Symbol("foo");
const obj = {[sym]: 1};
obj[sym];            // 1
obj[Object(sym)];    // still 1

sym == Object(sym) // 宽松相等，严格不相等
```