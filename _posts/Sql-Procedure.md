---
title: '存储过程'
excerpt: '存储过程'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-12-01 11:00:48'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 存储过程

### 基本使用

创建存储过程

```sql
create procedure 存储过程名称([参数...])
begin
  sql语句
end;

create procedure p1()
begin
    select * from emp;
end;
```

调用存储过程

```sql
call 存储过程名称([参数...]);

call p1;
```

查看存储过程

```sql
select * from information_schema.ROUTINES where ROUTINE_NAME='p1';

show create procedure p1;
```

删除存储过程

```sql
drop procedure if exists p1;
```

### 命令行中使用

```sql
-- 使用 delimiter 设置结束符
delimiter $$
create procedure p1()
begin
    select * from emp;
end$$
-- 重新将 ; 设置为结束符
delimiter ;
```

### 变量

#### 系统变量

```sql
-- 查看全局变量
show global variables;

-- 查看局部变量
show session variables;

-- 查看某一个全局变量
select @@global.变量名;

-- 查看某一个局部变量
select @@session.变量名;

-- 模糊匹配
show global variables like '...';

-- 设置系统变量
set @@[global.|session.]变量名=值;
set [global|session] 变量名=值;
```

> global 级别的系统变量会在 mysql 重启之后恢复成初始值，如果要让其不失效，需要在配置文件中修改


#### 用户自定义变量

- 基本语法

```sql
-- 定义变量
set @变量名=值[,...];
set @变量名:=值[,...];
select @变量名:=值[,...];
-- 也可以将查询语句的值赋值给变量，但查询出来的值只能有一个
select 字段 into @变量名 from 表 where 条件;

-- 查询变量
select @变量名[,...];

-- 销毁变量，直接设置成null
select @变量名:=null;
```

- 实际操作

```sql
mysql> set @name='li', @age:=18;
mysql> select @name, @age;
+-------+------+
| @name | @age |
+-------+------+
| li    |   18 |
+-------+------+

mysql> select @name:='zheng', @age:=19;
mysql> select @name, @age;
+-------+------+
| @name | @age |
+-------+------+
| zheng |   19 |
+-------+------+

mysql> select name into @name from user where id=1;
mysql> select @name, @age;
+-------+------+
| @name | @age |
+-------+------+
| lzx   |   19 |
+-------+------+
```

#### 局部变量

局部变量是在存储过程内部定义的变量，可以在存储过程内部使用，或者作为存储过程的输入参数

```sql
-- 变量类型是数据库字段类型
declare 变量名 变量类型 [default 默认值];
```

在存储过程中使用

```sql
create procedure p1()
begin
    declare user_count int default 0;
    -- 可以直接赋值
    -- set user_count = 10;
    -- 可以使用sql语句赋值
    -- select count(*) into user_count from user;
    select user_count;
end;
```

### 条件判断

```sql
-- 单分支
create procedure p1()
begin
    declare gender varchar(16) default 'male';
    declare res varchar(16);
    set res = if(gender='male', '男', '女');
    select res;
end;

-- 多分支 if
create procedure p2()
begin
    declare score int default 70;
    declare res varchar(16);
    if score>=90 then
        set res = '优秀';
    elseif score>=70 then
        set res = '良好';
    elseif score>=60 then
        set res = '及格';
    else
        set res = '不及格';
    end if;
    select res;
end;

-- 多分支 case
create procedure p1()
begin
    declare score int default 70;
    declare res varchar(16);
    case
    when score>=90 then
        set res = '优秀';
    when score>=70 then
        set res = '良好';
    when score>=60 then
        set res = '及格';
    else
        set res = '不及格';
    end case;
    select res;
end;

-- case 函数
create procedure p1()
begin
    declare score int default 70;
    declare res varchar(16);
    set res = case
      when score>=90 then '优秀'
      when score>=70 then '良好'
      when score>=60 then '及格'
      else '不及格'
    end;
    select res;
end;
```

