---
title: '数据库控制语言（DCL）'
excerpt: '函数据库控制语言（DCL）'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-10-12 11:31:53'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 函数据库控制语言（DCL）

管理数据库的用户，控制数据库访问权限

### 用户管理

#### 创建用户

```sql
-- 语法
-- 如果要让用户可以访问任意主机的话，那么 主机 可以设置为 %
create user <用户名>@<主机> identified by <密码>;
create user 'lzx'@'%' identified by 'lzx622427';
```

#### 删除用户

```sql
drop user <用户名>@<主机>;
drop user 'lzx'@'localhost';
```

#### 修改用户

```sql
-- 修改密码
alter user <用户名>@<主机> identified with mysql_native_password by <新密码>;
alter user 'lzx'@'%' identified with mysql_native_password by '123';

-- 修改主机
update mysql.user set host=<主机> where user=<用户名>;
update mysql.user set host='localhost' where user='lzx';
```

#### 查询用户

```sql
select * from mysql.user;
```

### 权限控制

- `all`、`all privileges`：所有权限

- `insert`：插入数据权限

- `delete`：删除数据权限

- `update`：修改数据权限

- `select`：查询数据权限

- `create`：创建数据库/表权限

- `drop`：删除数据库/表/视图权限

- `alter`：修改表/字段权限

#### 查询权限

> `*.*` 表示所有库所有表

```sql
-- 语法
show grants for <用户名>@<主机>;

create user 'lzx'@'localhost' identified by '123';
show grants for 'lzx'@'localhost';
-- GRANT USAGE ON *.* TO `lzx`@`localhost` 表示没有任何权限，只能登陆

show grants for 'root'@'localhost';
```

#### 分配权限

```sql
-- 语法
grant <权限列表> on <库名>.<表名> to <用户名>@<主机>;
-- 给'lzx'@'localhost'授予db6所有表的所有权限
grant all on db6.* to 'lzx'@'localhost';
```

#### 撤销权限

```sql
-- 语法
revoke <权限列表> on <库名>.<表名> from <用户名>@<主机>;
-- 撤销'lzx'@'localhost' db6所有表的所有权限
revoke all on db6.* from 'lzx'@'localhost';
```

#### 刷新权限

```sql
flush privileges;
```