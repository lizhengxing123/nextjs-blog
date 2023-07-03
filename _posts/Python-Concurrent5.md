---
title: 'asyncio'
excerpt: 'asyncio'
coverImage: '/assets/blog/python/concurrent.jpg'
date: '2023-06-28 11:35:42'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/concurrent.jpg'
type: 'Python'
---

## asyncio

```python
import asyncio
from threading import Thread, current_thread


async def f1():
  print("f1 start", current_thread().name)
  await asyncio.sleep(1)
  print("f1 end", current_thread().name)


async def f2():
  print("f2 start", current_thread().name)
  await asyncio.sleep(1)
  print("f2 end", current_thread().name)


tasks = [f1(), f2()]
asyncio.run(asyncio.wait(tasks))

"""
f1 start MainThread
f2 start MainThread

--- 1s ---

f1 end MainThread
f2 end MainThread
"""
```

`await` 后面只能跟一种对象，那就是可等待对象，包括协程对象、`task` 对象和 `future` 对象

阻塞操作必须替换成相应的异步库提供的函数：

- `time.sleep()` --> `asyncio.sleep()`
- `sever.accept()` --> `loop.sock_accept()`
- `conn.recv()` --> `loop.sock_recv()`

第三方异步库：`aiohttp` 、 `aiomysql` ...

### 协程对象

- 协程函数：定义形式为 `async def` 的函数
- 协程对象：调用协程函数所返回的对象

```python
async def recv(name):
  print("开始 IO")
  await asyncio.sleep(1)
  print("结束 IO")

  return f'{name}-hello'


async def f1():
  print("f1 start", current_thread().name)

  data = await recv('f1')
  print('f1', data)

  print("f1 end", current_thread().name)


async def f2():
  print("f2 start", current_thread().name)

  data = await recv('f2')
  print('f2', data)
  
  print("f2 end", current_thread().name)


tasks = [f1(), f2()]
asyncio.run(asyncio.wait(tasks))

"""
f1 start MainThread
开始 IO
f2 start MainThread
开始 IO

--- 1s --

结束 IO
f1 f1-hello
f1 end MainThread
结束 IO
f2 f2-hello
f2 end MainThread
"""
```

### Task 对象

当一个协程调用 `asyncio.create_task()` 函数，就会返回 `Task` 对象

```python
async def nested(num):
  await asyncio.sleep(1)
  return num


async def f1(name):
  print(name, 'start')

  task = asyncio.create_task(nested(11))
  res = await task
  print(f'{name}结果', res)

  print(name, 'end')


async def f2(name):
  print(name, 'start')

  task = asyncio.create_task(nested(11))
  # 取消任务
  task.cancel()

  res = await task
  print(f'{name}结果', res)

  print(name, 'end')


task_list = [f1('任务1'), f1('任务2'), f2('任务3')]
asyncio.run(asyncio.wait(task_list))

"""
任务1 start
任务3 start
任务2 start

--- 1s ---

任务1结果 11
任务1 end
任务2结果 11
任务2 end
"""
```

通过 `name` 参数，可以给任务设置别名

```python
async def nested():
  await asyncio.sleep(1)
  return 32


async def main(name):
  print(name, 'start')

  task_list = [
    asyncio.create_task(nested(), name='task-a'),
    asyncio.create_task(nested(), name='task-b'),
  ]

  # done 是已经执行完的 Task 集合
  # pending 是还没有执行完的 Task 集合
  done, pending = asyncio.wait(task_list)

  for task in done:
    print(task.result(), task.get_name())


asyncio.run(main('任务'))

"""
任务 start

--- 1s ---

32 task-a
32 task-b
"""
```

上方代码也可以这样写

```python
async def nested():
  await asyncio.sleep(1)
  return 32


task_list = [
  nested(),
  nested(),
]


done, pending = asyncio.run(asyncio.wait(task_list))

for task in done:
  print(task.result(), task.get_name())

"""
42 Task-2
42 Task-3
"""
```

### Future 对象 

是一种特殊的低层级可等待对象，表示一个异步操作的最终结果，是 `Task` 的基类

```python
async def f1(future):
  await asyncio.sleep(2)
  future.set_result('abc')


async def main():
  loop = asyncio.get_event_loop()
  future = loop.create_future()
  loop.create_task(f1(future))

  res = await future()
  print(res)


asyncio.run(main()) # 2s 之后打印 abc
```

将本不支持异步的函数，丢给线程池来执行，以此来达到异步的效果

