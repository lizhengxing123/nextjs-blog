---
title: 'Django项目配置'
excerpt: 'Django项目配置'
coverImage: '/assets/blog/django/django.png'
date: '2023-11-02 11:13:41'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/django/django.png'
type: 'Django'
---

## Django项目配置

### mysql配置

- 1、安装 `pymysql`

```py
pip3 install pymysql
```

- 2、在 `settings.py` 中配置 `mysql` 

```py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'django_first_project',      # 数据库名称
        'USER': 'root',      # 用户名
        'PASSWORD': '',  # 密码
        'HOST': 'localhost',      # 地址
        'PORT': '3306',      # 端口
    }
}
```

- 3、在与 `settings.py` 同级目录中的 `__init__.py` 中加入以下代码

```py
import pymysql

pymysql.install_as_MySQLdb()
```

### CORS配置

- 1、安装 `django-cors-headers`

```py
pip3 install django-cors-headers
```

- 2、修改 `settings.py`，在 `INSTALLED_APPS` 中增加 `corsheaders`

```py
INSTALLED_APPS = [
    ...
    'corsheaders'
    ...
]
```

- 3、在 `MIDDLEWARE` 中增加 `corsheaders.middleware.CorsMiddleware`

```py
MIDDLEWARE = [
    ...
    # 位置尽量靠前，要在 CommonMiddleware 上方
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]
```

- 4、`CORS` 其他配置

```py
# 是否允许任意 ip 访问，如果为 True 则白名单不启用
CORS_ORIGIN_ALLOW_ALL = True

# 白名单，和上面配置互斥
CORS_ORIGIN_ALLOW_WHITELIST = [
    'http://127.0.0.1:8080'
]

# 允许的请求方法
CORS_ORIGIN_ALLOW_METHODS = [
    'POST',
    'GET',
    'OPTIONS',
    'PUT',
    'DELETE',
    'PATCH'
]

# 允许的请求头
CORS_ORIGIN_ALLOW_HEADERS = [
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with'
]

# 请求时是否携带 cookie
CORS_ALLOW_CREDENTIALS = False
```

### JWT

#### 基本结构

```py
"""
b'eyJOeXAiOiJKV1QiLC]hbGciOiJIUzI1NiJ9.
eyJ1c2VybmFtZSI6lmd1b3hpYW9uYW8iLCJpc3MiOiJnZ2cifQ.
Zzg1u55DCBqPRGf9z3-NAn4kbA-MJN83SxyLFfc5mmM'
"""
```

可以分为三个部分；

- 1、`header`

将下面数据转成 `json` ，然后使用 `base64` 转码即可得到

```py
# alg 算法
# typ 类型
{'alg': 'HS256', 'typ': 'JWT'}
```

- 2、`payload`

存储的数据，分为公共声明和私有声明

```py
# 公共声明
{
  # exp: token过期时间,这个只能在服务器上生成
  "exp": 1700889819,
  # iss: jwt签发者
  "iss": "auth",
  # aud: 接收jwt的一方(什么意思)
  "aud": "app",
  # iat: jwt的签名时间,这个也只能在服务器上生成
  "iat": 1577889819,
}

# 私有声明，按照自己的需求即可
{
  'username': 'username'
}
```

- 3、`signature`

签名，用来做校验


#### 使用

- 1、安装 `pyjwt`

```py
pip3 install pyjwt
```

- 2、使用

```py
import jwt

# encode 返回 bytes 类型的 token
# 1、需要加密的字典，按需添加公共和私有声明
# 2、自定义的加密 key
# 3、指定加密算法
token = jwt.encode({'username': 'lzx'}, 'lzx', algorithm='HS256')

# decode 返回 payload 字典
# 1、token 
# 2、key
payload = jwt.decode(token, 'lzx')
```

> 加密时使用了 `exp` 字段的话，解码时会自动校验是否过期，如果过期，则会抛出
> `ExpiredSignatureError: Signature has expired.` 错误。

- 3、生成 token

