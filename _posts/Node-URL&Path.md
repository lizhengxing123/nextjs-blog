---
title: 'URL 和 Path'
excerpt: '学习 URL 和 Path'
coverImage: '/assets/blog/node/logo.svg'
date: '2022-12-01 19:02:34'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/node/logo.svg'
type: 'Node'
---

## 总结

常用的方法有

- `new URL(input[, base])`：然后访问里面的属性
- `url.fileURLToPath(import.meta.url)`：在 `ESM` 中，返回当前文件的 `__filename`
- `path.dirname(__filename)`：返回当前文件的 `__dirname`
- `path.join([...paths])`：合并 `path` 片段为一个规范化路径，会合并所有的片段
- `path.resolve([...paths])`：合并 `path` 片段为绝对路径，不一定合并完全部的片段

## URL 网址

`URL` 模块提供用于网址处理和解析的使用工具，可以使用以下方式访问

```js
import { URL } from 'url'
```

将网址字符串转为 `URL` 对象

```js
const myURL = new URL(
    "https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash"
    );
// URL {
//   href: 'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash',
//   origin: 'https://sub.example.com:8080',
//   protocol: 'https:',
//   username: 'user',
//   password: 'pass',
//   host: 'sub.example.com:8080',
//   hostname: 'sub.example.com',
//   port: '8080',
//   pathname: '/p/a/t/h',
//   search: '?query=string',
//   searchParams: URLSearchParams { 'query' => 'string' },
//   hash: '#hash'
// }
```

### new URL(input[, base])

- `input`：要解析的绝对或相对的输入网址。
  - 如果是相对的，则需要 `base`
  - 如果是绝对的，则忽略 `base`
  - 如果不是字符串，则先转换成字符串
- `base`：
  - 如果不是绝对的，则为要解析的基本网址
  - 如果不是字符串，则先转换成字符串

使用 `base`

```js
new URL('/foo/bar', 'https://example.com/')
// 'https://example.com/foo/bar'
```

如果事先不知道 `input` 是否是绝对网址，并且提供了 `base`，那么会发生以下情况
1. `input` 是绝对网址，直接使用绝对网址，忽略 `base`
2. `input` 不是绝对网址，使用 `base` 作为基本网址

```js
const myURL = new URL("http://baidu.com/foo/bar", "https://example.com/");
// http://baidu.com/foo/bar

const myURL = new URL("http:baidu.com/foo/bar", "https://example.com/");
// http://baidu.com/foo/bar

// 不是 http 或者 https 协议
// 只要存在协议，就会将其当作绝对地址
// origin 是 null
const myURL = new URL("lzx:baidu.com/foo/bar", "https://example.com/");
// lzx:baidu.com/foo/bar

const myURL = new URL("baidu.com/foo/bar", "https://example.com/");
// https://example.com/baidu.com/foo/bar
```

**如果协议不是 `http`、`https`、`ftp`、`ws`、`wss`，`URL` 对象的 `origin` 属性为 `'null'`**


### URL 对象的属性

这些属性都可以设置和获取

- `hash`：类型为字符串，网址中 `hash` 值 
- `host`：类型为字符串，网址的主机，包含主机名和端口号
- `hostname`：类型为字符串，网址的主机名
- `href`：类型为字符串，完整网址
- `origin`：类型为字符串，网址的源，只读，不能赋值
- `username`：类型为字符串，网址的用户名
- `password`：类型为字符串，网址的密码
- `pathname`：类型为字符串，网址的路径
- `protocol`：类型为字符串，网址的协议
  - 特殊协议`ftp、file、http、https、ws、wss`之间可以相互更改
  - 非特殊协议不能改为特殊协议
  - 也不能从特殊协议改为非特殊协议