```python
def f1(x):
  time.sleep(2)
  return x


async def main():
  loop = asyncio.get_event_loop()
  future = loop.run_in_executor(None, f1, 'xxx')

  res = await future()
  print(res)


asyncio.run(main()) # 2s 之后打印 xxx
```

### 迭代器

需要实现 `__next__` 和 `__iter__`

```python
class MyRange:
  def __init__(self, start, end=None):
    if end is None:
      self.count = -1
      self.end = start
    
    else:
      self.count = start - 1
      self.end = end


  def add_count(self):
    self.count += 1

    if self.count == self.end:
      return None

    return self.count


  def __next__(self):
    val = self.add_count()

    if val is None:
      raise StopIteration

    return val


  def __iter__(self):
    return self

  
for i in MyRange(8, 10):
  print('i') # 8 9
```

### 异步迭代器

需要实现 `__anext__` 和 `__aiter__`

```python
class MyRange:
  def __init__(self, start, end=None):
    if end is None:
      self.count = -1
      self.end = start
    
    else:
      self.count = start - 1
      self.end = end


  async def add_count(self):
    await asyncio.sleep(1)
    
    self.count += 1

    if self.count == self.end:
      return None

    return self.count


  async def __anext__(self):
    val = await self.add_count()

    if val is None:
      raise StopAsyncIteration

    return val


  def __aiter__(self):
    return self


async def main():
  async for i in MyRange(3):
    print(i)


asyncio.run(main())

"""
--- 1s ---
0
--- 1s ---
1
--- 1s ---
2
"""
```

### 上下文管理器

`with` 语法使用，需要实现 `__enter__` 和 `__exit__`

```python
class Client:
  def __init__(self, ip, port):
    self.ip = ip
    self.port = port


  def __enter__(self):
    self.c = socket.socket()
    self.c.connect((self.ip, self.port))

    # 这是 as 后面的变量
    return self

  
  def __exit__(self, exc_type, exc_val, exc_tb):
    self.c.close()


  def send(self, data):
    self.c.send(data.encode('utf-8'))


  def recv(self, size=1024):
    data = self.c.recv(size)
    return data.decode('utf-8')


with Client('127.0.0.1', 8080) as c:
  while True:
    c.send('abc')
    print(c.recv())
    time.sleep(2)
```

### 异步上下文管理器

`async with` 语法使用，需要实现 `__aenter__` 和 `__aexit__`

```python
class Client:
  def __init__(self, ip, port):
    self.ip = ip
    self.port = port
    self.loop = asyncio.get_event_loop()


  async def __aenter__(self):
    self.c = socket.socket()

    # 异步连接服务端
    await self.loop.sock_connect(self.c, (self.ip, self.port))

    # 这是 as 后面的变量
    return self

  
  def __aexit__(self, exc_type, exc_val, exc_tb):
    self.c.close()


  async def send(self, data):
    await self.loop.sock_sendall(self.c, data.encode('utf-8'))


  async def recv(self, size=1024):
    data = await self.loop.sock_recv(self.c, 1024)
    return data.decode('utf-8')


async def main():
  async with Client('127.0.0.1', 9856) as c:
    while True:
      await c.send('abc')
      data = await c.recv()
      print(data)
      await asyncio.sleep(1)


asyncio.run(main())
```

### 异步服务端

```python
import socket
import asyncio


async def waiter(conn, loop):
    while True:
        try:
            data = await loop.sock_recv(conn, 1024)

            if not data:
                break

            await loop.sock_sendall(conn, data.upper())

        except ConnectionResetError:
            break

    conn.close()


async def main(ip, port):
    sever = socket.socket()

    sever.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sever.bind((ip, port))
    sever.listen(5)
    sever.setblocking(False)

    loop = asyncio.get_event_loop()

    while True:
        conn, addr = await loop.sock_accept(sever)

        # 创建 task 任务
        loop.create_task(waiter(conn, loop))


asyncio.run(main('127.0.0.1', 9856))
```

`uvloop` 性能更高

```python
import socket
import asyncio
import uvloop

# 给 asyncio 打补丁
asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())


async def waiter(conn, loop):
    while True:
        try:
            data = await loop.sock_recv(conn, 1024)

            if not data:
                break

            await loop.sock_sendall(conn, data.upper())

        except ConnectionResetError:
            break

    conn.close()


async def main(ip, port):
    sever = socket.socket()

    sever.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sever.bind((ip, port))
    sever.listen(5)
    sever.setblocking(False)

    loop = asyncio.get_event_loop()

    while True:
        conn, addr = await loop.sock_accept(sever)
        
        # 创建 task 任务
        loop.create_task(waiter(conn, loop))


asyncio.run(main('127.0.0.1', 9856))
```