```py
import jwt
import time
from django.conf import settings

def gen_token(username, expire=86400):
    key = settings.JWT_TOKEN_KEY
    now = time.time()
    payload = {'username': username, 'exp': now+expire}

    return jwt.encode(payload, key, algorithm='HS256')
```

- 4、校验 token 的装饰器

```py
import jwt
from django.http import JsonResponse
from django.conf import settings
from User.models import UserProfile


# 登录装饰器
def logging_check(func):
    def wrap(request, *args, **kwargs):

        # 获取 token
        token = request.META.get('HTTP_AUTHORIZATION')

        if not token:
            return JsonResponse({'code': 401, 'error': '登录已过期'})

        # 校验 token
        try:
            payload = jwt.decode(token, settings.JWT_TOKEN_KEY, algorithms='HS256')
        except Exception as e:
            print(e)
            return JsonResponse({'code': 401, 'error': '登录已过期'})

        # 获取用户信息
        username = payload['username']

        try:
            user = UserProfile.objects.get(username=username)
        except Exception as e:
            return JsonResponse({'code': 10101, 'error': '用户不存在'})

        # 将用户信息临时添加到 request 对象上
        request.my_user = user

        return func(request, *args, **kwargs)

    return wrap

```

- 5、装饰器使用

```py
# 函数视图使用
@logging_check
def users_views(request, username):
  pass

# 类视图使用
class UserViews(View):

  @method_decorator(logging_check)
  def put(self, request, username=None):
    pass
```

### 短信接入

- 1、网站

[容联云](https:www.yuntongxun.com) 注册之后会有 8 块钱的赠送金额可以去测试

