from time import sleep
import requests
from datetime import datetime
import threading
import sys
from pathlib import Path
import logging
from logging.handlers import TimedRotatingFileHandler


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = TimedRotatingFileHandler("logs/periodic/periodic.log", when="midnight", interval=1, utc=True)
handler.suffix = "%Y-%m-%d"
handler.extMatch = r"^\d{4}-\d{2}-\d{2}$"
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Get the parent directory
parent_dir = Path(__file__).resolve().parent.parent
child_dir = parent_dir / 'misc'
sys.path.append(str(parent_dir))
sys.path.append(str(child_dir))

import misc.scrape_tourney as scrape_tourney

# Global settings
sleepTime = 60
checkNewLiveTourneysTime = 3600
liveTourneyTimer = 0
lock = threading.Lock()  # Lock for thread-safe operations
shutdown_event = threading.Event()  # Shutdown event for clean thread termination

def updateLive(liveTourneyIds=None):
    global liveTourneyTimer

    while not shutdown_event.is_set():
        with lock:  # Ensure that changes to liveTourneyTimer are thread-safe
            liveTourneyTimer -= sleepTime

        if liveTourneyIds is None or liveTourneyTimer <= 0:
            with lock:
                liveTourneyTimer = checkNewLiveTourneysTime  # Reset timer safely

            try:
                try:
                    response = requests.post("http://127.0.0.1:8080/tournaments/")
                    # print(response.json())
                    logger.info(response.json())
                except Exception as e:
                    # print(f"Couldn't get response: {e}")
                    logger.info(f"Couldn't get response: {e}")
                response = requests.get("http://127.0.0.1:8080/tournaments/?live=true")
                response.raise_for_status()
                liveTourneyIds = [x["tournament_id"] for x in response.json()]
                # print(f"Got new liveTourneyIds: {liveTourneyIds}")
                logger.info(f"Got new liveTourneyIds: {liveTourneyIds}")
            except Exception as e:
                # print(f"An unexpected error occurred: {e}")
                logger.info(f"An unexpected error occurred: {e}")
                liveTourneyIds = []

        scraped = 0
        scrape_log = "started_scrape|"
        for tourneyId in liveTourneyIds:
            try:
                logger.info(f"starting scrape for tournament {tourneyId}")
                if shutdown_event.is_set():
                    break  # Stop processing if a shutdown is triggered
            

                scraped += scrape_tourney.scrape_tourney(tourneyId)
                scrape_log += f"{tourneyId} scraped:[{scraped}] |"
                logger.info(f"starting scrape for tournament {tourneyId} and got {scraped} entries")
            except Exception as e:
                logger.info(f"Error scraping tournament {tourneyId}: {e}")
        

        logger.info(scrape_log)

        if scraped > 0:
            try:
                response = requests.post("http://127.0.0.1:8080/tournaments?live_only=true")
                # print(response.json())
                logger.info(response.json())
            except Exception as e:
                # print(f"Couldn't get response: {e}")
                logger.info(f"Couldn't get response: {e}")
            # print(f"Updated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            logger.info(f"Updated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        else:
            # print(f"No updates to databases at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            logger.info(f"No updates to databases at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        if shutdown_event.wait(sleepTime):
            break  # Exit the loop if shutdown event is set during the wait

def main():
    # Starting the update function in a thread
    update_thread = threading.Thread(target=updateLive)
    update_thread.start()

    try:
        while True:
            sleep(0.5)
    except KeyboardInterrupt:
        # print("Received shutdown signal")
        logger.info("Received shutdown signal")
        shutdown_event.set()  # Signal all threads to stop

    update_thread.join()  # Wait for the update thread to finish
    # print("All threads have been cleanly shut down")
    logger.info("All threads have been cleanly shut down")

if __name__ == "__main__":
    main()
