---
title: '窗口函数'
excerpt: '窗口函数'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-12-01 10:11:16'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 窗口函数

```sql
select id, name, post, count(post) over(partition by post) 岗位人数 from emp;
select id, name, post, sum(salary) over(partition by post, id) 岗位总薪资 from emp;
```

如果使用 `order by` 来排序的话，那么每一个都是一个窗口

```sql
-- 统计岗位薪资
select id, name, post, salary, sum(salary) over(partition by post order by salary) 岗位总薪资 from emp;
+----+-----------+--------------+----------+-----------------+
| id | name      | post         | salary   | 岗位总薪资      |
+----+-----------+--------------+----------+-----------------+
| 28 | 卢俊义    | 会计         |  4000.00 |         4000.00 |
| 29 | 晁盖      | 出纳         |  3500.00 |         3500.00 |
|  9 | 吕布      | 前端开发     |  9000.00 |         9000.00 |
| 10 | 周瑜      | 前端开发     | 36000.00 |        45000.00 |
|  8 | 典⻙      | 后端开发     |  6800.00 |         6800.00 |
|  5 | ⻢超      | 后端开发     | 11000.00 |        17800.00 |
|  6 | ⻩忠      | 后端开发     | 15000.00 |        32800.00 |
|  7 | 夏侯惇    | 后端开发     | 34000.00 |        66800.00 |
+----+-----------+--------------+----------+-----------------+

-- 统计历史平均
select id, name, post, salary, avg(salary) over(order by id) 历史平均薪资 from emp;
+----+-----------+--------------+----------+--------------------+
| id | name      | post         | salary   | 历史平均薪资       |
+----+-----------+--------------+----------+--------------------+
|  1 | 刘备      | 总经理       |  4000.00 |        4000.000000 |
|  2 | 关⽻      | 技术总监     |  8000.00 |        6000.000000 |
|  3 | 张⻜      | 项⽬经理     | 12000.00 |        8000.000000 |
|  4 | 赵云      | 产品经理     |  6800.00 |        7700.000000 |
|  5 | ⻢超      | 后端开发     | 11000.00 |        8360.000000 |
|  6 | ⻩忠      | 后端开发     | 15000.00 |        9466.666667 |
|  7 | 夏侯惇    | 后端开发     | 34000.00 |       12971.428571 |
+----+-----------+--------------+----------+--------------------+
```

- `first_value`：取分组排序之后的第一个值

```sql
mysql> select id, name, post, first_value(salary) over(partition by post order by salary, id) first from emp;
+----+-----------+--------------+-----------------+
| id | name      | post         | first      |
+----+-----------+--------------+-----------------+
| 28 | 卢俊义    | 会计         |         4000.00 |
| 29 | 晁盖      | 出纳         |         3500.00 |
|  9 | 吕布      | 前端开发     |         9000.00 |
| 10 | 周瑜      | 前端开发     |         9000.00 |
|  8 | 典⻙      | 后端开发     |         6800.00 |
|  5 | ⻢超      | 后端开发     |         6800.00 |
|  6 | ⻩忠      | 后端开发     |         6800.00 |
|  7 | 夏侯惇    | 后端开发     |         6800.00 |
+----+-----------+--------------+-----------------+
```

- `last_value`：取分组排序之后的最后一个值

```sql
select id, name, post, last_value(salary) over(partition by post order by salary, id) last from emp;
+----+-----------+--------------+-----------------+
| id | name      | post         | last      |
+----+-----------+--------------+-----------------+
| 28 | 卢俊义    | 会计         |         4000.00 |
| 29 | 晁盖      | 出纳         |         3500.00 |
|  9 | 吕布      | 前端开发     |         9000.00 |
| 10 | 周瑜      | 前端开发     |        36000.00 |
|  8 | 典⻙      | 后端开发     |         6800.00 |
|  5 | ⻢超      | 后端开发     |        11000.00 |
|  6 | ⻩忠      | 后端开发     |        15000.00 |
|  7 | 夏侯惇    | 后端开发     |        34000.00 |
+----+-----------+--------------+-----------------+
```

