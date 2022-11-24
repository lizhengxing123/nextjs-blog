---
title: 'Jest 基础'
excerpt: '学习 Jest 测试'
coverImage: '/assets/blog/react/jest.png'
date: '2022-11-24 16:44:14'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/react/jest.png'
type: 'React'
---

## Jest 匹配器

### 常用匹配器

- toBe

使用 Object.is 来进行精准匹配

- toEqual

递归的检查对象或数组中的每个字段

- not
  
在匹配器前面加上 not 表示否定

```js
expect(2 + 2).not.toBe(3)
```

### 真值判断

- toBeNull - 只匹配 null
- toBeUndefined - 只匹配 undefined
- toBeDefined - 与 toBeUndefined 相反
- toBeTruthy - 匹配任何 if 语句为真
- toBeFalsy - 匹配任何 if 语句为假

```js
test('null', () => {
  const n = null
  expect(n).toBeNull()
  expect(n).not.toBeUndefined()
  expect(n).toBeDefined()
  expect(n).not.toBeTruthy()
  expect(n).toBeFalsy()
})
```

### 数字判断

- toBeGreaterThan - 大于
- toBeGreaterThanOrEqual - 大于等于
- toBeLessThan - 小于
- toBeLessThanOrEqual - 小于等于
- toBeCloseTo - 比较浮点数

```js
test('number', () => {
  const num = 2;
  expect(num).toBeGreaterThan(1)
  expect(num).toBeGreaterThanOrEqual(2)
  expect(num).toBeLessThan(3)
  expect(num).toBeLessThanOrEqual(2)
  expect(0.1 + 0.2).toBeCloseTo(0.3)
})
```

### 字符串

- toMatch - 正则表达式匹配

```js
test('string', () => {
  expect('team').not.toMatch(/I/);
  expect('Christoph').toMatch(/stop/);
});
```

### 数组和可迭代对象

- toContain - 检查是否包含某项

```js
const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'milk',
];

test('shoppingList数组中包含milk', () => {
  expect(shoppingList).toContain('milk');
  expect(new Set(shoppingList)).toContain('milk');
});
```

### 其他

- toThrow - 函数调用抛出错误

```js
function compileAndroidCode() {
  throw new Error('you are using the wrong JDK!');
}

test('compiling android goes as expected', () => {
  // 可以不传参数
  expect(() => compileAndroidCode()).toThrow();
  // 可以传递 Error 构造函数
  expect(() => compileAndroidCode()).toThrow(Error);
  // 可以传递字符串，字符串必须被错误字符串包含
  expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
  // 可以传递一个正则表达式
  expect(() => compileAndroidCode()).toThrow(/JDK/);
  // 没有全部匹配
  expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/); // Test fails
  // 全部匹配
  expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK!$/); // Test pass
});
```

## 测试异步代码

- 使用 async/await

```js
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  // 断言数量为1，确保断言会被调用
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});
```

- 使用 resolves/rejects

```js
test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  await expect(fetchData()).rejects.toMatch('error');
});
```

## 安装和移除

### 重复设置

- beforeEach
- afterEach

### 一次性设置

- beforeAll
- afterAll

### 作用域

beforeAll 和 afterAll 只执行一次；beforeEach 和 afterEach 会执行多次；测试中会先执行 describe，然后在执行 test

```js
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));

test('', () => console.log('1 - test'));

describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));

  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```

### 使用 test.only 可以指定运行的测试

## 模拟函数

### 匹配器

- toHaveBeenCalled - 是否已经被调用
- toHaveBeenCalledWith - 是否已经被调用，并且携带参数
- toHaveBeenLastCalledWith - 最后一次被调用，并且携带参数
- toMatchSnapshot - 匹配快照
- toHaveBeenCalledTimes - 被调用的次数

```js
const mockFunc = jest.fn((arg1, arg2) => console.log(arg1, arg2))

expect(mockFunc).toHaveBeenCalled();

expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);

expect(mockFunc).toHaveBeenLastCalledWith(arg1, arg2);

expect(mockFunc).toMatchSnapshot();
```

### Mock 的返回值

在测试期间将测试值注入代码

```js
const filterFunc = jest.fn()

filterFunc.mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true)

const result = [11, 12, 13, 14].filter(num => filterTestFn(num));

console.log(result); // [11, 13]
```

### Mock 模块

mock axios 伪造响应结果

```js
import axios from 'axios';
jest.mock('axios')
const users = [{name: 'Bob'}];
const resp = {data: users};
axios.get.mockResolvedValue(resp)
```

### Mock 部分模块

```js
// foo-bar-baz.js
export const foo = 'foo';
export const bar = () => 'bar';
export default () => 'baz';

// foo-bar-baz.test.js
import defaultExport, {bar, foo} from '../foo-bar-baz';

jest.mock('../foo-bar-baz', () => {
  const originalModule = jest.requireActual('../foo-bar-baz');

  // mock default 和 foo
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked baz'),
    foo: 'mocked foo',
  };
});
```

### Mock 实现

```js
// foo.js
module.exports = function () {
  // some implementation;
};
// foo.test.js
// mock 模块
jest.mock('../foo');
const foo = require('../foo');

// mock 实现
foo.mockImplementation(() => 42);
foo();
// > 42

// 函数调用
const myMockFn = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call');

console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
// > 'first call', 'second call', 'default', 'default'

// mock 函数返回 this
jest.fn().mockReturnThis()
```

### spyOn

 从对象上获取方法

```js
// 模拟 fetch
jest.spyOn(global, 'fetch').mockImplementation(() => {
  return Promise.resolve({
    json: () => Promise.resolve("123")
  })
})
```

## 计时器

- 使用假的定时器

```js
jest.useFakeTimers({
  // 配置对象
})
```

- 使用真实的定时器

```js
jest.useActualTimers()
```

- 加快时间 - 快进

```js
// 快进 100 ms
jest.advanceTimersByTime(100);
```

- 获取当前时间

```js
jest.now()
```