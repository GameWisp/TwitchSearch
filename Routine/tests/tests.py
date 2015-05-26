import sys
sys.path.append('E:\Google Drive\Programacao\Projects\Twitch\TwitchSearch\Backend')
from dbaccess import DBAccess

db = DBAccess()
try:
    db.autocommit(True)
    _id = db.insertandreturnid("INSERT INTO teste(Name) VALUES(%s)", 'Joao')
    print _id
except db.geterror(), e:
    print e
