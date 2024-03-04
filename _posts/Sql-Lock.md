---
title: '锁'
excerpt: '锁'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2024-01-16 20:08:49'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 锁

### 全局锁

给整个数据库实例加上锁，所有客户端只能读取数据，写入操作会被阻塞，当前客户端只能读，写入操作会报错

```sql
-- 添加全局锁
flush tables with read lock;

-- 能正常查询数据
-- 修改数据会被阻止

-- 备份数据库
mysqldump -uroot -plzx622427 db1 > ~/Desktop/db1.sql

-- 使用 -h 可以指定地址 
-- mysqldump -h192.168.2.22 -uroot -plzx622427 db1 > ~/Desktop/db1.sql
-- [2024-01-16 20:36:57] /usr/local/mysql-8.0.27-macos11-x86_64/bin/mysqldump db1 --result-file=/Users/lizhengxing/_localhost-2024_01_16_20_36_57-dump.sql --user=root --host=127.0.0.1 --port=3306

-- 释放全局锁
unlock tables;
```

问题：

1. 业务全部停止
2. 主从结构，读写分离，主从延迟

解决：

--single-transaction（快照读）

```sql
mysqldump --single-transaction -uroot -plzx622427 db1 > ~/Desktop/db1.sql
```

### 表级锁

#### 表锁

- 表共享读锁（read lock）

所有客户端只能读取数据，写入操作会被阻塞，当前客户端只能读，写入操作会报错

- 表独占写锁（write lock）

当前客户端可读可写，其他客户端读写操作都会被阻塞

```sql
-- 加锁
lock tables 表1,表2 write/read; -- 给多张表加相同的锁
lock tables 表1 write, 表2 read; -- 表1加写锁，表2加读锁

-- 释放锁
unlock tables;
```

#### 元数据锁（meta data lock，简称MDL）

系统控制，在我们访问表的时候，会自动加上，不需要手动操作。为了避免DML和DDL的冲突，当一张表上面存在未提交的事务，其他事务是不能修改元数据的，或者说不能修改表结构。

增删改查：加MDL共享锁
修改表结构：加MDL排他锁

```sql
-- 查看元数据锁
select * from performance_schema.metadata_locks;
```

#### 意向锁

- 意向共享锁（IS）

```sql
select语句 lock in share mode;
-- 兼容表共享读锁，排斥表独占写锁
```

```sql
-- 开启事务
begin;

-- 添加行锁和意向共享锁
select * from emp where id=2 lock in share mode;

-- 查看锁 mysql8.0
select OBJECT_SCHEMA, OBJECT_NAME, LOCK_TYPE, LOCK_MODE, LOCK_DATA from performance_schema.data_locks;
+---------------+-------------+-----------+---------------+-----------+
| OBJECT_SCHEMA | OBJECT_NAME | LOCK_TYPE | LOCK_MODE     | LOCK_DATA |
+---------------+-------------+-----------+---------------+-----------+
| db1           | emp         | TABLE     | IS            | NULL      |
| db1           | emp         | RECORD    | S,REC_NOT_GAP | 2         |
+---------------+-------------+-----------+---------------+-----------+

-- 兼容表共享读锁
lock tables emp read;

-- 排斥表独占写锁
lock tables emp write; -- 阻塞
```

- 意向排他锁

```sql
insert、delete、update以及select语句 for update;
-- 排斥所有表锁，意向锁之间相互兼容
```

```sql
-- 开启事务
begin;

-- 添加行锁和意向排他锁
update emp set name="关二爷" where id=2;

-- 查看锁 mysql8.0
select OBJECT_SCHEMA, OBJECT_NAME, LOCK_TYPE, LOCK_MODE, LOCK_DATA from performance_schema.data_locks;
+---------------+-------------+-----------+---------------+-----------+
| OBJECT_SCHEMA | OBJECT_NAME | LOCK_TYPE | LOCK_MODE     | LOCK_DATA |
+---------------+-------------+-----------+---------------+-----------+
| db1           | emp         | TABLE     | IX            | NULL      |
| db1           | emp         | RECORD    | X,REC_NOT_GAP | 2         |
+---------------+-------------+-----------+---------------+-----------+

lock tables emp read; -- 阻塞
lock tables emp write; -- 阻塞
```

### 行级锁

每次操作锁定对应的行数据，并发性能最高

#### 行锁（record lock）

锁定单条记录

- 共享锁/读锁（S）

兼容其他共享锁，不兼容排他锁

- 排他锁/写锁（X）

不兼容共享锁和排他锁

#### 间隙锁（cap lock）

对两条记录之间的间隙加锁，锁定当前记录之前的间隙，不锁记录

#### 临键锁（next-key lock）

行锁和间隙锁的组合，同时锁住数据以及数据前的间隙

### 死锁

当两个或两个以上的事务相互等待对方释放资源时，就会发生死锁

### 乐观锁

在并发场景下，多个事务可能会访问同一条记录，乐观锁则认为，发生冲突的概率很低，所以在进行业务操作的时候，不会一开始就锁定数据，而是在提交数据更改时，检查当前数据是否有被其他事务修改，如果没有就提交数据，否则回滚事务

### 悲观锁

为了保持数据的完整性和一致性，在事务一开始读取的时候，就先把数据给锁上

## MVVC

### 基本概念

- 当前读

指的是读取记录的最新版本，读取的时候要保证当前记录不被其他事务修改，所以需要对读取的记录加锁

```sql
-- 以下sql是当前读
select ... for update;
select ... lock in share mode;
insert, delete, update
```

- 快照读

也叫非阻塞读，它读取的是记录的可见版本，有可能是历史数据

```sql
-- 普通的select语句，不加锁，都是快照读
select ...;

-- 在不同的隔离级别下，情况也有所不同
1. Read Committed: 每一次 select 都会产生一个快照读
2. Repeatable Read: 开启事务后的第一个 select，才会产生一个快照读
3. Serializable: 快照读变为当前读，都会加锁
```

### MVVC

维护一个数据的多个版本，快照读为 mysql 实现 mvvc 提供了一个非阻塞读的功能，使读写操作没有冲突。除了以来快照读之外，还需要依赖数据库表中的三个隐藏字段、undo log日志和readview

- 三个隐藏字段：

1. DB_TRX_ID: 记录插入或最后一次修改该记录的事务ID
2. DB_ROLL_PTR: 回滚指针，用于配合undo log，指向这条记录的上一个版本
3. DB_ROW_ID: 隐藏主键，创建表没指定主键的时候会出现

- undo log 日志

1. 当执行 insert 时，产生的 undo log 日志，只在回滚的时候需要，事务提交之后就没用了，可以立即删除
2. update/delete，产生的 undo log 日志，不仅在回滚的时候需要，在快照读的时候也需要，不会立即删除

- readview（读视图）

快照读 sql 执行时，mvvc提取数据的依据。有以下几个核心字段：

1. m_ids：记录当前活跃的事务id
2. min_trx_id：记录最小活跃事务id
3. max_trx_id：预分配事务id（最大事务id+1）
4. creator_trx_id：readview 创建者的事务id