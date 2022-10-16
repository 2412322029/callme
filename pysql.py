import time
import pymysql
from initdb import conf


class CreateCard():
    def __init__(self):
        self.conn = pymysql.connect(host=conf.host,
                                    user=conf.user,
                                    passwd=conf.passwd,
                                    db=conf.db,
                                    port=conf.port)
    def showmsgById(self, id: int):
        '''
        分页显示msg,第几个到第几个
        :starpage 起始id
        :endpage  终止id
        '''
        if isinstance(id, int) and id>0:
            c = self.conn.cursor()
            sql = '''
            select * from card where id={} limit 1
            '''.format(id)
            c.execute(sql)
            r = c.fetchall()
            self.conn.commit()
            if r==():
                return {"code": 400, "msg": "id不存在"}
            else:
                data = []
                for row in r:
                    res = {"id": row[0], "name": row[1],
                        "avatar": row[2], "title": row[3],
                        "data":row[4],"imgurl":row[5],"time":row[6],"type":row[7]}
                    data.append(res)
                self.conn.commit()
                return {"code": 200, "msg": "id详情查询成功","data": data}
        return {"code": 105, "msg": "页数应为int类型"}

    def showmsg(self, starpage: int, endpage: int):
        '''
        分页显示msg,第几个到第几个
        :starpage 起始id
        :endpage  终止id
        '''
        if isinstance(starpage, int) and isinstance(endpage, int) and starpage > 0 and endpage >= starpage:
            c = self.conn.cursor()
            sql = '''
            select * from card limit {},{}
            '''.format(starpage-1, endpage-starpage+1)
            c.execute(sql)
            r = c.fetchall()
            sql2 = '''
            SELECT COUNT(*) from  card
            '''
            c.execute(sql2)
            r2 = c.fetchone()[0]
            self.conn.commit()
            data = []
            for row in r:
                res = {"id": row[0], "name": row[1],
                       "avatar": row[2], "title": row[3],
                       "data":row[4],"imgurl":row[5],"time":row[6],"type":row[7]}
                data.append(res)
            self.conn.commit()
            return {"code": 200, "msg": "showmsg查询成功", "count": r2, "data": data}
        return {"code": 105, "msg": "页数应为int类型"}

    def showmsgNearNow(self, n: int, m: int):
        '''
        显示最近n:int条消息
        '''
        if isinstance(n, int) and isinstance(m, int) and n > 0 and m >= n:
            c = self.conn.cursor()
            sql = '''
            select * from card where time<{} ORDER BY time DESC limit {},{}
            '''.format(time.time(), n-1, m-n+1)
            c.execute(sql)
            r = c.fetchall()
            data = []
            for row in r:
                res = {"id": row[0], "name": row[1],
                       "avatar": row[2], "title": row[3],
                       "data":row[4],"imgurl":row[5],"time":row[6],"type":row[7]}
                data.append(res)
            self.conn.commit()
            return {"code": 200, "msg": "showmsgNearNow查询成功", "data": data}
        else:
            {"code": 112, "msg": "0<n<m"}

    def addmsg(self, name: str, avatar: str, title: str, data: str, imgurl: str, type):
        '''
        插入信息
        '''
        c = self.conn.cursor()
        sql = '''
        INSERT INTO card (name,avatar,title,data,imgurl,type,time)
            VALUES ('{}','{}','{}','{}','{}','{}',{})
        '''.format(name, avatar, title, data, imgurl, type, time.time())
        try:
            c.execute(sql)
            self.conn.commit()
            return {"code": 200, "msg": "发送成功"}
        except pymysql.Error as e:
            self.conn.rollback()  # 发生错误回滚
            return {"code": 400, "msg": "Data too long "}
            print(e)

    def delmsg(self, id: int):
        '''
        删除msg
        id已经被删除的会显示删除成功
        '''
        if isinstance(id, int):
            c = self.conn.cursor()
            sql2 = '''
            SELECT * from  card ORDER BY id DESC LIMIT 1
            '''
            c.execute(sql2)
            count = c.fetchall()[0][0]
            if id > 0 and id <= count:
                sql = '''
                DELETE from  card WHERE id={}
                '''.format(id)
                try:
                    c.execute(sql)
                    r = c.fetchall()
                    self.conn.commit()
                    return {"code": 200, "msg": "msg删除成功"}
                except pymysql.Error as e:
                    self.conn.rollback()  # 发生错误回滚
                    print(e)
                    return {"code": 302, "msg": "msg删除发生未知错误"}
            else:
                return {"code": 303, "msg": "id越界,msg删除错误"}
        else:
            return {"code": 304, "msg": "id应为int类型"}

    def getcount(self):
        c = self.conn.cursor()
        sql = '''
        SELECT COUNT(*) from  card
        '''
        c.execute(sql)
        r = c.fetchone()[0]
        self.conn.commit()
        return r


if __name__ == '__main__':
    DB = CreateCard()
    # rr = DB.getcount()
    # print(rr)
    # print(DB.showmsgNearNow(2, 2))

    # a=DB.showmsg(1,200)
    # print(a)

    b = DB.showmsgById(6)
    print(b)

    # c=DB.addmsg("王五","https://i.imgtg.com/2022/06/21/7y826.jpg"\
    #     ,"标题","内容","https://i.imgtg.com/2022/06/21/7y826.jpg","withimg")
    # c=DB.addmsg("王五","https://i.imgtg.com/2022/06/21/7y826.jpg"\
    #     ,"标题","内容","","noimg")
    # print(c)

    # d=DB.delmsg(2)
    # print(d)

    # ee="11a"
    # try:
    #     ee=int(ee)
    #     print("1")
    # except ValueError as e:
    #     print(e)
