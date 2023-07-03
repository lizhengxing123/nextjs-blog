---
title: 'cmd文件服务端和客户端'
excerpt: 'cmd文件服务端和客户端'
coverImage: '/assets/blog/python/socket.png'
date: '2023-06-21 09:36:21'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/socket.png'
type: 'Python'
---

## cmd文件服务端和客户端

1、客户端发送命令

2、服务端执行命令，拿到数据

3、服务端包装头部

4、服务端发送头部长度

5、服务端发送头部数据

6、服务端发送执行命令之后的真实数据

7、客户端接收头部长度

8、客户端接收头部数据

9、客户端接收真实数据

### 服务端

```python
import hashlib
import json
import socket
import subprocess

sk = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sk.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

sk.bind(('127.0.0.1', 9986))

sk.listen(5)

while True:
    coon, addr = sk.accept()

    while True:
        try:
            data = coon.recv(1024)
        except:
            break

        if not data:
            break

        # 解码命令
        data = data.decode('utf-8')

        # 执行命令
        obj = subprocess.Popen(data, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        # 命令执行错误的返回数据，拿到的是 bytes 类型
        err = obj.stderr.read()

        if err:
            break

        # 获取命令返回数据，拿到的是 bytes 类型
        res = obj.stdout.read()

        # 计算返回数据的总长度
        size = len(res)

        # 根据真实数据计算 hash
        h = hashlib.md5()
        h.update(res[:100])
        h.update(res[-100:])

        # 封装头部
        header_dic = {
            "command": data,
            "size": size,
            "md5": h.hexdigest()
        }

        # 转换成json
        header_json = json.dumps(header_dic)

        # 转换成 bytes
        header_bytes = bytes(header_json, "utf-8")

        # 计算 header 的长度，并将其转换为 4 字节
        header_len = bytes(str(len(header_bytes)), 'utf-8').zfill(4)

        # 发送数据
        coon.send(header_len)
        coon.send(header_bytes)
        coon.send(res)

    coon.close()
```

### 客户端

```python
import hashlib
import json
import socket

sk = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sk.connect(("127.0.0.1", 9986))

while True:
    cmd = input("请输入命令").strip()

    if not cmd:
        continue

    # 发送命令
    sk.send(cmd.encode("utf-8"))

    # 获取头部长度
    header_len = sk.recv(4).decode("utf-8")

    # 获取头部数据
    header_bytes = sk.recv(int(header_len))
    header_json = json.loads(header_bytes)

    # 获取数据大小
    data_size = header_json["size"]

    # 循环获取数据
    recv_size = 0
    data = b''

    while recv_size < data_size:
        recv_data = sk.recv(1024)
        recv_size += len(recv_data)
        data += recv_data

    # 进行 md5 校验
    h = hashlib.md5()
    h.update(data[:100])
    h.update(data[-100:])

    print(h.hexdigest() == header_json["md5"])

sk.close()
```
