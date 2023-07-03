---
title: '多进程vs多线程'
excerpt: '多进程vs多线程'
coverImage: '/assets/blog/python/concurrent.jpg'
date: '2023-06-26 11:00:04'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/concurrent.jpg'
type: 'Python'
---

## 多进程vs多线程

### 计算密集型任务

- 多进程：花费时间短
- 多线程：由于一个进程内无法同时执行多个线程，所以花费时间长

```python
from multiprocessing import Process
from threading import Thread
import time

def task():
  res = 0
  
  for i in range(10000000):
    res += i

if __name__ == "__main__":
  l = []

  start = time.time()

  for i in range(10):
    p = Process(target=task) # 1.2690958976745605
    # t = Thread(target=task) # 5.7173497676849365

    p.start()
    l.append(p)    

  for i in l:
    l.join()

  end = time.time()

  print(end - start)
    
```

### IO密集型任务

- 多进程：创建进程是需要消耗资源和时间的，因此花费时间长
- 多线程：花费时间短

```python
from multiprocessing import Process
from threading import Thread
import time

def task():
  time.sleep(1)

if __name__ == "__main__":
  l = []

  start = time.time()

  for i in range(10):
    p = Process(target=task) # 12.070472955703735
    # t = Thread(target=task) # 1.1148149967193604

    p.start()
    l.append(p)    

  for i in l:
    l.join()

  end = time.time()

  print(end - start)
```

### 死锁

会阻塞程序的执行

```python
from threading import Thread, Lock, current_thread
import time

mutex1 = Lock()
mutex2 = Lock()


def task1():
  mutex1.acquire()
  print(f'{current_thread().name}抢到锁1')

  mutex2.acquire()
  print(f'{current_thread().name}抢到锁2')

  mutex2.release()
  mutex1.release()

  task2()


def task2():
  mutex2.acquire()
  print(f'{current_thread().name}抢到锁2')

  time.sleep(1)

  mutex1.acquire()
  print(f'{current_thread().name}抢到锁1')

  mutex1.release()
  mutex2.release()


if __name__ == '__main__':
  for i in range(8):
    t = Thread(target=task1)
    t.start()

"""
Thread-1抢到锁1
Thread-1抢到锁2
Thread-1抢到锁2
Thread-2抢到锁1

分析：
进程1:
  先执行 task1:
    抢到锁1
    然后抢到锁2
    随后释放锁1
    释放锁2
  后执行 task2:
    抢到锁2
    休息1s，进程2执行
    锁1未被进程2释放，阻塞

进程2:
  先执行 task1:
    抢到锁1
    锁2未被进程1释放，阻塞
"""
```

### 递归锁

递归锁就是一个人重复的抢锁和释放锁。其内部有一个计数器，每 `acquire` 一次，计数器次数就加一，每 `release` 一次，计数器次数就减一。只要计数器不为 `0`，别人就不能抢这把锁。

```python
from threading import Thread, RLock, current_thread
import time

mutex1 = RLock()
mutex2 = mutex1


def task1():
    mutex1.acquire()
    print(f'{current_thread().name}抢到锁1')
    mutex2.acquire()
    print(f'{current_thread().name}抢到锁2')
    mutex2.release()
    mutex1.release()
    task2()


def task2():
    mutex2.acquire()
    print(f'{current_thread().name}抢到锁2')
    time.sleep(1)
    mutex1.acquire()
    print(f'{current_thread().name}抢到锁1')
    mutex1.release()
    mutex2.release()


if __name__ == '__main__':
    for i in range(3):
        t = Thread(target=task1)
        t.start()

"""
Thread-1抢到锁1
Thread-1抢到锁2
Thread-1抢到锁2
Thread-1抢到锁1
Thread-3抢到锁1
Thread-3抢到锁2
Thread-3抢到锁2
Thread-3抢到锁1
Thread-2抢到锁1
Thread-2抢到锁2
Thread-2抢到锁2
Thread-2抢到锁1

分析：
进程1:
  task1:
    mutex1.acquire() --- 1
    mutex2.acquire() --- 2
    mutex2.release() --- 1
    mutex1.release() --- 0
  task2:
    mutex2.acquire() --- 1
    sleep 并不会释放锁，因为计数不为 0
    mutex1.acquire() --- 2
    mutex1.release() --- 1
    mutex2.release() --- 0
其他进程同理
"""
```

### 信号量

信号量在不同阶段，可能对应不同的技术点，对于并发编程来讲，它指的是锁。

它可以用来控制同时访问特定资源的进程数量，通常用于某些资源有明确访问限制的场景，简单来说就是限流。

```python
from threading import Thread, Semaphore
import time

# 限制最多 5 个同时访问
sp = Semaphore(5)


def task(name):
    sp.acquire()
    print(f'{name}抢到车位')
    time.sleep(3)
    sp.release()


if __name__ == '__main__':
    for i in range(1, 11):
        t = Thread(target=task, args=(f'奔驰{i}',))
        t.start()

"""
奔驰1抢到车位
奔驰2抢到车位
奔驰3抢到车位
奔驰4抢到车位
奔驰5抢到车位

--- 等待 3 秒 ---

奔驰6抢到车位
奔驰9抢到车位
奔驰8抢到车位
奔驰10抢到车位
奔驰7抢到车位
"""
```

### Event 事件

- `set`：发射信号，让 `wait` 后面的代码能执行
- `wait`：等待信号

```python
from threading import Thread, Event
import time

event = Event()


def bus():
    print('公交车即将到站')
    time.sleep(3)
    print('公交车到站了')
    # 发射信号，event.wait() 后面的代码能执行了
    event.set()


def person(name):
    print(f'{name}正在等车')
    # 等待信号
    event.wait()
    print(f'{name}上车出发')


if __name__ == '__main__':
    t = Thread(target=bus)
    t.start()

    for i in range(3):
        t = Thread(target=person, args=(f'乘客{i}',))
        t.start()

"""
公交车即将到站
乘客0正在等车
乘客1正在等车
乘客2正在等车
公交车到站了
乘客0上车出发
乘客2上车出发
乘客1上车出发
"""
```

### 队列

#### 先进先出 Queue

```python
import queue

q = queue.Queue()

q.put('a')
q.get()
q.put_nowait()
q.get_nowait()
q.full()
q.empty()
```

#### 后进先出 Queue

```python
import queue

q = queue.LifoQueue()

q.put('a')
q.put('b')
q.put('c')

print(q.get())  # c
print(q.get())  # b
print(q.get())  # a
```

#### 优先级 Queue

最小优先，数字越小，优先级越高

```python
import queue

q = queue.PriorityQueue()

q.put((34, 'a'))
q.put((45, 'b'))
q.put((15, 'c'))
q.put((-1, 'd'))

print(q.get())  # (-1, 'd')
print(q.get())  # (15, 'c')
print(q.get())  # (34, 'a')
print(q.get())  # (45, 'b')
```