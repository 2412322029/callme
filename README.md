## 单html页面实现留言墙（dome）
### use python-flask and MDUI 
主页
![](https://i.imgtg.com/2022/10/17/JHljK.png)
![](https://i.imgtg.com/2022/10/17/JHYhB.png)
#### 管理
![](https://i.imgtg.com/2022/10/17/JHfRs.png)
#### 无限嵌套评论
![](https://i.imgtg.com/2022/10/17/JHjWa.png)
#### admin页面算后台

1. card包含标题，时间，内容，图片，头像
2. card详情页评论
3. card编辑添加

### 食用方法

安装依赖
```bash
pip install -r requirements.txt
```

Flask  Flask_Cors  PyMySQL

`./initdb.py`中配置数据库信息

首先创建数据库chat或者其他名
```python
class conf():
       host="localhost"#数据库地址
       user="root"#用户名
       passwd="123456"#密码
       db="chat"#数据库名
       port:int=3306#端口
       DelPasswd="J7QcN"# 删除card验证的密码，务必修改
```

### 运行
```bash
python3 initdb.py #创建数据表
```
### 启动
flask 自带的启动方法或者其他
关闭debug模式
`app.py`端口自行修改，添加防火墙允许
```python
 app.run(host='0.0.0.0', port=5000, debug=True)

```
```bash
python3 app.py ##启动
``` 
nohup python3 app.py & Linux后台运行

`main.js`前几行自行修改
```
imgbar_err = "https://i.imgtg.com/2022/10/15/Jy3Jb.png"//附加图片404替换图片
avatar_err = "https://i.imgtg.com/2022/10/15/J7QcN.png"//头像404替换图片
limit = 10//每页显示的个数
headline_name = "Demo"//标题
```

浏览器输入服务器ip+端口访问

admin界面 点一下标题显示

## 前后端分离
`分离前端页面`文件夹的文件放在cos存储桶

后端flask作为api提供数据接口

基本一样，加一些配置

`app.py`第9行
```python
CORS(app, resources=r'/*')
```
跨域cors默认统配，最好修改为静态文件服务器地址

`main.js`第一行basurl修改为flask api的服务器地址(加端口)


## 其他
### 可能存在的问题
1. 由于没有做api请求限制，存在被攻击可能
最好限制一下频率

2. 没有登录系统，点赞难以实现,提交信息时没有鉴权，日后加上验证码验证
3. 评论没有跟随card删除，（评论后来加的）
## TODO

[ ✓ ] 添加card

[ ✓ ] 删除card

[ ✓ ] 无限嵌套评论

[ ✓ ] admin界面，只能看看，删除需输入上面提到的密码

[ x ] 评论删除

[ x ] 验证码

分享card时候由于是静态单页，得添加页面标记

js会在url后加参数如`http://127.0.0.1:5500/?card=28`

带参数访问时js读取cardid自动跳转到详情页面

## 其他细节

主页详情页切换或者刷新时记住页面位置自动跳转

添加内容不刷新临时显示（频繁刷新影响体验）

## about

QQ: 2412322029

blog: [https://blog.unrun.top](https://blog.unrun.top)

之后发b站演示视频

还有很多问题需要完善，欢迎友好交流
