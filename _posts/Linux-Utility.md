---
title: 'Linux 实用程序'
excerpt: 'Linux 实用程序'
coverImage: '/assets/blog/linux/linux.jpg'
date: '2023-07-10 17:10:27'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/linux/linux.jpg'
type: 'Linux'
---

## Linux 实用程序

### 文件和文件夹操作

#### 1、创建/删除空目录

- `mkdir`：创建空目录
- `rmdir`：删除空目录

```shell
# 创建 aaa 空目录
[root@iZbp1cc6j8ewx7239u7o6rZ abc]# mkdir aaa

# 使用 -p 一次创建多个目录
[root@iZbp1cc6j8ewx7239u7o6rZ abc]# mkdir -p bbb/ccc

# 删除 aaa 空目录
[root@iZbp1cc6j8ewx7239u7o6rZ abc]# rmdir aaa
```

#### 2、创建/删除文件

- `touch`：创建空白文件或修改文件时间
  - 更改内容时间 - `mtime`
  - 更改权限时间 - `ctime`
  - 最后访问时间 - `atime`
- `rm`：删除文件
  - `-i`：交互式删除，每个删除项都会进行访问
  - `-r`：删除目录并递归的删除目录中的文件和目录
  - `-f`：强制删除，忽略不存在的文件，没有任何提示

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# touch a.txt

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# rm a.txt
rm：是否删除普通空文件 'a.txt'？
```

#### 3、切换和查看当前工作目录

- `cd`：可以跟绝对路径或相对路径
- `pwd`：查看当前工作目录
  
```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# pwd
/root
```

#### 4、查看目录内容

- `-l`：以长格式查看文件和目录
- `-a`：显示以点开头的文件和目录（隐藏文件）
- `-R`：遇到目录要进行递归展开（继续列出目录下面的文件和目录）
- `-d`：只列出目录，不显示其他内容
- `-S`：按大小排序
- `-t`：按时间排序
  
```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls -l
总用量 0
-rw-r--r-- 1 root root 0 7月  10 19:49 a.txt
```

#### 5、查看文件内容

`cat`、`tac`、`less`、`head`、`tail`、`more`、`rev`、`od`

> 使用 `wget` 从指定的 `URL` 下载资源

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# wget http://www.sohu.com/ -O sohu.html
--2023-07-10 20:43:59--  http://www.sohu.com/
.......
2023-07-10 20:44:00 (16.6 MB/s) - 已保存 “sohu.html” [222639/222639])

# 从开头开始，展示前三行数据
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# head -3 sohu.html 

# 从结尾开始，展示最后两行数据
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# tail -2 sohu.html 

# 查看文件内容
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# less sohu.html
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cat -n sohu.html | more
```

#### 6、拷贝/移动文件

`cp`、`mv`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls
b.txt  sohu.html

# 创建新的文件夹
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# mkdir b

# 拷贝 b.txt，生成新文件 b1.txt
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cp b.txt b1.txt
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls
b  b1.txt  b.txt  sohu.html

# 将 b1.txt 移动到 b 文件夹
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# mv b1.txt b
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls
b  b.txt  sohu.html
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cd b
[root@iZbp1cc6j8ewx7239u7o6rZ b]# ls
b1.txt

# 将 b1.txt 重命名
[root@iZbp1cc6j8ewx7239u7o6rZ b]# mv b1.txt b2.txt
[root@iZbp1cc6j8ewx7239u7o6rZ b]# ls
b2.txt 
```

#### 6、文件重命名

`rename`

- 第一个参数：需要修改的字符串
- 第二个参数：要替换成的目标字符串
- 第三个参数：要改变的文件列表

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ b]# rename b2.txt b3.txt b2.txt
[root@iZbp1cc6j8ewx7239u7o6rZ b]# ls
b3.txt
```

#### 7、查找文件和查找内容

