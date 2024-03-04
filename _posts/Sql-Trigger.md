---
title: '触发器'
excerpt: '触发器'
coverImage: '/assets/blog/sql/sql.jpeg'
date: '2023-12-01 11:00:48'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/sql/sql.jpeg'
type: 'Sql'
---

## 触发器

触发器是一个和表有关的数据库对象，可以在插入、更新、以及删除数据之前或者之后触发，触发器触发之后，就会执行其中定义的sql逻辑

### 基本使用

```sql
create trigger 触发器名称
-- 之前还是之后触发
before/after
-- 指定触发器类型
insert/update/delete 
on 表名
-- 行级触发器，每条记录都触发一次
for each row  
begin
    sql逻辑;
end;
```

- 查看触发器

```sql
show triggers;
```

- 删除触发器

```sql
drop trigger 触发器名称;
```

- 实操

```sql
-- 记录 emp 的数据变更日志，并把变更日志插入到 emp_logs 里面
create table emp_logs
(
    id            int primary key auto_increment,
    event_type    varchar(16) not null,
    event_time    datetime    not null,
    event_id      int         not null,
    event_content varchar(800)
);


-- 插入数据的触发器
create trigger emp_insert_trigger
    before insert
    on emp
    for each row
begin
    insert into emp_logs values (null, 'insert', now(), new.id,
                                 concat('插入的数据：', 'id=', new.id, ',name=', new.name, ',gender=', new.gender,
                                        ',phone=', new.phone, ',email=', new.email, ',age=', new.age, ',salary=',
                                        new.salary, ',post=', new.post, ',join_date=', new.join_date, ',leader_id=',
                                        new.leader_id));
        end;


insert into emp values (31, '大乔', 'female', '13035445031', 'qwerqwww@qq.com', 19, 800, '会计', '2035-09-01', 27);

-- 更新数据的触发器
create trigger emp_update_trigger
    before update
    on emp
    for each row
begin
    insert into emp_logs
    values (null, 'update', now(), new.id,
            concat('更新前的数据：', 'id=', old.id, ',name=', old.name, ',gender=', old.gender,
                   ',phone=', old.phone, ',email=', old.email, ',age=', old.age, ',salary=',
                   old.salary, ',post=', old.post, ',join_date=', old.join_date, ',leader_id=',
                   old.leader_id, '更新后的数据：', 'id=', new.id, ',name=', new.name, ',gender=', new.gender,
                   ',phone=', new.phone, ',email=', new.email, ',age=', new.age, ',salary=',
                   new.salary, ',post=', new.post, ',join_date=', new.join_date, ',leader_id=',
                   new.leader_id));
end;

update emp set salary=10000 where id=31;
update emp set salary=20000 where id>=31;

-- 删除数据的触发器
create trigger emp_delete_trigger
    before delete
    on emp
    for each row
begin
    insert into emp_logs
    values (null, 'delete', now(), old.id,
            concat('删除的数据：', 'id=', old.id, ',name=', old.name, ',gender=', old.gender,
                   ',phone=', old.phone, ',email=', old.email, ',age=', old.age, ',salary=',
                   old.salary, ',post=', old.post, ',join_date=', old.join_date, ',leader_id=',
                   old.leader_id));
end;

delete from emp where id >= 31;
```
