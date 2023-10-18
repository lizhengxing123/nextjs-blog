---
title: '数据类型'
excerpt: '数据类型'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-07-06 10:22:48'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 数据类型

### 数值

#### int

- `tinyint`

非常小的整数，1 `bytes` 大小

无符号整数范围：(0, 255)

有符号整数范围：(-128, 127)

- `smallint`

小的整数，2 `bytes` 大小

无符号整数范围：(0, 65535)

有符号整数范围：(-32768, 32767)

- `mediumint`

一般的整数，3 `bytes` 大小

无符号整数范围：(0, 16777215)

有符号整数范围：(-8388608, 8388607)

- `int`

标准的整数，4 `bytes` 大小

无符号整数范围：(0, 4294967295)

有符号整数范围：(-2147483648, 2147483647)

- `bigint`

大整数，8 `bytes` 大小

无符号整数范围：(0, 18446744073709551615)

有符号整数范围：(-9223372036854775808, 9223372036854775807)

```sql
-- 创建 t1 表，设置字段 n 类型为 tinyint
-- 默认为有符号
create table t1(n tinyint);

-- 增加一个无符号整数
-- unsigned 约束条件就表示无符号
alter table t1 add m tinyint unsigned;

-- 插入数据
insert into t1 values(128, -10);
-- 超出范围会报错
-- ERROR 1264 (22003): Out of range value for column 'n' at row 1

-- 成功插入数据
insert into t1 values(127, 10);
```

整型后面的宽度表示显示宽度

```sql
-- 创建 t2 表，设置 n 字段为无符号，0 填充且显示宽度为 3 的 int 类型
create table t2(n int(3) zerofill unsigned);

-- 插入数据
insert into t2 values(1),(23),(456),(7890);

-- 查看数据
select * from t2;
-- +------+
-- | n    |
-- +------+
-- |  001 |
-- |  023 |
-- |  456 |
-- | 7890 |
-- +------+
```

> `int` 类型无符号默认显示宽度是 10，有符号默认显示宽度是 11

#### float

- `float`

单精度浮点数值，4 `bytes` 大小，精确到小数点后 6 位

无符号整数范围：0，(1.175 494 351 E-38，3.402 823 466 E+38)

有符号整数范围：(-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38)

- `double`

双精度浮点数值，8 `bytes` 大小，精确到小数点后 15 位

无符号整数范围：0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308)

有符号整数范围：(-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308)

- `decimal`

小数值，`DECIMAL(M,D)` 。M最大为65，表示数字个数，N最大为30，表示小数个数。精度最高

无符号整数范围：依赖于M和D的值

有符号整数范围：依赖于M和D的值

>`float` 和 `double` 浮点数指定宽度可以传两个参数，
> 第一个参数表示数字个数（最大为255，如果小数为30，那么前面的整数就有 255-30=225 个），
> 第二个参数表示小数点后面的小数个数（最大为30）

### 字符

#### char 定长字符串

对于 `char(10)` 来说，最多能存 10 个字符；如果超过10个字符，会直接报错；如果不足10个字符，以空格补充。

最大字符数是 255

> `char` 是在最后面的补的空格，因此当实际字符后面有空格的时候，查询会取消掉空格

#### varchar 变长字符串

对于 `varchar(10)` 来说，最多能存 10 个字符；如果超过10个字符，会直接报错；如果不足10个字符，直接存，不会以空格补充。

最大字节是 65535（一行的最大字节数）

> `varchar` 最多能存储 65535 个字节。
> 其中 `null` 要占去一个字节，每个字段头要占 1(小于 255 字节) 或 2(255 ～ 65535) 个字节
> 因此实际存储字节数是 65532。
> 
> 如果是 `gbk` 编码的话，一个字符占2个字节，总共能存储 65532/2=32766 个字符
> 
> 如果是 `utf8` 编码的话，一个字符占3个字节，总共能存储 65532/3=21844 个字符

```sql
mysql> create table t3(first_name char(10), last_name varchar(10));

mysql> insert into t3 values('  xx  ', '  xx  ');

mysql> select char_length(first_name), char_length(last_name) from t3;
+-------------------------+------------------------+
| char_length(first_name) | char_length(last_name) |
+-------------------------+------------------------+
|                       4 |                      6 |
+-------------------------+------------------------+
1 rows in set (0.00 sec)
```

#### 比较

