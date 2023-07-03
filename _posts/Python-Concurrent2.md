---
title: '线程'
excerpt: '线程'
coverImage: '/assets/blog/python/concurrent.jpg'
date: '2023-06-25 11:32:04'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/concurrent.jpg'
type: 'Python'
---

## 线程

线程是执行单位。

在一个进程里面可以有多个线程，这多个线程之间的资源是共享的。

### 创建线程

#### 方式一

```python
from threading import Thread
import time

def task(name):
  print(f'{name}任务开始')
  time.sleep(3)
  print(f'{name}任务结束')

if __name__ == '__main__':
  t = Thread(target=task, args=('赤膊',))
  t.start()
  print('主线程')

"""
赤膊任务开始
主线程
赤膊任务结束
"""
```

#### 方式二

```python
from threading import Thread
import time

class MyThread(Thread):
  def __init__(self, name):
    super().__init__()
    self.name = name

  def run(self):
    print(f'{self.name}任务开始')
    time.sleep(3)
    print(f'{self.name}任务结束')


if __name__ == '__main__':
  t = MyThread('jiji')
  t.start()
  print('主线程')

"""
jiji任务开始
主线程
jiji任务结束
"""
```

### join

`join` 方法，让主线程等待子线程执行完毕后再继续执行

```python
from threading import Thread
import time

def task(name):
  print(f'{name}任务开始')
  time.sleep(3)
  print(f'{name}任务结束')

if __name__ == '__main__':
  t = Thread(target=task, args=('赤膊',))
  t.start()
  t.join()
  print('主线程')

"""
赤膊任务开始
赤膊任务结束
主线程
"""
```

### 线程间的数据共享

同一个进程内不同线程之间的数据是共享的

```python
from threading import Thread, current_thread, active_count
import os

a = 18

def task():
  global a
  a = 16

  print("子线程的进程号：", os.getpid())
  print("子线程名称：", current_thread().name)

if __name__ == "__main__":
  t = Thread(target=task)
  t.start()
  t.join()

  print("主线程的进程号：", os.getpid())
  print("主线程名称：", current_thread().name)
  print("活跃的线程数量：", active_count())

  print(a)

"""
子线程的进程号： 52981
子线程名称： Thread-1
主线程的进程号： 52981
主线程名称： MainThread
活跃的线程数量： 1
16
"""
```

### 守护线程

主线程结束，子线程也会跟着结束

```python
from threading import Thread
import time

def task(name):
  print(f'{name}任务开始')
  time.sleep(3)
  print(f'{name}任务结束')

if __name__ == '__main__':
  t = Thread(target=task, args=('赤膊',))
  t.daemon = True  # 主线程结束后，守护线程跟着结束
  t.start()

  print('主线程')

"""
赤膊任务开始
主线程
"""
```

### 线程互斥锁

```python
from threading import Thread, Lock
import time

num = 180

# 因为线程之间数据共享，因此可以直接把锁放到全局作用域里面
mutex = Lock()

def task():
  global num
    # mutex.acquire()

    with mutex: # 会自动的调用 acquire 和 release
      temp = num
      time.sleep(0.05)
      num = temp - 1
      print(current_thread().name, num)

    # mutex.release()


if __name__ == '__main__':
    l = []

    for i in range(3):
        t = Thread(target=task)
        t.start()
        l.append(t)

    for i in l:
        i.join()

    print(num) 

"""
Thread-1 2
Thread-2 1
Thread-3 0
0
"""
```

### GIL全局解释器锁

#### python解释器版本

- Cpython：c语言写的 python 解释器
- Jpython：java写的 python 解释器
- Pypypython：python写的 python 解释器

#### GIL
    
GIL 全局解释器锁不是 `python` 的特点，它是 Cpython 解释器独有的特点。在 Cpython 解释器中，GIL 是一把互斥锁，用来阻止同一进程下的多个线程 同时执行，即使是多核的，一次也只能使用一个核。这是因为 Cpython 的内存管理不是线程安全的。GIL 保证的是解释器级别的数据的安全。

```python
from threading import Thread, Lock,current_thread

num = 3


def task():
    global num

    # 不需要加锁处理
    temp = num
    num = temp - 1
    print(current_thread().name, num)


if __name__ == '__main__':
    l = []
    for i in range(3):
        t = Thread(target=task)
        t.start()
        l.append(t)

    for i in l:
        i.join()

    print(num)

"""
Thread-1 2
Thread-2 1
Thread-3 0
0
"""
```

### TCP并发编程

#### 服务端

```python
import socket
from threading import Thread

def task(conn):
  while True:
    try:
      data = conn.recv(1024)
    except:
      break

    if not data:
      break

    data = data.decode("utf-8")

    print("客户端发来的数据：", data)

    conn.send(data.upper().encode("utf-8"))

  conn.close()

def run(ip, port):
  sever = socket.socket()

  sever.bind((ip, port))

  sever.listen()

  while True:
    conn, addr = sever.accept()

    Thread(target=task, args=(conn,)).start()

if __name__ == "__main__":
  run("127.0.0.1", 9001)
```

#### 客户端

```python
import socket
import time

client = socket.socket()

client.connect(("127.0.0.1", 9001))

while True:
  msg = b"hello"

  client.send(msg)

  data = client.recv(1024).decode("utf-8")

  print("服务端发来的数据：", data)

  time.sleep(3)
```