---
title: '约束条件'
excerpt: '约束条件'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-10-07 16:18:31'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 约束条件

```sql
[unsigned] [zerofill] [not null] [default <value>]
```

### unsigned

设置为无符号

### zerofill

整型显示宽度用 0 填充

### not null

设置为不为空

`int` 默认填充 0，`char` 默认填充 "" 空字符串

> `unsigned` 和 `zerofill` 必须要写在 `not null` 前面
> 
> `unsigned` 和 `zerofill` 是类型约束，`not null`是字段约束

```sql
mysql> create table t6(id int unsigned zerofill not null);

-- unsigned 和 zerofill 是属于字段类型的
-- int(10) 是对 id 类型的强制约束
-- unsigned 和 zerofill 是对 id 类型的进一步约束
-- not null 是对字段的约束
mysql> desc t6;
+-------+---------------------------+------+-----+---------+-------+
| Field | Type                      | Null | Key | Default | Extra |
+-------+---------------------------+------+-----+---------+-------+
| id    | int(10) unsigned zerofill | NO   |     | NULL    |       |
+-------+---------------------------+------+-----+---------+-------+
```

### default <value>

不为空的时候设置默认值

```sql
mysql> create table t7(id int, name varchar(16), gender enum('male', 'female') not null default 'male');

mysql> desc t7;
+--------+-----------------------+------+-----+---------+-------+
| Field  | Type                  | Null | Key | Default | Extra |
+--------+-----------------------+------+-----+---------+-------+
| id     | int                   | YES  |     | NULL    |       |
| name   | varchar(16)           | YES  |     | NULL    |       |
| gender | enum('male','female') | NO   |     | male    |       |
+--------+-----------------------+------+-----+---------+-------+

-- 只插入需要的字段，默认字段不插入
mysql> insert into t7(id, name) values(1, 'lzx');

-- 插入全部字段
mysql> insert into t7 values(2, 'lll', 'female');

mysql> select * from t7;
+------+------+--------+
| id   | name | gender |
+------+------+--------+
|    1 | lzx  | male   |
|    2 | lll  | female |
+------+------+--------+
```

### unique

设置唯一

#### 单列唯一

只针对单独的一个字段设置唯一

```sql
-- 写法一
create table user(
    id int unique,
    name varchar(16) unique
);

-- 写法二
create table user(
    id int,
    name varchar(16),
    unique(id),
    unique(name)
);

mysql> insert into user values(1, 'lzx');

mysql> insert into user values(1, 'lzxx');
ERROR 1062 (23000): Duplicate entry '1' for key 'user.id'
mysql> insert into user values(2, 'lzx');
ERROR 1062 (23000): Duplicate entry 'lzx' for key 'user.name'

mysql> insert into user values(2, 'lzxx');

mysql> select * from user;
+------+------+
| id   | name |
+------+------+
|    1 | lzx  |
|    2 | lzxx |
+------+------+
```

#### 联合唯一

几个字段合在一起不重复就行了

```sql
create table app(
    id int,
    host varchar(15),
    port int,
    unique(host, port),
    unique(id)
);

mysql> desc app;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | YES  | UNI | NULL    |       |
| host  | varchar(15) | YES  | MUL | NULL    |       |
| port  | int         | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+

-- 插入数据
mysql> insert into app values(1, '192.168.2.4', 8000), (2, '192.168.2.5', 8000);

-- 重复会报错
mysql> insert into app values(3, '192.168.2.4', 8001), (4, '192.168.2.5', 8000);
ERROR 1062 (23000): Duplicate entry '192.168.2.5-8000' for key 'app.host'

mysql> select * from app;
+------+-------------+------+
| id   | host        | port |
+------+-------------+------+
|    1 | 192.168.2.4 | 8000 |
|    2 | 192.168.2.5 | 8000 |
+------+-------------+------+
```

### primary key

主键，其约束特性是：不为空且唯一

#### 单列主键

```sql
create table t8(
    id int primary key,
    name varchar(16)
);

mysql> desc t8;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | NO   | PRI | NULL    |       |
| name  | varchar(16) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+

-- 插入数据
mysql> insert into t8 values(1, 'lzx'), (2, 'lll');

mysql> select * from t8;
+----+------+
| id | name |
+----+------+
|  1 | lzx  |
|  2 | lll  |
+----+------+

-- 不能插入重复的主键
mysql> insert into t8 values(1, 'xxx');
ERROR 1062 (23000): Duplicate entry '1' for key 't8.PRIMARY'

-- 主键不能为空
mysql> insert into t8(name) values('xxx');
ERROR 1364 (HY000): Field 'id' doesn't have a default value
```

如果创建表的时候不指定主键，`innodb` 会自动查找不为空且唯一的字段作为主键

