# noinspection PyPep8,PyBroadException,PyBroadException,PyBroadException
class Stream:
    def __init__(self, s):
        self.s = s

    def getJSONObj(self):
        return self.s

    def getStreamValue(self, key):
        return self.s[key]

    def getChannelValue(self, key):
        return self.s['channel'][key]

    def getPreviewLink(self, key):
        return self.s['preview'][key]

    def validateJSON(self):
        clen = len(self.getStreamValue("channel"))
        if clen < 22:
            return False
        return True

    def toStr(self):
        return self.getChannelValue("name")
