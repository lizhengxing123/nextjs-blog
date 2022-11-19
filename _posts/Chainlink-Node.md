---
title: 'Chainlink 的使用 - 搭建本地节点'
excerpt: 'Chainlink 本地节点的搭建'
coverImage: '/assets/blog/chainlink/node-1.png'
date: '2022-11-19 09:55:36'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/chainlink/node-1.png'
type: 'Chainlink'
---

## 学习

- [bilibili 视频](https://www.bilibili.com/video/BV1ed4y1N7Uv?p=14&vd_source=97e4871747b6e43793eaa0ddb1bb5191)
- [官方文档](https://docs.chain.link/chainlink-nodes/running-a-chainlink-node)

## 需要准备的东西

- 需要安装[Docker](https://www.docker.com/)
- 需要一个以太坊RPC链接：可以在 [Alchemy](https://www.alchemy.com/) 中获取

## 步骤

### 1、创建本地文件夹来保存 Chainlink 数据

```linux
mkdir ~/.chainlink-goerli
```

### 2、在 .chainlink-goerli 文件夹中创建 .env 文件

在 .env 文件中加入以下内容

```env
ROOT=/chainlink
LOG_LEVEL=debug
ETH_CHAIN_ID=5
CHAINLINK_TLS_PORT=0
SECURE_COOKIES=false
ALLOW_ORIGINS=
# 这里的 URL 是你从 Alchyme 中获取到的
ETH_URL=<Your URL>
# 数据库的地址
# $USERNAME - 用户名
# $PASSWORD - 密码
# $SERVER - 数据库服务器名称
# $PORT - 数据库监听端口号
# $DATABASE - 用于 chainlink 节点的数据库
# 在测试节点可以添加 ?sslmode=disable 到 DATABASE_URL 中
DATABASE_URL=postgresql://$USERNAME:$PASSWORD@$SERVER:$PORT/$DATABASE?sslmode=disable
```

### 3、在 .chainlink-goerli 文件夹中创建 docker-compose.yml 文件

docker 的镜像可以在 [docker hub](https://hub.docker.com/) 这个网站中查找

在 docker-compose.yml 文件中加入以下内容

```yml
# docker 配置文件
# 需要 postgres 数据库 和 chainlink 节点两个 container

services:
  # postgres 数据库
  pg_chainlink:
    # 镜像
    image: "postgres:latest"
    # 监听端口
    ports:
      - "5432:5432"
    # 记录这个 container 用户名密码的文件
    env_file:
      - db.env
    # 需要本地文件夹路径
    volumes:
      - /Users/lizhengxing/.chainlink-goerli/db-volume:/var/lib/postgressql/data
  # chainlink 节点
  chainlink:
    # 镜像
    image: "smartcontract/chainlink:1.10.0"
    # 监听端口
    ports:
      - "6688:6688"
    # 记录这个 container 用户名密码的文件
    env_file:
      - .env
    # 需要本地文件夹路径
    volumes:
      - /Users/lizhengxing/.chainlink-goerli/chainlink-volume:/chainlink/
    # 依赖于数据库服务，需要先启动 pg_chainlink，然后才会启动这个
    depends_on:
      - pg_chainlink
    # 启动服务命令
    # password.txt 保存进入数据库所需要的密码
    # uipassword.txt 保存本地 chainlink 节点启动之后页面登录所需的账号密码
    command: node start --password /chainlink/password.txt --api /chainlink/uipassword.txt
```

### 4、在 .chainlink-goerli 文件夹中创建 db.env 文件

db.env 文件存放 postgres 数据库的账号密码等信息

在该文件中加入以下内容

```env
# 用户名
POSTGRES_USER=postgres
# 密码 - 至少16位
POSTGRES_PASSWORD=chainlinkdbpassword
# 数据库名称
POSTGRES_DB=chainlink-goerli
```

### 5、在 .chainlink-goerli 文件夹中创建 db-volume 文件夹

该文件夹是用来提供 pg_chainlink 的 volumes

### 6、在 .chainlink-goerli 文件夹中创建 chainlink-volume 文件夹

该文件夹是用来提供 chainlink 的 volumes

还需在该文件夹中创建 `password.txt` 文件，用来保存进入数据库的密码，和 `db.env` 中的密码保持一致

```txt
chainlinkdbpassword
```

另外还需在该文件夹中创建 `uipassword.txt` 文件，用来保存进入ui界面的账号和密码，内容自定义

```txt
youemail@address.com
chainlinkuipassword
```

### 7、运行 docker 文件

使用以下命令运行 docker 文件

```linux
docker compose up
```

使用以下命令删除已经停掉的 container

```linux
docker container prune
```

可能会遇到以下问题

```linux
chainlink-goerli-chainlink-1     | opening db: failed to open db: failed to connect to
`host=chainlink-goerli-pg_chainlink-1 user=postgres database=chainlink-goerli`: 
dial error (dial tcp 172.18.0.2:5432: connect: connection refused)
```

解决方法是：打开 docker 的 dashboard，选中 container，然后点击里面的 start 按钮即可

![db报错解决方式](/assets/blog/chainlink/node-2.png)

### 8、打开 localhost:6688

打开 localhost:6688 使用 uipassword.txt 里面的账号密码即可登录

## 其他运行节点的方式

- 使用 [naas](https://naas.link/nodes)
- Chainlink开发关系团队维护可用于测试实施的[测试网预言机](https://docs.chain.link/any-api/testnet-oracles/)
