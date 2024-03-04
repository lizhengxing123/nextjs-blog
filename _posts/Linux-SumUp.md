---
title: 'Linux 常用命令总结'
excerpt: 'Linux 常用命令总结'
coverImage: '/assets/blog/linux/linux.jpg'
date: '2023-11-20 09:23:09'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/linux/linux.jpg'
type: 'Linux'
---

## Linux 常用命令总结

### 文件相关

#### 1、ls

- `-a`：显示所有目录和文件，包括隐藏文件
- `-l`：以列表的形式显示文件详细信息
- `-h`：配合 `-l` 更人性化的显示文件大小

```shell
ls -lha
```

通配符的使用，帮助我们快速定位到具体的文件

- `*`：匹配0个或多个字符
- `?`：匹配一个字符
- `[]`：匹配字符组中的任意一个，如`[acd]`、`[a-f]`

```shell
[root@192 home]# ls
111.txt  123.txt  211.txt  311.txt  b

# 以 1 开头的
[root@192 home]# ls 1*
111.txt  123.txt

# 文件名中含有2的
[root@192 home]# ls *2*
123.txt  211.txt

# 文件名第二个字符是2的
[root@192 home]# ls ?2*
123.txt
```

#### 2、cd

- `cd`：切换到当前用户主目录
- `cd ～`：切换到当前用户主目录
- `cd .`：保持当前目录不变
- `cd ..`：切换到上级目录
- `cd -`：切换到最近一次访问的目录下

#### 3、touch

如果文件不存在，创建新的空白文件

如果文件存在，修改文件的末次修改日期

#### 4、mkdir

- `-p`：递归的创建目录

```shell
[root@192 home]# mkdir -p a/b/c
```

#### 5、rm

使用这个命令删除的文件和目录不能恢复

- `-r`：递归的删除目录下的内容，删除文件夹时必须增加这个参数
- `-f`：强制删除，忽略不存在的文件，无需提示

```shell
# 慎用
rm -rf *
```

#### 6、tree

