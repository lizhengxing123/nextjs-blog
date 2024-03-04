---
title: '存储函数'
excerpt: '存储函数'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2024-01-15 20:49:03'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 存储函数

存储函数是有返回值的存储过程，存储函数的参数只能是 in 类型

### 基本语法

```sql
create function 存储函数名称([参数...])
returns 返回值类型 [特性]
begin
    sql逻辑;
    return 返回值;
end;
```
存储函数返回值特性参数（mysql8.0之后必须写参数）

1. DETERMINISTIC: 指定函数是确定性的。这意味看对于给定的输入参数，函数的返回值总是相同的。这个参数可以帮助优化器进行性能优化，因为它允许缓存函数的结果。
2. NO DETERMINISTIC: 指定函数是非确定性的。这意味看对于给定的输入参数，函数的返值可能会发生变化。这个参数用于那些可能会根据外部因素（如当前时间）变化的函数。
3. READS SQL DATA: 指定函数会读取数据，包括表、视图等。也就是说，函数在执行过程中会对数据库进行读取操作。
4. MODIFIES SOL DATA: 指定函数会修改数据，比如插入、更新或删除表中的数据。函数在执行过程中会对数据库进行写入操作
5. NO SOL: 指定函数既不读取也不修改数据库中的数据。这意味着函数在执行过程中不会对数据库进行读写操作。

这些特性参数用于提供函数的特性，可以帮助优化器更好地进行性能优化

```sql
create function f1(num int)
returns int DETERMINISTIC
begin
    declare res int;
    select count(*) into res from emp where salary < num;
    return res;
end;

set @num = f1(5000);
select @num; -- 16
select f1(3000); -- 7
```