### 参数

- in：输入参数，默认
- out：输出参数

```sql
create procedure p2(in score int, out res varchar(16))
begin
    set res = case
    when score>=90 then '优秀'
    when score>=70 then '良好'
    when score>=60 then '及格'
    else '不及格'
    end;
end;

call p2(88, @res);
select @res; --良好
```

- inout：既可以是输入参数，也可以是输出参数

```sql
create procedure p3(inout score double)
begin
    set score = score/10;
end;

set @score = 88;
call p3(@score);
select @score; -- 8.8
```

### 循环控制语句

- while

```sql
create procedure p1(in num int)
begin
    declare res int default 0;
    while num > 0 do
        set res = res + num;
        set num = num - 1;
    end while;
    select res;
end;

call p1(100); -- 5050
```

- repeat

```sql
create procedure p1(in num int)
begin
    declare res int default 0;
    repeat
        set res = res + num;
        set num = num - 1;
        until num <= 0
    end repeat;
    select res;
end;

call p1(100); -- 5050
```

- loop

```sql
create procedure p1(in num int)
begin
    declare res int default 0;
    sum:loop
        if num = 5 then
            set num = num - 1;
            -- 进入下一次循环
            iterate sum;
        end if;

        set res = res + num;
        set num = num - 1;

        if num <= 0 then
            -- 退出循环
            leave sum;
        end if;
    end loop;
    select res;
end;

call p1(100); -- 5045
```

### 游标

用来存储查询结果集的数据类型

- 声明游标

```sql
declare 游标名称 cursor for select语句;
```

- 打开游标

```sql
open 游标名称;
```

- 读取游标记录

```sql
-- 读取一行记录，赋值给变量
fetch 游标名称 into 变量[,...];
```

- 关闭游标

```sql
close 游标名称;
```

### 条件处理程序（handler）

- 基本语法

```sql
-- 处理动作：continue/exit 
-- continue 跳过异常代码继续执行
-- exit 退出存储过程
-- 条件：满足什么样的条件，就执行处理动作
-- 先捕获异常，然后执行SQL逻辑，最后进行处理动作
declare 处理动作 handler for 条件 SQL逻辑;
```

条件的写法

```sql
-- 捕获某一个状态码
SQLSTATE 状态码;

-- 捕获警告信息，所有 01 开头的状态码
SQLWARNING;

-- 没有找到数据，所有 01 开头的状态码
NOT FOUND;

-- 例外的，SQLWARNING、NOT FOUND捕获不到的
SQLEXCEPTION;
```

- 实例

```sql
drop procedure if exists p5;
-- 用户传入一个 u_salary 参数，查询 emp 中所有薪资小于该参数的员工姓名，年龄，薪资以及岗位
-- 存储到新的表中
create procedure p5(in u_salary int)
begin
    -- 定义变量接收游标中的数据
    declare my_name varchar(16);
    declare my_age int;
    declare my_salary float(10, 2);
    declare my_post varchar(16);
    -- 声明一个游标，存储查询集
    declare my_cursor cursor for select name, age, salary, post from emp where salary < u_salary;
    -- 捕获异常，关闭游标
    -- declare exit handler for SQLSTATE '02000' close my_cursor;
    declare exit handler for NOT FOUND close my_cursor;
    -- 表如果存在就删除
    drop table if exists tb_cursor;
    -- 创建新的表
    create table tb_cursor
    (
        id     int primary key auto_increment,
        name   varchar(16) not null,
        age    int         not null,
        salary float(10, 2),
        post   varchar(16)
    );
    -- 打开游标
    open my_cursor;
    -- 循环读取并插入数据
    while true
        do
            -- 读取数据，并保存在变量中
            fetch my_cursor into my_name, my_age, my_salary, my_post;
            -- 插入数据
            insert into tb_cursor(name, age, salary, post) values (my_name, my_age, my_salary, my_post);
        end while;
end ;

call p5(3000);
```
