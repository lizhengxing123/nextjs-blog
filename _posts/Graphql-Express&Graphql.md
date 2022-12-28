---
title: '在 Express 中使用 Graphql'
excerpt: '在 Express 中使用 Graphql'
coverImage: '/assets/blog/graphql/express.png'
date: '2022-12-28 15:19:25'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/graphql/express.png'
type: 'Graphql'
---

## 在 Express 中使用 Graphql

需要用到的库有：

- `express`：`express`核心库
- `mongoose`：连接`mongodb`数据库
- `graphql`：`graphql`的`javascript`实现
- `express-graphql`：创建`graphql http`服务器

### 代码

```js
// server.js
const express = require("express");
const mongoose = require("mongoose");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");

const app = express();

// 连接数据库
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/study");
// 创建 Model
const FilmModel = mongoose.model(
  "film", // 集合名会自动添加s
  // 会自动生成 _id，不需要在这里声明id
  new mongoose.Schema({
    name: String,
    poster: String,
    price: Number,
    filmType: String,
  })
);

// 创建 schema
const schema = buildSchema(`
  enum FilmType {
    NOWPLAYING
    COMINGSOON
  }

  type Film {
    id: String
    name: String
    poster: String
    price: Int
    filmType: FilmType
  }

  input FilmInput {
    name: String
    poster: String
    price: Int
    filmType: FilmType
  }

  type Query {
    getList: [Film]
    getOne(id: String): Film
  }

  type Mutation {
    addFilm(input: FilmInput): Film
    updateFilm(id: String, input: FilmInput): Film
    deleteFilm(id: String): Int
  }
`);

const root = {
  // 查询
  getList: () => {
    return FilmModel.find();
  },
  getOne: ({id}) => {
    return FilmModel.findOne({_id: id});
  },
  // 增加
  addFilm: ({ input }) => {
    return FilmModel.create({
      ...input,
    });
  },
  // 更新
  updateFilm: ({ id, input }) => {
    return FilmModel.updateOne(
      {
        _id: id,
      },
      {
        ...input,
      }
    ).then((res) => FilmModel.findOne({ _id: id }));
  },
  // 删除
  deleteFilm: ({ id }) => {
    return FilmModel.deleteOne({
      _id: id,
    }).then((res) => 1);
  },
};

app.use(
  "/graphql",
  graphqlHTTP(async (request, response, graphQLParams) => ({
    schema,
    rootValue: root,
    graphiql: true,
  }))
);

app.listen("8666", (err) => {
  if (!err) console.log("服务启动成功，地址：localhost:8666");
});
```

### 启动服务

使用 nodemon 运行该文件

```zsh
nodemon ./server.js
```

在浏览器打开`localhost:8666/graphql`

### 界面操作

1. 查询

```graphql
query {
  getList {
    id
    name
    poster
    price
    filmType
  }
}
```

2. 增加

```graphql
mutation {
  addFilm(input: {
    name: "789",
    poster: "http://789.png",
    price: 789,
    filmType: COMINGSOON
  }) {
    id
    name
  }
}
```

3. 更新

```graphql
mutation {
  updateFilm(id: "63abf2ddfa4d17194c368d7f", input: {
    name: "888",
    price: 888,
    filmType: NOWPLAYING
  }) {
    id
    name
    poster
    price
    filmType
  }
}
```

4. 删除

```graphql
mutation {
  deleteFilm(id: "63abf2ddfa4d17194c368d7f")
}
```