```sql
create table t9(
    name varchar(16),
    age int unique not null
);

mysql> desc t9;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(16) | YES  |     | NULL    |       |
| age   | int         | NO   | PRI | NULL    |       |
+-------+-------------+------+-----+---------+-------+
```

#### 复合主键

```sql
create table app1(
    id int,
    host varchar(15),
    port int,
    primary key(host, port),
    unique(id)
);

mysql> desc app1;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int         | YES  | UNI | NULL    |       |
| host  | varchar(15) | NO   | PRI | NULL    |       |
| port  | int         | NO   | PRI | NULL    |       |
+-------+-------------+------+-----+---------+-------+

mysql> insert into app1 values(1, '192.168.2.4', 8000), (2, '192.168.2.5', 8000);

mysql> select * from app1;
+------+-------------+------+
| id   | host        | port |
+------+-------------+------+
|    1 | 192.168.2.4 | 8000 |
|    2 | 192.168.2.5 | 8000 |
+------+-------------+------+

-- 不能插入重复的
mysql> insert into app1 values(3, '192.168.2.5', 8000);
ERROR 1062 (23000): Duplicate entry '192.168.2.5-8000' for key 'app1.PRIMARY'
```

### auto_increment

自动递增

```sql
create database db4;
use db4;
create table t1(
    id int primary key auto_increment,
    name varchar(16)
);

mysql> desc t1;
+-------+-------------+------+-----+---------+----------------+
| Field | Type        | Null | Key | Default | Extra          |
+-------+-------------+------+-----+---------+----------------+
| id    | int         | NO   | PRI | NULL    | auto_increment |
| name  | varchar(16) | YES  |     | NULL    |                |
+-------+-------------+------+-----+---------+----------------+

-- 插入数据的时候可以不需要传 id
mysql> insert into t1(name) values('lzx'), ('mzx');

mysql> select * from t1;
+----+------+
| id | name |
+----+------+
|  1 | lzx  |
|  2 | mzx  |
+----+------+

-- 也可以自定义 id
mysql> insert into t1 values(11, 'xx');

mysql> select * from t1;
+----+------+
| id | name |
+----+------+
|  1 | lzx  |
|  2 | mzx  |
| 11 | xx   |
+----+------+

-- 自定义 id 之后，下一次自增的 id 就从自定义的 id 开始
mysql> insert into t1(name) values('llll');

mysql> select * from t1;
+----+------+
| id | name |
+----+------+
|  1 | lzx  |
|  2 | mzx  |
| 11 | xx   |
| 12 | llll |
+----+------+

-- 查看表中自增id的下一个值
-- AUTO_INCREMENT=13
mysql> show create table t1;
+-------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table | Create Table                                                                                                                                                                                         |
+-------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| t1    | CREATE TABLE `t1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci |
+-------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

-- 删除表中数据之后，自增 id 的值并不会改变
-- 下次插入的数据还是 之前的 id 值
mysql> delete from t1;

mysql> select * from t1;
Empty set (0.00 sec)

mysql> insert into t1(name) values('zzz');

mysql> select * from t1;
+----+------+
| id | name |
+----+------+
| 13 | zzz  |
+----+------+

-- 清空表中数据，并将自增 id 的值置为1
mysql> truncate t1;

mysql> select * from t1;
Empty set (0.00 sec)

mysql> insert into t1(name) values('zzz');

mysql> select * from t1;
+----+------+
| id | name |
+----+------+
|  1 | zzz  |
+----+------+
```

### foreign key

外键约束，用来建立表与表之间的联系

#### 多对一

```sql
-- 部门表
create table dep(
    id int primary key auto_increment,
    name varchar(16),
    -- desc 是 mysql 的关键字
    -- 如果要使用的话需要用反引号引起来
    `desc` varchar(64)
);

-- 员工表
-- 外键关联部门 id
create table emp(
    id int primary key auto_increment,
    name varchar(16),
    gender enum('male', 'female'),
    mobile varchar(11),
    dep_id int,
    foreign key(dep_id) references dep(id)
);

-- 插入研发部、销售部、人事部
insert into dep(name, `desc`) values
('研发部', '软件开发'),
('销售部', '销售业务'),
('人事部', '人才管理');

-- 插入5个人员，2个属于研发部，2个属于销售部，1个属于人事部
insert into emp(name, gender, mobile, dep_id) values
('马七', 'male', '13897878787', 1),  
('张三', 'male', '13897878788', 1),
('李四', 'female', '13897878789', 2),
('王五', 'male', '13897878700', 2),
('赵六', 'male', '13897878701', 3);

-- 如果要删除一个部门的话
-- 必须要先删除这个部门所有的员工
-- 因为员工外键引用着部门的id
delete from emp where dep_id = 1;
delete from dep where id = 1;

