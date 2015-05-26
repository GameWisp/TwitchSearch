def main():
    import time
    import logging
    from streams_wrapper import StreamsWrapper
    from dbaccess import DBAccess

    SLEEP_TIME = 10
    number_of_routines = 0
    start = time.time()
    db = DBAccess()

    # Setup logger
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)
    # create file handler which logs even debug messages
    filename = 'logs/' + str(start) + '.log'
    fh = logging.FileHandler(filename)
    fh.setLevel(logging.WARNING)
    # create console handler with a higher log level
    ch = logging.StreamHandler()
    ch.setLevel(logging.WARNING)
    # create formatter and add it to the handlers
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    fh.setFormatter(formatter)
    # add the handlers to logger
    logger.addHandler(ch)
    logger.addHandler(fh)

    sw = StreamsWrapper(logger)

    # New session
    db.autocommit(True)
    sessionid = db.insertandreturnid(db.getquery('insert_new_session'),
                                     (db.parsetimestamp(start), filename))

    logger.warning("Started session #%s (%s)", sessionid, time.ctime(start))
    while True:
        number_of_routines += 1
        logger.warning("******************")
        logger.warning("Started routine #%s", number_of_routines)

        rstart = time.time()
        try:
            # Gather updated streams info
            logger.warning("Gathering live streams info")
            sw.update()
            # Save them in the database
            logger.warning("Saving streams in the database")
            sw.saveToDb(db)

            rend = time.time()
            relapsed = int(round((rend - rstart) / 60, 0))
            success = sw.getSuccessAmount()
            errors = sw.getErrorAmount()
            ratio = round(success / float(success + errors) * 100, 2)
            logger.warning(
                "Ended routine #%s (~%s minutes) with %s valid entries (%s errors, %s%% success ratio)",
                number_of_routines,
                relapsed,
                success,
                errors,
                ratio)

            db.execute(db.getquery('insert_new_session_routine'),
                       (sessionid, number_of_routines, success, errors, ratio))

            time.sleep(SLEEP_TIME)
        except KeyboardInterrupt:
            logger.warning("Routine interrupted")
            break

    end = time.time()
    elapsed = end - start

    db.autocommit(True)
    db.execute(db.getquery('lock_on_end_session'))
    db.execute(db.getquery('update_session_endtime'), (db.parsetimestamp(end), sessionid))
    db.execute(db.getquery('unlock_tables'))

    logger.warning("** STATS (session #%s) **", sessionid)
    logger.warning("Started at %s", time.ctime(start))
    logger.warning("Ended at %s", time.ctime(end))
    logger.warning("Elapsed time %s s (%s mins)", elapsed, elapsed / 60)
    logger.warning("Number of routines %s", number_of_routines)


if __name__ == '__main__':
    main()
