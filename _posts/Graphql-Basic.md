---
title: 'Graphql 基础'
excerpt: '学习 Graphql'
coverImage: '/assets/blog/graphql/logo.png'
date: '2022-12-28 14:08:25'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/graphql/logo.png'
type: 'Graphql'
---

## Graphql 基础

`graphql`是一种面向数据的`API`查询风格

### 操作类型

- `query`：查询，获取数据
- `mutation`：变更，对数据进行变更，如修改、增加、删除
- `subscription`：订阅，当数据发生更改，进行消息推送

### 对象类型和标量类型

- 对象类型：用户在`schema`中声明的`type`
- 标量类型：`graphql`内置的类型，如`String`、`Int`、`Float`、`Boolean`、`ID`，用户也可以自己定义标量类型

```graphql
# 在 schema 中定义对象类型
type User {
  name: String! # 非空标量
  age: Int # 可空标量
}
```

### 模式 Schema

`Schema`定义了字段的类型，数据的结构，描述了接口请求数据的规则。当我们进行一些错误的查询时，会有详细的错误信息，对开发调试十分友好。

`Schema`使用一个简单的强类型模式语法，称为模式描述语法（`SDL`）。

```graphql
# 枚举类型
enum Gender {
  MAN
  WOMAN
}
# 接口类型
interface UserInterface {
  id: ID!
  name: String!
  age: Int
  gender: Gender
}
# 对象类型
type User implements UserInterface {
  id: ID!
  name: String!
  age: Int
  gender: Gender
  email: String!
}
# 输入类型
input UserInput {
  name: String
  age: Int
  gender: Gender
  email: String
}
# Query 入口
type Query {
  hello: String
  users: [User]!
  user(id: String): User
}
# Mutation 入口
type Mutation {
  createUser(input: UserInput): User!
  updateUser(id: ID!, input: UserInput): User!
  deleteUser(id: ID!): User
}
# Subscription 入口
type Subscription {
  subUser(id: ID!): User
}
```

> `Query` 查询字段时是并行执行的，而 `Mutation` 变更的时候，是线性执行的，一个接着一个，防止同时变更带来的竞态问题

### 解析函数 Resolver

前端请求信息到达后端之后，就需要解析函数来提供数据。

```graphql
# Query
query {
  hello
}
# Resolver
Query {
  hello(parent, args, context, info) {
    # ...
  }
}
```

解析函数接收4个参数：

- `parent`：当前上一个解析函数的返回值
- `args`：查询中传入的参数
- `context`：提供给所有解析器的上下文信息
- `info`：一个保存与当前查询相关的字段特定信息以及`schema`详细信息的值

解析函数的返回值可以是一个具体的值，也可以是`Promise`或者`Promise`数组。

可以使用 `Apollo` 来省略一些简单的解析函数，比如一个字段没有提供对应的解析函数时，会从上层返回对象中读取并返回这个字段同名的属性


### 请求格式

- `GET`：将请求内容放在`URL`中
- `POST`：设置`Content-Type: application/json`情况下，请求内容放在请求体中

```graphql
query {
  me {
    name
  }
}
# GET
http://myapi/graphql?query={me{name}}
# POST body
{
  "query": "...",
  "operationName": "...",
  "variables": { "myVariable": "someValue", ... }
}
```

返回格式为`JSON`

```js
// 正确返回
{
  "data": { ... }
}
// 执行时发生错误
{
  "errors": [ ... ]
}
```