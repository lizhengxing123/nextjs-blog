---
title: 'Graphql 补充'
excerpt: 'Graphql 补充'
coverImage: '/assets/blog/graphql/logo.png'
date: '2022-12-28 15:51:07'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/graphql/logo.png'
type: 'Graphql'
---

## Graphql 补充

[官方文档](https://graphql.cn/learn/)

### 别名 Aliases

使用不同参数查询相同字段的时候，重名会导致冲突，所以就需要别名，它可以将字段重命名成任意的字段

```graphql
query {
  one: getOne(id:"63abf2ddfa4d17194c368d7f") {
    id
    name
    poster
    price
    filmType
  }
  two: getOne(id:"63abf5fdfa4d17194c368d86") {
    id
    name
    poster
    price
    filmType
  }
}
```

上面的查询语句中，`getOne`根据`id`来查询。如果使用两个`getOne`会报错：

```js
{
  "errors": [
    {
      "message": "Fields \"getOne\" conflict because they have differing arguments. Use different aliases on the fields to fetch both if this was intentional.",
      "locations": [
        {
          "line": 7,
          "column": 3
        },
        {
          "line": 14,
          "column": 3
        }
      ]
    }
  ]
}
```

使用别名`one`和`two`将两个`getOne`重新命名，查询语句就可以正常工作：

```js
{
  "data": {
    "one": {
      "id": "63abf2ddfa4d17194c368d7f",
      "name": "888",
      "poster": "http://789.png",
      "price": 888,
      "filmType": "NOWPLAYING"
    },
    "two": {
      "id": "63abf5fdfa4d17194c368d86",
      "name": "123",
      "poster": "http://123.png",
      "price": 123,
      "filmType": "COMINGSOON"
    }
  }
}
```

### 片段 Fragments

`Graphql`片段为可复用单元。片段能够组织一组字段，然后在需要的时候引入

```graphql
query {
  one: getOne(id:"63abf2ddfa4d17194c368d7f") {
    ...filmFields
  }
  two: getOne(id:"63abf5fdfa4d17194c368d86") {
    ...filmFields
  }
}

fragment filmFields on Film {
  id
  name
  poster
  price
  filmType
}
```

### 变量 Variables

变量以`$`开头，后面紧跟变量类型，也可设置默认值，如`$price: Int = 3`

```graphql
query GetOne($id: String = "123") {
  getOne(id: $id) {
    id
    name
    poster
    price
    filmType
  }
}
```

### 指令 Directives

指令可以附着在字段或者片段包含的字段上，然后以任何服务端期待的方式来改变查询的执行。

`GraphQL`的核心规范包含两个指令，服务端也可以自定义新的指令。

- `@include(if: Boolean)`：仅在参数为 `true` 时，包含此字段
- `@skip(if: Boolean)`：如果参数为 `true`，跳过此字段

```graphql
query GetOne($id: String, $withPrice: Boolean = true, $skipPoster: Boolean = false) {
  getOne(id: $id) {
    id
    name
    poster @skip(if: $skipPoster)
    price @include(if: $withPrice)
    filmType
  }
}
```

### 内联片段 Inline Fragments

根据不同类型来返回不同的字段

```graphql
# Droid 和 Human 都实现了 Character 接口，它们都有 name 字段
# Droid 还有额外的 primaryFunction 字段
# Human 还有额外的 height 字段
# 根据 $ep 是不同的类型，来返回不同的字段
# 如果 $ep 是 Droid 类型，返回 name、__typename 和 primaryFunction 字段，__typename 的值是 "Droid"
# 如果 $ep 是 Human 类型，返回 name、__typename 和 height 字段，__typename 的值是 "Human"
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    __typename
    ... on Droid {
      primaryFunction
    }
    ... on Human {
      height
    }
  }
}
```

> 可以使用 `__typename` 元字段来获取对象类型

### 类型

- `type`：声明类型
- `enum`：声明枚举类型
- `scalar`：声明标量对象
- `!`：类型修饰符
- `interface`：声明接口
- `union`：声明联合类型
- `input`：声明输入类型

```graphql
# 带参数
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
# 枚举类型
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
# 接口类型
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
# 对象类型实现接口类型
# 必须具有接口类型所有字段
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}
type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
# 联合类型
# 联合类型的成员必须是具体对象类型，不能是接口或者其他联合类型
union SearchResult = Human | Droid | Starship
```

如果需要查询联合类型的字段，需要使用内联片段才能查询任意字段：

```graphql
type Query {
  search(text: "an") {
    __typename
    ... on Human {
      name
      height
    }
    ... on Droid {
      name
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
# 由于 Droid 和 Human 都实现了公共接口 Character，所以可以把他俩的 name 字段提取出来
type Query {
  search(text: "an") {
    __typename
    ... on Character {
      name
    }
    ... on Human {
      height
    }
    ... on Droid {
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
# 需要注意的是 name 字段仍然需要指定在 Starship 上，因为它并不是一个 Character
```

列表和非空：

```js
// 表示数组本身可以为空，但里面的内容不能为空
myField1: [String!]
// 比如 
myField1: null // 有效
myField1: [] // 有效
myField1: ['a', 'b'] // 有效
myField1: ['a', null, 'b'] // 错误

// 表示数组本身不能为空，但里面的内容可以为空
myField2: [String]！
// 比如 
myField2: null // 错误
myField2: [] // 有效
myField2: ['a', 'b'] // 有效
myField2: ['a', null, 'b'] // 有效

// 表示数组本身不能为空，但里面的内容也不能为空
myField3: [String!]！
// 比如 
myField3: null // 错误
myField3: [] // 有效
myField2: ['a', 'b'] // 有效
myField2: ['a', null, 'b'] // 错误
```