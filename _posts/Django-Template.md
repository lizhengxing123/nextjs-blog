---
title: 'Django模板'
excerpt: 'Django模板'
coverImage: '/assets/blog/django/django.png'
date: '2023-10-24 10:53:12'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/django/django.png'
type: 'Django'
---

## Django模板

### 注释

```django
{# 单行注释 #}

{% comment %}
    多行注释
    多行注释
{% endcomment %}
```

### 变量

- 视图函数

```python
def index(request):
    data = {
        'name': 'zhangsan',
        'age': 24,
        'is_female': True,
        'hobbies': ['movie', 'code', 'game'],
        'address': {
            'province': '甘肃省',
            'city': '兰州市'
        },
        'stars': [
            ['张飞', '刘备', '关羽'],
            ['宋江', '李逵', '武松'],
            ['孙悟空', '猪八戒', '沙悟净']
        ],
        'now': datetime.datetime.now(),
        'code': '<script>alert("哈哈哈！")</script>'
    }
    return render(request, 'index.html', data)
```

- 模板

```django
{#  字符串  #}
<p>name: {{ name }}</p> {#  name: zhangsan  #}

{#  数字  #}
<p>age: {{ age }}</p> {#  age: 24  #}

{# 布尔值 #}
<p>is_female: {{ is_female }}</p> {# is_female: True #}

{#  数组  #}
<p>hobbies: {{ hobbies }}</p> {#  hobbies: ['movie', 'code', 'game']  #}
{#  数组中的某个值，使用 . 的方式，不能使用中括号 #}
<p>hobbies.2: {{ hobbies.2 }}</p> {#  hobbies.2: game  #}

{#  字典  #}
<p>address: {{ address }}</p> {# address: {'province': '甘肃省', 'city': '兰州市'} #}
{#  字典中的某个值 #}
<p>address.city: {{ address.city }}</p> {# address.city: 兰州市 #}
```

### 标签

#### if

```django
{#  if语句单分支  #}
{% if age >= 18 %}
    <p>age >= 18</p>
{% endif %} 

{#  if语句双分支  #}
{% if is_female %}
    <p>Female</p>
{% else %}
    <p>Male</p>
{% endif %}

{#  if语句多分支  #}
{% if age <= 18 %}
    <p>age <= 18</p>
{% elif age >= 60 %}
    <p>age >= 60</p>
{% else %}
    <p>18 < age < 60</p>
{% endif %}

{#  if语句结合运算符 and or not in  #}
{% if age >= 18 and age < 60 %}
    <p>壮年</p>
{% endif %}
{% if 'game' in hobbies %}
    <p>game</p>
{% endif %}
```

#### for

```django
{# for循环 #}
{% for hobby in hobbies %}
    <p>{{ hobby }}</p>
{% endfor %}

{# 当循环的对象为空时，会显示 empty 后面的内容 #}
{% for hobby in hobbies2 %}
    <p>{{ hobby }}</p>
{% empty %}
    <p>hobbies2不存在或为空</p>
{% endfor %}

{# 下标 #}
{% for hobby in hobbies %}
    <p>
        counter0: {{ forloop.counter0 }}
        counter: {{ forloop.counter }}
        revcounter0: {{ forloop.revcounter0 }}
        revcounter: {{ forloop.revcounter }}

        {% if forloop.first %}
            <b> - first</b>
        {% endif %}

        {% if forloop.last %}
            <b> - last</b>
        {% endif %}
    </p>
{% endfor %}

{# 循环嵌套 #}
<table border>
    {% for star in stars %}
        <tr>
            {% for s in star %}
                <td>
                    {{ forloop.parentloop.counter }}-{{ forloop.counter }}: {{ s }}
                </td>
            {% endfor %}
        </tr>
    {% endfor %}
</table>
```

#### 过滤器

```django
{# 加 #}
<p>age|add:8 = {{ age|add:8 }}</p> {# 32 #}

{# 减 #}
<p>age|add:-8 = {{ age|add:-8 }}</p> {# 16 #}

{# 大写 #}
<p>{{ name|upper }}</p> {# ZHANGSAN #}

{# 小写 #}
<p>{{ name|lower }}</p>{# zhangsan #}

{# 取第一个元素 #}
<p>hobbies|first = {{ hobbies|first }}</p> {# movie #}

{# 取最后一个元素 #}
<p>hobbies|last = {{ hobbies|last }}</p> {# game #}

{# 可以串联起来，取第一个元素，并将第一个字母大写 #}
<p>hobbies|first|title = {{ hobbies|first|title }}</p> {# Movie #}

{# 可以串联起来，取最后一个元素，并截取 3 个字符 #}
<p>hobbies|last|truncatechars:3 = {{ hobbies|last|truncatechars:3 }}</p> {# ga… #}

{# 拼接列表 #}
<p>hobbies|join:'+' = {{ hobbies|join:'+' }}</p> {# movie+code+game #}

{# 默认值 #}
<p>hobbies2|default:'default' = {{ hobbies2|default:'default' }}</p> {# default #}

{# 日期 #}
<p>now|date:'y-m-d' = {{ now|date:'y-m-d' }}</p> {# 23-10-24 #}
<p>now|date:'Y-m-d' = {{ now|date:'Y-m-d' }}</p> {# 2023-10-24 #}

{# html转义 确定安全才可以转义成 html 进行解析渲染 #}
<p>{{ code|safe }}</p>
```

### 模板继承

- 父模板
  
```django
{# block.html #}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Block</title>

    {# css #}
    {% block extcss %}
    {% endblock %}
</head>
<body>
    <h2>父模版</h2>
    <hr>
    {% block header %}
    {% endblock %}

    {% block content %}
        <p>父模板content</p>
    {% endblock %}

    {% block footer %}
    {% endblock %}

    {# js #}
    {% block extjs %}
    {% endblock %}
</body>
</html>
```

- 子模板

```django
{# child.html #}

{# 继承父模版 #}
{% extends 'block.html' %}

{% block header %}
    <h3>Header</h3>
    {# 导入其他模板文件 #}
    {% include 'child_include.html' %}
{% endblock %}

{% block content %}
    {# 默认情况下，子模板内容会覆盖父模板内容 #}
    {# 如果需要显示父模板内容，需要使用 block.super #}
    {{ block.super }}
    <h3>Content</h3>
{% endblock %}

{% block footer %}
    <h3>Footer</h3>
{% endblock %}
```

- 子模板内容拆分

```django
{# child_include.html #}

<ol>
    <li>中国</li>
    <li>甘肃</li>
    <li>兰州</li>
</ol>
```

### 使用 jinja2

- 环境文件 `jinja2_env.py`，和 `setting.py` 在同一目录下

```py
# jinja2_env.py

# jinja2 配置文件
from django.templatetags.static import static
from django.urls import reverse
from jinja2 import Environment


def environment(**options):
    env = Environment(**options)
    env.globals.update({
        'static': static,
        'url': reverse
    })
    return env
```

- 修改 `settings.py`

```py
# settings.py

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.jinja2.Jinja2',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            # 指定 jinja2 环境
            'environment': 'DjangoPro2.jinja2_env.environment',
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

- 模板里可以使用中括号和小括号

```jinja2
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <p>{{ name }}</p>
    {% for hobby in hobbies %}
        {{ hobby }}
    {% endfor %}
    {% for i in range(0, 3) %}
        <p>{{ hobbies[i] }}</p>
    {% endfor %}
</body>
</html>
```