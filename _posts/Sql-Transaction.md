---
title: '事务'
excerpt: '事务'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-10-12 15:56:06'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 事务

事务是一组操作的集合（多条`sql`语句的集合），这个集合是一个不可分割的工作单位，它会把集合内的所有操作一起提交，如果提交过程中，有任何一条`sql`出现了错误，那便会回退到整个事务执行之前的状态，即：要么同时成功，要么同时失败。

```sql
-- 经典例子：银行转帐

-- 增加账户表
create table account
(
    id      int primary key auto_increment,
    name    varchar(16),
    balance int
);

insert into account(name, balance)
values ('刘备', 8000),
       ('曹操', 32000);

-- 查询当前数据库默认的事务提交方式
select @@autocommit; -- 1 说明是自动提交的

-- 更改当前会话的事务提交方式
set @@autocommit = 0; -- 0 表示当前会话更改成手动提交
set @@autocommit = 1;

-- 开启事务
start transaction;
begin;

-- 曹操给刘备转账10000
    -- 1、查询曹操的余额
    select balance from account where name='曹操';
    -- 2、曹操账户-10000
    update account set balance = balance - 10000 where name='曹操';
    -- print('异常');
    -- 3、刘备账户+10000
    update account set balance = balance + 10000 where name='刘备';

-- 提交事务
commit;

-- 回滚事务
rollback;
```

- 查看事务的提交方式

`select @@autocommit;`

- 更改事务的提交方式

`set @@autocommit = 0;`

> 0 表示手动提交，1 表示自动提交，都只针对当前会话

- 开启事务

`start transaction;` 或者 `begin;`

- 提交事务

`commit;`

- 回滚事务

`rollback;`

### 事务的四大特性

- 原子性（**A**tomicity）

事务是不可分割的最小操作单元，这个操作单元要么全部成功，要么全部失败

- 一致性（**C**onsistency）

事务完成的时候，必须使所有数据保持一致状态

- 隔离性（**I**solation）

在并发的情况下，A事务在操作的时候，它不会影响B事务的执行；B事务在操作的时候，也不会影响A事务。

- 持久性（**D**urability）

事务不管是提交还是回滚，它对数据库里面数据的改变，都是永久的。

### 并发事务引发的问题

- 脏读

一个事务读取到了另一个事务还没提交的数据

- 不可重复读

一个事务先后读取同一条记录，但两次读取到的数据不同

- 幻读

一个事务查询某一条记录的时候，没有对应的记录，但是在插入记录的时候，又发现这条记录已经存在了

### 事务的隔离级别

隔离级别从低到高，性能从高到低，数据安全性从低到高

#### Read Uncommitted 读未提交

- 脏读 ✅
- 不可重复读 ✅
- 幻读 ✅

适用场景：在一个事务里面插入一批非常大的数据，这个事务已经执行了很长时间，并且还在执行过程中没有提交，如何知道当前已经插入了多少条数据呢？

利用 `Read Uncommitted` 隔离级别的脏读，用一个新的事务，读取这一批数据的插入进度。

#### Read Committed 读已提交

- 脏读 ❎
- 不可重复读 ✅
- 幻读 ✅

#### Repeatable Read（默认）可重复读

- 脏读 ❎
- 不可重复读 ❎
- 幻读 ✅

#### Serializable 串行化

- 脏读 ❎
- 不可重复读 ❎
- 幻读 ❎

```sql
-- 查看事务隔离级别
select @@transaction_isolation; -- REPEATABLE-READ

-- 设置事务隔离级别
-- session 表示当前会话 global 表示全局
set {session|global} transaction isolation level <隔离级别>;

set session transaction isolation level read uncommitted;
```