- 2、按照[官方教程](https://doc.yuntongxun.com/pe/5a531a353b8496dd00dcdfe2)进行测试

- 3、封装获取短信类

```py
# 短信
import base64
import datetime
import hashlib
import json
import requests


class YunTongXun:
    """
    容联云通讯短信接入
    https://doc.yuntongxun.com/pe/5a533de33b8496dd00dce07c
    """

    base_url = 'https://app.cloopen.com:8883'

    def __init__(self, account_sid, auth_token, app_id, template_id):
        self.account_sid = account_sid  # 主账户ID
        self.auth_token = auth_token  # 账户授权令牌
        self.app_id = app_id  # 应用 ID
        self.template_id = template_id  # 模板 ID

    def get_request_url(self, sig):
        # /2013-12-26/Accounts/{accountSid}/SMS/{funcdes}?sig={SigParameter}
        return f'{self.base_url}/2013-12-26/Accounts/{self.account_sid}/SMS/TemplateSMS?sig={sig}'

    def get_timestamp(self):
        # 获取时间戳 格式 yyMMddHHmmss
        return datetime.datetime.now().strftime('%Y%m%d%H%M%S')

    def get_sig(self, timestamp):
        # 生成业务 url 中需要的sig
        s = self.account_sid + self.auth_token + timestamp
        h = hashlib.md5()
        h.update(s.encode('utf8'))
        return h.hexdigest().upper()

    def get_request_header(self, timestamp):
        # 生成请求头
        s = self.account_sid + ':' + timestamp
        auth = base64.b64encode(s.encode('utf8')).decode('utf8')
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': auth
        }

    def get_request_body(self, phone, code, valid_time):
        # 生成请求体
        # valid_time 单位是分钟
        return {
            'to': phone,
            'appId': self.app_id,
            'templateId': self.template_id,
            'datas': [code, valid_time]
        }

    def request_api(self, url, header, body):
        # 发送请求
        res = requests.post(
            url,
            headers=header,
            data=body
        )
        return res.text

    def run(self, phone, code):
        timestamp = self.get_timestamp()
        sig = self.get_sig(timestamp)
        url = self.get_request_url(sig)
        header = self.get_request_header(timestamp)
        body = self.get_request_body(phone, code, "3")
        data = self.request_api(url, header, json.dumps(body))
        return data


if __name__ == '__main__':
    config = {
        'account_sid': '',
        'auth_token': '',
        'app_id': '',
        'template_id': "1"
    }
    ytx = YunTongXun(**config)
    res = ytx.run("", 1234)
    print(res)

```

- 4、实现 api 接口

```py
# 发送短信验证码
def sms_view(request):
    if request.method != 'POST':
        return JsonResponse({'code': 10102, 'error': '请求方法错误，请使用 POST'})

    # 获取手机号
    json_obj = json.loads(request.body)
    phone = json_obj.get('phone')

    # 生成随机验证码 4位数字
    code = random.randint(1000, 9999)
    print(f'{phone} -- {code}')

    # 使用 redis 存储验证码，需要安装 django-redis
    cache_key = f'sms_{phone}'
    # 检查是否已经发送过验证码，且未过期
    old_code = cache.get(cache_key)
    if old_code:
        return JsonResponse({'code': 10105, 'msg': '验证码已发送，请3分钟后重试'})

    cache.set(cache_key, code, 180)
    # 发送验证码
    res = send_sms(phone, code)
    print(res)
    if res['statusCode'] != '000000':
        return JsonResponse({'code': 10103, 'msg': '短信发送失败'})

    return JsonResponse({'code': 200, 'msg': '短信发送成功'})


def send_sms(phone, code):
    # SMS_YTX_CONFIG 存放在 settings 中
    # 云通讯配置
    # SMS_YTX_CONFIG = {
    #     'account_sid': '',
    #     'auth_token': '',
    #     'app_id': '',
    #     'template_id': "1"
    # }
    ytx = YunTongXun(**settings.SMS_YTX_CONFIG)
    res = ytx.run(phone, code)
    return json.loads(res)
```

- 5、使用 redis 存储验证码

```py
# 1、安装
pip install django-redis

# 2、配置
# redis 配置  -->  settings.py
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT CLASS": "django_redis.client.DefaultClient",
            # "PASSWORD": ""
        }
    }
}

# 3、存数据
from django.core.cache import cache

cache.set(key, data, expires)

# 4、取数据
data = cache.get(key)
```

### Celery

使用 [Celery](https://www.celerycn.io/jian-jie) 可以将短信业务抽离出去，避免主业务的请求阻塞

- 安装 `celery`

```shell
pip3 install celery
```

#### 基本配置和使用

- 1、先定义 worker

```py
# tasks.py

from celery import Celery

# 创建 Celery 应用，指定名称和要存储的 broker
app = Celery('lzx', broker="redis://:@127.0.0.1:6379/2")


# 定义 worker
@app.task
def task_test():
    print('run...')

```

- 2、启动 celery

```shell
# tasks 就是文件名
celery -A tasks worker -l info
```

- 3、测试

```py
# 使用 python 交互式环境

>>> from tasks import task_test
>>> task_test.delay()
<AsyncResult: add7a7cf-c768-4508-a005-c249d6dd71c8>
```

#### 存储结果的 worker

- 1、先定义 worker

```py
from celery import Celery

# 创建 Celery 应用
app = Celery('lzx_result', broker="redis://:@127.0.0.1:6379/2", backend='redis://:@127.0.0.1:6379/3')


# 定义 worker
@app.task
def task_test(a, b):
    return a + b

```

- 2、启动 celery

```shell
celery -A tasks_result worker -l info
```

- 3、测试并获取数据

```py
>>> from tasks_result import task_test
>>> s = task_test.delay(100, 123)
>>> s.result
223
```

#### 在 Django 中使用

[详细教程](https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html#using-celery-with-django)

- 1、创建 celery.py 配置文件

```py
# 需放在与项目同名的文件夹下
# celery 配置
import os
from django.conf import settings
from celery import Celery

# 给环境变量添加值
# 为 celery 指定配置文件
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FirstProject.settings')

# 初始化
app = Celery('FirstProject')

# 指定配置
app.config_from_object('django.conf:settings', namespace='CELERY')

# 自动去注册应用下寻找并加载 worker 函数
app.autodiscover_tasks(settings.INSTALLED_APPS)

```

- 2、应用中创建 `tasks.py`

```py
# 集中定义对应的 worker 函数
# worker 函数
import json
from django.conf import settings

from tools.sms import YunTongXun
from FirstProject.celery import app


@app.task
def send_sms_worker(phone, code):
    ytx = YunTongXun(**settings.SMS_YTX_CONFIG)
    res = ytx.run(phone, code)
    return json.loads(res)

```

- 3、视图中调用 worker 函数

```py
# 视图函数充当生产者，推送具体的 worker 函数
res = send_sms_worker.delay(phone, code)
```

- 4、项目目录下启动 worker

```shell
celery -A 项目同名文件夹名称 worker -l info
```

- 5、正式环境启动 celery

```shell
# nohub：忽略掉所有挂断（SIGHUB）信号
# &：表示命令在后台执行
# -P：指定 celery 以 gevent 的形式开协程
# -c：指定协程的数量
# > celery.log：指定输出的日志文件
# 标准输入是文件描述符 0
# 标准输出是文件描述符 1
# 标准错误输出是文件描述符 2
# 2>&1：表示将错误输出重定向到标准输出一同记录到日志文件中
nohub celery -A 和项目同名的文件名称 worker -P gevent -c 1000 > celery.log 2>&1 &
```

### 自定义装饰器缓存列表数据

- 1、定义装饰器

```py
from .logging_dec import get_user_by_request
from django.core.cache import cache


# 缓存装饰器
def cache_set(expire):
    def _cache_set(func):
        def wrap(request, *args, **kwargs):
            # 只做列表页
            if 't_id' in request.GET:
                # 请求的是详情，直接返回视图
                return func(request, *args, **kwargs)

            # 生成 cache_key，区分【self】和【other】
            visitor = get_user_by_request(request)
            visitor_username = visitor.username if visitor else None
            is_self = visitor_username == kwargs['author_id']
            print(f'visitor_username: {visitor_username} | author_id: {kwargs["author_id"]} | is_self: {is_self}')

            full_path = request.get_full_path()

            if is_self:
                cache_key = f'topics_cache_self_{full_path}'
            else:
                cache_key = f'topics_cache_{full_path}'

            print(f'cache_key: {cache_key}')
            # 判断是否有缓存，有缓存的话直接返回
            data = cache.get(cache_key)
            if data:
                print('use cache'.center(80, "*"))
                return data
            # 执行视图
            res = func(request, *args, **kwargs)
            # 存储缓存
            cache.set(cache_key, res, expire)
            # 返回响应
            return res

        return wrap

    return _cache_set

```

- 2、使用

```py
@method_decorator(cache_set(300))
def get(self, request, author_id):
    print('use view'.center(80, "*"))

    # 获取当前用户
    try:
        author = UserProfile.objects.get(username=author_id)
    except Exception as e:
        return JsonResponse({'code': 10300, 'error': '用户不存在'})

    # 获取访问者
    visitor = get_user_by_request(request)
    visitor_username = None
    if visitor:
        visitor_username = visitor.username

    # 是否为自己本人访问
    is_self = visitor_username == author_id

    # 获取文章详情
    t_id = request.GET.get('t_id')
    if t_id:
        t_id = int(t_id)
        if is_self:
            try:
                author_topic = Topic.objects.get(id=t_id, author_id=author_id)
            except:
                return JsonResponse({'code': 10301, 'error': '文章不存在'})
        else:
            try:
                author_topic = Topic.objects.get(id=t_id, author_id=author_id, limit='public')
            except:
                return JsonResponse({'code': 10301, 'error': '文章不存在'})

        res = self.make_topic_res(author, author_topic, is_self)
        return JsonResponse(res)
    else:
        # 获取查询字符串
        category = request.GET.get('category')
        if category in ['tec', 'no-tec']:
            if is_self:
                # 自己访问自己
                author_topics = Topic.objects.filter(author_id=author_id, category=category)
            else:
                # 其他人在访问
                author_topics = Topic.objects.filter(author_id=author_id, limit='public', category=category)
        else:
            if is_self:
                # 自己访问自己
                author_topics = Topic.objects.filter(author_id=author_id)
            else:
                # 其他人在访问
                author_topics = Topic.objects.filter(author_id=author_id, limit='public')

        # 返回结果
        res = self.make_topics_res(author, author_topics)
        return JsonResponse(res)
```

- 3、清除缓存，可以在文章发布后，清除当前用户的所有缓存

```py
def clear_topics_caches(self, request):
    # path 中包含着是请求的哪个用户名称
    path = request.path_info
    cache_key_p = ['topics_cache_self_', 'topics_cache_']
    cache_key_s = ['', '?category=tec', '?category=no-tec']
    all_keys = []

    for p in cache_key_p:
        for s in cache_key_s:
            all_keys.append(f'{p}{path}{s}')

    cache.delete_many(all_keys)

@method_decorator(logging_check)
def post(self, request, author_id):
    author = request.my_user

    # 获取前端数据
    json_obj = json.loads(request.body)

    data = {
        'title': json_obj.get('title'),
        'category': json_obj.get('category'),
        'limit': json_obj.get('limit'),
        'content': json_obj.get('content'),
        'introduce': json_obj.get('contentText')[:30],
        'author': author
    }

    # 存储数据
    Topic.objects.create(**data)

    # 清空当前用户缓存
    self.clear_topics_caches(request)

    return JsonResponse({'code': 200, 'msg': '请求成功'})
```

### 留言数据组织

```py
all_messages = Message.objects.filter(topic=author_topic).order_by('-created_time')

msg_list = []
rep_dic = {}
msg_count = 0

for message in all_messages:
    if message.parent_message:
        # 回复
        rep_dic.setdefault(message.parent_message, [])
        rep_dic[message.parent_message].append({
            'id': message.id,
            'publisher': message.publisher.nickname,
            'publisher_avatar': str(message.publisher.avatar),
            'content': message.content,
            'created_time': message.created_time.strftime('%Y-%m-%d %H:%M:%S')
        })
    else:
        # 留言
        msg_count += 1
        msg_list.append({
            'id': message.id,
            'publisher': message.publisher.nickname,
            'publisher_avatar': str(message.publisher.avatar),
            'content': message.content,
            'created_time': message.created_time.strftime('%Y-%m-%d %H:%M:%S'),
            'replay': []
        })

for msg in msg_list:
    if msg['id'] in rep_dic:
        msg['replay'] = rep_dic[msg['id']]
```

### 支付宝

- 1、注册开发者账号

[进入沙箱环境](https://open.alipay.com/develop/sandbox/app)

- 2、创建公/私钥

```shell
openssl # 进入 openssl 交互式环境
genrsa -out app_private_key.pem 2048 # 生成私钥
rsa -in app_private_key.pem -pubout -out app_public_key.pem # 导出公钥
exit # 退出
```

- 3、在沙箱中设置刚生成的自定义密钥，并拿到支付宝公钥

- 4、定义支付基类

```py
# settings.py
# 公/私钥路径配置
ALIPAY_KEY_DIR = BASE_DIR / 'static/keys'

# alipay 相关配置
ALIPAY_APPID = '9021000131659246'
ALIPAY_GATEWAY_URL = 'https://openapi-sandbox.dl.alipaydev.com/gateway.do'
ALIPAY_RETURN_URL = 'http://localhost:9528/sat/login'
ALIPAY_NOTIFY_URL = 'http://localhost:8000/v1/orders/result




app_private_key_string = open(os.path.join(settings.ALIPAY_KEY_DIR, 'app_private_key.pem')).read()
alipay_public_key_string = open(os.path.join(settings.ALIPAY_KEY_DIR, 'alipay_public_key.pem')).read()

# 定义一个基类，涉及到支付的都可以继承这个类
class MyAliPay(View):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.alipay = AliPay(
            appid=settings.ALIPAY_APPID,
            app_private_key_string=app_private_key_string,
            alipay_public_key_string=alipay_public_key_string,
            app_notify_url=None,  # 支付宝通知支付结果的地址
            sign_type='RSA2',  # 签名算法
            debug=True,  # 沙箱环境用True，正式环境默认False
        )

    def get_trade_url(self, order_num, amount):
        """
        获取支付地址
        :param order_num: 订单号，需要自己生成
        :param amount: 订单金额
        """
        # 生成查询字符串
        order_string = self.alipay.api_alipay_trade_page_pay(
            subject=order_num,  # 标题
            out_trade_no=order_num,  # 订单号
            total_amount=amount,  # 金额
            return_url=settings.ALIPAY_RETURN_URL,  # 支付成功后要跳转的地址
            notify_url=settings.ALIPAY_NOTIFY_URL,  # 支付成功后支付宝会往这个地址发送post请求
        )
        return settings.ALIPAY_GATEWAY_URL + '?' + order_string

        def get_verify_result(self, data, sign):
        """
        获取验签结果
        :param data: 支付宝 POST 表单提交过来的数据
        :param sign: 数据中的签名
        """
        return self.alipay.verify(data, sign)

    def get_trade_result(self, order_num):
        """
        向支付宝发送请求，查询订单状态
        :param order_num: 当初发送的订单号
        """

        # macos 会报错
        # 解决方式：https://github.com/fzlee/alipay/issues/112
        result = self.alipay.api_alipay_trade_query(order_num)
        print('result: --------', result)
        return result.get('trade_status') == 'TRADE_SUCCESS'
```

- 5、支付结果处理

```py
class ResultView(MyAliPay):

    def post(self, request):
        """
        notify_url 业务逻辑，支付宝异步通知支付结果
        官方文档参考：https://opendocs.alipay.com/open/270/105902?pathHash=d5cd617e
        """
        # 获取表单提交数据
        request_data = {k: request.POST[k] for k in request.POST.keys()}
        # 获取 sign，并修改 request_data
        sign = request_data.pop('sign')

        is_verify = self.get_verify_result(request_data, sign)

        if is_verify:
            # 修改订单状态
            trade_status = request_data.get('trade_status')
            order_num = request_data.get('out_trade_no')

            order = Order.objects.get(num=order_num)

            if trade_status == 'TRADE_SUCCESS':
                order.status = 1
                order.save()
                return HttpResponse('success')  # 支付宝要求返回 success
            else:
                return HttpResponse('订单异常')
        else:
            return HttpResponse('订单校验失败')

    def get(self, request):
        """
        return_url 逻辑

        return_url 示例
        http://localhost:8000/v1/orders/result
        ?charset=utf-8
        &out_trade_no=20231108172842000001
        &method=alipay.trade.page.pay.return
        &total_amount=999.00
        &sign=CDul1azJMcSQ5mPP7qqfU4DDFAGFxvBNz%2FsktfrwdJA4uh5BUuyJ2irMUyA905H7DQQOzVOhwMIm2aqD92Rrv%2FHCVKYtnvH1UMKU%2FgaCoGtuIGQf58o5yjvyZ1xBVZqzuNiIkYysfmDkUM6LW2kLHKCy9hxxARoZ7VTu2JB2gpQgP4Toamsbgqt20kjfvX0%2F5YiGscsugHhJnlCsIIDoKhqiDe9LuYQMlVoO9BNyoKgs8vf%2FkUBMVV2qoHgmJ6KJCNzbsS3m9pLq11W5lB%2B3Ie5icWOLm6DRQQbZOHi2Brc3ui2TUMy91%2BXXEE1ErhcATzZCyRYghkxCDAnLj2Q51w%3D%3D
        &trade_no=2023110822001490890501433330
        &auth_app_id=9021000131659246
        &version=1.0
        &app_id=9021000131659246
        &sign_type=RSA2
        &seller_id=2088721020868516
        &timestamp=2023-11-08%2017%3A29%3A36
        """
        order_num = request.GET['out_trade_no']
        # 在表中查询订单状态
        order = Order.objects.get(num=order_num)
        print(order)
        is_success = order.status == 1

        if is_success:
            return HttpResponse('支付成功')

        # 如果没成功，需要请求支付宝查询这个订单的真实交易状态
        result = self.get_trade_result(order_num)

        if result:
            order.status = 1
            order.save()
            return HttpResponse('支付成功---主动查询')
        else:
            return HttpResponse('支付异常---主动查询')

```
