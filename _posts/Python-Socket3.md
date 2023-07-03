---
title: 'udp服务端和客户端'
excerpt: 'udp服务端和客户端'
coverImage: '/assets/blog/python/socket.png'
date: '2023-06-20 16:50:41'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/socket.png'
type: 'Python'
---

## udp服务端和客户端

`udp` 最大传输量是 `1472` 个字节：

总包最大 `1500` 字节，`ip` 头部占 `20` 字节，`ip` 头部占 `8` 字节

`udp` 稳定传输的最大数据量是 `512` 个字节：只适合发短数据

### 服务端

```python
import socket

# 1、创建 socket 对象
#   AF_INET：基于网络通信的套接字家族
#   SOCK_STREAM：流式协议（tcp协议）
#   SOCK_DGRAM：数据报协议（udp协议）
sk = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 设置端口和地址重复使用
sk.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# 2、绑定地址
#   参数是一个元组，为地址+端口
sk.bind(('127.0.0.1', 9876))


# 3、数据传输
#   recv：接收客户端的数据
#   send：向客户端发送数据
#   1024：一次接收的最大数据量，单位为 bytes
while True: # 持续的接收当前连接发送过来的数据
  # 获取数据和客户端地址+端口
  # 如果没拿到数据会阻塞在这里
  data, addr = sk.recvfrom(1024)

  # 查看数据
  data = data.decode('utf-8')
  print('客户端发来的数据：', data)

  # 给客户端发送数据
  sk.sendto(data.upper().encode('utf-8'), addr)

```

### 客户端

```python
# 1、创建 socket 对象
#   AF_INET：基于网络通信的套接字家族
#   SOCK_STREAM：流式协议（tcp协议）
#   SOCK_DGRAM：数据报协议（udp协议）
sk = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 2、数据传输
while True: # 持续发送数据
  # 会阻塞代码的执行
  msg = input("请输入数据：").strip()

  # 如果没数据，进行下一轮循环
  if not msg:
    continue

  # 发送数据
  sk.sendto(msg.encode('utf-8'), ('127.0.0.1', 9876))

  # 接收数据
  data, addr = sk.recvfrom(1024)
  data = data.decode('utf-8')
  print('服务端发来的数据：', data)

# 3、关闭连接
sk.close()
```