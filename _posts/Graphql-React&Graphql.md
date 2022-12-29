---
title: '在 React 中使用 Graphql'
excerpt: '在 React 中使用 Graphql'
coverImage: '/assets/blog/graphql/react.png'
date: '2022-12-29 15:21:25'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/graphql/react.png'
type: 'Graphql'
---

## 在 React 中使用 Graphql

[官方文档](https://www.apollographql.com/docs/react/get-started)

需要用到的库有：

- `@apollo/client`：`Apollo`客户端
- `graphql`：`graphql`的`javascript`实现

### 代码

- `src/index.js`：`React`项目入口文件，初始化`Apollo`客户端

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import App from './App';

// 初始化客户端
const client = new ApolloClient({
  uri: "http://localhost:8666/graphql", // 后端地址，需要配置跨域设置
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <HashRouter>
        <App />
      </HashRouter>
    </ApolloProvider>
  </React.StrictMode>
);
```

- `src/pages/graphql/index.js`：`graphql`使用文件

```js
// src/pages/graphql/index.js
import React from 'react'
import { useQuery, useMutation, gql } from "@apollo/client";

// graphql 查询语句
const GET_LIST = gql`
  query GetList {
    list: getList {
      id
      name
      poster
      price
      filmType
    }
  }
`;
// graphql 更新语句 - 传递 id 和 input 参数
// 参数类型必须和后端设置的保持一致
const UPDATE_FILM = gql`
  mutation UpdateFilm($id: String, $input: FilmInput) {
    updateFilm(id: $id, input: $input) {
      id
      name
      poster
      price
      filmType
    }
  }
`;
// graphql 删除语句 - 传递 id 参数
const DELETE_FILM = gql`
  mutation DeleteFilm($id: String) {
    deleteFilm(id: $id)
  }
`;

export default function Graphql() {
  // 查询 hook
  // 调用 refetch 方法会重新获取数据
  const { data, loading, refetch /*, error*/ } = useQuery(GET_LIST);
  
  // 修改 hook
  // updateFilm 是更新函数
  const [ updateFilm/*, { data, loading, error, reset }*/] = useMutation(UPDATE_FILM);

  const handleUpdate = async (id) => {
    // 传递变量，返回值为 Promise
    await updateFilm({variables: {
      id,
      input: {
        name: "修改之后的名称"
      }
    }})
    // 重新请求
    refetch()
  }
  // 删除 hook
  // deleteFilm 是删除函数
  const [ deleteFilm ] = useMutation(DELETE_FILM);

  const handleDelete = async(id) => {
    const data = await deleteFilm({
      variables: {
        id
      },
    });
    console.log('data: ', data); // 能拿到返回的数据
    refetch()
  };

  if(loading) return <p>Loading</p>
  return data.list.map(({ id, name, poster, price, filmType }) => (
    <div key={id}>
      <span>{name}</span> ——
      <span>{poster}</span> ——
      <span>{price}</span> ——
      <span>{filmType}</span> ——
      <button onClick={() => handleUpdate(id)}>修改</button>
      <button onClick={() => handleDelete(id)}>删除</button>
    </div>
  ));
}
```