---
title: '多表查询'
excerpt: '多表查询'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-10-10 15:20:41'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 多表查询

例子

```sql
create database db6;

use db6;

-- 创建 dep
create table dep(
    id int primary key auto_increment,
    name varchar (16),
    notes varchar (64)
);

-- 给 dep 插入数据
insert into
    dep (name)
values
    ('总经办'), ('技术部'), ('市场部'), ('人事部'), ('财务部'), ('后勤部');

-- 创建 emp
create table emp(
    id int primary key auto_increment,
    name varchar (16) not null,
    gender enum( 'male', 'female') not null,
    age int not null,
    salary float (10, 2),
    post varchar (16),
    join_date date,
    leader_id int,
    dep_id int
);

-- 给 emp 插入数据
insert into emp values
    (1,'刘备',' male', 32, 4000,'总经理','2035-06-01',null, 1),
    (2,'关羽','male', 20,8000,'技术总监','2035-06-05',1, 2),
    (3,'张飞','male', 25,12000,'项目经理','2035-06-10',2,2),
    (4,'赵云','male', 19, 6800,'产品经理','2035-06-10',2,2),
    (5,'马超','male', 26, 11000,'后端开发','2035-07-11',2,2),
    (6,'黄忠','female', 48, 15000,'后端开发','2035-07-22',2,2),
    (7,'夏侯惇','male', 36,34000,'后端开发','2035-07-29', 2, 2),
    (8,'典韦','male', 19,6800,'后端开发','2035-08-02',2,2),
    (9,'吕布','female', 20, 9000,'前端开发','2035-08-03',2,2),
    (10,'周瑜','female',32, 36000,'前端开发', '2035-08-08',2, 2),
    (11,'文丑','male', 27,24000,'测试','2035-08-12',2, 2),
    (12,'诸葛亮','male',27,8000,'市场总监','2035-06-05', 1,3),
    (13,'庞统','male',37, 4200,'销售','2035-06-06',12,3),
    (14, '徐庶','male', 36, 4000,'销售',' 2035-06-12',12,3),
    (15,'荀彧','male', 25,2400,'销售','2035-06-10',12,3),
    (16,'荀攸','male',25, 2400,'销售','2035-06-12',12,3),
    (17,'鲁肃','male', 43,4300,'销售',' 2035-06-18',12,3),
    (18,'司马懿','female', 44, 5000,'销售','2035-06-20', 12,3),
    (19,'杨修','male',19, 800,'销售','2035-07-10', 12, 3),
    (20,'丁仪',' male', 49,3500,'销售','2035-07-11',12,3),
    (21,'宋江','male',30, 8000,'人事总监','2035-06-05', 1, 4),
    (22,'吴用','male', 38,3000,'人事主管','2035-06-06', 21, 4),
    (23,'扈三娘' ,'female', 42, 2500,'招聘专员','2035-06-11',21, 4),
    (24,'顾大嫂','female',38,3300,'招聘专员','2035-06-25', 21, 4),
    (25,'孙二娘','female', 32, 2400,'绩效专员','2035-07-22',21,4),
    (26,'丁得孙','male', 32, 2800,'培训专员','2035-08-10',21, 4),
    (27,'柴进','male', 30,8000,'财务总监','2035-06-05', 1, 5),
    (28,'卢俊义',' male', 44,4000,'会计', '2035-08-19',27,5),
    (29,'晁盖','male', 44,3500,'出纳','2035-08-20',27, 5),
    (30, '貂蝉', 'female', 36, 800, null, '2035-09-01', null, null);
```

### 笛卡尔积

简单点说就是，两个集合里面的元素一一组合的所有情况

比如集合`{a, b, c}`和集合`{1, 2, 3}`的笛卡尔积现象就会是 `a1,a2,a3,b1,b2,b3,c1,c2,c3` 共9种

### 连接查询

#### 内连接

查询两张表的交集部分

- 隐式内连接(不推荐)

```sql
select * from emp, dep where emp.dep_id=dep.id;
```

- 显式内连接

```sql
-- 语法
select <字段> from <表A> [inner] join <表B> on <条件>;

select * from emp inner join dep on emp.dep_id=dep.id;
select * from emp join dep on emp.dep_id=dep.id;
```

#### 外连接

- 左外连接

查询左表所有数据，包括交集部分

```sql
-- 语法
select <字段> from <表A> left [outer] join <表B> on <条件>;

select * from emp left join dep on emp.dep_id=dep.id;
select * from emp left outer join dep on emp.dep_id=dep.id;
```

- 右外连接

查询右表所有数据，包括交集部分

```sql
-- 语法
select <字段> from <表A> right [outer] join <表B> on <条件>;

select * from emp right join dep on emp.dep_id=dep.id;
select * from emp right outer join dep on emp.dep_id=dep.id;

-- 相当于
select * from dep left join emp on dep.id=emp.dep_id;
```

#### 自连接

自己连接自己

```sql
-- 语法
-- 查询的时候必须要起别名
select <字段> from <表A> <A> join <表A> <B> on <条件>;

select a.name as '员工', b.name as '领导' from emp a join emp b on a.leader_id=b.id;

-- 也可以使用外连接
select a.name as '员工', b.name as '领导' from emp a left join emp b on a.leader_id=b.id;
```

#### 联合查询

把多次查询的结果合并在一起，关键字：`union`、`union all`

```sql
-- 语法
select ... union [all] select ...;

-- union all 会查询出来重复的数据
select * from emp where salary >= 15000
union all
select * from emp where age >= 45;

-- union 会去除重复的数据
select * from emp where salary >= 15000
union
select * from emp where age >= 45;
```

