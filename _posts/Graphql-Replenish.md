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
