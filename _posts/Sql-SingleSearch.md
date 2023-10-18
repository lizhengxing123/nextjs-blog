---
title: '单表查询'
excerpt: '单表查询'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-10-09 16:19:41'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 单表查询

```sql
select distinct -- 去重
  <字段...> -- * 表示全部字段
  from <库名>.<表名>
  where <过滤条件>
  group by <分组条件>
  having <过滤条件>
  order by <排序字段> {ASC | DESC} -- 默认升序 ASC
  limit n; -- 限制展示 n 条
```

测试例子

```sql
create database db3;
use db3;

-- 创建表
create table emp(
    id int primary key auto_increment,
    name varchar(16) not null,
    gender enum('male', 'female') not null,
    age int not null,
    salary float(10, 2),
    dep varchar(32),
    notes varchar(64)
);

-- 给emp表插入数据
insert into emp(name, gender, age, salary, dep, notes) values
  ('宋江', 'male', 35, 5000.00, '部门A', '部门A员工1'),
  ('卢俊义', 'male', 32, 4800.50, '部门A', '部门A员工2'),
  ('吴用', 'male', 28, 5200.75, '部门A', '部门A员工3'),
  ('林冲', 'male', 30, 4900.25, '部门A', '部门A员工4'),
  ('鲁智深', 'male', 36, 5100.00, '部门B', '部门B员工1'),
  ('杨志', 'male', 29, 4900.75, '部门B', '部门B员工2'),
  ('公孙胜', 'male', 34, 5300.50, '部门B', '部门B员工3'),
  ('秦明', 'male', 31, 4950.25, '部门B', '部门B员工4'),
  ('花荣', 'male', 33, 5150.00, '部门C', '部门C员工1'),
  ('柴进', 'male', 30, 4950.75, '部门C', '部门C员工2'),
  ('李应', 'male', 28, 5350.50, '部门C', '部门C员工3'),
  ('朱仝', 'male', 32, 5000.25, '部门C', '部门C员工4'),
  ('燕青', 'male', 29, 5100.00, '部门D', '部门D员工1'),
  ('柴秀', 'female', 27, 4800.75, '部门D', '部门D员工2'),
  ('魏定国', 'male', 35, 5400.50, '部门D', '部门D员工3'),
  ('解珍', 'male', 33, 5250.25, '部门D', '部门D员工4'),
  ('史进', 'male', 31, 5150.00, '部门A', '部门A员工5'),
  ('武松', 'male', 30, 5000.75, '部门B', '部门B员工5'),
  ('王英', 'male', 28, 4900.50, '部门C', '部门C员工5'),
  ('扈三娘', 'female', 29, 5350.25, '部门D', '部门D员工5'),
  ('花和尚', 'male', 37, 5100.00, '部门A', '部门A员工6'),
  ('鲍旭', 'male', 32, 4800.75, '部门B', '部门B员工6'),
  ('雷横', 'male', 28, 5200.50, '部门C', '部门C员工6'),
  ('李逵', 'male', 30, 4900.25, '部门D', '部门D员工6'),
  ('吴承恩', 'male', 38, 5300.00, '部门A', '部门A员工7'),
  ('杨雄', 'male', 31, 4950.75, '部门B', '部门B员工7'),
  ('石秀', 'male', 29, 5350.50, '部门C', '部门C员工7'),
  ('解宝', 'male', 33, 5150.25, '部门D', '部门D员工7');
```

### 去重

去除记录的重复

```sql
-- 获取表中的部门
mysql> select distinct dep from emp;
+---------+
| dep     |
+---------+
| 部门A   |
| 部门B   |
| 部门C   |
| 部门D   |
+---------+

-- 获取表中的部门和人名
-- 这个会查出所有的记录
-- 因为去重只是针对查出来的记录
select distinct dep, name from emp;
```

### 四则运算

`+`、`-`、`*`、`/`

```sql
mysql> select name, salary*12 from emp where dep='部门A';
-- 查出来的只是存在内存中的一张虚拟表
+-----------+-----------+
| name      | salary*12 |
+-----------+-----------+
| 宋江      |  60000.00 |
| 卢俊义    |  57606.00 |
| 吴用      |  62409.00 |
| 林冲      |  58803.00 |
| 史进      |  61800.00 |
| 花和尚    |  61200.00 |
| 吴承恩    |  63600.00 |
+-----------+-----------+

-- 也可以使用 as 为字段设置别名
-- as 也可以省略，但写上语义更加明确
mysql> select name, salary*12 as yearly_salary from emp where id=18;
+--------+---------------+
| name   | yearly_salary |
+--------+---------------+
| 武松   |      60009.00 |
+--------+---------------+
```

### 格式化显示

