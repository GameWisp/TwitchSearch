import MySQLdb
import MySQLdb.cursors
import ConfigParser

class DBAccess:
    def __init__(self):
        cfg = ConfigParser.ConfigParser()
        cfg.read("config.ini")
        h = cfg.get("DBAccess", "host")
        u = cfg.get("DBAccess", "user")
        p = cfg.get("DBAccess", "password")
        d = cfg.get("DBAccess", "database")
        self.con = MySQLdb.connect(host=h, user=u, passwd=p, db=d,
                                   cursorclass=MySQLdb.cursors.SSCursor)
        self.cur = self.con.cursor()
        self.queries = Queries()

    def __del__(self):
        self.cur.close()
        self.con.close()

    def setutf8(self):
        self.con.set_character_set('utf8')
        self.execute('SET NAMES utf8;')
        self.execute('SET CHARACTER SET utf8;')
        self.execute('SET character_set_connection=utf8;')

    def execute(self, q, args=()):
        try:
            self.cur.execute(q, args)
            return self.cur.fetchall()
        except MySQLdb.Error, e:
            raise e

    def insertandreturnid(self, q, args=()):
        try:
            self.cur.execute(q, args)
            return self.cur.lastrowid
        except MySQLdb.Error, e:
            raise e

    def autocommit(self, flag):
        self.con.autocommit(flag)

    def commit(self):
        self.con.commit()

    def rollback(self):
        self.con.rollback()

    def getquery(self, key):
        return self.queries.getquery(key)

    @staticmethod
    def geterror():
        return MySQLdb.Error

    @staticmethod
    def parsetimestamp(epoch):
        import time
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(epoch))


class Queries():
    def __init__(self):
        self.queries = {}
        self.setqueries()

    def setqueries(self):
        self.queries['delete_all_streams'] = "DELETE FROM Stream"
        self.queries['insert_new_stream'] = "INSERT INTO Stream(Game, Viewers, Created_at, Average_FPS, Preview, " \
                                            "Display_name, Logo, isMature, Status, isPartner, URL, " \
                                            "Channel_created_at, Followers, Views, LanguageID) " \
                                            "VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        self.queries['select_language_id'] = "SELECT ID FROM Language WHERE Code = %s"
        self.queries['lock_on_new_stream'] = "LOCK TABLES Stream WRITE, Language READ, Routine WRITE"
        self.queries['lock_on_end_session'] = "LOCK TABLES Session WRITE"
        self.queries['unlock_tables'] = "UNLOCK TABLES"
        self.queries['insert_new_session'] = "INSERT INTO Session(Start_at, Log_file) VALUES(%s,%s)"
        self.queries['insert_new_session_routine'] = "INSERT INTO Routine(SessionID, Number, Valid, Invalid, Ratio)" \
                                                     "VALUES (%s,%s,%s,%s,%s)"
        self.queries['update_session_endtime'] = "UPDATE Session SET End_at=%s WHERE ID=%s"

    def getquery(self, key):
        return self.queries[key]
