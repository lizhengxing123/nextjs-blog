---
title: 'Module 模块'
excerpt: '学习 Module 模块'
coverImage: '/assets/blog/node/logo.svg'
date: '2022-11-29 21:32:19'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/node/logo.svg'
type: 'Node'
---

## cjs CommonJS 模块

CommonJS 模块是为 Node.js 打包 Javascript 代码的原始方式。在 Node.js 中，每个文件都被视为一个模块

### 导出模块

- 使用 `exports`

```js
// a.js
exports.num = 10;
exports.name = 'lzx';
```

- 使用 `module.exports`

```js
// a.js
module.exports = {
    num: 10,
    name: 'lzx'
}
```

- 使用 `this`

```js
// a.js
this.num = 10;
this.name = 'lzx';
```

### 导入模块

使用 `require` 导入

```js
// b.js
const a = require('./a.js')
console.log('a: ', a);
// 输出为
// a: { num: 10, name: 'lzx' }
```

### 同时使用 exports、module.exports和this 导出模块

```js
// a.js
exports.num = 10;
exports.name = "lzx";

module.exports = {
    a: 2
}

this.fn = () => 12

// b.js
const a = require('./a.js')
console.log('a: ', a);
// 输出为
// a: { a: 2 }
```

会发现导出的值是 `{ a: 2 }`，这是因为 `require` 函数默认返回的是 `module.exports`。

下面是 `require` 函数的假设实现

```js
// require.js
function require(modulePath) {
    // 1、根据传递的模块路径，得到模块完整的绝对路径
    const moduleId = getModuleId(modulePath)
    // 2、判断缓存
    if(cache(moduleId)) {
        return cache(moduleId)
    }
    // 3、真正运行模块代码的辅助函数
    function _require(exports, require, module, __filename, __dirname) {
        // 目标模块的代码在这里执行
    }
    // 4、准备并运行辅助函数
    const module = { exports: {} };
    const exports = module.exports
    // 得到模块文件的绝对路径
    const __filename = moduleId
    // 得到模块文件目录的绝对路径
    const __dirname = getDirname(__filename)
    // 调用辅助函数
    _require.call(exports, exports, require, module， __filename, __dirname)
    // 5、缓存 module.exports
    cache[moduleId] = module.exports
    // 6、返回 module.exports
    return module.exports
}
```

从上面的代码可以看出，在最开始时 `this`、`exports`和`module.exports`都指向同一个对象，但后面我们给`module.exports`重新赋值了，所以最后导出的就是`{ a: 2 }`。

使用下面的代码就能导出所有的值了。

```js
// a.js
exports.num = 10;
exports.name = "lzx";

module.exports.a = 2

this.fn = () => 12

// b.js
const a = require('./a.js')
console.log('a: ', a);
// 输出为
// a: { num: 10, name: 'lzx', a: 2, fn: [Function (anonymous)] }
```

### 模块作用域

在模块中，默认有以下变量

- `__dirname`：当前模块文件目录的绝对路径
- `__filename`：当前模块文件的绝对路径
- `exports`：初始时与`this`和`module.exports`相同
- `module`：当前模块的引用，有以下类型
  - `id`：模块文件的绝对路径
  - `path`：模块文件目录的绝对路径
  - `exports`：模块导出的内容
  - `children`：这个模块首次需要的对象
- `require(id)`：`id`为模块名称或路径，返回导出的内容

## esm ECMAScript 模块

### 导出模块

- 使用 `export`

```js
// a.js
export const name = "lzx"

const address = "兰州"
export { address as city }

// 重新导出其他模块
// c.js => export const job = 'frontend'
export { job as work } from './c.js'
```
- 使用 `export default`，**只能有一个默认导出**

```js
// a.js
export default {
    age: 24
}
```

### 导入

- 导入一个模块中的某个导出内容

```js
// b.js
import { name, work, city } from "./a.js"
// lzx frontend 兰州

// 进行重命名
import { name as name1} from './a.js'
// name1 => 'lzx'
// 使用 name 会报错
```

- 导入整个模块

```js
// b.js
import * as info from './a.js'
// info 的值
// {
//   city: '兰州',
//   default: { age: 24 },
//   name: 'lzx',
//   work: 'frontend'
// }
```

- 导入默认导出内容

```js
// b.js
import info from "./a.js";
// { age: 24 }
```

- 副作用导入

```js
// 一些模块会设置一些全局状态供其它模块使用，
// 这些模块可能没有任何的导出或用户根本就不关注它的导出
import './other.js'
```

### esm 符号绑定问题

```js
// c.js
export let num = 1
export function increase() {
    num++
}

// d.js
import {num, increase} from "./c.js"
// 下面的语句会报错 => TypeError: Assignment to constant variable
// 不能给常量赋值
// num++
console.log(num);
increase()
console.log(num);
// 1
// 2
```

在 esm 中，`d.js` 和 `c.js` 中的 `num` 共用同一块内存空间，这就是符号绑定，这会导致许多莫名其妙的问题。所以模块中导出的变量应该使用 `const` 定义，防止其变化导致各种各样的`bug`。

需要注意的是下面这种情况：

```js
const obj1 = {}
const obj2 = obj1
```

`obj1` 和 `obj2` 引用的是同一个地址，但它们两个用的是两块内存空间，不要和符号绑定混淆。