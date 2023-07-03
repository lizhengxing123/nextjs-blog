---
title: 'udp并发服务端和客户端'
excerpt: 'udp并发服务端和客户端'
coverImage: '/assets/blog/python/socket.png'
date: '2023-06-21 10:37:19'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/socket.png'
type: 'Python'
---

## udp并发服务端和客户端


### 服务端

```python
import socketserver

# 需要创建一个类，用来处理连接请求
# 这个类需要继承 socketserver.BaseRequestHandler
class RequestHandle(socketserver.BaseRequestHandler):
    # 必须要实现 handle 方法
    def handle(self):
        # 数据和连接对象
        data, sk = self.request

        # 客户端地址
        addr = self.client_address

        # 数据
        data = data.decode("utf-8")
        print("客户端发来的数据", data)

        # 发送数据
        sk.sendto(data.upper().encode('utf-8'), addr)

# 创建 socket 对象
sk = socketserver.ThreadingUDPServer(("127.0.0.1", 9987), RequestHandle)

# 持续提供服务
sk.serve_forever()
```

### 客户端

```python
import socket

sk = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

while True:
    msg = input("请输入").strip()

    if not msg:
        continue

    sk.sendto(msg.encode("utf-8"), ("127.0.0.1", 9987))

    data, addr = sk.recvfrom(1024)
    
    print("服务端发来的数据", data.decode("utf-8"))

sk.close()
```
