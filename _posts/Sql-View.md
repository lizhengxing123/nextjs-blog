---
title: '视图'
excerpt: '视图'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-11-15 10:01:39'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 视图

视图是一种虚拟存在的表，它只保存sql逻辑，不保存查询结果

```sql
-- or replace：如果视图存在就替换
-- (字段名)：不经常用
-- selec语句：视图的数据就来自这条select语句，其查询的表就是基表
create [or replace] view 视图名[(字段名)] as selec语句 [with [cascaded | local] check option];
```

### 视图操作

```sql
-- 创建视图
mysql> create view emp_v1 as select id, name, age from emp where id <= 5;

-- 查询视图
mysql> select * from emp_v1;
+----+--------+-----+
| id | name   | age |
+----+--------+-----+
|  1 | 刘备   |  32 |
|  2 | 关⽻   |  20 |
|  3 | 张⻜   |  25 |
|  4 | 赵云   |  19 |
|  5 | ⻢超   |  26 |
+----+--------+-----+

-- 修改视图（方式一）
mysql> create or replace view emp_v1 as select id, name, age from emp where id <= 2;
mysql> select * from emp_v1;
+----+--------+-----+
| id | name   | age |
+----+--------+-----+
|  1 | 刘备   |  32 |
|  2 | 关⽻   |  20 |
+----+--------+-----+

-- 修改视图（方式二）
mysql> alter view emp_v1 as select id, name, age, post from emp where id <= 12;
mysql> select * from emp_v1 where id <=3;
+----+--------+-----+--------------+
| id | name   | age | post         |
+----+--------+-----+--------------+
|  1 | 刘备   |  32 | 总经理       |
|  2 | 关⽻   |  20 | 技术总监     |
|  3 | 张⻜   |  25 | 项⽬经理     |
+----+--------+-----+--------------+

-- 删除视图
mysql> drop view if exists emp_v1;
```

### 在视图中插入数据

```sql
-- 基表
mysql> select * from user;
+------+------+
| id   | name |
+------+------+
|    1 | lzx  |
|    2 | lzxx |
+------+------+

-- 创建视图
mysql> create or replace view user_v1 as select id, name from user where id <= 5;
-- 往视图中插入数据
mysql> insert into user_v1 values (3, 'xxx');
-- 查询数据
mysql> select * from user;
-- 数据其实是存储在了基表当中，视图不存储数据
mysql> select * from user_v1;
+------+------+
| id   | name |
+------+------+
|    1 | lzx  |
|    2 | lzxx |
|    3 | xxx  |
+------+------+

-- 往视图中插入数据
mysql> insert into user_v1 values (13, 'qqq');
-- 视图中查询不到刚插入的数据
mysql> select * from user_v1;
+------+------+
| id   | name |
+------+------+
|    1 | lzx  |
|    2 | lzxx |
|    3 | xxx  |
+------+------+
-- 基表中是存在的
mysql> select * from user;
+------+------+
| id   | name |
+------+------+
|    1 | lzx  |
|    2 | lzxx |
|    3 | xxx  |
|   13 | qqq  |
+------+------+
```

#### cascaded

```sql
-- 基表
mysql> select * from user;
+------+------+
| id   | name |
+------+------+
|    1 | lzx  |
|    2 | lzxx |
+------+------+

-- 创建视图
-- cascaded：用来检查我们操作的记录是否满足视图的条件
mysql> create or replace view user_v1 as select id, name from user where id <= 5 with check option;

-- 插入id大于5的会报错，因为其不满足条件
mysql> insert into user_v1 values (13, 'qqq');
ERROR 1369 (HY000): CHECK OPTION failed 'db1.user_v1'
```

基于视图创建视图，cascaded也会进行检查

```sql
mysql> create or replace view user_v1 as select id, name from user where id <= 10;
mysql> create or replace view user_v2 as select id, name from user_v1 where id >= 5 with check option;

mysql> insert into user_v2 values (13, 'qqq');
ERROR 1369 (HY000): CHECK OPTION failed 'db1.user_v2'

-- 满足条件就能正常插入
mysql> insert into user_v2 values (8, 'sss');
Query OK, 1 row affected (0.01 sec)
```

#### local 

只检查自己视图

```sql
mysql> create or replace view user_v1 as select id, name from user where id <= 10;
mysql> create or replace view user_v2 as select id, name from user_v1 where id >= 5 with check option;

mysql> insert into user_v2 values (13, 'qqq');
Query OK, 1 row affected (0.01 sec)
```

### 视图更新条件

视图中的行，与基表中的行，必须存在一对一关系

如果出现以下情况，视图将不可更新

- 1、聚合函数（sum、max、count等）或窗口函数
- 2、出现了distinct去重操作
- 3、group by 分组操作
- 4、having 分组之后的过滤操作
- 5、union 联合查询

```sql
mysql> create view user_v3 as select count(*) from user;

mysql> select * from user_v3;
+----------+
| count(*) |
+----------+
|        4 |
+----------+

mysql> insert into user_v3 values(10);
ERROR 1471 (HY000): The target table user_v3 of the INSERT is not insertable-into
```

### 视图的作用

- 1、简化操作：可以将复杂的查询定义到视图里面，以后直接查询视图就行了
- 2、安全：可以将权限控制到具体的字段，比如给用户只开放相关字段的视图权限
- 3、屏蔽基表基本结构变化带来的影响