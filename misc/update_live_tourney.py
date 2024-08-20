import threading
import pandas as pd
import argparse
import scrape_tourney
from datetime import datetime

# depreciated


live_tourney_id = 61727238
csv_path = "/root/tft-tourneys/misc/tourney_info.csv"

def set_live_flag():
    df = pd.read_csv(csv_path)
    df['is_live_flag'] = 0
    if live_tourney_id != 0:
        df.loc[df['id'] == live_tourney_id, 'is_live_flag'] = 1
    df.to_csv(csv_path, index=False)

def update_live():
    scrape_tourney.scrape_tourney(live_tourney_id)
    # Reschedule the update_live function to be called after 300 seconds (5 minutes)
    print(f"Updated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    threading.Timer(300, update_live).start()

def main():
    parser = argparse.ArgumentParser(description="Manage live tournament update.")
    parser.add_argument("--set_live", action="store_true", help="Set the live flag and exit.")
    args = parser.parse_args()

    if args.set_live:
        set_live_flag()
    else:
        update_live()

if __name__ == "__main__":
    main()
