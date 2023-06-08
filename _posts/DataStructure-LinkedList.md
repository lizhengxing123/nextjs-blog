---
title: '链表'
excerpt: '链表'
coverImage: '/assets/blog/data-structure/linked-list.jpeg'
date: '2023-02-15 14:30:45'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/data-structure/linked-list.jpeg'
type: 'DataStructure'
---

## 链表

[参考文章](https://github.com/trekhleb/javascript-algorithms/blob/master/src/data-structures/linked-list/README.zh-CN.md)

### 基本概念

链表是数据元素的线性集合，元素的线性顺序不是由它们在内存中的物理位置给出的。相反，每个元素指向下一个元素。它是由一组节点组成的数据结构，这些节点一起，表示序列。

在最简单的形式下，每个节点由数据和到序列中下一个节点的引用（链接）组成。这种结构允许在迭代期间有效的从序列中的任何位置插入或删除元素。

更复杂的变体添加额外的链接，允许有效的插入或删除任意元素的引用。

链表的一个缺点是访问时间是线性的，而且难以管道化。更快的访问（如随机访问），是不可行的。与链表相比，数组具有更好的缓存位置。

### 代码实现

```js

```