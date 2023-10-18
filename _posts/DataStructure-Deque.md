---
title: '双端队列'
excerpt: '双端队列'
coverImage: '/assets/blog/data-structure/queue.jpeg'
date: '2023-08-17 16:22:17'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/data-structure/queue.jpeg'
type: 'DataStructure'
---

## 双端队列

### 定义

双端队列 `Deque` 也是一种有次序的数据集。

跟队列相似，其两端可以称作 “首” “尾” 端。在双端队列中数据项既可以从 “首” 端插入，也可以从 “尾” 端插入，同时也可以从两端移除。

从某种意义上来说，双端队列集成了栈和队列的功能。

### 抽象数据类型 Deque

#### 操作

- `Deque()`：创建一个空的双端队列
- `add_front(item)`：加入队首
- `add_rear(item)`：加入尾
- `remove_front()`：移除队首
- `remove_rear()`：移除队尾
- `is_empty()`：是否为空
- `size()`：元素个数

#### 代码实现

```python
class Deque:
    """双端队列"""

    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)

    def add_front(self, item):
        self.items.insert(0, item)

    def add_near(self, item):
        self.items.append(item)

    def remove_front(self):
        return self.items.pop(0)

    def remove_near(self):
        return self.items.pop()
```

### 应用

#### 回文词

一段话顺着读和反着读得到同样的结果

```python
def pal_checker(s):
    char_deque = []

    for char in s:
        char_deque.append(char)

    while len(char_deque) > 1:
        first = char_deque.pop(0)
        last = char_deque.pop()
        if first != last:
            return False

    return True
```