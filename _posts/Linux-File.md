---
title: 'Linux 文件系统'
excerpt: 'Linux 文件系统'
coverImage: '/assets/blog/linux/linux.jpg'
date: '2023-07-12 10:43:09'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/linux/linux.jpg'
type: 'Linux'
---

## Linux 文件系统

### 文件和路径

#### 1、命名规则

文件名的最大长度与文件系统类型有关，一般情况下，文件名不应该超过 255 个字符，尽量使用英文大小写字母、数字下划线和点这些符号，应尽量避免使用空格。

#### 2、扩展名

在 `Linux` 系统下文件的扩展名是可选的，使用文件扩展名有助于对文件内容的理解。


#### 3、隐藏文件

以点开头的文件在 `Linux` 系统中都是隐藏文件


### 目录结构

- `/bin`：基本命令的二进制文件
- `/boot`：引导加载程序的静态文件
- `/dev`：设备文件
- `/etc`：配置文件
- `/home`：普通用户主目录的父目录
- `/lib`：共享库文件
- `/lib64`：共享 64 位库文件
- `/lost+found`：存放未链接文件
- `/media`：自动识别设备的挂载目录
- `/mnt`：临时挂载文件系统的挂载点
- `/opt`：可选插件软件包安装位置
- `/proc`：内核和进程信息
- `/root`：超级管理员用户主目录
- `/run`：存放系统运行时需要的东西
- `/sbin`：超级用户的二进制文件
- `/sys`：设备的伪文件系统
- `/tmp`：临时文件夹
- `/usr`：用户应用目录
- `/var`：变量数据目录

### 访问权限

![文件访问权限](/assets/blog/linux/file-mode.png)

> r -> 4
>
> w -> 2
>
> x -> 1

#### 1、改变文件模式比特

- `chmod`:
  - `u` 表示所有者
  - `g` 表示同组用户
  - `o` 表示其他用户
  - `a` 表示所有用户
  - `+` 表示增加权限
  - `-` 表示减少权限

```shell
# 字符设定法
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls -l sohu.html
-rw-r--r-- 2 root root 222639 7月  10 20:44 sohu.html

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# chmod a+w sohu.html

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls -l sohu.html
-rw-rw-rw- 2 root root 222639 7月  10 20:44 sohu.html


# 数字设定法
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# chmod 644 sohu.html

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls -l sohu.html
-rw-r--r-- 2 root root 222639 7月  10 20:44 sohu.html
```

#### 2、改变文件所有者

- `chown`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls -l a.txt
-rw-r--r-- 1 root root 120 7月  11 14:40 a.txt

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# chown lzx a.txt

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls -l a.txt
-rw-r--r-- 1 lzx root 120 7月  11 14:40 a.txt
```

#### 3、改变用户组

- `chgrp`


### 磁盘管理

#### 1、列出文件系统的磁盘使用情况

- `df`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# df -h
文件系统          容量   已用  可用  已用% 挂载点
devtmpfs        842M     0  842M    0% /dev
tmpfs           860M     0  860M    0% /dev/shm
tmpfs           860M  468K  859M    1% /run
tmpfs           860M     0  860M    0% /sys/fs/cgroup
/dev/vda3        40G  4.4G   36G   11% /
/dev/vda2       191M  7.3M  184M    4% /boot/efi
tmpfs           172M     0  172M    0% /run/user/0
```

#### 2、磁盘分区表操作

- `fdisk`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# fdisk -l
Disk /dev/vda：40 GiB，42949672960 字节，83886080 个扇区
单元：扇区 / 1 * 512 = 512 字节
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
磁盘标签类型：gpt
磁盘标识符：631457A9-BC62-48D0-A53A-10C67EEC6963

设备          起点      末尾     扇区   大小  类型
/dev/vda1    2048     4095     2048    1M BIOS 启动
/dev/vda2    4096   395263   391168  191M EFI 系统
/dev/vda3  395264 83886046 83490783 39.8G Linux 文件系统
```

#### 3、磁盘分区工具

- `parted`

#### 4、格式化文件系统

- `mkfs`
  - `-t`：指定文件系统的类型
  - `-c`：创建文件系统时检查磁盘损坏情况
  - `-v`：显示详细信息

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# mkfs -t ext4 -v /dev/sdb
```

#### 5、文件系统检查

- `fsck`

#### 6、转换或拷贝文件

- `dd`

#### 7、挂载/卸载

- `mount/unmount`

#### 8、创建/关闭/激活交换分区

- `mkswap/swapoff/swapon`

- `fsck`