- [find](https://www.runoob.com/linux/linux-comm-find.html)：查找文件
  - `-name pattern`：按文件名查找，支持使用通配符`*`、`?`
  - `-type type`：按文件类型查找，`f`(普通文件)、`d`(目录)、`i`(符号链接)等
  - `-size [+-]size[cwbkmg]`：按文件大小查找，`[+-]`表示大于或小于，`[cwbkmg]`分别表示字节、字数、块数、KB、MB、GB
  - `-mtime [+-]days`：按修改时间查找，`[+-]`表示指定天数前后，`days` 表示天数
  - `-atime n`：查找 n 天內被访问过的文件
  - `-ctime n`：查找 n 天內状态发生改变的文件
  - `-mtime n`：查找 n 天內被修改过的文件
  - `-user username`：按文件所有者查找
  - `-group groupname`：按文件所属组查找

```shell
# path 是目录
# expression 是可选参数
find [path] [expression]

# 查找 / 目录下所有名称以 .html 结尾的文件
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# find / -name "*.html"
/root/sohu.html
/usr/share/doc/tzdata/theory.html
......

# 查找当前目录下 7 天内访问过的文件
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# find . -atime 7 -type f -print

# 查找当前目录下文件大小超过 2kb 的文件
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# find . -type f -size +2k
```

- [grep](https://www.runoob.com/linux/linux-comm-grep.html)：查找内容
  - `i`：忽略大小写进行匹配
  - `v`：反向查找，只打印不匹配的行
  - `n`：显示匹配行的行号
  - `r`：递归查找子目录中的文件
  - `l`：只打印匹配的文件名
  - `c`：只打印匹配的行数
  - `E`：将样式为延伸的正则表达式来使用

```shell
# 在 sohu.html 中查找 <script> 并显示行号
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# grep "<script>" sohu.html -n

# 使用正则表达式进行查找
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# grep -E \<\/?script.*\> sohu.html -n
```

#### 9、创建链接和查看链接

`ln`、`readlink`

> 链接可以分为硬链接和软链接（符号链接）。硬链接可以认为是一个指向文件数据的指针，每添加一个硬链接，文件的对应链接数就加一，只有当文件的链接数为 0 时，文件对应的存储空间才有可能被其他文件覆盖。
> 软链接相当于 windows 下的快捷方式。

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls -l sohu.html
-rw-r--r-- 1 root root 222639 7月  10 20:44 sohu.html

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ln /root/sohu.html /root/b
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls -l sohu.html
-rw-r--r-- 2 root root 222639 7月  10 20:44 sohu.html
```

#### 10、压缩和解压缩

`gzip`、`gunzip`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# wget http://download.redis.io/releases/redis-4.0.10.tar.gz
--2023-07-11 10:43:34--  http://download.redis.io/releases/redis-4.0.10.tar.gz
......
2023-07-11 10:43:36 (4.73 MB/s) - 已保存 “redis-4.0.10.tar.gz” [1738465/1738465])

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls
b  b.txt  redis-4.0.10.tar.gz  sohu.html

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# gunzip redis-4.0.10.tar.gz
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls
b  b.txt  redis-4.0.10.tar  sohu.html
```

#### 11、归档和解归档

归档和解归档都是用 `tar` 这个命令

> 归档需要指定 `-cvf` 参数，`c` 表示创建(create)、`v` 表示显示创建归档详情(verbose)、`f` 表示指定归档的文件
>
> 解归档需要指定 `-xvf` 参数，`x` 表示抽取(extract)、`v` 表示显示创建归档详情(verbose)、`f` 表示指定归档的文件

```shell
# 解归档
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# tar -xvf redis-4.0.10.tar
redis-4.0.10/
redis-4.0.10/.gitignore
.....
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls
b  b.txt  redis-4.0.10  redis-4.0.10.tar  sohu.html

# 归档
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# tar -cvf sh.tar sohu.html
sohu.html
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls
b  b.txt  redis-4.0.10  redis-4.0.10.tar  sh.tar  sohu.html
```

#### 12、将标准输入转成命令行参数

`xargs`

```shell
# 查找当前路径下的 html 文件，
# 然后通过 xargs 将这些文件作为参数传给 rm 命令
# 实现查找并删除文件的操作
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# find . -type f -name *.html | xargs rm -f

# 将 a.txt 中的多行内容变成一行输出到 b.txt 文件中
# < 表示从 a.txt 中读取内容
# > 表示将命令的执行结果输出到 b.txt 中
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# xargs < a.txt > b.txt
```

#### 13、显示文件或目录

`basename`、`dirname`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# basename /usr/bin/sort
sort

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# dirname /usr/bin/
/usr
```

#### 14、计算字数

- `wc`：
  - `-c`：只显示字节数
  - `-l`：只显示行数
  - `-w`：只显示字数

### 管道和重定向

#### 1、管道的使用

`|`

```shell
# 查找当前目录下的文件个数
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# find ./ | wc -l
689

# 查看当前路径下的文件和文件夹，给每一项加一个编号
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls | cat -n
```

#### 2、重定向

- `>`：向文件中写入内容
- `>>`：向文件中追加内容
- `<`：获取文件内容
- `tee`
  - `-a`：附加到既有文件后面，而非覆盖他

```shell
# 向文件中写入内容
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# echo "hello world" > hello.txt
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cat hello.txt
hello world


# 获取文件内容
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# wall < hello.txt

来自 root@iZbp1cc6j8ewx7239u7o6rZ (pts/0) (Tue Jul 11 11:23:41 2023) 的广�

hello world


# 覆盖文件内容
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# echo "123" > hello.txt
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cat hello.txt
123


# 向文件中追加内容
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# echo "456" >> hello.txt
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cat hello.txt
123
456


# 在终端显示 ls 的结果，并把结果追加到 hello.txt 文件中
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ls | tee -a hello.txt
b
b.txt
hello.txt
ls.txt
redis-4.0.10
redis-4.0.10.tar
sh.tar
sohu.html
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cat hello.txt
123
456
b
b.txt
hello.txt
ls.txt
redis-4.0.10
redis-4.0.10.tar
sh.tar
sohu.html
```

### 别名

#### 1、设置别名

`alias`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# alias ll="ls -l"

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ll hello.txt
-rw-r--r-- 1 root root 80 7月  11 11:35 hello.txt
```

#### 2、取消别名

`unalias`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# unalias ll

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# ll
-bash: ll: 未找到命令
```

### 文本处理

#### 1、字节流编辑器

`sed` 是操作、过滤和转换文本内容的工具

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cat hello.txt -n
     1	123
     2	456
     3	b
     4	b.txt
     5	hello.txt
     6	ls.txt
     7	redis-4.0.10
     8	redis-4.0.10.tar
     9	sh.tar
    10	sohu.html
```

在第二行后面添加一个 `789`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# sed "2a 789" hello.txt
123
456
789
b
b.txt
hello.txt
ls.txt
redis-4.0.10
redis-4.0.10.tar
sh.tar
sohu.html
```

在第二行前面插入一个 `000`

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# sed "2i 000" hello.txt
123
000
456
b
b.txt
hello.txt
ls.txt
redis-4.0.10
redis-4.0.10.tar
sh.tar
sohu.html
```

删除 2~6 行

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# sed "2,6d" hello.txt
123
redis-4.0.10
redis-4.0.10.tar
sh.tar
sohu.html
```

> 以上这些操作并不会修改 hello.txt 文件

将文本中的 t 替换为 @，并写入文件

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# sed 's#1#@#g' hello.txt > a.txt

[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cat a.txt
@23
......
```

#### 2、模式匹配和处理语言

`awk` 可以从文本中提取指定的列、用正则表达式从文本中取出我们想要的内容、显示指定的行以及统计和运算

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# cat a.txt
1       banana      120
2       grape       500
3       apple       1230
4       watermelon  80
5       orange      400
```

显示第三行

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# awk "NR == 3" a.txt
3       apple       1230
```

显示第二列

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# awk '{print $2}' a.txt
banana
grape
apple
watermelon
orange
```

显示最后一列

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# awk '{print $NF}' a.txt
120
500
1230
80
400
```

输出第三列数字大于 300 的行

```shell
[root@iZbp1cc6j8ewx7239u7o6rZ ~]# awk '{if($3 >= 300) {print $0}}' a.txt
2       grape       500
3       apple       1230
5       orange      400
```
