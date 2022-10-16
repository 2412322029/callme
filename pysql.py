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
        if isinstance(id, int) and id > 0:
            c = self.conn.cursor()
            sql = '''
            select * from card where id={} limit 1
            '''.format(id)
            c.execute(sql)
            r = c.fetchall()
            self.conn.commit()
            if r == ():
                return {"code": 400, "msg": "id不存在"}
            else:
                data = []
                for row in r:
                    res = {"id": row[0], "name": row[1],
                           "avatar": row[2], "title": row[3],
                           "data": row[4], "imgurl": row[5],
                           "time": row[6], "type": row[7], "comment_count": row[8]}
                    data.append(res)
                self.conn.commit()
                return {"code": 200, "msg": "id详情查询成功", "data": data}
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
                       "data": row[4], "imgurl": row[5],
                       "time": row[6], "type": row[7], "comment_count": row[8]}
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
                       "data": row[4], "imgurl": row[5],
                       "time": row[6], "type": row[7], "comment_count": row[8]}
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
            print(e)
            return {"code": 400, "msg": "Data too long "}

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

    def new_one_comment(self, cid: int):
        '''
        评论数加一
        '''
        c = self.conn.cursor()
        sql = '''
        update card set comment_count=comment_count+1 where id = {}
        '''.format(cid)
        r = c.execute(sql)
        self.conn.commit()
        # print(r)
        if r == 1:
            return {"code": 200, "msg": str(cid)+"号，评论加一"}
        else:
            return {"code": 400, "msg": "评论计数失败"}

    def sentcomment(self, cid: int, depth: int, parent_id: int, name: str, content: str):
        '''
        插入评论
        cid:所属卡片id
        depth:评论嵌套深度
        parent_id:该评论的上一级评论id,该值为0表示depth=0,没有上级评论
        name:名称
        content:内容
        '''

        c = self.conn.cursor()
        sql = '''
        INSERT INTO comment (cid,depth,parent_id,name,content,time)
            VALUES ('{}','{}','{}','{}','{}',{})
        '''.format(cid, depth, parent_id, name, content, time.time())
        try:
            c.execute(sql)
            self.conn.commit()
            self.new_one_comment(cid)  # 评论数加一
            return {"code": 200, "msg": "评论发送成功"}
        except pymysql.Error as e:
            self.conn.rollback()  # 发生错误回滚
            print(e)
            return {"code": 400, "msg": "评论发送失败"}

    def readcomment(self, cid: int):
        '''
        cid:卡片id
        '''
        try:
            cid=int(cid)
            
            c = self.conn.cursor()
            sql = '''
            select id,depth,parent_id,name,content,time,cid from comment 
                where cid={}
            '''.format(cid)
            result=c.execute(sql)
            if result==0:
                return {"code": 300, "msg": "没有评论"}
            else: 
                r=c.fetchall()
                self.conn.commit()
                data = []
                for row in r:
                    id=row[0]
                    depth=row[1]
                    parent_id=row[2]
                    name=row[3]
                    content=row[4]
                    time=row[5]
                    cid=row[6]
                    res={"id": id,"depth":depth,"parent_id":parent_id,
                        "name": name,"content":content,
                        "time":time,"cid":cid}
                    data.append(res) 
                return {"code": 200, "msg": "评论查询成功", "data": data}
        except ValueError as e:
            return  {"code": 400, "msg": e}



if __name__ == '__main__':
    DB = CreateCard()
    # rr = DB.getcount()
    # print(rr)
    # print(DB.showmsgNearNow(2, 2))

    # a=DB.showmsg(1,200)
    # print(a)

    # print(DB.sentcomment(6,1,1,"txxxxt1","ccccxxc"))

    print(DB.readcomment(6))

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