- `port`：类型为字符串，网址端口号，赋值的时候可以为以下类型：
  - 可以是包含 0 到 65535（含）范围内的数字或字符串
  - 也可以为空字符串，在这种情况下，端口取决于协议
    - `ftp` -> 21
    - `file` -> ''
    - `http` -> 80
    - `https` -> 443
    - `ws` -> 80
    - `wss` -> 443
  - 端口赋值时，该值将首先调用 `toString` 方法，如果字符串无效但以数字开头，将前导数字分配给`port`，如果数字在范围之外则忽略
  - 端口赋值时，如果值是默认端口，则自动转换为空字符串
  - 端口赋值时，如果值是小数，则截断取小数点前面的数字，如果数字在范围之外则忽略

```js
const myURL = new URL('https://example.com:888')
// port -> 888

myURL.port = 443
// 使用默认端口，转换为空字符串 port -> ''

myURL.port = 1234
// port -> 1234

myURL.port = '567abc'
// 使用前导数字，port -> 567

myURL.port = 3.14
// 非整数截断，port -> 3

myURL.port = 3234555.14
// 超出范围无效，port -> 3
```

- `search`：类型为字符串，网址的查询部分
- `searchParams`：类型为映射，是只读属性
- `toString()`：返回序列化的网址，值和 `href` 相同
- `toJSON()`：返回序列化的网址，值和 `href` 相同，当 `URL` 对象调用 `JSON.stringify()` 序列化时，会自动调用这个方法

### URLSearchParams 类

提供对 `URL` 查询的读写访问

#### 创建实例

- `new URLSearchParams()`：实例化新的空的 `URLSearchParams` 对象
- `new URLSearchParams(string)`：根据查询字符串，实例化新的 `URLSearchParams` 对象，如果`?`存在会被忽略
- `new URLSearchParams(object)`：根据对象，实例化新的 `URLSearchParams` 对象
  - 重复的键后面的会覆盖之前的
  - 所有的值和键都会转换为字符串，数组会使用逗号连接
- `new URLSearchParams(iterable)`：根据可迭代对象，实例化新的 `URLSearchParams` 对象
  - 可以是二维数组
  - 也可以是另一个 `URLSearchParams` 对象，在这种情况下，只是简单的创建提供的 `URLSearchParams` 对象的克隆


```js
const s1 = new URLSearchParams()
// {}

const s1 = new URLSearchParams('?a=1&b=2')
// { 'a' => '1', 'b' => '2' }

const obj = {
    a: 123
}
const arr = [99, 87]
const s = new URLSearchParams({
    a: 3,
    a: 4,
    [arr]:'qwer',
    [obj]: [1,2]
})
// { 'a' => '4', '99,87' => 'qwer', '[object Object]' => '1,2' }

// 使用二维数组
new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]).toString();
// user=abc&query=first&query=second


// 使用 map
const map = new Map();
map.set('user', 'abc');
map.set('query', 'first');
map.set('query', 'second');
new URLSearchParams(map).toString();
// user=abc&query=first&query=second

// 使用生成器函数
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
new URLSearchParams(getQueryPairs()).toString();
// user=abc&query=first&query=second
```

#### 实例属性

- `append(name, value)`：将名称-值追加到查询字符串
- `delete(name)`：删除所有名称为 `name` 的名称-值
- `entries()`：返回迭代器

```js
new URLSearchParams([
  ['query', 'first'],
  ['query', 'second'],
]).entries()
// URLSearchParams Iterator { [ 'query', 'first' ], [ 'query', 'second' ] }
```

- `forEach(fn[, thisArg])`：迭代查询

```js
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
//   a b true
//   c d true
```

- `get(name)`：返回名称为 `name` 的第一个值，如果没有，返回 `null`
- `getAll(name)`：返回名称为 `name` 的所有值，如果没有，返回空数组
- `has(name)`：返回是否至少有一个名称为 `name` 的名称-值
- `keys()`：返回所有的 `key`
- `values()`：返回所有的 `value`

```js
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.keys()
// URLSearchParams Iterator { 'a', 'c'}
myURL.searchParams.values()
// URLSearchParams Iterator { 'b', 'd'}
```

