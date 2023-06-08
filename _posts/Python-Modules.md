---
title: '模块'
excerpt: '模块'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-08 15:12:26'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 模块

编写模块有很多方式，最简单的一种便是创建一个包含变量和函数的 `python` 文件

另一种方法就是使用撰写 `python` 解释器本身的本地语言来编写模块，比如使用 `c` 语言来撰写 `python` 模块，并且在编译后，可以通过标准 `python` 解释器在我们的 `python` 代码中使用

一个模块可以被其他程序导入并使用其中的功能

```python
import sys

print(sys.argv) # 命令行参数
print(sys.path) # 路径列表
```

`sys` 是一个内置(`built-in`)模块，因此 `python` 知道应该在哪里能找到它。

如果它不是一个已编译好的模块，那么 `python` 解释器将从它的 `sys.path` 变量所提供的目录中搜索。如果找到了对应模块，则该模块中的语句将在开始时运行，并能使用其中的功能。需要注意的是，初始化工作只需在我们第一次导入时完成。


### 导入模块

- 从模块中导入单个功能 `form ... import ...`
- 导入整个模块 `import ...`
- 给模块/功能重命名 `... as ...`

```python
# 导入整个 sys 模块并重命名 system
import math as m

print(m.sqrt(16)) # 4.0

# 单个导入 sqrt
from math import sqrt
print(sqrt(16)) # 4.0

# 单个全部导入
from math import *
print(sqrt(16))
```

### 模块的 __name__

每个模块都有一个名称，而模块中的语句可以找到它们所处的模块的名称。

我们可以通过 `__name__` 来判断模块是独立运行的（`__main__`） 还是被导入的（`模块名`）

```python
if __name__ == '__main__':
  print('模块自己运行')
else:
  print('模块被导入')
```

### 编写自己的模块

每个 `python` 文件就是一个模块

```python
# module.py

#  __all__：控制使用 * 导入的名称
#  如果不指定 __age__，那么使用 * 导入的时候不会导入以下划线开头的变量
# __all__ = ['func1', '__age__']

name = 'lzx'

__age__ = 34

def func1():
    print('func1')


def func2():
    print('func2')


"""
__name__：
1、当作模块导入时，值为 module
2、当作文件运行时，值为 __main__
"""
print('__name__', __name__)

if __name__ == '__main__':
    func2()
    func1()
```

- `import module`

```python
import module

module.func1() # func1
module.func2() # func2
print(module.__age__) # 34
print(module.name) # lzx
```

- `from module import func1, func2, __age__, name`

```python
from module import func1, func2, __age__, name

func1() # func1
func2() # func2
print(__age__) # 34
print(name) # lzx
```

- `from module import *`

```python
from module import func1, func2, __age__, name

func1() # func1
func2() # func2
print(name) # lzx

# print(__age__) # 不能导入下划线开头的变量
# 可以使用 __all__ 指定使用 * 导入的标识符
```

> **python 之禅**
>
> “明了胜过晦涩”，我们应该尽量避免使用 `import *`

### dir 函数

返回由对象定义的名称列表。

如果提供参数，并且参数是一个模块，那么会返回模块的名称列表，如果没指定参数，则返回当前模块的参数列表

```python
import module

print(dir()) 
# ['__builtins__', '__doc__', ... , '__name__', 'module']

print(dir(module))
# ['__age__', ..., 'func1', 'func2', 'name'] 
```

### 包

必须遵守用以组织程序的层次结构。变量通常位于函数内部，函数和全局变量通常位于模块内部。

包是指一个包含模块与一个特殊的 `__init__.py`，后者向 `python` 表明这一文件夹是特别的，其中包含了 `python` 模块

一个 `world` 的包，其中还包含着 `asia`、`africa` 等其它子包，同时这些子包都包含了诸如 `india`、 `madagascar` 等模块

```python
- <some folder present in the sys.path>/
    - world/
        - __init__.py
        - asia/
            - __init__.py
            - india/
                - __init__.py
                - foo.py
        - africa/
            - __init__.py
            - madagascar/
                - __init__.py
                - bar.py
```

> 如同函数是程序中的可重用部分那般，模块是可重用的程序，包是用以组织模块的另一种层次结构