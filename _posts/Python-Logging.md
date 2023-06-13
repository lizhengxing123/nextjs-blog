---
title: '日志管理'
excerpt: '日志管理'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-13 17:03:25'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 日志管理

```python
import logging
```

### 日志基本配置

```python
"""
#   日志基本配置
logging.basicConfig(
    # 日志级别
    # DEBUG   INFO    WARNING    ERROR   CRITICAL
    # 10      20      30         40      50
    level=10,
    # 日志输出格式
    # asctime   name        pathname    lineno      levelname   message
    # 当前时间   当前日志名字   文件路径     哪一行       等级         消息
    format='%(asctime)s %(name)s [%(pathname)s line:%(lineno)d] %(levelname)s %(message)s',
    # asctime 时间格式
    datefmt='%Y-%m-%d %H:%M:%S',
    # 日志输出位置，不指定的话，默认打印到终端
    filename='user.log'
)
"""
```

### 日志配置字典

```python
LOGGING_DIC = {
    'version': 1.0,
    'disable_existing_loggers': False,
    # 日志格式
    'formatters': {
        'standard': {
            'format': '%(asctime)s %(threadName)s:%(thread)d [%(name)s] %(levelname)s [%(pathname)s line:%(lineno)d] %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
        'simple': {
            'format': '%(asctime)s [%(name)s] %(levelname)s %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
        'test': {
            'format': '%(asctime)s %(message)s'
        }
    },
    'filters': {},
    # 日志处理器
    'handlers': {
        'console_debug_handler': {
            'level': 'DEBUG',  # 日志处理的级别限制
            'class': 'logging.StreamHandler',  # 输出到终端
            'formatter': 'simple',  # 日志格式
        },
        # 日志轮转
        'file_info_handler': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',  # 保存到文件
            'filename': 'deal.log',
            'maxBytes': 1024 * 1024 * 10,  # 10M
            'backupCount': 10,  # 日志文件保存数量限制
            'encoding': 'utf-8',  # 日志文件的编码
            'formatter': 'standard'
        },
        'file_debug_handler': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',  # 保存到文件
            'filename': 'test.log',  # 日志存放路径
            'encoding': 'utf-8',  # 日志文件的编码
            'formatter': 'test'
        },
        'file_deal_handler': {
            'level': 'INFO',
            'class': 'logging.FileHandler',  # 保存到文件
            'filename': 'deal.log',  # 日志存放路径
            'encoding': 'utf-8',  # 日志文件的编码
            'formatter': 'standard'
        },
    },
    # 日志记录器
    'loggers': {
        'logger1': {
            'handlers': ['console_debug_handler'],  # 日志分配到哪个 handler
            'level': 'DEBUG',  # 日志记录的级别限制
            'propagate': False  # 默认为 True，向更高级别的 logger 传递
        },
        'logger2': {
            'handlers': ['console_debug_handler', 'file_debug_handler', 'file_deal_handler'],
            'level': 'INFO',
            'propagate': False
        },
        # 没有名字的话，getLogger 传递的名字就是 logger 的名字
        '': {
            'handlers': ['console_debug_handler', 'file_info_handler'],
            'level': 'INFO',
            'propagate': False
        },
    },
}

logging.config.dictConfig(LOGGING_DIC)
logger1 = logging.getLogger('用户操作')

logger1.info('xxx xx了 xxx')
```