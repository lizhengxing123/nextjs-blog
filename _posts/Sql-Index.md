---
title: '索引'
excerpt: '索引'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-10-17 10:16:06'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 索引

索引是一种有序的数据结构，它可以帮助 MySQL 高效获取数据

> 数据进行增删改操作的时候，索引节点也会同步增删改

### B+Tree索引

使用最广泛的索引结构

> 可视化网站：[https://www.cs.usfca.edu/~galles/visualization/Algorithms.html](https://www.cs.usfca.edu/~galles/visualization/Algorithms.html)

#### 二叉树

顺序插入时，会形成链表，查询效率大幅度降低

#### 红黑树

当数据量特别大的时候，层级非常深，查找速度同样会很慢

#### B-Tree

多路平衡查找树


#### B+Tree

所有数据都会出现在叶子节点，叶子结点会形成一个单向链表

#### Innodb索引结构

B+Tree非叶子节点不存数据，一页能存的指针和key就会更多，每个节点存的指针和key多了，相同数据量的情况下，B+Tree的高度肯定要比B-Tree更低，树的高度低了，查询次数就少了，磁盘io也就少了


### Hash索引

Memory 引擎支持 Hash 索引，它的数据是存储在内存中的

Innodb 引擎里面也有一个自适应 Hash 功能，它会根据查询条件，在特定情况下，自动根据 B+Tree 索引构建 Hash 索引


### FULL-Text索引

### R-Tree索引

### 索引分类

- 主键索引

- 唯一索引

- 常规索引

- 全文索引

按照存储方式不同，可以分为

- 聚集索引（聚簇索引）
- 二级索引（辅助索引，非聚集索引）

> 如果存在主键，主键索引就是聚集索引
>
> 如果不存在主键，第一个唯一字段将会被作为聚集索引
>
> 如果没有主键，也没有唯一字段，innodb 会自动生成一个 rowid，作为隐藏的聚集索引


### 索引语法

#### 创建索引

```sql
-- unique 表示创建唯一索引
-- fulltext 表示创建全文索引
-- 如果不加这两个，说明创建的是常规索引
create {unique|fulltext} index 索引名称 on 表名(字段名...);
```

#### 查询索引

```sql
show index from 表名;
```

#### 删除索引

```sql
drop index 索引名称 on 表名;
```

例子

```sql
create database db1 charset utf8mb4;

use db1;

create table emp
(
    id        int primary key auto_increment,
    name      varchar(16)            not null,
    gender    enum ('male','female') not null,
    phone     varchar(11)            not null,
    email     varchar(50),
    age       int                    not null,
    salary    float(10, 2),
    post      varchar(16),
    join_date date,
    leader_id int
);

insert into emp values
(1, '刘备', 'male', '13035445001', 'abcdabcdeabc@qq.com', 32, 4000, '总经理', '2035-06-01', null),
(2, '关⽻', 'male', '13035445002', 'abcdabcdeghefg@qq.com', 20, 8000, '技术总监', '2035-06-05', 1),
(3, '张⻜', 'male', '13035445003', 'ijklijklijk@qq.com', 25, 12000, '项⽬经理', '2035-06-10', 2),
(4, '赵云', 'male', '13035445004', 'abmnoepmnopmno@qq.com', 19, 6800, '产品经理', '2035-06-10', 2),
(5, '⻢超', 'male', '13035445005', 'abqrstqrstqrs@qq.com', 26, 11000, '后端开发', '2035-07-11', 2),
(6, '⻩忠', 'female', '13035445006', 'abuvwxuvwxuvw@qq.com', 48, 15000, '后端开发', '2035-07-22', 2),
(7, '夏侯惇', 'male', '13035445007', 'yzabyzabyza@qq.com', 36, 34000, '后端开发', '2035-07-29', 2),
(8, '典⻙', 'male', '13035445008', 'cdefcdefcdef@qq.com', 19, 6800, '后端开发', '2035-08-02', 2),
(9, '吕布', 'female', '13035445009', 'ghijghijghij@qq.com', 20, 9000, '前端开发', '2035-08-03', 2),
(10, '周瑜', 'female', '13035445010', 'klmnklmnklmn@qq.com', 32, 36000, '前端开发', '2035-08-08', 2),
(11, '⽂丑', 'male', '13035445011', 'opqropqropqr@qq.com', 27, 24000, '测试', '2035-08-12', 2),
(12, '诸葛亮', 'male', '13035445012', 'stuevstuvstuv@qq.com', 27, 8000, '市场总监', '2035-06-05', 1),
(13, '庞统', 'male', '13035445013', 'wxyezwxyzwxy@qq.com', 37, 4200, '销售', '2035-06-06', 12),
(14, '徐庶', 'male', '13035445014', 'xabcdefghijk@qq.com', 36, 4000, '销售', '2035-06-12', 12),
(15, '荀彧', 'male', '13035445015', 'lmnopqrstuv@qq.com', 25, 2400, '销售', '2035-06-10', 12),
(16, '荀攸', 'male', '13035445016', 'wxyszabcdefg@qq.com', 25, 2400, '销售', '2035-06-12', 12),
(17, '鲁肃', 'male', '13035445017', 'hijklmnopqr@qq.com', 43, 4300, '销售', '2035-06-18', 12),
(18, '司⻢懿', 'female', '13035445018', 'stuvwxyzabc@qq.com', 44, 5000, '销售', '2035-06-20', 12),
(19, '杨修', 'male', '13035445019', 'defghijklmn@qq.com', 19, 800, '销售', '2035-07-10', 12),
(20, '丁仪', 'male', '13035445020', 'opqsrstuvwxy@qq.com', 49, 3500, '销售', '2035-07-11', 12),
(21, '宋江', 'male', '13035445021', 'zabcdefghijkl@qq.com', 30, 8000, '⼈事总监', '2035-06-05', 1),
(22, '吴⽤', 'male', '13035445022', 'mnopqrstuvwxyz@qq.com', 38, 3000, '⼈事主管', '2035-06-06', 21),
(23, '扈三娘', 'female', '13035445023', 'sabcdefghijklm@qq.com', 42, 2500, '招聘专员', '2035-06-11', 21),
(24, '顾⼤嫂', 'female', '13035445024', 'fnopqrstuvwxyz@qq.com', 38, 3300, '招聘专员', '2035-06-25', 21),
(25, '孙⼆娘', 'female', '13035445025', 'wabcdefghijklf@qq.com', 32, 2400, '绩效专员', '2035-07-22', 21),
(26, '丁得孙', 'male', '13035445026', 'enopqrstuvwxyz@qq.com', 32, 2800, '培训专员', '2035-08-10', 21),
(27, '柴进', 'male', '13035445027', 'tabcdefghijkli@qq.com', 30, 8000, '财务总监', '2035-06-05', 1),
(28, '卢俊义', 'male', '13035445028', 'inopqrstuvwxyz@qq.com', 44, 4000, '会计', '2035-08-19', 27),
(29, '晁盖', 'male', '13035445029', 'oabcdefghijkle@qq.com', 44, 3500, '出纳', '2035-08-20', 27),
(30, '貂蝉', 'female', '13035445030', 'wnopqrstuvwxyz@qq.com', 36, 800, null, '2035-09-01', null);
```

实际使用

```sql
-- 查看索引
mysql> show index from emp;
+-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| emp   |          0 | PRIMARY  |            1 | id          | A         |          30 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
+-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+

-- 创建索引 命名规则 idx_表名_字段名
-- 给 name 创建常规索引
mysql> create index idx_emp_name on emp(name);

-- 给 phone 创建唯一索引
mysql> create unique index idx_emp_phone on emp(phone);

-- 给 age salary post 创建联合索引
mysql> create index idx_emp_age_salary_post on emp(age, salary, post);

mysql> show index from emp;
+-------+------------+-------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table | Non_unique | Key_name                | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+-------+------------+-------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| emp   |          0 | PRIMARY                 |            1 | id          | A         |          30 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| emp   |          0 | idx_emp_phone           |            1 | phone       | A         |          30 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| emp   |          1 | idx_emp_name            |            1 | name        | A         |          30 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| emp   |          1 | idx_emp_age_salary_post |            1 | age         | A         |          15 |     NULL |   NULL |      | BTREE      |         |               | YES     | NULL       |
| emp   |          1 | idx_emp_age_salary_post |            2 | salary      | A         |          27 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
| emp   |          1 | idx_emp_age_salary_post |            3 | post        | A         |          29 |     NULL |   NULL | YES  | BTREE      |         |               | YES     | NULL       |
+-------+------------+-------------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
```

全文索引

```sql
-- 创建新表
create table articles(content varchar(5000));

-- 插入数据
insert into articles values
('这⼏天⼼⾥颇不宁静。今晚在院⼦⾥坐着乘凉，忽然想起⽇⽇⾛过的荷塘，在这满⽉的光⾥，总该另有⼀番样⼦吧。⽉亮渐渐地升⾼了，墙外⻢路上孩⼦们的欢笑，已经听不⻅了；妻在屋⾥拍着闰⼉，迷迷糊糊地哼着眠歌。我悄悄地披了⼤衫，带上⻔出去。'),('这时我看⻅他的背影，我的泪很快地流下来了。我赶紧拭⼲了泪。怕他看⻅，也怕别⼈看⻅。我再向外看时，他已抱了朱红的橘⼦往回⾛了。过铁道时，他先将橘⼦散放在地上，⾃⼰慢慢爬下，再抱起橘⼦⾛。到这边时，我赶紧去搀他。他和我⾛到⻋上，将橘⼦⼀股脑⼉放在我的⽪⼤⾐上。'),
('Life is too short to spend time with people who suck the 
happiness out of you. If someone wants you in their life, they’ll 
make room for you. You shouldn’t have to fight for a spot. Never, 
ever insist yourself to someone who continuously overlooks your 
worth. And remember, it’s not the people that stand by your side 
when you’re at your best, but the ones who stand beside you when 
you’re at your worst that are your true friends.');

-- 创建全文索引
-- 默认只能检索英文，如果要支持中文，需要指定中文解析器
mysql> create fulltext index idx_articles_content on articles(content) with parser ngram;

mysql> show index from articles;
+----------+------------+----------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| Table    | Non_unique | Key_name             | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
+----------+------------+----------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
| articles |          1 | idx_articles_content |            1 | content     | NULL      |           3 |     NULL |   NULL | YES  | FULLTEXT   |         |               | YES     | NULL       |
+----------+------------+----------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+---------+------------+
1 row in set (0.01 sec)

-- 使用全文索引搜索
-- match(字段名) against(需要搜索的词)
mysql> select * from articles where match(content) against('月亮');

-- 创建表的时候创建全⽂索引
create table articles(
  content varchar(5000),
  fulltext (content) with parser ngram
);

-- 删除索引
mysql> drop index idx_articles_content on articles;
```

### SQL 性能分析

#### 查询sql执行频次

```sql
-- session 表示当前会话
-- global 表示全局
show {session|global} status like {'com_insert'|'com_delete'|'com_update'|'com_select'}

-- 查询插入次数
mysql> show global status like 'com_insert';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Com_insert    | 3     |
+---------------+-------+

-- 使用通配符 _
mysql> show global status like 'com_______';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Com_binlog    | 0     |
| Com_commit    | 0     |
| Com_delete    | 0     |
| Com_import    | 0     |
| Com_insert    | 3     |
| Com_repair    | 0     |
| Com_revoke    | 0     |
| Com_select    | 86    |
| Com_signal    | 0     |
| Com_update    | 0     |
| Com_xa_end    | 0     |
+---------------+-------+

-- 也可以使用正则
mysql> show global status where Variable_name rlike 'com_[idus][enp].{4}$';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| Com_delete    | 0     |
| Com_insert    | 3     |
| Com_select    | 86    |
| Com_update    | 0     |
+---------------+-------+
```

#### 慢查询日志

执行时间超过规定时间（默认是10s）的查询语句会被记录到慢查询日志中

```sql
-- 查看慢查询日志
mysql> show variables like 'slow%';
+---------------------+-----------------------------+
| Variable_name       | Value                       |
+---------------------+-----------------------------+
| slow_launch_time    | 2                           |
| slow_query_log      | OFF                         |
| slow_query_log_file | /var/lib/mysql/192-slow.log |
+---------------------+-----------------------------+

mysql> select @@slow_query_log;
+------------------+
| @@slow_query_log |
+------------------+
|                0 |
+------------------+

-- 开启慢查询日志 需要全局设置
mysql> set @@global.slow_query_log=1;

mysql> select @@slow_query_log;
+------------------+
| @@slow_query_log |
+------------------+
|                1 |
+------------------+

-- 查询慢查询日志的时间阈值（当前会话的）
mysql> select @@long_query_time;
+-------------------+
| @@long_query_time |
+-------------------+
|         10.000000 |
+-------------------+

-- 更改全局的慢查询日志时间阈值
mysql> set @@global.long_query_time=2;

-- 加 session 或不写 global 默认就是当前会话级别的
-- 当前会话级别查询不到变量，就会去全局查找，类似 python 的作用域

-- 当前会话的时间阈值
mysql> select @@long_query_time;
+-------------------+
| @@long_query_time |
+-------------------+
|         10.000000 |
+-------------------+

-- 当前会话的时间阈值
mysql> select @@session.long_query_time;
+---------------------------+
| @@session.long_query_time |
+---------------------------+
|                 10.000000 |
+---------------------------+

-- 全局的的时间阈值
mysql> select @@global.long_query_time;
+--------------------------+
| @@global.long_query_time |
+--------------------------+
|                 2.000000 |
+--------------------------+
```

> mysql 服务端重启之后，设置的全局变量都会失效
> 
> 因此不建议以上的设置方式

要设置这两个变量，我们需要更改 mysql 的配置文件

```shell
# 打开mysql配置文件
vi /etc/my.cnf

# 在 [mysqld] 下面增加两条
[mysqld]
slow_query_log=1
long_query_time=2
```

#### 千万数据准备

```python
# 使用 python 生成 五千万条 数据
with open('/Users/lizhengxing/Desktop/data.txt', mode='wt', encoding='utf8') as f:
    for i in range(1, 50000001):
        f.write('{0},用户{0}\n'.format(i))
```

#### 千万数据导入

```sql
-- 上传到 root 根目录下

-- 连接数据库 需要加参数
mysql --local-infile

-- 设置 local_infile 变量
mysql> select @@local_infile;
+----------------+
| @@local_infile |
+----------------+
|              0 |
+----------------+

mysql> set @@global.local_infile=1;
mysql> select @@local_infile;
+----------------+
| @@local_infile |
+----------------+
|              1 |
+----------------+

-- 创建表
mysql> use db1;
mysql> create table test_data(id int primary key, name varchar(16));

-- 导入数据
-- 设置字段的分隔符   fields terminated by '分隔符'
-- 设置每一行的分隔符 lines terminated by '分隔符'
mysql> load data local infile '/root/data.txt' into table test_data fields terminated by ',' lines terminated by '\n';

-- 查询
mysql> select * from test_data where name='用户9999';
+------+------------+
| id   | name       |
+------+------------+
| 9999 | 用户9999   |
+------+------------+
1 row in set (18.02 sec)

-- 查看慢查询日志
# Time: 2023-10-17T08:50:29.282876Z
# User@Host: root[root] @ localhost []  Id:     8
# Query_time: 18.025266  Lock_time: 0.001500 Rows_sent: 1  Rows_examined: 50000000
SET timestamp=1697532611;
select * from test_data where name='用户9999';
```

#### profile

```sql
-- 查看当前数据库是否支持 profile
mysql> select @@have_profiling;
+------------------+
| @@have_profiling |
+------------------+
| YES              |
+------------------+

-- 查看是否开启了 profile
mysql> select @@profiling;
+-------------+
| @@profiling |
+-------------+
|           0 |
+-------------+

-- 开启会话级别的 profile
mysql> set @@profiling=1;

-- 进行一些查询
mysql> select * from emp;
mysql> select * from emp where id=10;
mysql> select * from emp where name='周瑜';
mysql> select * from test_data where id=9999;
mysql> select * from test_data where name='用户9999';

-- 查看sql时间消耗详情
mysql> show profiles;
+----------+-------------+-------------------------------------------------+
| Query_ID | Duration    | Query                                           |
+----------+-------------+-------------------------------------------------+
|        2 |  0.00704550 | select * from emp                               |
|        4 |  0.00244125 | select * from emp where id=10                   |
|        5 |  0.00144925 | select * from emp where name='周瑜'             |
|        6 |  0.00298875 | select * from test_data where id=9999           |
|        7 | 22.26662750 | select * from test_data where name='用户9999'   |
+----------+-------------+-------------------------------------------------+

-- 查询语句具体的耗时
mysql> show profile for query 7;
+--------------------------------+-----------+
| Status                         | Duration  |
+--------------------------------+-----------+
| starting                       |  0.000232 |
| Executing hook on transaction  |  0.000006 |
| starting                       |  0.000008 |
| checking permissions           |  0.000029 |
| Opening tables                 |  0.000040 |
| init                           |  0.000006 |
| System lock                    |  0.000009 |
| optimizing                     |  0.000012 |
| statistics                     |  0.000020 |
| preparing                      |  0.000020 |
| executing                      | 22.253306 |
| end                            |  0.002319 |
| query end                      |  0.001369 |
| waiting for handler commit     |  0.001177 |
| closing tables                 |  0.000568 |
| freeing items                  |  0.001483 |
| logging slow query             |  0.005992 |
| cleaning up                    |  0.000034 |
+--------------------------------+-----------+

-- 查询 sql 语句具体耗时情况及cpu情况
mysql> show profile cpu for query 7;
+--------------------------------+-----------+-----------+------------+
| Status                         | Duration  | CPU_user  | CPU_system |
+--------------------------------+-----------+-----------+------------+
| starting                       |  0.000232 |  0.000000 |   0.000174 |
| Executing hook on transaction  |  0.000006 |  0.000000 |   0.000004 |
| starting                       |  0.000008 |  0.000000 |   0.000007 |
| checking permissions           |  0.000029 |  0.000000 |   0.000027 |
| Opening tables                 |  0.000040 |  0.000000 |   0.000037 |
| init                           |  0.000006 |  0.000000 |   0.000005 |
| System lock                    |  0.000009 |  0.000000 |   0.000009 |
| optimizing                     |  0.000012 |  0.000000 |   0.000011 |
| statistics                     |  0.000020 |  0.000000 |   0.000018 |
| preparing                      |  0.000020 |  0.000000 |   0.000018 |
| executing                      | 22.253306 | 16.933415 |   2.376655 |
| end                            |  0.002319 |  0.000245 |   0.000065 |
| query end                      |  0.001369 |  0.000000 |   0.000189 |
| waiting for handler commit     |  0.001177 |  0.000000 |   0.000170 |
| closing tables                 |  0.000568 |  0.000000 |   0.000125 |
| freeing items                  |  0.001483 |  0.000095 |   0.000385 |
| logging slow query             |  0.005992 |  0.000951 |   0.000060 |
| cleaning up                    |  0.000034 |  0.000024 |   0.000007 |
+--------------------------------+-----------+-----------+------------+
```

#### explain

```sql
-- 查看 sql 的执行计划
explain <select 语句>

mysql> explain select * from test_data where id=9999;
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | test_data | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
```

- `select_type`

是查询类型，其中 `SIMPLE` 表示简单查询

- `type`

访问类型，性能由差到好为 `all<index<range<ref<eq_ref<const<system<NULL`

`NULL` 表示不访问任何表

`system` 要在 `myisam` 存储引擎里才能看到，并且表里只有一条数据才能看到

```sql
mysql> create table t_system(id int primary key, name varchar(16)) engine=myisam;
mysql> insert into t_system values(1, 'lzx');
mysql> explain select * from t_system;
+----+-------------+----------+------------+--------+---------------+------+---------+------+------+----------+-------+
| id | select_type | table    | partitions | type   | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
+----+-------------+----------+------------+--------+---------------+------+---------+------+------+----------+-------+
|  1 | SIMPLE      | t_system | NULL       | system | NULL          | NULL | NULL    | NULL |    1 |   100.00 | NULL  |
+----+-------------+----------+------------+--------+---------------+------+---------+------+------+----------+-------+
```

`const` 比较常见，只要是根据主键或者唯一索引查询，就是出现

`eq_ref` 是连表查询的时候，连接条件使用的字段都是唯一索引或主键索引字段，一般就会出现这种类型

`ref` 根据非唯一索引查询

```sql
mysql> explain select * from emp where phone='13035445022';
+----+-------------+-------+------------+-------+---------------+---------------+---------+-------+------+----------+-------+
| id | select_type | table | partitions | type  | possible_keys | key           | key_len | ref   | rows | filtered | Extra |
+----+-------------+-------+------------+-------+---------------+---------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | emp   | NULL       | const | idx_emp_phone | idx_emp_phone | 46      | const |    1 |   100.00 | NULL  |
+----+-------------+-------+------------+-------+---------------+---------------+---------+-------+------+----------+-------+

mysql> explain select * from emp where name='刘备';
+----+-------------+-------+------------+------+---------------+--------------+---------+-------+------+----------+-------+
| id | select_type | table | partitions | type | possible_keys | key          | key_len | ref   | rows | filtered | Extra |
+----+-------------+-------+------------+------+---------------+--------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | emp   | NULL       | ref  | idx_emp_name  | idx_emp_name | 66      | const |    1 |   100.00 | NULL  |
+----+-------------+-------+------------+------+---------------+--------------+---------+-------+------+----------+-------+
```

`range` 是在索引上进行范围查询

`index` 查询的时候走索引，但会遍历整个索引树

`all` 不走索引，全表扫描
 
```sql
mysql> explain select * from emp where age > 40;
+----+-------------+-------+------------+-------+-------------------------+-------------------------+---------+------+------+----------+-----------------------+
| id | select_type | table | partitions | type  | possible_keys           | key                     | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-------+------------+-------+-------------------------+-------------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | emp   | NULL       | range | idx_emp_age_salary_post | idx_emp_age_salary_post | 4       | NULL |    7 |   100.00 | Using index condition |
+----+-------------+-------+------------+-------+-------------------------+-------------------------+---------+------+------+----------+-----------------------+
```

> 这些类型不是绝对的，因为在有些情况下索引会失效

- `possible_keys` 可能用到的索引

- `key` 索引名

- `key_len` 用到的索引字节数，和索引列字段的实际长度有关

- `ref` 连表查询的时候，连接的条件

- `rows` 预估要读取的行数

- `filtered` 返回结果占读取行数的百分比，值越大性能越高

- `Extra` 额外信息

### 索引失效情况

#### 最左前缀法则

对于联合索引，最左列必须存在，并且不跳过联合索引中间的列，如果跳过了联合索引中的某一列，那么后面的字段索引将会失效

```sql
-- 三个索引都用到了
mysql> explain select * from emp where age=25 and salary=2400 and post='销售';
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------------------+------+----------+-----------------------+
| id | select_type | table | partitions | type | possible_keys           | key                     | key_len | ref               | rows | filtered | Extra                 |
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------------------+------+----------+-----------------------+
|  1 | SIMPLE      | emp   | NULL       | ref  | idx_emp_age_salary_post | idx_emp_age_salary_post | 76      | const,const,const |    2 |   100.00 | Using index condition |
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------------------+------+----------+-----------------------+

-- 没有跳过中间列，最左列也存在，用了 age 和 salary 索引
mysql> explain select * from emp where age=25 and salary=2400;
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------------+------+----------+-----------------------+
| id | select_type | table | partitions | type | possible_keys           | key                     | key_len | ref         | rows | filtered | Extra                 |
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------------+------+----------+-----------------------+
|  1 | SIMPLE      | emp   | NULL       | ref  | idx_emp_age_salary_post | idx_emp_age_salary_post | 9       | const,const |    2 |   100.00 | Using index condition |
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------------+------+----------+-----------------------+

-- 没有跳过中间列，最左列也存在，只用了 age 索引
mysql> explain select * from emp where age=25;
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------+------+----------+-------+
| id | select_type | table | partitions | type | possible_keys           | key                     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | emp   | NULL       | ref  | idx_emp_age_salary_post | idx_emp_age_salary_post | 4       | const |    3 |   100.00 | NULL  |
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------+------+----------+-------+

-- 跳过中间列，最左列存在，只用了 age 索引
mysql> explain select * from emp where age=25 and post='销售';
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------+------+----------+-----------------------+
| id | select_type | table | partitions | type | possible_keys           | key                     | key_len | ref   | rows | filtered | Extra                 |
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------+------+----------+-----------------------+
|  1 | SIMPLE      | emp   | NULL       | ref  | idx_emp_age_salary_post | idx_emp_age_salary_post | 4       | const |    3 |    10.00 | Using index condition |
+----+-------------+-------+------------+------+-------------------------+-------------------------+---------+-------+------+----------+-----------------------+

-- 没有最左列，索引失效
mysql> explain select * from emp where salary=2400 and post='销售';
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | emp   | NULL       | ALL  | NULL          | NULL | NULL    | NULL |   30 |     3.33 | Using where |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
```

> 最左列知道是联合索引里面 `Seq_in_index` 是 1 的这一列，跟查询时条件放的位置无关。
> 因此在设计联合索引时，要考虑那个字段经常被用于查询，并且按照常用查询顺序，来创建联合索引