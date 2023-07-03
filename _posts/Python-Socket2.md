---
title: 'tcp服务端和客户端'
excerpt: 'tcp服务端和客户端'
coverImage: '/assets/blog/python/socket.png'
date: '2023-06-20 15:55:07'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/socket.png'
type: 'Python'
---

## tcp服务端和客户端

### 服务端

```python
import socket

# 1、创建 socket 对象
#   AF_INET：基于网络通信的套接字家族
#   SOCK_STREAM：流式协议（tcp协议）
#   SOCK_DGRAM：数据报协议（udp协议）
sk = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 设置端口和地址重复使用
sk.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# 2、绑定地址
#   参数是一个元组，为地址+端口
sk.bind(('127.0.0.1', 9876))

# 3、监听连接请求
#   5：半连接池大小
sk.listen(5)

# 4、处理连接请求，开始服务
#   如果半连接池里面有请求，会执行以下代码
#   如果没有请求，代码会阻塞在这里，停下来
while True: # 使用死循环，持续提供服务
  # 获取连接对象和客户端地址+端口
  coon, addr = sk.accept()

  # 5、数据传输
  #   recv：接收客户端的数据
  #   send：向客户端发送数据
  #   1024：一次接收的最大数据量，单位为 bytes
  while True: # 持续的接收当前连接发送过来的数据
      
    # try/catch 解决 windows 连接直接断开的异常问题
    try:
      # 如果没拿到数据也会阻塞在这里
      data = coon.recv(1024)
    except:
      break

    # 解决 linux/mac 连接直接断开的死循环问题
    if not data:
      break

    # 查看数据
    data = data.decode('utf-8')
    print('客户端发来的数据：', data)

    # 给客户端发送数据
    coon.send(data.upper().encode('utf-8'))

  # 6、关闭连接
  coon.close()
```

### 客户端

```python
# 1、创建 socket 对象
#   AF_INET：基于网络通信的套接字家族
#   SOCK_STREAM：流式协议（tcp协议）
#   SOCK_DGRAM：数据报协议（udp协议）
sk = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 2、根据地址+端口建立连接
sk.connect(('127.0.0.1', 9876))

# 3、数据传输
while True: # 持续发送数据
  # 会阻塞代码的执行
  msg = input("请输入数据：").strip()

  # 如果没数据，进行下一轮循环
  if not msg:
    continue

  # 发送数据
  sk.send(msg.encode('utf-8'))

  # 接收数据
  data = sk.recv(1024)
  data = data.decode('utf-8')
  print('服务端发来的数据：', data)

# 4、关闭连接
sk.close()
```