- `lead`：获取下一条数据的值

```sql
mysql> select id, name, post, salary, lead(salary) over(order by id) 下一个薪资 from emp;
+----+-----------+--------------+----------+-----------------+
| id | name      | post         | salary   | 下一个薪资      |
+----+-----------+--------------+----------+-----------------+
|  5 | ⻢超      | 后端开发     | 11000.00 |        15000.00 |
|  6 | ⻩忠      | 后端开发     | 15000.00 |        34000.00 |
|  7 | 夏侯惇    | 后端开发     | 34000.00 |         6800.00 |
|  8 | 典⻙      | 后端开发     |  6800.00 |         9000.00 |
|  9 | 吕布      | 前端开发     |  9000.00 |        36000.00 |
| 10 | 周瑜      | 前端开发     | 36000.00 |        24000.00 |
| 11 | ⽂丑      | 测试         | 24000.00 |         8000.00 |
| 12 | 诸葛亮    | 市场总监     |  8000.00 |         4200.00 |
| 13 | 庞统      | 销售         |  4200.00 |         4000.00 |
| 14 | 徐庶      | 销售         |  4000.00 |         2400.00 |
| 15 | 荀彧      | 销售         |  2400.00 |         2400.00 |
| 30 | 貂蝉      | NULL         |   800.00 |            NULL |
+----+-----------+--------------+----------+-----------------+
```

- `lag`：获取上一条数据的值

```sql
select id, name, post, salary, lag(salary) over(order by id) 上一个薪资 from emp;
+----+-----------+--------------+----------+-----------------+
| id | name      | post         | salary   | 上一个薪资      |
+----+-----------+--------------+----------+-----------------+
|  1 | 刘备      | 总经理       |  4000.00 |            NULL |
| 24 | 顾⼤嫂    | 招聘专员     |  3300.00 |         2500.00 |
| 25 | 孙⼆娘    | 绩效专员     |  2400.00 |         3300.00 |
| 26 | 丁得孙    | 培训专员     |  2800.00 |         2400.00 |
| 27 | 柴进      | 财务总监     |  8000.00 |         2800.00 |
| 28 | 卢俊义    | 会计         |  4000.00 |         8000.00 |
| 29 | 晁盖      | 出纳         |  3500.00 |         4000.00 |
| 30 | 貂蝉      | NULL         |   800.00 |         3500.00 |
+----+-----------+--------------+----------+-----------------+

select id, name, post, salary, lag(salary) over(order by id) 上一个薪资, salary - lag(salary) over(order by id) 差值 from emp;
+----+-----------+--------------+----------+-----------------+-----------+
| id | name      | post         | salary   | 上一个薪资      | 差值      |
+----+-----------+--------------+----------+-----------------+-----------+
|  1 | 刘备      | 总经理       |  4000.00 |            NULL |      NULL |
| 18 | 司⻢懿    | 销售         |  5000.00 |         4300.00 |    700.00 |
| 19 | 杨修      | 销售         |   800.00 |         5000.00 |  -4200.00 |
| 20 | 丁仪      | 销售         |  3500.00 |          800.00 |   2700.00 |
| 21 | 宋江      | ⼈事总监     |  8000.00 |         3500.00 |   4500.00 |
| 22 | 吴⽤      | ⼈事主管     |  3000.00 |         8000.00 |  -5000.00 |
| 23 | 扈三娘    | 招聘专员     |  2500.00 |         3000.00 |   -500.00 |
| 24 | 顾⼤嫂    | 招聘专员     |  3300.00 |         2500.00 |    800.00 |
| 25 | 孙⼆娘    | 绩效专员     |  2400.00 |         3300.00 |   -900.00 |
| 26 | 丁得孙    | 培训专员     |  2800.00 |         2400.00 |    400.00 |
| 27 | 柴进      | 财务总监     |  8000.00 |         2800.00 |   5200.00 |
| 28 | 卢俊义    | 会计         |  4000.00 |         8000.00 |  -4000.00 |
| 29 | 晁盖      | 出纳         |  3500.00 |         4000.00 |   -500.00 |
| 30 | 貂蝉      | NULL         |   800.00 |         3500.00 |  -2700.00 |
+----+-----------+--------------+----------+-----------------+-----------+
```

