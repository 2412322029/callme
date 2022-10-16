import pymysql

class conf():
       host="localhost"
       user="root"
       passwd="123456"
       db="chat"
       port:int=3306
       DelPasswd="J7QcN"


if __name__ == '__main__':
       conn = pymysql.connect(host=conf.host,
                     user=conf.user,
                     passwd=conf.passwd,
                     db=conf.db,
                     port=conf.port)

       print ("数据库打开成功")
       c = conn.cursor()
       c.execute('''
       CREATE TABLE ca
              (id INTEGER NOT NULL AUTO_INCREMENT ,
              name varchar(200)   NOT NULL,
              avatar varchar(200)    default '',
              title varchar(200)   NOT NULL,
              data  text   NOT NULL,
              imgurl varchar(200)   default '',
              time  varchar(200)   NOT NULL,
              type varchar(200)   default 'noimg',
              comment_count int(255) default 0,
              PRIMARY KEY(id)
              )
              ''')
       print ("数据表card创建成功")
       conn.commit()

       c = conn.cursor()
       c.execute('''
       CREATE TABLE commen
              (id INTEGER NOT NULL AUTO_INCREMENT ,
              cid int(255) NOT NULL,
              depth  int(20) default 0,
              parent_id varchar(200)   NOT NULL,
              name varchar(200)    NOT NULL,
              content  text   NOT NULL,
              time  varchar(200)   NOT NULL,
              PRIMARY KEY(id)
              )
              ''')
       print ("数据表comment创建成功")
       conn.commit()

       conn.close()