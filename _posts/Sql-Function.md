---
title: '函数'
excerpt: '函数'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-10-10 11:34:42'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 函数

### 字符串处理函数

```sql
-- 字符串拼接
select concat('a', 'c', 'b'); -- acb

-- 转小写
select lower('HELLO'); -- hello

-- 转大写
select upper('hello');-- HELLO

-- 左填充
-- 用字符串'-'在hello的左边填充至10个字符
select lpad('hello', 10, '-'); -- -----hello
-- 如果原字符串超过10个字符，则会截取10个字符
select lpad('hello world', 10, '-'); -- hello worl

-- 右填充
-- 用字符串'-'在hello的右边填充至10个字符
select rpad('hello', 10, '-'); -- hello-----
-- 如果原字符串超过10个字符，则会截取10个字符
select rpad('hello world', 10, '-'); -- hello worl

-- 去除字符串两边的空格
select trim('    hell o    '); -- hell o

-- 字符串切片
-- 从第2个字符开始，切3个字符
select substring('hello', 2, 3); -- ell
```

### 数值处理函数

```sql
-- 向上取整
select ceil(1.3); -- 2

-- 向下取整
select floor(1.3); -- 1

-- 取余
select mod(10, 3); -- 0.7917309829888223

-- 获取0～1的随机小数
select rand(); -- 0.7917309829888223

-- 四舍五入
-- 第二个参数是要保留的小数位数
select round(3.229888223, 4); -- 3.2299
```

### 日期处理函数

```sql
-- 获取当前日期
select '当前日期', curdate(); -- 2023-10-10

-- 获取当前时间
select '当前时间', curtime(); -- 14:45:35

-- 获取当前日期和时间
select '当前日期时间', now(); -- 2023-10-10 14:46:14

-- 获取date_time的年份
select '年', year('2023-10-10 14:46:14'); -- 2023

-- 获取date_time的月份
select '月', month('2023-10-10 14:46:14'); -- 10

-- 获取date_time的日期
select '日', day('2023-10-10 14:46:14'); -- 10

-- 获取date_time的小时
select '时', hour('2023-10-10 14:46:14'); -- 14

-- 获取date_time的分钟
select '分', minute('2023-10-10 14:46:14'); -- 46

-- 获取date_time的秒钟
select '秒', second('2023-10-10 14:46:14'); -- 14

-- 时间差计算
-- interval单位：year、month、day、hour、minute、second、microsecond
-- 获取一年后的时间
select date_add(now(), interval 1 year); -- 2024-10-10 14:53:38

-- 获取一月后的时间
select date_add('2024-1-31 14:33:38', interval 1 month); -- 2024-02-29 14:33:38

-- 获取相差的天数
-- 第一个参数必须要大于第二个参数
select datediff('2024-02-29 14:33:38', now()); -- 142

-- 获取相差的小时数
select timediff('2023-10-10 18:53:38', now()); -- 03:53:16
select timediff('2023-10-09 18:53:38', now()); -- -20:07:16
```

### 流程控制函数

#### 单分支

```sql
-- if 判断
-- 传递三个参数，第一个参数是条件，条件满足返回第二个参数，条件不满足返回第三个参数
select name, if(gender='male', '男', '女') as '性别' from db3.emp;

-- ifnull 判断是否为空
-- 传递两个参数，第一个参数是要判断的字段，第二个参数是字段为空后采用的值
select name, ifnull(notes, '未知') as 'Note' from db3.emp;
```

#### 多分支

```sql
-- case...when...then...else...end
-- 工资>5300 核心员工
-- 工资>5000 普通员工
-- 工资<=5000 新员工
select 
  name,
  case when salary>5300 then '核心员工' when salary>5000 then '普通员工' else '新员工' end as '员工级别'
from 
  db3.emp
order by
  salary desc;

-- 部门A 高级技术顾问
-- 部门B HR
-- 其他 销售人员
select 
  name,
  case dep when '部门A' then '高级技术顾问' when '部门B' then 'HR' else '销售人员' end as '职位'
from 
  db3.emp;
```