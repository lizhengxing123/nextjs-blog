---
title: '线性结构'
excerpt: '线性结构'
coverImage: '/assets/blog/algorithm/useful-information.jpg'
date: '2023-07-27 16:27:23'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/algorithm/useful-information.jpg'
type: 'UsefulInformation'
---

## 线性结构

### 定义

线性结构是一种有序数据项的集合，其中每个数据项都有 **唯一** 的前驱和后继

> 除了第一个没有前驱，最后一个没有后继

新的数据项加入到数据集中时，只会加入到原有某个数据项之前或之后

具有这种性质的数据集，就称为线性结构

### 分类

线性结构总有两端，可以是“左”、“右”和“前“、”后”端，也可以是“顶”、“底”和“上”、“下”端

不同线性结构的关键区别在于数据项增减的方式，比如有的结构只允许数据项从一端添加，而有的结构允许数据项从两端添加移除

线性结构可以分为 4 种简单但功能强大的数据结构

- 栈 Stack
- 队列 Queue
- 双端队列 Deque
- 列表 List

> 这四个数据集的共同点在于，数据项之间只存在先后的次序关系，都是线性结构

这些线性结构是应用最广泛的数据结构，它们出现在各种算法中，用来解决大量重大的问题，比如

- 操作系统中的进程队列
- 消息队列
- 编译系统中的调用栈