```sql
-- 格式 -> 姓名：xx  年龄：xx岁  薪资：xx元
-- 一个 concat 就是一列
select 
  concat('姓名：', name) as '姓名', 
  concat('年龄：', age, '岁') as '年龄',
  concat('薪资：', age, '元') as '薪资'
  from emp where id=18; 
+-----------------+----------------+----------------+
| 姓名            | 年龄           | 薪资           |
+-----------------+----------------+----------------+
| 姓名：武松       | 年龄：30岁      | 薪资：30元     |
+-----------------+----------------+----------------+

-- 格式 -> 姓名-年龄-薪资
select concat(name, '-', age, '-', salary) as '姓名-年龄-薪资' from emp where id=18;
+----------------------+
| 姓名-年龄-薪资        |
+----------------------+
| 武松-30-5000.75      |
+----------------------+

-- 简单的方法
-- concat_ws 第一个参数是拼接符号，后面的参数是要拼接的字段名
select concat_ws('-', name, age, salary) as '姓名-年龄-薪资' from emp where id=18;
+----------------------+
| 姓名-年龄-薪资        |
+----------------------+
| 武松-30-5000.75      |
+----------------------+
```

### where

```sql
-- 单条件查询
mysql> select name, age from emp where age > 35;
+-----------+-----+
| name      | age |
+-----------+-----+
| 鲁智深    |  36 |
| 花和尚    |  37 |
| 吴承恩    |  38 |
+-----------+-----+

-- 多条件查询
mysql> select name, dep, age from emp where dep='部门A' and age > 20;
+-----------+---------+-----+
| name      | dep     | age |
+-----------+---------+-----+
| 宋江      | 部门A   |  35 |
| 卢俊义    | 部门A   |  32 |
| 吴用      | 部门A   |  28 |
| 林冲      | 部门A   |  30 |
| 史进      | 部门A   |  31 |
| 花和尚    | 部门A   |  37 |
| 吴承恩    | 部门A   |  38 |
+-----------+---------+-----+

-- 区间查询 between
-- 是一个闭区间，包含两边
select name, age from emp where age >= 25 and age <= 30;
select name, age from emp where age between 25 and 30;

-- or
select name, age from emp where age < 25 or age > 30;

-- not
select name, age from emp where age not between 25 and 30;

-- in
select name, salary from emp where salary in (3000, 4000, 5000);

-- is null
-- 空字符串 '' 不是 null
select * from emp where notes is null;

-- is not null
select * from emp where notes is not null;

-- like 模糊匹配
-- _ 表示任意一个字符，相当于正则中的 .
-- % 表示任意多个字符，相当于正则中的 .*
mysql> select * from emp where name like '吴_';
+----+--------+--------+-----+---------+---------+----------------+
| id | name   | gender | age | salary  | dep     | notes          |
+----+--------+--------+-----+---------+---------+----------------+
|  3 | 吴用   | male   |  28 | 5200.75 | 部门A   | 部门A员工3     |
+----+--------+--------+-----+---------+---------+----------------+

mysql> select * from emp where name like '吴__';
+----+-----------+--------+-----+---------+---------+----------------+
| id | name      | gender | age | salary  | dep     | notes          |
+----+-----------+--------+-----+---------+---------+----------------+
| 25 | 吴承恩    | male   |  38 | 5300.00 | 部门A   | 部门A员工7     |
+----+-----------+--------+-----+---------+---------+----------------+

mysql> select * from emp where name like '吴%';
+----+-----------+--------+-----+---------+---------+----------------+
| id | name      | gender | age | salary  | dep     | notes          |
+----+-----------+--------+-----+---------+---------+----------------+
|  3 | 吴用      | male   |  28 | 5200.75 | 部门A   | 部门A员工3     |
| 25 | 吴承恩    | male   |  38 | 5300.00 | 部门A   | 部门A员工7     |
+----+-----------+--------+-----+---------+---------+----------------+
```

### group by

