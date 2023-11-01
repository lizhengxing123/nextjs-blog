---
title: 'Django视图'
excerpt: 'Django视图'
coverImage: '/assets/blog/django/django.png'
date: '2023-10-30 15:50:44'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/django/django.png'
type: 'Django'
---

## Django视图

### HttpRequest

```py
def my_request(request):
    print('*' * 100)
    print(request)  # <WSGIRequest: GET '/request/'>

    # request 对象的属性和方法

    # 1、请求方式，有 GET POST PUT DELETE ...
    print(request.method)

    # 2、GET请求的参数 QueryDict: 类字典对象
    #   请求地址 /request/?name=lisi&age=34&name=zhangsan
    print(request.GET)  # <QueryDict: {'name': ['lisi', 'zhangsan'], 'age': ['34']}>

    # 没有 name 会报错，存在多个 name 会返回数组中的最后一个
    print(request.GET['name'])  # zhangsan
    # 没有 name 会返回 None 或者默认值，存在多个 name 会返回数组中的最后一个
    print(request.GET.get('name'))  # zhangsan
    # 设置默认值
    print(request.GET.get('name', default='匿名用户'))  # 匿名用户
    # 获取 key 对应的列表，没有返回 []
    print(request.GET.getlist('name'))  # ['lisi', 'zhangsan']

    # 3、POST请求的参数，和 GET 类似
    print(request.POST)

    # 4、请求地址
    print(request.path)  # /request/

    # 5、请求完整地址
    print(request.get_full_path())  # /request/?name=lisi&age=34&name=zhangsan

    # 6、cookie
    print(request.COOKIES)
    # 设置 cookie
    # response = redirect(reverse('index'))
    # response.set_cookie('userid', user.id)
    # 设置过期时间 单位是秒
    # response.set_cookie('userid', user.id, expires=7*24*60)
    # 删除 cookie
    # response = redirect(reverse('index'))
    # response.delete_cookie('userid')
    # 获取 cookie 设置第二个参数指定默认值
    # userid = request.COOKIES.get('userid', 0)

    # 7、session
    print(request.session)
    # 设置 session
    # request.session['userid'] = userid
    # 设置过期时间
    # request.session.set_expiry(7*24*60)
    # 删除 session
    # session_key = request.session.session_key
    # request.session.delete(session_key)
    # 获取 session 设置第二个参数指定默认值
    # request.session.get('userid', 0)

    # 8、上传文件使用，获取上传的文件对象
    print(request.FILES)
    # 获取单个文件
    request.FILES.get('file')

    # 9、元数据
    print(request.META['REMOTE_ADDR'])  # 获取客户端的ip地址
    print('*' * 100)
    return HttpResponse('ok')

```

### HttpResponse

```py
def my_response(request):
    # 1、返回字符串
    # return HttpResponse('123')

    # 2、返回模版
    # return render(request, 'index.html', {'data': data})

    # 3、重定向
    # return redirect(reverse('App:detail', {'uid': 1}))
    # return HttpResponseRedirect('/request/')

    # 4、JSON
    return JsonResponse({'id': 1, 'name': 'lisi', 'age': 18})

    # 5、其他属性
    # response = HttpResponse()
    # response.content = '123'  # 内容
    # response.status_code = 400  # 状态码
    # response.charset = 'utf8'
    # return response
```

### 单文件上传

```py
import os.path
import uuid
from django.conf import settings


class FileModel(models.Model):
    original_name = models.CharField(max_length=100)
    file_path = models.CharField(max_length=100)
    upload_time = models.DateTimeField(auto_now_add=True)


def upload(request):
    if request.method == 'POST':
        # 获取文件
        file = request.FILES.get('file')
        # 为避免重复，修改文件名
        # file_name = gen_uuid_name() + file.name[file.name.rfind('.'):]
        file_name = gen_uuid_name() + os.path.splitext(file.name)[-1]
        # 拼接地址
        file_path = os.path.join(settings.MEDIA_ROOT, file_name)
        # 分块写入文件
        with open(file_path, 'ab') as f:
            for part in file.chunks():
                f.write(part)
                f.flush()  # 清空缓存

        # 入库
        FileModel.objects.create(original_name=file.name, file_path=f'upload/{file_name}')

    return render(request, 'upload.html')


def gen_uuid_name():
    return str(uuid.uuid4())
```

### 多文件上传

```py
def upload(request):
    if request.method == 'POST':
        # 获取文件列表
        files = request.FILES.getlist('files')
        # 遍历
        for file in files:
            file_name = gen_uuid_name() + os.path.splitext(file.name)[-1]
            file_path = os.path.join(settings.MEDIA_ROOT, file_name)
            with open(file_path, 'ab') as f:
                for part in file.chunks():
                    f.write(part)
                    f.flush()
            FileModel.objects.create(original_name=file.name, file_path=f'upload/{file_name}')

    return render(request, 'upload2.html')
```