-- 部门表里面 id 如果存在引用
-- 那么它是不能改的，但其他字段都可以修改
update dep set name='财务部' where id=2;

mysql> select * from dep;
+----+-----------+--------------+
| id | name      | desc         |
+----+-----------+--------------+
|  2 | 财务部    | 销售业务     |
|  3 | 人事部    | 人才管理     |
+----+-----------+--------------+

-- 修改 id 会报错
update dep set id=999 where id=2;
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails (`db2`.`emp`, CONSTRAINT `emp_ibfk_1` FOREIGN KEY (`dep_id`) REFERENCES `dep` (`id`))
```

如果要解决删除同步和更新同步的问题，我们只需要加入以下语句就可以

```sql
create table emp(
    id int primary key auto_increment,
    name varchar(16),
    gender enum('male', 'female'),
    mobile varchar(11),
    dep_id int,
    foreign key(dep_id) references dep(id)
    -- 删除同步
    on delete cascade
    -- 更新同步
    on update cascade
);

-- 删除研发部
-- 研发部的员工也会同步删除
delete from dep where id=1;

mysql> select * from emp;
+----+--------+--------+-------------+--------+
| id | name   | gender | mobile      | dep_id |
+----+--------+--------+-------------+--------+
|  3 | 李四   | female | 13897878789 |      2 |
|  4 | 王五   | male   | 13897878700 |      2 |
|  5 | 赵六   | male   | 13897878701 |      3 |
+----+--------+--------+-------------+--------+

mysql> select * from dep;
+----+-----------+--------------+
| id | name      | desc         |
+----+-----------+--------------+
|  2 | 销售部    | 销售业务     |
|  3 | 人事部    | 人才管理     |
+----+-----------+--------------+

-- 更新销售部，员工表里的 id 也会同步更新
update dep set name='市场部' id=999 where id=2;

mysql> select * from dep;
+-----+-----------+--------------+
| id  | name      | desc         |
+-----+-----------+--------------+
|   3 | 人事部    | 人才管理     |
| 999 | 销售部    | 销售业务     |
+-----+-----------+--------------+

mysql> select * from emp;
+----+--------+--------+-------------+--------+
| id | name   | gender | mobile      | dep_id |
+----+--------+--------+-------------+--------+
|  3 | 李四   | female | 13897878789 |    999 |
|  4 | 王五   | male   | 13897878700 |    999 |
|  5 | 赵六   | male   | 13897878701 |      3 |
+----+--------+--------+-------------+--------+
```

> 在大型项目中，一定要避免使用外键，因为外键还是将两张表进行强关联了，违反了解耦的初衷
> **一切外键的概念必须在应用层解决，也就是代码层面解决**


#### 多对多

就不能使用外键了，而是新建一张中间表，来关联两个表

```sql
-- 歌曲表
create table song(
    id int primary key auto_increment,
    name varchar(20) not null
);

-- 歌手表
create table singer(
    id int primary key auto_increment,
    name varchar(20) not null
);

-- 它俩的关联表
create table song2singer(
    id int primary key auto_increment,
    song_id int,
    singer_id int,
    -- 可以使用 constraint 来给外键设置别名，方便以后修改
    constraint sk_song 
    foreign key(song_id) references song(id) 
    on delete cascade
    on update cascade,
    foreign key(singer_id) references singer(id) 
    on delete cascade
    on update cascade
);

-- 插入数据
insert into song(name) values
('夜的第七章'),
('以父之名'),
('惊鸿一面');

insert into singer(name) values
('周杰伦'),
('许嵩'),
('黄龄');

insert into song2singer(song_id, singer_id) values
(1, 1),
(2, 1),
(3, 2),
(3, 3);
```

#### 一对一

```sql
-- 一个客户对应一个业主
-- 外键设置在业主表中，因为先有客户后有业主

-- 客户表
create table customer(
    id int primary key auto_increment,
    name varchar(16),
    gender enum('male', 'female'),
    mobile varchar(11)
);

-- 业主表
create table owner(
    id int primary key auto_increment,
    room_num varchar(16),
    is_loan enum('true', 'false'),
    customer_id int unique,
    foreign key(customer_id) references customer(id)
    on delete cascade
    on update cascade
);

-- 插入客户
insert into customer(name, gender, mobile) values
('马七', 'male', '13897878787'),  
('张三', 'male', '13897878788'),
('李四', 'female', '13897878789'),
('王五', 'male', '13897878700'),
('赵六', 'male', '13897878701');

-- 插入业主
insert into owner(room_num, is_loan, customer_id) values
('3078', 'true', 2),  
('9989', 'false', 4);
```