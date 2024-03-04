---
title: 'Linux 基础'
excerpt: 'Linux 基础'
coverImage: '/assets/blog/linux/linux.jpg'
date: '2023-07-10 10:44:46'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/linux/linux.jpg'
type: 'Linux'
---

## Linux 基础

### 概述

`Linux` 是一个通用操作系统。一个操作系统要负责任务调度、内存分配、处理外围设备I/O等操作。操作系统通常由内核（运行其他程序，管理磁盘、打印机等硬件设备的核心程序）和系统程序（设备驱动、底层库、`shell`、服务程序等）两部分组成。

### 优点

- 1、通用操作系统，不跟特定的硬件绑定
- 2、用 `C` 语言编写，可移植性强，有内核编程接口
- 3、支持多用户和多任务，支持安全的分层文件系统
- 4、大量的实用程序，完善的网络功能以及强大的支持文档
- 5、可靠的安全性和良好的稳定性，对开发者更友好

### 发行版本

- [Redhat](https://www.redhat.com/en)
- [Ubuntu](https://www.ubuntu.com/)
- [CentOS](https://www.centos.org/)
- [Fedora](https://getfedora.org/)
- [Debian](https://www.debian.org/)
- [openSUSE](https://www.opensuse.org/)

### 基础命令

`Linux` 系统的命令通常都是如下所示的格式

```shell
命令名称 [命令参数] [命令对象]
```

#### 1、获取登录信息 

- `w`：详细查询已登录当前计算机的用户

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# w
 11:07:05 up 2 days, 20:52,  2 users,  load average: 0.13, 0.21, 0.21
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    125.75.72.148    10:42   24:15   0.01s  0.01s -bash
root     pts/1    125.75.72.148    11:07    0.00s  0.02s  0.00s w
```

- `pkill -kill -t [TTY]`：强制退出活动用户

```shell
pkill -kill -t pts/1
```

- `who`：显示已登录当前计算机用户的简单信息

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# who
root     pts/0        2023-07-10 10:42 (125.75.72.148)
root     pts/1        2023-07-10 11:07 (125.75.72.148)
```

- `who am i`、`who mom likes`

显示当前登录用户

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# who am i
root     pts/2        2023-07-10 11:14 (125.75.72.148)

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# who mom likes
root     pts/2        2023-07-10 11:14 (125.75.72.148)
```

- `last`、`lastb` 

显示最近登录的用户列表

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# last
root     pts/2        125.75.72.148    Mon Jul 10 11:14   still logged in
root     pts/1        125.75.72.148    Mon Jul 10 11:07 - 11:18  (00:11)
root     pts/0        125.75.72.148    Mon Jul 10 10:42 - 11:18  (00:35)
root     pts/0        125.75.73.102    Fri Jul  7 14:16 - 14:16  (00:00)
root     pts/0        125.75.73.102    Fri Jul  7 14:15 - 14:16  (00:00)
reboot   system boot  4.18.0-305.3.1.e Fri Jul  7 22:15   still running
reboot   system boot  4.18.0-305.3.1.e Fri Jul  7 20:01 - 14:14  (-5:46)
reboot   system boot  4.18.0-305.3.1.e Fri Jul  7 19:51 - 12:01  (-7:50)
reboot   system boot  4.18.0-305.3.1.e Fri Jul  7 19:37 - 11:50  (-7:46)

wtmp begins Wed Jun 29 08:23:38 2022
```

#### 2、查看自己使用的 `shell`

`shell` 也被称为“壳”或“壳程序”，它是用户与操作系统内核交流的翻译官，简单来说就是人与计算机交互的界面和接口。

目前默认的 `shell` 是 `bash`

- `ps`：查看自己使用的 `shell`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ps
    PID TTY          TIME CMD
3906925 pts/0    00:00:00 bash
3907432 pts/0    00:00:00 ps
```

#### 3、查看命令的说明和位置

> 使用的时候如果出现 `没有 appropriate`，则表示需要安装数据库
>
> [阿里云服务器安装数据库](https://help.aliyun.com/document_detail/188447.html?spm=a2c4g.178136.0.0)

- `whatis`：用于查询一个命令执行什么功能，并将查询结果打印到终端上

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# whatis ps
ps (1)               - report a snapshot of the current processes. # 报告当前进程的快照。
ps (1p)              - report process status                       # 报告进程状态
```

- `whereis`：用于查询一个命令的二进制、源代码和手册页

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# whereis ps
ps: /usr/bin/ps /usr/share/man/man1/ps.1.gz /usr/share/man/man1p/ps.1p.gz
```

- `which`：用于定位系统中可执行文件非常小且简单的命令

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# which ps
/usr/bin/ps
```

#### 4、清除屏幕上显示的内容

- `clear`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# clear
```

#### 5、查看帮助文档

- `--help`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ps --help

Usage:
 ps [options]

 Try 'ps --help <simple|list|output|threads|misc|all>'
  or 'ps --help <s|l|o|t|m|a>'
 for additional help text.

For more details see ps(1).
```

- `man`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# man ps
PS(1)               User Commands                   PS(1)

NAME
       ps - report a snapshot of the current processes.

SYNOPSIS
       ps [options]

DESCRIPTION
       ps displays.....
```

> `回车`跳转下一行
> 
> `f`或`空格`跳转下一页
>
> `b`跳转上一页
>
> `/单词`查询单词
>
> `q`退出

- `info`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# info ps
PS(1)               User Commands                   PS(1)

NAME
       ps - report a snapshot of the current processes.

SYNOPSIS
       ps [options]

DESCRIPTION
       ps displays.....
```

- `apropos`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# apropos ps
accessdb (8)         - dumps the content of a man-db database in a human readable format
appstream-compose (1) - Generate AppStream metadata
appstream-util (1)   - Manipulate AppStream, AppData and MetaInfo metadata
...
```

#### 6、查看系统和主机名

- `uname`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# uname
Linux
```

- `hostname`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# hostname
iZbp1cc6j8ewx7239u7o6rZ
```

- `cat`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cat /etc/centos-release
CentOS Linux release 8.4.2105
```

#### 7、时间和日期

- `date`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# date
2023年 07月 10日 星期一 14:49:50 CST
```

- `cal`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cal
      七月 2023
 日 一 二  三 四 五 六
                   1
 2  3  4  5  6  7  8
 9 10 11 12 13 14 15
16 17 18 19 20 21 22
23 24 25 26 27 28 29
30 31

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cal 7 2022
      七月 2022
 日 一 二  三 四 五 六
                1  2
 3  4  5  6  7  8  9
10 11 12 13 14 15 16
17 18 19 20 21 22 23
24 25 26 27 28 29 30
31
```

#### 8、重启和关机

- `reboot`：重启
- `shutdown`：关机
- `shutdown -h now`：立刻关机
  
#### 9、退出登录

- `exit/logout`

#### 10、查看历史命令

- `history`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# history
    1  q
    2  exit
    3  quit
   ......
   26  w
   27  who mom likes
   ......
   31  history
```

- `!历史命令编号`：重新执行该命令

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# !26
w
 15:03:35 up 3 days, 48 min,  2 users,  load average: 0.55, 0.30, 0.21
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    125.75.72.148    14:34   11:09   0.02s  0.02s -bash
root     pts/1    125.75.72.148    15:02    2.00s  0.02s  0.00s w
```

- `history -c`：清除历史命令

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# history -c
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# history
    1  history
```