- `set(name, value)`：如果存在任何名称为 `name` 的预先存在的名称-值对，则将第一个此类对的值设置为 `value` 并删除所有其他名称。 如果没有，则将名称-值对追加到查询字符串。
- `sort()`：按名称对所有现有的名称-值对进行就地排序。
- `toString()`：转换为字符串搜索参数
- 迭代实例对象

```js
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// 打印:
//   foo bar
//   xyz baz
```

### 其它 API

- `url.domainToASCII(domain)`：返回 `domain` 的 `ASCII` 序列化。 如果 `domain` 是无效域，则返回空字符串。
- `url.domainToUnicode(domain)`：返回 `domain` 的 `Unicode` 序列化。 如果 `domain` 是无效域，则返回空字符串。
- `url.fileURLToPath(url)`：此函数可确保正确解码百分比编码字符，并确保跨平台有效的绝对路径字符串。
- `url.pathToFileURL(path)`：该函数确保 path 被绝对解析，并且在转换为文件网址时正确编码网址控制字符。
```js
import url from 'url';

// domainToASCII
console.log(url.domainToASCII('español.com'));
// 打印 xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// 打印 xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// 打印 an empty string

// domainToUnicode
console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// 打印 español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// 打印 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// 打印 an empty string

// fileURLToPath
new URL('file:///C:/path/').pathname;      // 错误: /C:/path/
fileURLToPath('file:///C:/path/');         // 正确: C:\path\ (Windows)
new URL('file://nas/foo.txt').pathname;    // 错误: /foo.txt
fileURLToPath('file://nas/foo.txt');       // 正确: \\nas\foo.txt (Windows)
new URL('file:///你好.txt').pathname;      // 错误: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // 正确: /你好.txt (POSIX)
new URL('file:///hello world').pathname;   // 错误: /hello%20world
fileURLToPath('file:///hello world');      // 正确: /hello world (POSIX)

// pathToFileURL
new URL('/foo#1', 'file:');           // 错误: file:///foo#1
pathToFileURL('/foo#1');              // 正确: file:///foo%231 (POSIX)
new URL('/some/path%.c', 'file:');    // 错误: file:///some/path%.c
pathToFileURL('/some/path%.c');       // 正确: file:///some/path%25.c (POSIX)
```

- `url.format(URL[, options])`：返回 `URL` 对象的自定义序列化，可选配置为
  - `auth`：如果序列化的网址字符串应包含用户名和密码，则为 `true`，否则为 `false`。 默认值: `true`。
  - `fragment`：如果序列化的网址字符串应包含片段(`hash`)，则为 `true`，否则为 `false`。 默认值: `true`。
  - `search`：如果序列化的网址字符串应包含搜索查询，则为 `true`，否则为 `false`。 默认值: `true`。
  - `unicode`：如果出现在网址字符串的主机组件中的 `Unicode` 字符应该被直接编码而不是 `Punycode` 编码，则为 `true`，否则为 `false`。 默认值: `false`。

```js
import url from 'url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// 打印 https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// 打印 https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// 打印 'https://測試/?abc'
```

- `url.urlToHttpOptions(url)`：将网址对象转换为普通选项对象。

```js
import { urlToHttpOptions } from 'url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
// {
//   protocol: 'https:',
//   hostname: 'xn--g6w251d',
//   hash: '#foo',
//   search: '?abc',
//   pathname: '/',
//   path: '/?abc',
//   href: 'https://a:b@xn--g6w251d/?abc#foo',
//   auth: 'a:b'
// }
```

## path 路径

```js
import path from 'path'
```

- `path.basename(path[, ext])`：路径和可选的文件扩展名，区分大小写

```js
path.basename('/foo/bar/baz/asdf/quux.html');
// 返回: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返回: 'quux'

path.basename('/foo/bar/baz/asdf/quux.HTML', '.html');
// 返回: 'quux.HTML'
```

- `path.delimiter`：提供特定于平台的路径定界符

```js
// MAC
console.log(path.delimiter) // : 冒号
// Windows
console.log(path.delimiter) // ; 分号
```

