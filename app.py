from datetime import timedelta
from flask import Flask, render_template, request
from initdb import conf
from pysql import CreateCard
from flask_cors import CORS

app = Flask(__name__, static_folder="static")

CORS(app, resources=r'/*')

app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
# 设置静态文件缓存过期时间
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)
app.config['JSON_AS_ASCII'] = False
app.config['JSONIFY_MIMETYPE'] = "application/json;charset=utf-8"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/admin/')
def admin():
    return render_template('admin.html')


@app.route("/card/<n>")
def card(n):
    return render_template("card.html")


@app.route("/api/showmsgById", methods=['GET'])
def showmsgById():
    id = request.args.get('id', 1)
    try:
        id = int(id)
        query = CreateCard()
        if id <= 0 or id > 1000000:
            return {"code": 102, "msg": "id超出范围"}
        else:
            res = query.showmsgById(id)
            return res
    except ValueError as e:
        print(e)
        return {"code": 104, "msg": str(e)}


@app.route("/api/showmsg", methods=['GET'])
def showmsg():
    p = request.args.get('p', 1)
    l = request.args.get('l', 5)
    try:
        p = int(p)
        l = int(l)
        query = CreateCard()
        if p <= 0 or p > l:
            return {"code": 102, "msg": "页数超出范围"}
        elif l < 0 or l > 50:
            return {"code": 103, "msg": "每页显示超出限制"}
        else:
            res = query.showmsg(p, l)
            return res
    except ValueError as e:
        print(e)
        return {"code": 104, "msg": str(e)}


@app.route("/api/addmsg", methods=['GET', 'POST'])
def addmsg():
    if request.method == 'POST':
        name = request.form['name']
        avatar = request.form['avatar']
        title = request.form['title']
        data = request.form['data']
        type = request.form['type']
        imgurl = request.form['imgurl']
        if imgurl == None or imgurl == "":
            imgurl = ""
        if name == None or data == None or title == None or type == None or \
                name == "" or data == "" or title == "" or type == "":
            return {"code": 400, "msg": "不能为空"}
        else:
            query = CreateCard()
            return query.addmsg(name, avatar, title, data, imgurl, type)

    else:
        return {"code": 400, "msg": "不支持访问类型"}


@app.route("/api/showmsgNearNow", methods=['GET'])
def showmsgNearNow():
    n = request.args.get("n", 1)
    m = request.args.get("m", 1)
    try:
        m = int(m)
        n = int(n)
        query = CreateCard()
        return query.showmsgNearNow(n, m)
    except ValueError as e:
        print(e)
        return {"code": 112, "msg": str(e)}


@app.route("/api/delmsg", methods=['GET'])
def delmsg():
    n = request.args.get("n")
    DelPasswd = request.args.get("DelPasswd")
    if n == None or DelPasswd == None or n == "" or DelPasswd == "":
        return {"code": 112, "msg": "缺少参数"}
    elif DelPasswd != conf.DelPasswd:
        return {"code": 112, "msg": "密码错误"}
    else:
        try:
            n = int(n)
            query = CreateCard()
            return query.delmsg(n)
        except ValueError as e:
            print(e)
            return {"code": 112, "msg": str(e)}


@app.route("/api/getcount", methods=['GET'])
def getcount():
    query = CreateCard()
    return {"count": query.getcount()}


@app.route("/api/comment", methods=['GET'])
def comment():
    return {"comment": "1"}


if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5000, debug=True)
