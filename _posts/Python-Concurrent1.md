---
title: '进程'
excerpt: '进程'
coverImage: '/assets/blog/python/concurrent.jpg'
date: '2023-06-21 10:44:54'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/concurrent.jpg'
type: 'Python'
---

## 进程

进程是资源单位

### 创建进程

#### 方式一

```python
from multiprocessing import Process
import time

def fn(num):
  print('任务开始')
  time.sleep(num)
  print("任务结束")

if __name__ == "__main__":
  # 得到进程操作对象
  p = Process(target=fn, args=(3,))
  # 启动进程
  p.start()

  print('主进程')

"""
主进程
任务开始
任务结束
"""
```

#### 方式二

```python
from multiprocessing import Process
import time

# 创建类，继承 Process
class MyProcess(Process):
  def __init__(self, name):
    super().__init__()
    self.name = name

  def run(self):
    print(f'{self.name}任务开始')
    time.sleep(num)
    print(f"{self.name}任务结束")

if __name__ == "__main__":
  p = MyProcess("打代码")
  p.start()
  print('主进程')

"""
主进程
打代码任务开始
打代码任务结束
"""
```

### join

`join` 方法，让主进程等待子进程执行完毕后再继续执行

```python
from multiprocessing import Process
import time

def fn(num):
  print('任务开始')
  time.sleep(num)
  print("任务结束")

if __name__ == "__main__":
  # 得到进程操作对象
  p = Process(target=fn, args=(3,))
  # 启动进程
  p.start()

  # 等待子进程执行完毕
  p.join()

  print('主进程')

"""
任务开始
任务结束
主进程
"""
```

### 进程间的数据隔离

启动新进程的时候，会将主进程的数据拷贝一份到新的进程中

```python
from multiprocessing import Process

a = 18

def fn(num):
  global a

  # 这里并不会修改主进程里的 a
  # 而是修改子进程自己拷贝的全局变量 a
  a = num

if __name__ == "__main__":
  p = Process(target=fn, args=(3,))

  p.start()

  p.join()

  print('主进程', a) # 主进程 18
```

### 进程号

```python
from multiprocessing import Process
import time
import os

def task(name="子进程"):
  # 可以使用 os.getpid() 获取当前进程号
  print(f"{name}{os.getpid()}正在运行中")

  # 另外可以使用 os.getppid() 获取当前进程的父进程号
  print(f"{name}的父进程{os.getppid()}正在运行中")

  time.sleep(10)

if __name__ == '__main__':
  p = Process(target=task)

  p.start()

  print("主进程号", os.getpid())

"""
主进程号 12676
子进程12678正在运行中
子进程的父进程12676正在运行中
"""
```

### 杀死当前进程

```python
from multiprocessing import Process
import time
import os

def task(name="子进程"):
  print(f"{name}{os.getpid()}正在运行中")

  print(f"{name}的父进程{os.getppid()}正在运行中")

  time.sleep(10)

if __name__ == '__main__':
  p = Process(target=task)
  p.start()

  # 杀死当前进程
  p.terminate()

  time.sleep(0.001)

  # 查看当前进程是否存活
  print(p.is_alive()) # False
```

### 僵尸进程

子进程死后，还会有一些资源占用（比如进程号、运行状态、运行时间等），等待父进程通过系统调用回收（收尸）。

除了 `init` 进程之外，所有的进程最后都会成为僵尸进程。

危害：子进程退出后，如果父进程没有及时处理，僵尸进程就会一直占用计算机资源。如果产生了大量的僵尸进程，资源过度占用，系统没有可用的进程号，就会导致系统不能产生新的进程。

### 孤儿进程

子进程处于存活状态，但是父进程意外死亡了。

操作系统会开设一个 `init` 进程（孤儿院），专门用来管理孤儿进程，回收孤儿进程相关的资源。

### 守护进程

主进程结束，子进程也会跟着结束

```python
from multiprocessing import Process
import time

def task(name):
  print(f"{name} 还存活")
  
  time.sleep(3)

  print(f"{name} 已死亡")

if __name__ == "__main__":
  p = Process(target=task, args=("进程1",))
  p.start()

  print("主进程")

"""
主进程
进程1 还存活
进程1 已死亡
"""
```

使用 `p.daemon = True` 转换为守护进程

```python
if __name__ == "__main__":
  p = Process(target=task, args=("进程1",))
  p.daemon = True
  p.start()

  print("主进程")

"""
主进程
"""
```

### 互斥锁

当多个进程处理同一份数据的时候，会出现数据错乱的问题，解决办法就事加锁处理。

锁的原理是把并发变为串行，虽然牺牲了运行效率，但是保证了数据安全。

