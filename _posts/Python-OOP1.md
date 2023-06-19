---
title: '面向对象'
excerpt: '面向对象'
coverImage: '/assets/blog/python/oop.jpeg'
date: '2023-06-15 15:56:05'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/oop.jpeg'
type: 'Python'
---

## 面向对象

对象就是容器，是用来存放数据和功能的集合体

### 类

类也是容器，里面存的是对象共有的一些数据和功能

> 类的子代码在定义阶段就会运行，生成名称空间

```python
class Hero:
    count = 0

    def __init__(self, name, speed):
        self.name = name
        self.speed = speed
        Hero.count += 1
    
    def get_hero_info(self):
        print(f'姓名：{self.name}')

    def set_hero_speed(self, new_speed):
        self.speed += new_speed
```

访问类的属性

```python
print(Hero.count) # 0
```

建立类与对象之间的关联关系

> 类加 `()` 调用并不会触发类的子代码运行，因为其在定义阶段就已经运行了
> 类加 `()` 调用本质上是调用类里面的 `__init__` 方法来初始化对象

```python
hero_obj = Hero('李白', 300)

print(Hero.count) # 1

print(hero_obj.__dict__, type(hero_obj))
# {'name': '李白', 'speed': 300} <class '__main__.Hero'>
```

访问对象的属性和方法

```python
hero_obj.get_hero_info()
# 姓名：李白

hero_obj.set_hero_speed(30)
print(hero_obj.speed)  # 330
```

给对象添加新的属性

> 和类属性同名并不会覆盖类的属性

```python
hero_obj.work = '刺客'
hero_obj.count = 23

print(hero_obj.__dict__, Hero.count)
# {'name': '李白', 'speed': 330, 'work': '刺客', 'count': 23} 1
```