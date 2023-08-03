---
title: 'Linux 用户管理'
excerpt: 'Linux 用户管理'
coverImage: '/assets/blog/linux/linux.jpg'
date: '2023-07-11 14:51:29'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/linux/linux.jpg'
type: 'Linux'
---

## Linux 用户管理

#### 1、创建和删除用户

- `useradd`：创建用户
  - `-d`：为用户指定主目录
  - `-g`：为用户指定用户组
- `userdel`：删除用户

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# useradd lzx
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# userdel lzx
```

#### 2、创建和删除用户组

- `groupadd`：创建用户组
- `groupdel`：删除用户组

#### 3、修改密码

- `passwd`：如果没有指定命令作用的对象，则表示要修改当前用户的密码
  - `-l`：锁定用户
  - `-u`：解锁用户
  - `-d`：清除用户密码
  - `-e`：设置密码立即过期，用户登录时会强制要求修改密码
  - `-i`：设置密码过期多少天后禁用该用户
- `chpasswd`：批量修改用户密码

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# passwd lzx
更改用户 lzx 的密码 。
新的 密码：
重新输入新的 密码：
passwd：所有的身份验证令牌已经成功更新。
```

#### 4、查看和修改密码有效期

- `chage`

```shell
# 设置 lzx 用户 100 天后必须修改密码，过期前 15 天通知该用户，过期后 7 天仅用改用户
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# chage -M 100 -W 15 -I 7 lzx
```

#### 5、切换用户

- `su`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# su lzx
[lzx@iZbp1cc6j8ewx7239u7o6rZ root]$
```
#### 6、编辑 sudoers 文件

- `visudo`

> 如果用户要以管理员身份执行命令，用户必须出现在 `sudoers` 名单中，
> 直接编辑该文件需要使用 `visudo` 这条命令


#### 7、以管理员身份执行命令

- `sudo`

```shell
[lzx@iZbp1cc6j8ewx7239u7o6rZ root]$ ls /root
ls: 无法打开目录'/root': 权限不够
[lzx@iZbp1cc6j8ewx7239u7o6rZ root]$ sudo ls /root
```

#### 8、显示用户和用户组信息

- `id`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# id
uid=0(root) gid=0(root) 组=0(root)
```

#### 9、给其他用户发送消息

- `write`、`wall`

#### 10、查看/设置是否接收其他用户发送的消息

- `mesg`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# mesg
是 y

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# mesg n
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# mesg
是 n

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# mesg y
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# mesg
是 y
```