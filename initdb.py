import pymysql

class conf():
       host="localhost"
       user="root"
       passwd="123456"
       db="chat"
       port:int=3306


if __name__ == '__main__':
       conn = pymysql.connect(host=conf.host,
                     user=conf.user,
                     passwd=conf.passwd,
                     db=conf.db,
                     port=conf.port)

       print ("数据库打开成功")
       c = conn.cursor()
       c.execute('''
       CREATE TABLE card
              (id INTEGER NOT NULL AUTO_INCREMENT ,
              name varchar(200)   NOT NULL,
              avatar varchar(200)    default(""),
              title varchar(200)   NOT NULL,
              data  varchar(200)   NOT NULL,
              imgurl varchar(200)   default(""),
              time  varchar(200)   NOT NULL,
              type varchar(200)   default("noimg"),
              PRIMARY KEY(id)
              )
              ''')
       print ("数据表创建成功")
       conn.commit()
       conn.close()