---
title: 'Sql优化'
excerpt: 'Sql优化'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-11-14 10:28:40'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## Sql优化

### insert 优化

- 批量插入，每条insert语句插入数据不超过1000条，数据量大的话分割成多条insert语句

```sql
insert into emp values(1, 'l'),(2, 'z'),(3, 'x');
insert into emp values(1, 'l'),(2, 'z'),(3, 'x');
insert into emp values(1, 'l'),(2, 'z'),(3, 'x');
```

- 手动事务提交

```sql
begin;
insert into emp values(1, 'l'),(2, 'z'),(3, 'x');
insert into emp values(1, 'l'),(2, 'z'),(3, 'x');
insert into emp values(1, 'l'),(2, 'z'),(3, 'x');
commit;
```

- 大批量数据插入，使用load导入

```sql
-- mysql8.0需要加以下两个步骤
mysql --local-infile -uroot -p;
set global local_infile=1;

-- 导入数据
load data local infile '/root/data.txt' into table test_data fields terminated by ',' lines terminated by '\n';
```

- 保持主键顺序插入，性能比乱序插入更高

### 主键优化

- 数据的存放方式

在 innodb 存储引擎中，数据是按照主键顺序存放的

- [页合并](https://www.bilibili.com/video/BV1yQ4y1H7mH/?spm_id_from=pageDriver&vd_source=97e4871747b6e43793eaa0ddb1bb5191)

- 主键设计原则
  - 插入数据的时候，要尽量顺序插入，最好给主键设置自增，乱序会导致页分裂
  - 尽量不要使用太复杂的值作为主键，比如：uuid、证件号等
  - 尽量降低主键长度
  - 尽量不要修改主键


### group by优化

单列索引或联合索引都有效，联合索引需要遵循最左前缀法则

```sql
-- 使用联合索引，并遵循最左前缀法则
-- Using index 性能比较高
mysql> explain select age, count(*) from emp group by age;
+----+-------------+-------+------------+-------+-------------------------------------+-------------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys                       | key         | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+-------------------------------------+-------------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | emp   | NULL       | index | idx_emp_age_salary_post,idx_emp_age | idx_emp_age | 4       | NULL |   30 |   100.00 | Using index |
+----+-------------+-------+------------+-------+-------------------------------------+-------------+---------+------+------+----------+-------------+

-- 使用联合索引，不遵循最左前缀法则
-- Using temporary 性能低
mysql> explain select salary, count(*) from emp group by salary;
+----+-------------+-------+------------+-------+-------------------------+-------------------------+---------+------+------+----------+------------------------------+
| id | select_type | table | partitions | type  | possible_keys           | key                     | key_len | ref  | rows | filtered | Extra                        |
+----+-------------+-------+------------+-------+-------------------------+-------------------------+---------+------+------+----------+------------------------------+
|  1 | SIMPLE      | emp   | NULL       | index | idx_emp_age_salary_post | idx_emp_age_salary_post | 76      | NULL |   30 |   100.00 | Using index; Using temporary |
+----+-------------+-------+------------+-------+-------------------------+-------------------------+---------+------+------+----------+------------------------------+

-- 使用联合索引，遵循最左前缀法则
mysql> explain select age, salary, count(*) from emp group by age, salary;
+----+-------------+-------+------------+-------+-------------------------+-------------------------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys           | key                     | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+-------------------------+-------------------------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | emp   | NULL       | index | idx_emp_age_salary_post | idx_emp_age_salary_post | 76      | NULL |   30 |   100.00 | Using index |
+----+-------------+-------+------------+-------+-------------------------+-------------------------+---------+------+------+----------+-------------+
```

### order by优化

- using index

通过有序索引顺序扫描，直接返回有序的数据，不需要额外的排序，效率比较高

- using filesort

通过索引或者全表扫描，读取满足条件的记录，然后在排序缓冲区里面完成排序操作，只要不是通过索引直接返回排序结果的排序，都是filesort

- 总结
  - 1、尽量使用覆盖索引
  - 2、对于多字段排序，需要遵循最左前缀法则
  - 3、如果需要一个升序，一个降序，需要在创建索引的时候就指定好（8.0后支持）
  - 4、mysql缓冲区大小默认是256k，如果是大数据量要进行filesort，可以根据实际情况，适当增大排序缓冲区

```sql
-- 倒序会使用 filesort
mysql> explain select id, age, salary from emp order by age desc, salary desc;
+----+-------------+-------+------------+-------+---------------+-------------------------+---------+------+------+----------+----------------------------------+
| id | select_type | table | partitions | type  | possible_keys | key                     | key_len | ref  | rows | filtered | Extra                            |
+----+-------------+-------+------------+-------+---------------+-------------------------+---------+------+------+----------+----------------------------------+
|  1 | SIMPLE      | emp   | NULL       | index | NULL          | idx_emp_age_salary_post | 76      | NULL |   30 |   100.00 | Backward index scan; Using index |
+----+-------------+-------+------------+-------+---------------+-------------------------+---------+------+------+----------+----------------------------------+

-- 升序只使用index
mysql> explain select id, age, salary from emp order by age, salary;
+----+-------------+-------+------------+-------+---------------+-------------------------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key                     | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+-------------------------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | emp   | NULL       | index | NULL          | idx_emp_age_salary_post | 76      | NULL |   30 |   100.00 | Using index |
+----+-------------+-------+------------+-------+---------------+-------------------------+---------+------+------+----------+-------------+

-- 倒序会使用 filesort
mysql> explain select id, age, salary from emp order by age, salary desc;
+----+-------------+-------+------------+-------+---------------+-------------------------+---------+------+------+----------+-----------------------------+
| id | select_type | table | partitions | type  | possible_keys | key                     | key_len | ref  | rows | filtered | Extra                       |
+----+-------------+-------+------------+-------+---------------+-------------------------+---------+------+------+----------+-----------------------------+
|  1 | SIMPLE      | emp   | NULL       | index | NULL          | idx_emp_age_salary_post | 76      | NULL |   30 |   100.00 | Using index; Using filesort |
+----+-------------+-------+------------+-------+---------------+-------------------------+---------+------+------+----------+-----------------------------+

-- 可以增加倒序的索引（8.0后支持）
mysql> create index idx_emp_age_salary_ad on emp(age desc, salary);
-- 这样再使用倒序就没有 filesort 了
mysql> explain select id, age, salary from emp order by age desc, salary;
+----+-------------+-------+------------+-------+---------------+-----------------------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key                   | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+-----------------------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | emp   | NULL       | index | NULL          | idx_emp_age_salary_ad | 9       | NULL |   30 |   100.00 | Using index |
+----+-------------+-------+------------+-------+---------------+-----------------------+---------+------+------+----------+-------------+

-- 不使用覆盖索引会导致查询效率很低
mysql> explain select * from emp order by age desc, salary;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
|  1 | SIMPLE      | emp   | NULL       | ALL  | NULL          | NULL | NULL    | NULL |   30 |   100.00 | Using filesort |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+

-- 查看排序缓冲区大小
mysql> select @@sort_buffer_size;
+--------------------+
| @@sort_buffer_size |
+--------------------+
|             262144 |
+--------------------+
```

### limit优化


- 使用覆盖索引

```sql
select id from test_data limit 40000000, 10;
```

- 使用子查询

```sql
select * from test_data d join (select * from test_data limit 40000000, 10) t on d.id=t.id;
```

### count优化

- count(*)

和count(数字)差不多，不取值，直接累加，同时innodb对它还做了优化

- count(数字)

innodb会遍历整张表，不取值，只要遍历到一行记录，就会用一个数字作为这行记录的值，然后直接计数累加

- count(主键)

innodb会遍历整张表，把每一行的主键取出来，直接计数累加

- count(字段名)：不统计null值

判断当前字段是否有not null 约束

如果没有，innodb会遍历整张表，把每一行的字段值取出来，然后判断是否为null，不为null，则计数累加

如果有，innodb会遍历整张表，把每一行的字段值取出来，直接计数累加


### update优化

要根据有索引的字段进行更新，不然就会出现行锁升级成表锁的现象，因为innodb的行锁是针对索引加的锁，不是针对记录加的锁，而且这个索引不能失效，如果索引失效，行锁同样会升级为表锁。