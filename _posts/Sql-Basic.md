---
title: 'sql 基础'
excerpt: 'sql 基础'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-07-05 11:05:45'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## sql 基础

每一条 `sql` 语句都是以分号 `;` 结尾的

```sql
-- 查看所有数据库
show databases;
```

库对应文件夹；表对应文件；表中的每条记录对应文件中的一行行数据

```sql
+--------------------+
| Database           |
+--------------------+
| information_schema | 
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```
- `information_schema`

是一个虚拟库，存储在内存中的，里面都是一些数据库启动之后的信息，比如数据类型，访问权限等等

- `mysql`

主要有一个授权表，改密码都是改的这个里面的内容

- `performance_schema`

它提供了一些性能监控和诊断功能，可以用来分析数据库的性能

- `sys`

是数据库引擎的扩展库

### 退出连接

```sql
-- 查看数据库字符编码以及其他信息
\s

-- 结束当前语句
\c

-- 退出连接
exit;
quit;
```

### 操作库

#### 增

```sql
create database [if not exists] <库名> [charset=<字符编码>];
```

创建新的库

```sql
-- 创建 db1 数据库
create database db1;
```

创建新的库，并指定字符编码

```sql
-- 创建 db2 数据库，并指定 gbk 字符编码
create database db2 charset=gbk;
```

创建库之前先判断库存不存在

```sql
-- 如果不存在 db1 数据库，再创建 db1，并指定 utf8 字符编码
create database if not exists db1 charset=utf8;
```

#### 删

```sql
drop database [if exists] <库名>;
```

删除数据库

```sql
-- 删除 db2 数据库
drop database db2;
```

删除库之前先判断库存不存在

```sql
-- 如果存在 db2 数据库，再删除 db2
drop database if exists db2;
```

#### 改

```sql
alter database <库名> charset=<字符编码>;
```

修改数据库的字符编码

```sql
-- 将 db2 数据库的字符编码修改为 utf8
alter database db2 charset=utf8;
```

#### 查

```sql
show create database <库名>;
```

查看所有数据库

```sql
show databases;
```

查一个，查看创建这个数据库的 `sql` 语句

```sql
-- 查看创建 db1 数据库的 `sql` 语句
show create database db1;
```

#### 其它命令

查看当前所在数据库，如果没有就是 `NULL`

```sql
select database();
```

切换数据库

```sql
-- 切换到 db1 数据库
use db1;
```

### 操作表

#### 增

创建新的表，字符编码默认为库的字符编码

```sql
-- 创建 movies 表
-- 并指定 id 字段 int 类型，name 字段 char(char(1)) 类型
create table movies(id int, name char);
```

创建新的库，并指定字符编码

```sql
-- 创建 movies 表
-- 并指定 id 字段 int 类型，name 字段 char(char(1)) 类型
-- 同时设置字符编码为 utf8
create table movies(id int, name char) charset=utf8;
```

#### 删

删除表

```sql
-- 删除 movies 表
drop table movies;
```

#### 改

修改表中字段类型

```sql
-- 将 movies 表中 name 字段的类型修改为 char(4)
alter table movies modify name char(4);
```

修改表中字段名称和类型

```sql
-- 将 movies 表中 name 字段名称修改为 Name
-- 并且将其类型修改为 char(5)
alter table movies change name Name char(5);
```

#### 查

查看当前数据库所有的表

```sql
show tables;
```

查一个，查看创建这个表的 `sql` 语句

```sql
-- 查看创建 movies 表的 `sql` 语句
show create table movies;
```

查看一张表的结构

```sql
-- 查看 movies 表的结构
describe movies;

-- 简写为
desc movies;
```

> **Tips**
> 
> 所有对表的操作，都可以使用绝对路径的方式
> 
> 这样可以不切换库，也能操作数据库对应的表
>
> `create table db2.movies(id int, name char);`


### 操作记录

#### 增

向表中插入一条记录

```sql
-- 向 movies 表中插入一条记录
-- id 为 1，name 为 '八角笼中'
insert into movies values(1, '八角笼中');
```

向表中插入多条记录

```sql
-- 向 movies 表中插入两条记录
-- id 为 2，name 为 '消失的她'
-- id 为 3，name 为 '速度与激情10'
insert into movies values(2, '消失的她'), (3, '速度与激情10');
```

#### 删

删除表中记录

```sql
-- 删除 movies 表中 name 为 '速度与激情10' 这条记录
delete from movies where name='速度与激情10';

-- 删除 movies 表中所有记录
delete from movies;
```

#### 改

修改表中记录

```sql
-- 将 movies 表中 id 为 2 这条记录的 name 字段的值修改为 '变形金刚'
update movies set name='变形金刚' where id=2;
```

#### 查

查看表中所有记录

```sql
-- 查看 movies 表中所有记录
select * from movies;
```

查看表中所有记录的指定字段

```sql
-- 查看 movies 表中所有记录的 name 字段
select name from movies;

-- 查看 movies 表中所有记录的 id 和 name 字段
select id, name from movies;

-- 查看 mysql 数据库 user 表中所有记录的 user 和 host 字段
select user, host from mysql.user;
```

### sql 语句分类

#### DDL

`Data Definition Language (DDL) for structuring data.`

数据库定义语言,用来定义和管理数据库或数据表

关键字：`create`、`drop`、`alter`

#### DML

`Data Manipulation Language (DML) for editing data.`

数据库操纵语言，用来操作数据

关键字：`insert`、`delete`、`update`

#### DQL

`Data Query Language (DQL) for querying data.`

数据库查询语言，用来查询数据

关键字：`select`

#### DCL

`Data Control Language (DCL) for administering the database.`

数据库控制语言，用来权限控制

关键字：`grant`、`revoke`、`commit`、`rollback`