> 需要注意的是，使用联合查询的时候，一定要保证多次查询的列数相同

```sql
-- 列数不同会报错
select * from emp where salary >= 15000
union
select * from dep;
[21000][1222] The used SELECT statements have a different number of columns

select name, gender, salary from emp where salary >= 15000
union
select * from dep;
```

### 子查询

一条查询语句里面嵌套另外的查询语句，可以放在`select`之后、`from`之后、`where`之后

#### 标量子查询：子查询的结果是单个值

可以用于比较运算符

```sql
-- 查询技术部所有员工
  -- 先从 dep 查询技术部id 一行一列 只拿到一个id
  select id from dep where name='技术部'; -- 2
  -- 再从 emp 查询技术部员工
  select * from emp where dep_id=2;

  -- 标量子查询 sql
  select * from emp where dep_id=(select id from dep where name='技术部');

-- 查询薪资比黄忠高的
  -- 先查询黄忠的薪资
  select salary from emp where name='黄忠'; -- 15000
  -- 再查询比15000高的人
  select * from emp where salary>15000;

  -- 标量子查询 sql
  select * from emp where salary>(select salary from emp where name='黄忠');
```

#### 列子查询：子查询的结果是一列

- `in`：在范围里
- `not in`：不在范围里
- `any`：有任何一个满足即可
- `some`：同 `any`
- `all`：所有都必须满足

```sql
-- 查询人事部和财务部所有员工
  -- 先从 dep 查询人事部和财务部id 一列多行
  select id from dep where name in ('人事部', '财务部'); -- 4， 5
  -- 再从 emp 查询人事部和财务部员工
  select * from emp where dep_id in (4, 5);

  -- 列子查询 sql
  select * from emp where dep_id in (select id from dep where name in ('人事部', '财务部'));

-- 查询比市场部所有人入职都晚的员工
  -- 查询市场部id
  select id from dep where name='市场部';
  -- 查询市场部所有人的入职日期
  select join_date from emp where dep_id=(select id from dep where name='市场部');
  -- 查询比市场部所有人入职都晚的员工
  select * from emp where join_date>all(select join_date from emp where dep_id=(select id from dep where name='市场部'));

  -- 也可以查询市场部所有人中最晚的入职日期
  select max(join_date) from emp where dep_id=(select id from dep where name='市场部');
  -- 查询比市场部所有人入职都晚的员工 标量子查询
  select * from emp where join_date>(select max(join_date) from emp where dep_id=(select id from dep where name='市场部'));
```

#### 行子查询：子查询的结果是一行

- `=`
- `!=`
- `in`
- `not in`

```sql
-- 查询和关羽薪资相同，领导也相同的员工
  -- 查询关羽薪资和领导
  select salary, leader_id from emp where name='关羽';
  -- 查询和关羽薪资相同，领导也相同的员工
  select * from emp where (salary, leader_id)=(select salary, leader_id from emp where name='关羽');

  -- in
  select * from emp where (salary, leader_id) in (
    select salary, leader_id from emp where name='关羽', 
    select salary, leader_id from emp where name='赵云'
  );
```

#### 表子查询：子查询的结果是多行多列

- `in`
- `not in`

```sql
-- in 
select * from emp where (salary, leader_id) in (
  select salary, leader_id from emp where name in ('关羽','赵云')
);

-- 查询工资为8000的员工信息，以及部门信息
  -- 查询工资为8000的员工
  select * from emp where salary=8000;
  -- 查询这部分员工的部门信息
  select * from (select * from emp where salary=8000) e left join dep on e.dep_id=dep.id;

  -- 也可以使用 where 过滤
  select * from emp left join dep on emp.dep_id=dep.id where salary=8000;
```

### 练习

```sql
-- 需要增加
-- 职位等级表
create table job_grade (
    id int primary key auto_increment,
    grade varchar (16),
    min_salary int,
    max_salary int
);

insert into job_grade (grade, min_salary, max_salary) values
    ('p1', 0, 4999),
    ('p2', 5000, 9999),
    ('p3', 10000, 14999),
    ('р4',15000, 19999),
    ('p5', 20000, 24999),
    ('p6', 30000, 39999);

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

```sql
-- 1、查询所有员工的职级
select e.name, e.salary, j.grade
from emp e
         left join job_grade j on e.salary between j.min_salary and j.max_salary
order by e.salary;

-- 2、查询人事部员工的职级
select e.name, e.salary, d.name, j.grade
from emp e
         join job_grade j on e.salary between j.min_salary and j.max_salary
         join dep d on e.dep_id = d.id
where d.name = '人事部';

-- 3、查询薪资低于每个部门平均值的员工信息
select a.name, a.salary, (select avg(salary) from emp b where b.dep_id = a.dep_id) 'avg_salary'
from emp a
where a.salary < (select avg(salary) from emp b where b.dep_id = a.dep_id);

-- 4、查询每个部门的员工数量
select d.name, (select count(e.id) from emp e where e.dep_id=d.id) '人数' from dep d;
select d.name, count(e.id)  from dep d left join emp e on e.dep_id=d.id group by d.name;

-- 5、查询歌曲及对应的歌手
select s.name, s2.name
from song s
         join song2singer s2s on s.id = s2s.song_id
         join singer s2 on s2s.singer_id = s2.id;

select s.name, s2.name
from song s,
     song2singer s2s,
     singer s2
where s.id = s2s.song_id
  and s2.id = s2s.singer_id;
```