- `rank`：排名

```sql
select id, name, post, salary, rank() over(order by id) 排名 from emp;
+----+-----------+--------------+----------+--------+
| id | name      | post         | salary   | 排名   |
+----+-----------+--------------+----------+--------+
|  1 | 刘备      | 总经理       |  4000.00 |      1 |
|  2 | 关⽻      | 技术总监     |  8000.00 |      2 |
|  3 | 张⻜      | 项⽬经理     | 12000.00 |      3 |
|  4 | 赵云      | 产品经理     |  6800.00 |      4 |
| 25 | 孙⼆娘    | 绩效专员     |  2400.00 |     25 |
| 26 | 丁得孙    | 培训专员     |  2800.00 |     26 |
| 27 | 柴进      | 财务总监     |  8000.00 |     27 |
| 28 | 卢俊义    | 会计         |  4000.00 |     28 |
| 29 | 晁盖      | 出纳         |  3500.00 |     29 |
| 30 | 貂蝉      | NULL         |   800.00 |     30 |
+----+-----------+--------------+----------+--------+

mysql> select id, name, post, salary, rank() over(partition by post order by salary) 排名 from emp;
+----+-----------+--------------+----------+--------+
| id | name      | post         | salary   | 排名   |
+----+-----------+--------------+----------+--------+
| 30 | 貂蝉      | NULL         |   800.00 |      1 |
| 19 | 杨修      | 销售         |   800.00 |      1 |
| 15 | 荀彧      | 销售         |  2400.00 |      2 |
| 16 | 荀攸      | 销售         |  2400.00 |      2 |
| 20 | 丁仪      | 销售         |  3500.00 |      4 |
| 14 | 徐庶      | 销售         |  4000.00 |      5 |
| 13 | 庞统      | 销售         |  4200.00 |      6 |
| 17 | 鲁肃      | 销售         |  4300.00 |      7 |
| 18 | 司⻢懿    | 销售         |  5000.00 |      8 |
|  3 | 张⻜      | 项⽬经理     | 12000.00 |      1 |
+----+-----------+--------------+----------+--------+

mysql> select id, name, post, salary, rank() over(order by salary) 排名 from emp;
+----+-----------+--------------+----------+--------+
| id | name      | post         | salary   | 排名   |
+----+-----------+--------------+----------+--------+
| 19 | 杨修      | 销售         |   800.00 |      1 |
| 30 | 貂蝉      | NULL         |   800.00 |      1 |
| 15 | 荀彧      | 销售         |  2400.00 |      3 |
| 16 | 荀攸      | 销售         |  2400.00 |      3 |
| 25 | 孙⼆娘    | 绩效专员     |  2400.00 |      3 |
| 23 | 扈三娘    | 招聘专员     |  2500.00 |      6 |
| 26 | 丁得孙    | 培训专员     |  2800.00 |      7 |
| 22 | 吴⽤      | ⼈事主管     |  3000.00 |      8 |
+----+-----------+--------------+----------+--------+
```

- `dense_rank`：排名中间不出现跳过

```sql
+----+-----------+--------------+----------+--------+
| id | name      | post         | salary   | 排名   |
+----+-----------+--------------+----------+--------+
| 19 | 杨修      | 销售         |   800.00 |      1 |
| 30 | 貂蝉      | NULL         |   800.00 |      1 |
| 15 | 荀彧      | 销售         |  2400.00 |      2 |
| 16 | 荀攸      | 销售         |  2400.00 |      2 |
| 25 | 孙⼆娘    | 绩效专员     |  2400.00 |      2 |
| 23 | 扈三娘    | 招聘专员     |  2500.00 |      3 |
| 26 | 丁得孙    | 培训专员     |  2800.00 |      4 |
| 22 | 吴⽤      | ⼈事主管     |  3000.00 |      5 |
+----+-----------+--------------+----------+--------+
```

- `row_number`：行号