显示文件目录结构，如果未找到该命令，[解决办法](https://www.cnblogs.com/zqzhen/p/12706131.html)

- `-d`：只显示目录，不显示文件

```shell
# 显示当前文件夹的目录结构
tree

# 显示当前用户文件夹的目录结构
tree ~
```

#### 7、cp

拷贝文件或目录

- `-i`：覆盖文件前提示
- `-r`：递归复制一个目录

```shell
# 将其他目录下的文件复制到当前文件夹下，并保持文件名一致
cp ~/a/a.txt .
```

#### 8、mv

移动文件或目录，也可以给文件或目录重命名

- `-i`：覆盖文件前提示

```shell
# 移动文件
mv ~/a/a.txt ~

# 文件重命名
mv a.txt b.txt
```

#### 9、cat

查看文件内容，一次显示所有文件内容

- `-b`：对非空输出行编号
- `-n`：对所有输出行编号

#### 10、more

查看文件内容，分屏显示文件内容

> `回车`跳转下一行
> 
> `f`或`空格`跳转下一页
>
> `b`跳转上一页
>
> `/单词`查询单词
>
> `q`退出


#### 11、grep

- `-n`：显示匹配行及行号
- `-v`：显示不匹配文本的所有行，相当于取反
- `-i`：忽略大小写

```shell
grep -in "hello world" a.txt
```

- `^a`：行首，搜索以a开头的行
- `e$`：行尾，搜索以e结尾的行

```shell
grep -n ^a a.txt

grep -n e$ a.txt

# 相当于正则表达式
# 查找以a开头，bc结尾的行
grep -n "^a.*bc$" a.txt
```

#### 12、echo和重定向

配合 `>` 和 `>>` 使用

```shell
# 往 b.txt 写入 Hello World! 内容
# 如果 b.txt 不存在则会创建文件
# 如果 b.txt 存在内容则会覆盖
echo Hello World! > b.txt

# 往 b.txt 追加 Hello World! 内容
# 如果 b.txt 不存在则会创建文件
# 如果 b.txt 存在内容则会被追加到最后
echo Hello World! >> b.txt
```

#### 13、管道

可以将一个命令的输出通过管道作为另一个命令的输入

`|` 管道左侧写，右侧读

```shell
ls -l | grep -i b
```

### 远程管理相关

#### 1、shutdown

关闭或重新启动系统

- `-r`：重新启动

```shell
# 一分钟之后关闭系统
shutdown

# 取消本次关机操作
shutdown -c

# 立即重新启动系统
shutdown -r now

# 立即关机
shutdown now

# 今天 20:45 重新启动系统
shutdown -r 20:45

# 10分钟后关机
shutdown +10
```

#### 2、ifconfig

查看当前计算机的网络配置信息

```shell
[root@192 ~]# ifconfig | grep inet
        inet 192.168.2.28  netmask 255.255.255.0  broadcast 192.168.2.255
        inet6 fe80::21c:42ff:fec1:da02  prefixlen 64  scopeid 0x20<link>
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
```

#### 3、ping

检测到目标 ip 地址的连接是否正常

```sql
[root@192 ~]# ping www.baidu.com
PING www.a.shifen.com (220.181.38.150) 56(84) 比特的数据。
64 比特，来自 www.baidu.com (220.181.38.150): icmp_seq=1 ttl=52 时间=35.8 毫秒
64 比特，来自 www.baidu.com (220.181.38.150): icmp_seq=2 ttl=52 时间=65.0 毫秒
64 比特，来自 www.baidu.com (220.181.38.150): icmp_seq=3 ttl=52 时间=54.6 毫秒
64 比特，来自 www.baidu.com (220.181.38.150): icmp_seq=4 ttl=52 时间=52.9 毫秒
64 比特，来自 www.baidu.com (220.181.38.150): icmp_seq=5 ttl=52 时间=34.5 毫秒
64 比特，来自 www.baidu.com (220.181.38.150): icmp_seq=6 ttl=52 时间=59.1 毫秒
^C
--- www.a.shifen.com ping 统计 ---
已发送 6 个包， 已接收 6 个包, 0% packet loss, time 4995ms
```

#### 4、ssh

远程连接服务器

- `-p`：指定端口号

```shell
# 默认端口号是 22
# 如果端口号不是 22，就需要使用 -p 指定端口号
ssh [-p port] user@ip
```

#### 5、scp

远程拷贝文件

- `-P`：指定端口号，默认端口号是 22
- `-r`：递归的复制目录

```shell
# 将本地文件复制到远程服务器上
# : 后面的路径不是绝对路径，是以 ~ 为参照的相对路径
# 也就是说 : 可以看成是 ~/
scp -P port a.txt user@ip:Desktop/a.txt

# 将远程服务器上的文件复制到本地
scp -P port user@ip:Desktop/a.txt a.txt

# 加上 -r 参数可以复制文件夹
scp -r user@ip:Desktop/b b
```

### 用户和权限相关

```shell
# - 表示文件 d 表示文件夹
# r(read，4)读取 w(write，2)写 x(execute，1)执行
# 除第一个字符外，其余九个字符每三个分为一组，分别为
# 拥有者权限，拥有者所在组权限，其他用户的权限
# 1、3表示硬链接数，通俗的讲，就是用多少种方式可以访问到该目录
# 后面分别代表拥有者、拥有者所在组、大小、时间、文件名
-rw-r--r--. 1 root root  0 11月 16 20:18 311.txt
drwxr-xr-x. 3 root root 30 11月 17 09:56 a
```

> 硬链接访问方式：
>
> 1、通过绝对路径访问
>
> 2、在本目录下，使用 `cd .` 访问
>
> 3、在子目录下，使用 `cd ..` 访问，因此子目录越多，硬链接数就越多

#### 1、chmod

修改文件或目录权限

```shell
chmod +/-rwx 文件名称
```

将python文件变为可执行文件

```shell
# 1、在python文件第一行加入如下内容
#!/usr/bin/python

# 2、为python文件增加执行权限
chmod +x hello.py

# 3、执行文件
./hello.py 
```

修改目录需要加上 `-R` 选项

可以使用数字一次修改拥有者、组和其他人权限

```shell
# 数字可以修改
chmod [-R] 755 文件名
```

#### 2、组管理

- 添加组
```shell
groupadd dev
```


- 查看组

```shell
[root@192 home]# cat /etc/group|grep dev
dev:x:1000:
```

- 删除组

```shell
groupdel dev
```

- 修改文件所属组

```shell
[root@192 home]# mkdir python_study
[root@192 home]# ls -l
drwxr-xr-x. 2 root root  6 11月 17 22:32 python_study
[root@192 home]# chgrp -R dev python_study/
[root@192 home]# ls -l
drwxr-xr-x. 2 root dev   6 11月 17 22:32 python_study
```

#### 3、用户管理

- 增加用户
```shell
# -m 自动建立用户家目录
# -g 指定用户所在的组，否则会建立一个和用户同名的组
useradd -m -g dev 用户名
```

- 设置用户密码

```shell
# 如果是普通用户，可以直接使用该命令修改自己账号密码
passwd 用户名
```

- 删除用户

```shell
# -r 自动删除用户家目录
userdel -r 用户名
```

- 查看用户信息

```shell
cat /etc/passwd|grep 用户名

[root@192 zhangsan]# cat /etc/passwd | grep zhangsan
zhangsan:x:1000:1000::/home/zhangsan:/bin/bash
# 以分号分割，分别为
# 1、用户名
# 2、x 表示加密的密码
# 3、用户 id
# 4、组 id
# 5、用户全名或本地账号
# 6、用户家目录
# 7、登陆Shell

# 使用 id
[root@192 zhangsan]# id zhangsan
用户id=1000(zhangsan) 组id=1000(dev) 组=1000(dev)

# 查看当前所有登录的用户列表
[root@192 zhangsan]# who
root     tty1         2023-11-16 09:55
root     pts/0        2023-11-18 00:48 (192.168.2.26)
zhangsan pts/1        2023-11-18 01:28 (192.168.2.26)

# 查看当前登录的用户
[root@192 zhangsan]# whoami
root
```

#### 4、usermod

设置用户的主组/附加组和登录Shell

```shell
# 修改用户主组
usermod -g 组 用户名

# 修改用户附加组
usermod -G 组 用户名

# 修改用户登录的shell
usermod -s /bin/bash 用户名
```

> 如果想让用户使用 `sudo`，需要将用户加入到 `wheel` 组中
>
> `usermod -G wheel zhangsan`
>
> 随后用户重新登录，即可使用 `sudo`

#### 4、which

查看执行命令所在位置

```shell
[root@192 zhangsan]# which echo
/usr/bin/echo

[root@192 zhangsan]# which useradd
/usr/sbin/useradd
```

> `bin(binary)`：二进制可执行文件目录，主要用于具体应用
>
> `sbin(system binary)`：系统管理员专用的二进制可执行文件目录，主要用于系统管理
>
> `/usr/bin`：后期安装的一些软件
>
> `/usr/sbin`：超级用户的一些管理软件


#### 5、su

切换用户

```shell
# 切换用户
[root@192 ~]# su zhangsan
[zhangsan@192 root]$ pwd
/root

# 切换用户并切换用户家目录
[root@192 ~]# su - zhangsan
[zhangsan@192 ~]$ pwd
/home/zhangsan

# 使用 exit 退出
[zhangsan@192 ~]$ exit
注销
[root@192 ~]# 

# 不加用户名就会切换到 root 用户
[root@192 ~]# su -
```

#### 6、chown

修改文件拥有者

```shell
chown 用户名 文件名
```

### 系统信息相关

#### 1、日期和时间

- `date`

```shell
[root@192 home]# date
2023年 11月 18日 星期六 10:12:46 CST
```
- `cal`：查看日历

```shell
[root@192 home]# cal

# 使用 -y 可以查看当前一年的日历
[root@192 home]# cal -y
```

#### 2、磁盘信息

- `df -h`：显示磁盘剩余空间
- `du -h 目录名`：显示目录下的文件大小

```shell
[root@192 home]# df -h
[root@192 home]# du -h /home
```

#### 3、进程信息

- `ps`：查看进程状态

```shell
# 不带参数，只会显示当前用户通过终端启动的应用程序
[root@192 home]# ps
    PID TTY          TIME CMD
  17049 pts/0    00:00:00 bash
  17175 pts/0    00:00:00 ps


# a：显示终端上的所有进程，包括其他用户的进程
# u：显示进程的详细状态
# x：显示后台进程
[root@192 home]# ps aux
```

- `top`：动态显示运行中的进程并排序

- `kill [-9] 进程代号`：终止指定代号的进程，-9表示强制终止

```shell
[root@192 home]# kill -9 17320
```

### 其他命令

#### 1、find

查找文件

```shell
# 查找当前目录下
[root@192 ~]# find -name "*1*"

# 查找 home 目录下
[root@192 ~]# find /home -name "*1*"
```

#### 2、ln

建立软链接，相当于windows下的快捷方式

- `-s`：不使用该选项建立的是硬链接

```shell
# 使用绝对路径创建软链接
[root@192 home]# ln -s /home/a/b/c/hello.py hello_1

# 使用相对路径创建软链接
[root@192 home]# ln -s a/b/c/hello.py hello_2

[root@192 home]# ls -l
lrwxrwxrwx. 1 root     root 20 11月 18 14:00 hello_1 -> /home/a/b/c/hello.py
lrwxrwxrwx. 1 root     root 14 11月 18 14:02 hello_2 -> a/b/c/hello.py

# 移动这两个软链接文件
[root@192 home]# mv hello* b

# 使用绝对路径的能正常使用
[root@192 b]# ./hello_1
Hello World!

# 使用相对路径的会报错
[root@192 b]# cat hello_2
cat: hello_2: 没有那个文件或目录
```

创建硬链接

```shell
# 创建硬链接
[root@192 b]# ln /home/a/b/c/hello.py hello_3
[root@192 b]# ls -lh
总用量 4.0K
lrwxrwxrwx. 1 root root 20 11月 18 14:00 hello_1 -> /home/a/b/c/hello.py
lrwxrwxrwx. 1 root root 14 11月 18 14:02 hello_2 -> a/b/c/hello.py
-rwxr-xr--. 2 root root 40 11月 17 21:20 hello_3

# 删除源文件
[root@192 b]# rm /home/a/b/c/hello.py

# 软链接均不可用
[root@192 b]# ./hello_1
-bash: ./hello_1: 没有那个文件或目录
[root@192 b]# ./hello_2
-bash: ./hello_2: 没有那个文件或目录

# 硬链接可以正常使用
[root@192 b]# ./hello_3 
Hello World!

# 硬链接的数量会减少
[root@192 b]# ls -l
-rwxr-xr--. 1 root root 40 11月 17 21:20 hello_3
```

在Linux中，文件名和文件数据是分开存储的，当硬链接数为0的时候，文件数据才会被删除

```shell
# 软链接
# 软链接文件名 -> 软链接文件数据 -> 文件名 -> 文件数据
#
# 硬链接
# 文件名       硬链接文件名
#   ｜             ｜
#   ｜             ｜
#    ——————————————
#           ｜
#         文件数据
```

#### 3、tar

基本命令，如果未找到命令使用 `yum install -y tar` 安装

```shell
# 打包文件
tar -cvf 打包文件名.tar 被打包的文件/路径

# 解包文件
tar -xvf 打包文件名.tar 

# 选项说明
# c：生成档案文件，创建打包文件
# v：显示指令执行过程，显示进度
# x：解开档案文件
# z：压缩文件
# j：与z类似，只不过j调用bzip2，文件后缀名为tar.bz2
# t：列出文件
# r：追加文件
# f：指定档案文件名，f后面一定是.tar文件，必须放在最后
```

使用 `-z` 选项可以调用 `gzip` 完成压缩和解压缩

```shell
# 打包压缩文件
tar -zcvf 打包文件名.tar.gz 被打压缩的文件/路径

# 解压缩文件
tar -zxvf 打包压缩文件名.tar.gz 

# 解压缩文件到指定路径，指定路径必须存在
tar -zxvf 打包压缩文件名.tar.gz -C 目标路径
```

#### 4、[apt](https://www.runoob.com/linux/linux-comm-apt.html)

安装、卸载、更新软件包

```shell
# 安装软件包
apt install 软件包

# 卸载软件包
apt remove 软件包

# 更新已安装的软件包
apt upgrade
```