import unittest
import json
from app import app
import logging
from logging.handlers import TimedRotatingFileHandler
from datetime import datetime

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

handler = TimedRotatingFileHandler("logs/my_log.log", when="midnight", interval=1)
handler.suffix = "%Y-%m-%d"
handler.extMatch = r"^\d{4}-\d{2}-\d{2}$"

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

logger.addHandler(handler)



class TestTournaments(unittest.TestCase):
    def test_hello(self):
        self.assertEqual(True, True)

if __name__ == "__main__":
    # unittest.main()

    logger.info("HELLO WORLD")
    logger.warning("KFJLDFKLD")

    