- `path.sep`：提供特定于平台的路径片段分隔符

```js
// MAC
console.log(path.sep) // / 正斜杠
// Windows
console.log(path.sep) // \ 反斜杠
```

- `path.dirname(path)`：返回 `path` 的目录名

```js
// esm
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
```

- `path.extname(path)`：返回 `path` 的扩展名，即 `path` 的最后一部分中从最后一次出现的 `.`（句点）字符到字符串的结尾，如果没有返回空

```js
path.extname('index.html');
// 返回: '.html'

path.extname('index.coffee.md');
// 返回: '.md'

path.extname('index.');
// 返回: '.'

path.extname('index');
// 返回: ''

path.extname('.index');
// 返回: ''

path.extname('.index.md');
// 返回: '.md'
```

- `path.format(pathObject)`：从对象返回路径字符串，对象属性
  - `dir`：如果有这个属性，则忽略 `root` 属性
  - `root`
  - `base`：如果有这个属性，则忽略 `name` 和 `ext` 属性
  - `name`
  - `ext`

图形表示

```js
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
```

```js
// 如果提供 `dir`、`root` 和 `base`，
// 则将返回 `${dir}${path.sep}${base}`。
// `root` 将被忽略。
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt'
});
// 返回: '/home/user/dir/file.txt'

// 如果未指定 `dir`，则将使用 `root`。
// 如果仅提供 `root` 或 `dir` 等于 `root`，则将不包括平台分隔符。
// `ext` 将被忽略。
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored'
});
// 返回: '/file.txt'

// 如果未指定 `base`，则将使用 `name` + `ext`。
path.format({
  root: '/',
  name: 'file',
  ext: '.txt'
});
// 返回: '/file.txt'
```
- `path.parse(path)`：从路径字符串返回对象

```js
path.parse('/file')
// { root: '/', dir: '/', base: 'file', ext: '', name: 'file' }
path.parse('/file/a')
// { root: '/', dir: '/file', base: 'a', ext: '', name: 'a' }
path.parse('/a.js')
// { root: '/', dir: '/', base: 'a.js', ext: '.js', name: 'a' }
path.parse('/file/a.js')
//  { root: '/', dir: '/file', base: 'a.js', ext: '.js', name: 'a' }
```

- `path.isAbsolute(path)`：判断路径是否为绝对路径
- `path.join([...paths])`：使用特定于平台的分隔符作为定界符将所有给定的 `path` 片段连接在一起，然后规范化生成的路径。如果任何路径片段不是字符串，则会报错

```js
path.join('/foo', 'bar', 'baz/asdf', 'quux');
// 返回: '/foo/bar/baz/asdf/quux'

path.join('/foo', 'bar', 'baz/asdf', 'quux'， '..');
// 返回: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```

- `path.normalize(path)`：方法规范化给定的 `path`，解析 `..` 和 `.` 片段

```js
path.normalize('/foo/bar//baz/asdf/quux/..');
// 返回: '/foo/bar/baz/asdf'
```

- `path.relative(from, to)`：根据当前工作目录返回从 `from` 到 `to` 的相对路径

```js
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 返回: '../../impl/bbb'
```

- `path.resolve([...paths])`：将路径或路径片段的序列解析为绝对路径

> 给定的路径从右往左处理，每个后续的 `path` 会被追加到前面，直到构建绝对路径；
> 如果处理完所有给定的 `path` 片段之后，还没有生成绝对路径，则使用当前工作目录；
> 生成的路径会被规范化，并删除尾部斜杠（除非路径解析为根路径）；
> 零长度的 `path` 片段会被忽略；
> 如果没有传入 `path` 片段，则返回当前**工作目录**的绝对路径。

```js
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

- `path.toNamespacedPath(path)`：仅在 `Windows` 系统上，返回给定 `path` 的等效命名空间前缀路径
- `path.win32`：提供对 `path` 方法的 `Windows` 特定实现的访问。