```sql
-- select 后面跟的字段必须和分组字段一致
-- 否则会报错
mysql> select * from emp group by dep;
ERROR 1055 (42000): Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'db3.emp.id' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by

mysql> select dep from emp group by dep;
+---------+
| dep     |
+---------+
| 部门A   |
| 部门B   |
| 部门C   |
| 部门D   |
+---------+

-- 聚合函数
-- 从某一组中聚合出我们需要的结果 

-- count 统计数量
-- 统计每个部门的员工数
mysql> select dep,count(id) as dep_count from emp group by dep;
+---------+-----------+
| dep     | dep_count |
+---------+-----------+
| 部门A   |         7 |
| 部门B   |         7 |
| 部门C   |         7 |
| 部门D   |         7 |
+---------+-----------+

-- max 最大值
-- 统计每个组中年龄最大的
mysql> select dep,max(age) as max_age from emp group by dep;
+---------+---------+
| dep     | max_age |
+---------+---------+
| 部门A   |      38 |
| 部门B   |      36 |
| 部门C   |      33 |
| 部门D   |      35 |
+---------+---------+

-- min 最小值
-- 统计每个组中薪资最低的
mysql> select dep,min(salary) as min_salary from emp group by dep;
+---------+------------+
| dep     | min_salary |
+---------+------------+
| 部门A   |    4800.50 |
| 部门B   |    4800.75 |
| 部门C   |    4900.50 |
| 部门D   |    4800.75 |
+---------+------------+

-- sum 求和
-- 统计每个组中薪资总和
mysql> select dep,sum(salary) as sum_salary from emp group by dep;
+---------+------------+
| dep     | sum_salary |
+---------+------------+
| 部门A   |   35451.50 |
| 部门B   |   35003.75 |
| 部门C   |   35903.00 |
| 部门D   |   35952.25 |
+---------+------------+
-- avg 平均值
-- 统计每个组中薪资均值
mysql> select dep,avg(salary) as avg_salary from emp group by dep;
+---------+-------------+
| dep     | avg_salary  |
+---------+-------------+
| 部门A   | 5064.500000 |
| 部门B   | 5000.535714 |
| 部门C   | 5129.000000 |
| 部门D   | 5136.035714 |
+---------+-------------+

-- 可以使用多个字段进行分组
mysql> select dep, gender, count(id) from emp group by dep, gender;
+---------+--------+-----------+
| dep     | gender | count(id) |
+---------+--------+-----------+
| 部门A   | male   |         7 |
| 部门B   | male   |         7 |
| 部门C   | male   |         7 |
| 部门D   | male   |         5 |
| 部门D   | female |         2 |
+---------+--------+-----------+
```

如果不用 `group by`，那么查询出来的默认就是一组，我们那仍然可以使用聚合函数来获取结果

```sql
mysql> select avg(salary) from emp;
+-------------+
| avg(salary) |
+-------------+
| 5082.517857 |
+-------------+
```

#### group_concat

对分组内容进行拼接

```sql
-- 查询每个部门的人员姓名
mysql> select dep, group_concat(name) from emp group by dep;
+---------+-----------------------------------------------------------+
| dep     | group_concat(name)                                        |
+---------+-----------------------------------------------------------+
| 部门A   | 宋江,卢俊义,吴用,林冲,史进,花和尚,吴承恩                  |
| 部门B   | 鲁智深,杨志,公孙胜,秦明,武松,鲍旭,杨雄                    |
| 部门C   | 花荣,柴进,李应,朱仝,王英,雷横,石秀                        |
| 部门D   | 燕青,柴秀,魏定国,解珍,扈三娘,李逵,解宝                    |
+---------+-----------------------------------------------------------+
```

### having

```sql
-- 查询所有部门内，员工数量小于5的部门名，以及该部门内的员工名和员工数量
select 
  dep, 
  group_concat(name) as emp_names, 
  count(id) as dep_count 
from 
  emp
group by 
  dep 
having 
  dep_count > 5;
+---------+-----------------------------------------------------------+-----------+
| dep     | emp_names                                                 | dep_count |
+---------+-----------------------------------------------------------+-----------+
| 部门A   | 宋江,卢俊义,吴用,林冲,史进,花和尚,吴承恩                  |         7 |
| 部门B   | 鲁智深,杨志,公孙胜,秦明,武松,鲍旭,杨雄                    |         7 |
| 部门C   | 花荣,柴进,李应,朱仝,王英,雷横,石秀                        |         7 |
| 部门D   | 燕青,柴秀,魏定国,解珍,扈三娘,李逵,解宝                    |         7 |
+---------+-----------------------------------------------------------+-----------+

-- 查询各部门年龄大于30的员工超过3个人的部门名，以及大于30的人数
select 
  dep, 
  count(id) as dep_count 
from 
  emp 
where 
  age > 30 
group by 
  dep 
having 
  dep_count > 3;
+---------+-----------+
| dep     | dep_count |
+---------+-----------+
| 部门A   |         5 |
| 部门B   |         5 |
+---------+-----------+
```

### order by

```sql
-- 对所有员工，按照工资进行升序排列
select name, salary from emp order by salary asc;

-- 对所有员工，按照工资进行降序排列，按照 id 升序排列
select * from emp order by salary desc, id asc;
```

### limit

```sql
-- 展示5条
select * from emp limit 5;

-- 展示员工中工资最高的5个人
select * from emp order by salary desc limit 5;

-- 分页
select * from emp limit 0, 10;
select * from emp limit 10, 10;
select * from emp limit 20, 10;
```

### regexp

```sql
-- 查询 吴或者宋开头的名字
select * from emp where name regexp '^(吴|宋).*';
+----+-----------+--------+-----+---------+---------+----------------+
| id | name      | gender | age | salary  | dep     | notes          |
+----+-----------+--------+-----+---------+---------+----------------+
|  1 | 宋江      | male   |  35 | 5000.00 | 部门A   | 部门A员工1     |
|  3 | 吴用      | male   |  28 | 5200.75 | 部门A   | 部门A员工3     |
| 25 | 吴承恩    | male   |  38 | 5300.00 | 部门A   | 部门A员工7     |
+----+-----------+--------+-----+---------+---------+----------------+
```
