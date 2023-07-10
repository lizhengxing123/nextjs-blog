---
title: '表操作'
excerpt: '表操作'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-07-06 09:29:58'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 表操作

### 存储引擎

表的类型，就是存储引擎

查看所有的存储引擎

```sql
show engines;
```

- `InnoDB`

`mysql` 默认的存储引擎是 `InnoDB`，其支持事务、行锁（确保数据安全）和外键

- `MEMORY`

基于哈希，存储在内存中，对临时表很有用

- `BLACKHOLE`

黑洞存储引擎，主要用于调试或性能测试场景，写入的任何内容将消失

- `MyISAM`

`mysql` 5.5 以前默认使用的，支持表锁定

创建表并指定存储引擎

```sql
create table t1(id int, name char) engine=innodb;
create table t2(id int, name char) engine=memory;
create table t3(id int, name char) engine=blackhole;
create table t4(id int, name char) engine=myisam;
```

向表中插入数据

```sql
insert into t1 values(1, 'a');
insert into t2 values(2, 'b');
insert into t3 values(3, 'c');
insert into t4 values(4, 'd');
```

由于 `t3` 是黑洞引擎，写入的任何内容将消失，所以它里面没有任何数据，插入不进去

另外 `t2` 的数据存储在内存中，所以断电或者当 `mysql` 关闭之后数据就会丢失

### 创建表

```sql
-- 宽度是字符个数，而不是字节
-- 在 mysql5.6 之前，关闭严格模式的情况下，即使宽度超了，也能插入进去（截取字符）

create table <表名>(
  <字段名1> <字段类型1>[(宽度)] [约束条件], 
  <字段名2> <字段类型2>[(宽度)] [约束条件],
  <字段名3> <字段类型3>[(宽度)] [约束条件1, 约束条件2]
) [engine=<存储引擎> charset=<字符编码>];
-- create table t1(id int, name char(4) not null);
```

### 修改表

#### 修改表名

```sql
alter table <表名> rename <新表名>;
-- alter table t1 rename tt;
```

#### 修改存储引擎

```sql
alter table <表名> engine=<存储引擎>;
-- alter table t3 engine=innodb;
```

#### 修改字段

```sql
-- 修改字段类型
alter table <表名> modify <字段> <新字段类型>[(宽度)] [约束条件];

-- 修改字段名和类型
alter table <表名> change <字段> <新字段名> <新字段类型>[(宽度)] [约束条件];
```

#### 增加字段

```sql
alter table <表名> add <字段> <字段类型>[(宽度)] [约束条件] [first|after <字段名>];
-- alter table movies add dir char(16) not null;
-- alter table movies add score char(16) not null after name;
```

#### 删除字段

```sql
alter table <表名> drop <字段>;
-- alter table movies drop dir;
```

### 删除表

```sql
drop table <表名>;
-- drop table tt;
```

### 复制表

#### 复制表结构和全部数据

```sql
create table <新表名> select * from <旧表名>;
-- create table a select * from movies;
```

#### 复制部分表结构和全部数据

```sql
create table <新表名> select 字段1, 字段2 from <旧表名>;
-- create table b select id, name from movies;
```

#### 复制部分表结构和部分数据

```sql
create table <新表名> select 字段1, 字段2 from <旧表名> [条件];
-- create table c select id, name from movies where id=1;
```

#### 只复制表结构

```sql
create table <新表名> select * from <旧表名> <假>;
-- create table d select * from movies where 0=1;

create table <新表名> like <旧表名>;
-- create table e like movies;
```

### 约束条件

要注意顺序

```sql
-- 设置为无符号
[unsigned]

-- 整型显示宽度用 0 填充
[zerofill]

-- 设置为不为空
-- int 默认填充 0
-- char 默认填充 "" 空字符串
[not null] 
```