```python
"""
./data/tickets.json

{"tickets_num": 2}
"""

from multiprocessing import Process, Lock
import time
import json
import random

# 模拟查票买票
def buy_ticket(name):
  # 先查票
  with open("./data/tickets.json", mode="rt", encoding="utf-8") as f:
    dic = json.load(f)

  print(f'{name}查询余票：{dic.get("tickets_num")}')

  # 模拟网络延迟
  time.sleep(random.randint(1, 3))

  # 买票
  if dic.get("tickets_num") > 0:
    # 票数减一
    dic["tickets_num"] -= 1

    # 重新写入数据
    with open("./data/tickets.json", mode="rt", encoding="utf-8") as f:
      json.dump(dic, f)

    print(f'{name}买票成功')

  else:
    print(f'{name}买票失败，余票不足')


def task(name, mutex):
  # 加锁
  mutex.acquire()

  buy_ticket(name)

  # 释放锁
  mutex.release()

if __name__ == "__main__":
  # 互斥锁
  mutex = Lock()

  for i in range(10):
    p = Process(target=task, args=(str(i + 1) + "号", mutex))
    p.start()

  # 解决报错问题
  time.sleep(1)


"""
输出结果：

1号查询余票：2
1号买票成功
3号查询余票：1
3号买票成功
2号查询余票：0
2号买票失败，余票不足
4号查询余票：0
4号买票失败，余票不足
5号查询余票：0
5号买票失败，余票不足
6号查询余票：0
6号买票失败，余票不足
8号查询余票：0
8号买票失败，余票不足
7号查询余票：0
7号买票失败，余票不足
10号查询余票：0
10号买票失败，余票不足
9号查询余票：0
9号买票失败，余票不足
"""
```

### 队列

是一种先进先出（`FIFO`）的数据结构

```python
from multiprocessing import Queue
```

#### 创建队列

可以传递数字，表示队列里面最多能存多少个数据，默认大小是 `32767`

```python
q = Queue(3)
```

#### 存数据

```python
q.put("a")
q.put("b")
q.put("c")

# 超过数量会导致程序阻塞
# q.put("d")

# 超过数量会直接报错 queue.Full
# q.put_nowait("d")

# 等待 3 秒，超过数量会直接报错 queue.Full
# q.put("d", timeout=3)
```

#### 判断队列是否满了

```python
q.full() # True
```

#### 取数据

```python
v1 = q.get()
v2 = q.get()
v3 = q.get()

# 超过数量会导致程序阻塞
# q.get()

# 超过数量会直接报错 _queue.Empty
# q.get_nowait()

# 等待 3 秒，超过数量会直接报错 _queue.Empty
# q.get()

print(v1, v2, v3)
#     a   b   c
```

#### 判断队列是否空了

```python
print(q.empty()) # True
```

以下四个方法在多进程中可能不太准确

```python
"""
q.put_nowait()
q.get_nowait()
q.full()
q.empty()
"""
```

### 进程间的通信（IPC机制）

```python
from multiprocessing import Process, Queue
import time

def task1(q):
  q.put("淅沥")
  q.put("哗啦")

def task2(q):
  print("task2", q.get())

if __name__ == "__main__":
  q = Queue()

  p1 = Process(target=task1, args=(q,))
  p2 = Process(target=task2, args=(q,))

  p1.start()
  p2.start()

  time.sleep(0.1)  # 解决报错问题

  print("主进程", q.get())
  print(q.empty())

"""
task2 淅沥
主进程 哗啦
True
"""
```

### 生产者消费者模型

```python
from multiprocessing import Process, JoinableQueue
import random
import time

"""
JoinableQueue

在 Queue 的基础上增加了一个计数器，每 put 一个数据，计数器加一；
每调用一次 task_done，计数器就减一；
当计数器为 0 时，就会走 join() 后面的方法
"""

def producer(name, food, q):
  for i in range(3):
    time.sleep(random.randint(1, 3))
    print(f"{name}生产了{food}{i + 1}")
    q.put(f"{food}{i + 1}")

def consumer(name, q):
  while True:
    food = q.get()
    time.sleep(random.randint(1, 3))
    print(f"{name}吃光了{food}")

    # 告诉队列，拿走的数据处理光了
    q.task_done()

if __name__ == "__main__":
  q = JoinableQueue()

  p1 = Process(target=producer, args=('中华小当家', '黄金炒饭', q))
  p2 = Process(target=producer, args=('神厨小福贵', '佛跳墙', q))
  c1 = Process(target=consumer, args=('猪八戒', q))
  c2 = Process(target=consumer, args=('孙悟空', q))

  p1.start()
  p2.start()

  # 将消费者设置为守护进程
  c1.daemon = True
  c2.daemon = True

  c1.start()
  c2.start()

  # 等待生产者生产完数据
  p1.join()
  p2.join()

  # 等待队列中所有数据被取完，计数器变为 0
  q.join()  

  # 之后主进程结束，守护进程跟着结束

"""
中华小当家生产了黄金炒饭1
神厨小福贵生产了佛跳墙1
中华小当家生产了黄金炒饭2
猪八戒吃光了黄金炒饭1
孙悟空吃光了佛跳墙1
猪八戒吃光了黄金炒饭2
神厨小福贵生产了佛跳墙2
中华小当家生产了黄金炒饭3
神厨小福贵生产了佛跳墙3
孙悟空吃光了佛跳墙2
猪八戒吃光了黄金炒饭3
孙悟空吃光了佛跳墙3
"""
```

### TCP并发编程

#### 服务端

```python
import socket
from multiprocessing import Process

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

    Process(target=task, args=(conn,)).start()

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