- `char`：浪费空间，但存取速度快
- `varchar`：节省空间，但存取速度慢（**推荐使用**）

#### 注意点

`varchar` 最多能存储 65535 个字节，这是行大小，如果该行还有其它字段，那么存储的字符数还要相应的减少

```sql
-- utf8
mysql> create table t2(id int, name varchar(21844)) charset=utf8;
ERROR 1118 (42000): Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535. This includes storage overhead, check the manual. You have to change some columns to TEXT or BLOBs
-- 由于 int 占用四个字节，因此在 utf8 编码的情况下，要减去两个字符
mysql> create table t2(id int, name varchar(21842)) charset=utf8;
Query OK, 0 rows affected, 1 warning (0.01 sec)

-- gbk
mysql> create table t3(id int, name varchar(32766)) charset=gbk;
ERROR 1118 (42000): Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535. This includes storage overhead, check the manual. You have to change some columns to TEXT or BLOBs
-- 由于 int 占用四个字节，因此在 gbk 编码的情况下，要减去两个字符
mysql> create table t3(id int, name varchar(32764)) charset=gbk;
Query OK, 0 rows affected (0.01 sec)
```
### 时间日期

#### year

年

#### date

年月日

#### time

时分秒

#### datetime

年月日时分秒，8个字节，能存1000～9999年

#### timestamp

时间戳，4个字节，能存1970～2038年

```sql
mysql> create table user(
    ->   id int,
    ->   name varchar(16),
    ->   born year,
    ->   birth date,
    ->   active time,
    ->   reg_time datetime
    -> );

-- now() 是 mysql 提供的函数，获取当前时间
mysql> insert into user values(1, "lzx", now(), now(), now(), now());
mysql> insert into user values(2, 'lll', '1999', '1999-02-05', '15:53:34', now());

mysql> select * from user;
+------+------+------+------------+----------+---------------------+
| id   | name | born | birth      | active   | reg_time            |
+------+------+------+------------+----------+---------------------+
|    1 | lzx  | 2023 | 2023-10-07 | 15:49:05 | 2023-10-07 15:49:05 |
|    2 | lll  | 1999 | 1999-02-05 | 15:53:34 | 2023-10-07 15:54:04 |
+------+------+------+------------+----------+---------------------+
```
### 枚举

`enum` 单选

```sql
mysql> create table t4(
    ->   id int,
    ->   name varchar(16),
    ->   gender enum('male', 'female', 'other')
    -> );

mysql> insert into t4 values(1, 'lzx', 'male');

mysql> select * from t4;
+------+------+--------+
| id   | name | gender |
+------+------+--------+
|    1 | lzx  | male   |
+------+------+--------+

mysql> desc t4;
+--------+-------------------------------+------+-----+---------+-------+
| Field  | Type                          | Null | Key | Default | Extra |
+--------+-------------------------------+------+-----+---------+-------+
| id     | int                           | YES  |     | NULL    |       |
| name   | varchar(16)                   | YES  |     | NULL    |       |
| gender | enum('male','female','other') | YES  |     | NULL    |       |
+--------+-------------------------------+------+-----+---------+-------+

-- 不能插入枚举值以外的东西
mysql> insert into t4 values(2, 'lll', 'xx');
ERROR 1265 (01000): Data truncated for column 'gender' at row 1
```

### 集合

`set` 多选

```sql
mysql> create table t5(
    ->   id int,
    ->   name varchar(16),
    ->   hobby set('tea', 'code', 'game')
    -> );

mysql> desc t5;
+-------+--------------------------+------+-----+---------+-------+
| Field | Type                     | Null | Key | Default | Extra |
+-------+--------------------------+------+-----+---------+-------+
| id    | int                      | YES  |     | NULL    |       |
| name  | varchar(16)              | YES  |     | NULL    |       |
| hobby | set('tea','code','game') | YES  |     | NULL    |       |
+-------+--------------------------+------+-----+---------+-------+

mysql> insert into t5 values(1, 'lzx', 'code'),(2, 'lll', 'game,tea');

mysql> select * from t5;
+------+------+----------+
| id   | name | hobby    |
+------+------+----------+
|    1 | lzx  | code     |
|    2 | lll  | tea,game |
+------+------+----------+

-- 不在 set 里面的数据不能插入
mysql> insert into t5 values(3, 'zzz', 'ball');
ERROR 1265 (01000): Data truncated for column 'hobby' at row 1
```