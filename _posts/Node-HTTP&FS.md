---
title: 'HTTP 和 FS'
excerpt: '学习 HTTP 和 FS'
coverImage: '/assets/blog/node/logo.svg'
date: '2022-12-02 19:02:27'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/node/logo.svg'
type: 'Node'
---

## HTTP 超文本传输协议

通过 `http` 模块引入

```js
import http from 'http'
```

### http.METHODS

支持的 `HTTP` 方法列表，返回字符串数组。

```js
http.METHODS
// ['GET', 'POST', 'DELETE', 'PUT', ...]
```

### http.STATUS_CODES

所有标准 `HTTP` 响应状态代码的集合，以及每个的简短描述。

```js
http.STATUS_CODES
// {
//     '200': 'OK',
//     '400': 'Bad Request',
//     '401': 'Unauthorized',
//     '403': 'Forbidden',
//     '404': 'Not Found',
//     '500': 'Internal Server Error',
//     '502': 'Bad Gateway',
//     '503': 'Service Unavailable',
//     ...
// }
```

### http.createServer([options][, requestListener])

创建一个服务，返回 `http.Server` 新实例

- `options`：配置选项
- `requestListener`：请求的事件

> 1. `req` 常用属性：`url`
> 2. `res` 常用属性：`writeHead、write、end、on`
  
```js
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        data: "Hello World!",
      })
    );
})

server.listen(8000)
```

监听请求事件

```js
const server = http.createServer()
server.on('request', (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        data: "Hello World!",
      })
    );
})

server.listen(8000)
```

### http.request

有两种请求方式，返回 `http.ClientRequest` 类的实例，返回值是可写流，在 `POST` 方法中可以写入请求体数据。

```js
http.request(options[, callback])
http.request(url[, options][, callback])
// 是 request方法 options -> method: GET 的简写
// 使用方法和 request 一样
http.get(options[, callback])
http.get(url[, options][, callback])
```

- `url`：字符串或者 `URL` 实例对象
  - 如果是字符串，则转换为 `URL` 实例对象，在转换为 `options` 对象
  - 如果是 `URL` 实例对象，直接转换为转换为 `options` 对象
  - 如果同时存在 `url` 和 `options`，则合并对象，`options` 属性优先
- `options`：
  - `headers`：请求头对象
  - `host`：要请求的服务器域名或 `IP`
  - `path`：请求的路径
  - `method`：请求的方法，默认为 `GET`
  - `port`：远程服务器的端口，默认为：80
- `callback`：回调函数

```js
import https from 'https'

const postData = JSON.stringify([{}, { baseParam: { ypClient: 1 } }])

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const req = https.request(
    'https://m.xiaomiyoupin.com/mtop/market/search/placeHolder',
    options, 
    (res) => {
    console.log('res: ', res.statusCode);
    // 设置编码类型
    res.setEncoding('utf-8')
    res.on('data', (chunk) => {
        console.log('chunk: ', chunk);
    })
    res.on('end', () => {
        console.log("完成");
    })
})
// 错误
req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

// 写入请求体数据
req.write(postData)
// 结束请求
req.end()
```

## FS 文件系统


### promise API

- `readFile(path[, options])`：读取文件
- `writeFile(path, data[, options])`：写入文件
- `readDir(path[, options])`：读取目录的内容，返回文件的名称数组
- `stat(path[, options])`：文件状态，其返回值可用来判断文件是否为文件夹 `isDirectory()`
- `unlink(path)`：删除文件或空文件夹，如果文件夹里还有文件会抛出错误
- `appendFile(path, data[, options])`：将数据追加到文件，如果该文件尚不存在，则创建该文件
- `mkdir(path[, options])`：创建目录
- `rename(oldPath, newPath)`：重命名
- `rm(path[, options])`：删除目录和目录，递归删除需要指定 `recursive: true`

```js
import fs from "fs/promises";

try {
  const promise = await fs.readFile('./e.js', { encoding: "utf-8" });
  console.log('promise: ', promise);
} catch (err) {
  // 当请求中止时 - err 是 AbortError
  console.error(err);
}
```

### 同步 API

- `readFileSync(path[, options])`：读取文件
- `writeFileSync(path, data[, options])`：写入文件
- `readDirSync(path[, options])`：读取目录的内容，返回文件的名称数组
- `statSync(path[, options])`：文件状态，其返回值可用来判断文件是否为文件夹 `isDirectory()`
- `unlinkSync(path)`：删除文件或空文件夹，如果文件夹里还有文件会抛出错误
- `appendFileSync(path, data[, options])`：将数据追加到文件，如果该文件尚不存在，则创建该文件
- `mkdirSync(path[, options])`：创建目录
- `renameSync(oldPath, newPath)`：重命名
- `rmSync(path[, options])`：删除目录和目录，递归删除需要指定 `recursive: true`

```js
import fs from "fs";

try {
    const data = fs.readFileSync("./categories.csv", { encoding: "utf-8" } )
    console.log(data);
} catch (error) {
    console.log('error: ', error);
}
```

### 异步 API

- `readFile(path[, options], callback)`：读取文件
- `writeFile(path, data[, options], callback)`：写入文件
- `readDir(path[, options], callback)`：读取目录的内容，返回文件的名称数组
- `stat(path[, options], callback)`：文件状态，其返回值可用来判断文件是否为文件夹 `isDirectory()`
- `unlink(path, callback)`：删除文件或空文件夹，如果文件夹里还有文件会抛出错误
- `appendFile(path, data[, options], callback)`：将数据追加到文件，如果该文件尚不存在，则创建该文件
- `mkdir(path[, options], callback)`：创建目录
- `rename(oldPath, newPath, callback)`：重命名
- `rm(path[, options], callback)`：删除目录和目录，递归删除需要指定 `recursive: true`

```js
import fs from "fs";

fs.readFile("./categories.csv", { encoding: 'utf-8'}, (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
