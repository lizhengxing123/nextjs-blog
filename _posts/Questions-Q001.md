---
title: '出现奇数次的数字'
excerpt: '出现奇数次的数字'
coverImage: '/assets/blog/webpack/webpack.png'
date: '2023-01-04 20:07:32'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/webpack/webpack.png'
type: 'Webpack'
---

### 只出现奇数次的一个数字

[题目](https://leetcode.cn/problems/single-number/)

直接使用异或位运算解决

```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        x: int = 0
        for num in nums:
            x = x ^ num

        return x
```

### 只出现奇数次的两个数字

[视频 1:00:00](https://www.bilibili.com/video/BV13g41157hK/?p=3&spm_id_from=pageDriver&vd_source=97e4871747b6e43793eaa0ddb1bb5191)

```python
"""
两个数字不相等，那么异或之后的结果必不为 0
那么
"""
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        eor: int = 0
        for num in nums:
            eor = eor ^ num
        # 由于出现了两个不同的数字，eor肯定不为0
        # 那么 eor 二进制有一位上肯定是 1
        # 我们需要查找出 eor 最右边的一位 1
        right_one: int = eor ^ (~eor + 1)
        """
        eor        1 0 1 0 1 1 1 0 1 0
        ~eor       0 1 0 1 0 0 0 1 0 1
        ~eor+1     0 1 0 1 0 0 0 1 1 0
        eor^eor+1  0 0 0 0 0 0 0 0 1 0
        """
        # 两个出现奇数次的不同的数字记为 a b
        # a 和 b 有一位上一个为 0 一个为 1
        # right_one 表示的就是 a b 其中最右边不同的一位
        # 这样就可以把列表分为两部分，a b 各占一部分，
        # 其中一部分是最右边一位为 1 的，另外一部分是 0 的

        # 声明一个变量，继续循环异或
        tem: int = 0
        for num in nums:
            # 使用 & 可以选出最右边一位是 0 的数
            # 也可以是 != 0 ，可以选出最右边一位是 1 的数
            if num & right_one == 0:
                # 说明 num 在最右边位上是 0
                # 继续异或我们就可以找到其中一个出现奇数次的数
                # 这个数在最右一位上是 0
                tem = tem ^ num

        # 另外一个出现奇数次的数就是
        print("两个数分别为：", tem, eor ^ tem)
```

