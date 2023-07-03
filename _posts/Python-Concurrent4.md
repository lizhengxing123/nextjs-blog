---
title: '并发编程'
excerpt: '并发编程'
coverImage: '/assets/blog/python/concurrent.jpg'
date: '2023-06-27 10:16:48'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/concurrent.jpg'
type: 'Python'
---

## 并发编程

### 池

池是用来保证计算机硬件安全的情况下，最大限度的利用计算机的资源。虽然降低了程序运行效率，但是保证了计算机硬件的安全，以此来让我们的程序能正常运行。

#### 线程池

```python
from concurrent.futures import ThreadPoolExecutor
import time
import os

# 获取 cpu 个数
# cpu_num = os.cpu_count()

# 创建线程池
# 参数为线程数量
# 默认数量为 min(32, (os.cpu_count() or 1) + 4)
pool = ThreadPoolExecutor(2)

def task(name):
  print(name)

  time.sleep(3)

  return name + 10

f_list = []

# 往线程池中提交任务，异步提交
for i in range(4):
  future = pool.submit(task, i)

  f_list.append(future)

# 获取异步调用结果
for f in f_list:
  print("结果：", f.result())

"""
0
1

--- 3s ---

2
3

--- 3s ---

结果 10
结果 11
结果 12
结果 13
"""
```

> 与信号量的区别
>
> 信号量是锁，线程有我们自己创建，它来控制线程的执行与阻塞
>
> 线程池自己创建线程，并且控制线程的数量


#### 进程池

```python
from concurrent.futures import ProcessPoolExecutor
import time
import os

# 获取 cpu 个数
# cpu_num = os.cpu_count()

# 创建进程池
# 参数为进程数量
# 默认数量为 cpu 个数
pool = ProcessPoolExecutor(2)

def task(name):
  print(name, os.getpid())

  time.sleep(3)

  return name + 10

# 获取结果的回调
def done_cb(future):
  print('done_cb', future.result())

if __name__ == "__main__":

  # 往进程池中提交任务，异步提交
  for i in range(4):

    # add_done_callback 添加回调函数
    # 该回调函数会在任务完成拿到返回值时调用
    pool.submit(task, i).add_done_callback(fn=done_cb)

"""
0 12889
1 12890

--- 3s ---

2 12898
done_cb 10
3 12899
done_cb 11

--- 3s ---

done_cb 12
done_cb 13
"""
```

### 协程

也可以称为微线程，它是一种用户态内的上下文技术，简单说就是在单线程下实现并发效果。

代码层面上的实现思路时：切换 + 保存状态，主要是 `yield` 关键字

对于 `IO密集型` 操作来说，切换会提升效率

对于 `计算密集型` 操作来说，切换会降低效率

#### 计算密集型

- 串行

```python
import time

def f1():
    n = 0
    for i in range(10000000):
        n += i


def f2():
    n = 0
    for i in range(10000000):
        n += i


start = time.time()
f1()
f2()
end = time.time()
print(end - start) # 1.1593782901763916
```

- 协程

```python
def f1():
    n = 0
    for i in range(10000000):
        n += i
        yield


def f2():
    g = f1()
    n = 0
    for i in range(10000000):
        n += i
        next(g)


start = time.time()
f2()
end = time.time()
print(end - start) # 2.066110849380493

"""
先执行 f2
等到调用 next 之后

再执行 f1
等到执行到 yield 之后

切换到 f2
等到调用 next 之后

切换到 f1
等到执行到 yield 之后

....

"""
```

#### IO密集型

- 串行

```python
def da():
    for _ in range(3):
        print('哒')
        time.sleep(2)


def mie():
    for _ in range(3):
        print('咩')
        time.sleep(2)


start = time.time()
da()
mie()
end = time.time()
print(end - start)

"""
哒
--- 2s ---
哒
--- 2s ---
哒
--- 2s ---
咩
--- 2s ---
咩
--- 2s ---
咩
--- 2s ---

12.021934032440186
"""
```

- 协程

```python
from gevent import monkey

# 猴子补丁
# 打上补丁之后就能监听所有的 IO 操作了
monkey.patch_all()

from gevent import spawn

def da():
    for _ in range(3):
        print('哒')
        time.sleep(2)


def mie():
    for _ in range(3):
        print('咩')
        time.sleep(2)


start = time.time()
g1 = spawn(da)
g2 = spawn(mie)
g1.join()
g2.join()
end = time.time()
print(end - start)

"""
哒
咩
--- 2s ---
哒
咩
--- 2s ---
哒
咩
--- 2s ---

6.012590169906616
"""
```

#### 并发服务端

