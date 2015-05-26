class StreamsWrapper:
    def __init__(self, logger):
        self.streams = list()
        self.logger = logger
        self.error_amount = 0

    def update(self):
        import urllib2
        import json
        from stream import Stream

        self.streams = list()
        self.stream_names = list()
        self.error_amount = 0
        pages = list()
        limit = 100
        offset = 0
        url = 'https://api.twitch.tv/kraken/streams?limit=@l@&offset=@o@'

        while True:
            new_url = url.replace("@l@", str(limit)).replace("@o@", str(offset))
            self.logger.debug(new_url)
            response = urllib2.urlopen(new_url)
            data = json.load(response)
            slen = len(data["streams"])
            if slen == 0:
                break
            offset += limit
            pages.append(data)

        for index in xrange(0, len(pages)):
            data = pages[index]
            slen = len(data["streams"])
            for i in xrange(0, slen):
                s = data["streams"][i]
                stream = Stream(s)
                # if stream.validateJSON():
                if not self.exists(stream) and stream.validateJSON():
                    self.streams.append(stream)
                    self.stream_names.append(stream.getChannelValue('display_name'))
                    self.logger.info("Added " + stream.toStr())
                else:
                    self.error_amount += 1
                    self.logger.info("Invalid entry " + stream.toStr())

    def saveToDb(self, db):
        try:
            db.autocommit(False)

            # Set db to work with utf8
            db.setutf8()

            # Lock the tables
            db.execute(db.getquery('lock_on_new_stream'))

            # Delete all current entries
            db.execute(db.getquery('delete_all_streams'))
            for s in self.streams:
                self.logger.info("Saving in DB: " + s.toStr())
                game = s.getStreamValue('game')
                viewers = s.getStreamValue('viewers')
                created_at = parsetimestamp(s.getStreamValue('created_at'))
                avg_fps = round(s.getStreamValue('average_fps'), 0)
                preview = s.getPreviewLink('medium')
                display_name = s.getChannelValue('display_name')
                logo = s.getChannelValue('logo')
                ismature = s.getChannelValue('mature') == True
                status = s.getChannelValue('status')
                ispartner = s.getChannelValue('partner') == True
                url = s.getChannelValue('url')
                channel_created_at = parsetimestamp(s.getChannelValue('created_at'))
                followers = s.getChannelValue('followers')
                views = s.getChannelValue('views')
                langcode = getlanguageid(s.getChannelValue('broadcaster_language'), db)
                db.execute(db.getquery('insert_new_stream'),
                           (game, viewers, created_at, avg_fps, preview, display_name, logo, ismature,
                            status, ispartner, url, channel_created_at, followers, views, langcode))

            # Unlock the table
            db.execute(db.getquery('unlock_tables'))

            db.commit()
        except db.geterror(), e:
            db.rollback()
            self.logger.error("Error %d: %s" % (e.args[0], e.args[1]))
        finally:
            db.autocommit(True)

    def exists(self, entry):
        return entry.getChannelValue('display_name') in self.stream_names

    def getStreams(self):
        return self.streams

    def getErrorAmount(self):
        return self.error_amount

    def getSuccessAmount(self):
        return len(self.streams)


def parsetimestamp(timestamp):
    return timestamp.replace('T', ' ').replace('Z', '')


def getlanguageid(lang, db):
    langid = None
    if lang:
        rs = db.execute(db.getquery('select_language_id'), lang)
        for row in rs:
            langid = row[0]
    return langid