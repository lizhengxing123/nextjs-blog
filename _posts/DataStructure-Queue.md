---
title: '队列'
excerpt: '队列'
coverImage: '/assets/blog/data-structure/queue.jpeg'
date: '2023-08-03 15:16:13'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/data-structure/queue.jpeg'
type: 'DataStructure'
---

## 队列

### 定义

队列是一种先进先出（First In First Out）的数据结构。其新数据的添加发生在尾端，现存数据的移除发生在首端。

### 抽象数据类型 Queue

#### 操作

- `Queue()`：创建空队列
- `enqueue(item)`：入队
- `dequeue()`：出队
- `is_empty()`：是否为空队列
- `size()`：返回队列大小

#### 代码实现

```python
class Queue:
    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)

    def enqueue(self, item):
        self.items.insert(0, item)

    def dequeue(self):
        return self.items.pop()
```

### 应用

#### 热土豆

参与游戏的人名列表，传土豆的次数，返回最后剩下的人名

队首始终是持有热土豆的人，游戏开始时，只需要让队首的人出队，再到队尾入队，算是土豆的一次传递。传递了num次后，将队首的人出队，不再入队。如此反复，直至队列中剩余一人。

- 代码实现

```python
def hot_potato(name_list, num):
    # 空队列，保存人名
    queue = []
    # 让所有人入队
    for name in name_list:
        queue.insert(0, name)

    # 开始传递
    while len(queue) > 1:
        # 传递 num 次
        for _ in range(num):
            # 队首的人出队再入队
            queue.insert(0, queue.pop())

        # 传递了num次后，队首的人出队，不再入队
        queue.pop()

    # 返回队里的人
    return queue.pop()
```

#### 打印任务

多人共享一台打印机，采取”先到先服务“的队列策略来执行打印任务。

- 问题建模

有三个对象，分别为：

1、打印任务：提交时间、打印页数

2、打印队列：具有 `FIFO` 性质的打印任务队列

3、打印机：打印速度、是否忙


过程：

1、生成和提交打印任务

> 确定生成概率：实例为每小时会有 10 个学生提交 20 个作业，计算得出每 180 秒会有 1 个作业生成并提交，概率为`每秒1/180`
> 
> 确定打印页数：实例是 1～20 页，那么就是 1～20 页之间的概率相同

2、实施打印

> 当前的打印作业：正在打印的作业
>
> 打印结束倒计时：新作业开始打印时开始倒计时，到0表示打印完毕，可以处理下一个任务


模拟时间：

1、统一的时间框架：以秒均匀流逝的时间，设定结束时间

2、同步所有过程：在 `一个时间单位` 里，对 `生成打印任务` 和 `实施打印` 两个过程各处理一次


- 模拟流程

1、创建打印队列对象

2、时间按照秒的单位流逝

> 按照概率生成打印任务，加入打印队列
>
> 如果打印机空闲，且队列不空，则取出队首作业打印，并记录此作业等待时间
>
> 如果打印机忙，则按照打印速度进行1秒打印
>
> 如果打印任务完成，则打印机进入空闲

3、时间用尽，开始统计平均等待时间


- 时间

作业的等待时间：

> 生成作业时，记录生成的时间戳
>
> 开始打印时，当前时间减去生成时间即可

作业的打印时间：

> 生成作业时，记录生成的时间戳
>
> 开始打印时，页数除以打印速度即可


- 代码实现

```python
import random


class Printer:
    """打印机类"""

    def __init__(self, ppm):
        """初始化
        ppm 打印速度，每分钟打印多少页
        """
        self.page_rate = ppm  # 打印速度
        self.current_task = None  # 当前打印任务
        self.time_remaining = 0  # 任务倒计时

    def tick(self):
        """打印一秒
        如果当前打印任务不为空，则任务倒计时减 1
        当任务倒计时为 0，则将当前打印任务置为空
        """
        if self.current_task is not None:
            self.time_remaining -= 1
            if self.time_remaining <= 0:
                self.current_task = None

    def busy(self):
        """判断打印机是否忙（是否在工作）
        直接判断当前打印任务是否存在
        """
        return self.current_task is not None

    def start_next(self, new_task):
        """打印新任务
        new_task 新任务
        任务倒计时就是 当前任务的打印页数 乘以 每秒的打印速度
        """
        self.current_task = new_task
        self.time_remaining = new_task.get_pages() / (self.page_rate / 60)


class Task:
    """打印任务类"""

    def __init__(self, time):
        """初始化
        time 任务的生成时间
        """
        self.timestamp = time
        self.pages = random.randint(1, 20)

    def get_stamp(self):
        """获取生成时间"""
        return self.timestamp

    def get_pages(self):
        """获取打印页数"""
        return self.pages

    def wait_time(self, current_time):
        """等待时间
        current_time 当前时间
        """
        return current_time - self.timestamp


def new_print_task():
    """生成新的打印任务
    概率为每秒 1/180
    """
    return random.randint(1, 180) == 180


def simulation(num_seconds, pages_per_minute):
    """模拟
    num_seconds 多长时间，多少秒
    pages_per_minute 每分钟打印的页数
    """
    lab_printer = Printer(pages_per_minute)  # 打印机对象
    print_queue = []  # 打印任务队列
    waiting_times = []  # 等待时间列表

    # ************ 主体部分---时间流逝 ************
    for current_second in range(num_seconds):
        if new_print_task():
            # 如果能生成新的任务
            # 实例化任务
            task = Task(current_second)
            # 加入打印任务队列
            print_queue.insert(0, task)

        if (not lab_printer.busy()) and (len(print_queue) > 0):
            # 如果打印机不忙，并且打印任务队列不为空
            # 取出队首任务
            next_task = print_queue.pop()
            # 将当前任务等待时间加入等待时间列表
            waiting_times.append(next_task.wait_time(current_second))
            # 打印机开始打印新任务
            lab_printer.start_next(next_task)

        # 打印机打印一秒
        lab_printer.tick()

    # *******************************************

    average_wait = sum(waiting_times) / len(waiting_times)  # 统计平均等待时间

    print(f'处理了{len(waiting_times)}个任务，平均等待{average_wait}秒，剩余{len(print_queue)}个任务还在等待')


if __name__ == '__main__':
    for i in range(10):
        simulation(3600, 5)

    for i in range(10):
        simulation(3600, 10)
```