```python
import socket

from gevent import monkey
monkey.patch_all()

from gevent import spawn

def comm(conn):
  while True:
    try:
      data = conn.recv(1024)
    except:
      break

    if not data:
      break

    data = data.decode("utf-8")
    print(data)

    conn.send(data.upper().encode("utf-8"))
  
  conn.close()

def run(ip, port):
  sever = socket.socket()

  sever.bind((ip, port))

  sever.listen(5)

  while True:
    conn, addr = sever.accept()
    spawn(comm, conn)

if __name__ == "__main__":
  g = spawn(run, "127.0.0.1", 9876)
  g.join()
``` 

#### 并发客户端

```python
import socket
import time
from threading import Thread, current_thread

def client():
  sk = socket.socket()

  sk.connect(("127.0.0.1", 9876))

  n = 0
  while True:
    msg = f'{current_thread().name}    say：{n}'

    sk.send(msg.encode('utf-8'))

    data = sk.recv(1024)
    print(data.decode('utf-8'))

    time.sleep(3)

    n += 1

if __name__ == '__main__':
  for i in range(3):
    Thread(target=client).start()

"""
Thread-1    say：0
Thread-3    say：0
Thread-2    say：0

--- 3s ---

Thread-1    say：1
Thread-3    say：1
Thread-2    say：1
"""
```

### 非阻塞IO

#### 服务端

```python
import socket

sever = socket.socket()

# 设置端口重用
sever.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

sever.bind(('127.0.0.1', 7865))

sever.listen(5)

# 将网络从阻塞变为非阻塞
sever.setblocking(False)

c_list = []
d_list = []

while True:
  try:
    conn, addr = sever.accept()

    # 将连接添加到列表中
    c_list.append(conn)
  except BlockingIOError:
    # 遍历连接列表
    for conn in c_list:
      try:
        data = conn.recv(1024)

        # 如果没拿到数据，就关闭连接
        # 并把该连接放到删除列表里面
        if not data:
          conn.close()
          d_list.append(conn)

        conn.send(data.upper())

      # 如果没拿到数据，就会走下面的错误
      except BlockingIOError:
        pass
      
      # 处理 windows 上的报错
      except ConnectionResetError:
        conn.close()
        d_list.append(conn)

    # 根据 d_list 重置 c_list
    for i in d_list:
      c_list.remove(i)

    # 清空 d_list
    d_list.clear()
```

#### 客户端

```python
import socket
import time

sk = socket.socket()

sk.connect(('127.0.0.1', 7865))

while True:
    sk.send(b'abc')
    data = sk.recv(1024)
    print(data.decode('utf-8'))
    time.sleep(2)
```

### IO多路复用

#### 服务端

```python
import socket
import select

sever = socket.socket()

sever.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sever.bind(('127.0.0.1', 7865))

sever.listen(5)

sever.setblocking(False)

# select 监管列表
input_list = [sever]

while True:
  # select 监管机制是操作系统提供的
  # 将 socket 对象交给 select 监管机制，如果有连接进来的时候，就回返回数据
  rist, wlist, xist = select.select(input_list)

  # rlist 是监管机制返回的可读列表
  # 遍历循环的时候，如果是客户端连接我们，i 就是 sever
  # 如果是客户端给我们发送消息，i 就是 conn
  for i in rlist:

    if i is sever:
      # 获取 conn 
      conn, _ = i.accept()

      # conn 也需要监管
      input_list.append(conn)

      continue

    try:
      # 是 conn
      msg = i.recv(1024)

      # 如果没有数据，关闭连接，移除监管
      if not data:
        i.close()
        input_list.remove(i)
        continue

      i.send(data.upper())

    # 处理 windows 平台报错问题
    except ConnectionResetError:
      i.close()
      input_list.remove(i)
      continue
```

#### 客户端

```python
import socket
import time

sk = socket.socket()

sk.connect(('127.0.0.1', 7865))

while True:
    sk.send(b'abc')
    data = sk.recv(1024)
    print(data.decode('utf-8'))
    time.sleep(2)
```

### selectors

#### 服务端

```python
import selectors
import socket

sever = socket.socket()

sever.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sever.bind(('127.0.0.1', 7865))

sever.listen(5)

sever.setblocking(False)

sel = selectors.DefaultSelector()

def accept(sever):
  conn, _ = sever.accept()
  
  # conn 对象也需要注册到监管列表
  sel.register(conn, selectors.EVENT_READ, read)  

def read(conn):
  try:
    data = conn.recv(1024)

    if not data:
        conn.close()
        sel.unregister(conn)
        return

    conn.send(data.upper())

  except ConnectionResetError:
    conn.close()
    sel.unregister(conn)
    return

# 将 sever 对象注册到监管列表
sel.register(sever, selectors.EVENT_READ, accept)

while True:
  # 获取所有的就绪链表
  events = sel.select()

  for key, mask in events:
    cb = key.data
    cb(key.fileobj)
```

#### 客户端

```python
import socket
import time

sk = socket.socket()

sk.connect(('127.0.0.1', 7865))

while True:
    sk.send(b'abc')
    data = sk.recv(1024)
    print(data.decode('utf-8'))
    time.sleep(2)
```