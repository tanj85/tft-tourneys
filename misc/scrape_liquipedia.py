import pandas as pd
from bs4 import BeautifulSoup
import requests
from sqlalchemy import create_engine, text
import psycopg2
import datetime
import hash_tournaments
import time
import re
import copy

user = 'postgres'
password = 'tft!'
host = '127.0.0.1'
port = '5432'
dbname = 'tftourneys'
table_name = 'tbl_liquipedia_tournaments'



def filter_prize_pool_table_rows(tag):
    return tag.has_attr('class') and 'csstable-widget-row' in tag['class'] and 'prizepooltable-header' not in tag['class'] and 'ppt-toggle-expand' not in tag['class']

def scrap_final_standings(engine):

    with engine.connect() as conn:
        
        result = conn.execute(
            text("""
        SELECT tournament_id, liquipedia_link, num_participants FROM tbl_liquipedia_tournaments;
        """)
        )

    urls = []
    tournament_ids = []

    with engine.connect() as conn:

        for row in result:
            result2 = conn.execute(text("SELECT COUNT(tournament_id) from tbl_final_standings WHERE tournament_id=:t_id;"), {'t_id':row[0]})
            if int(result2.first()[0]) >= int((row[2]if row[2] else 0)/2):
                print(f"skipped tournamnet {row[0]} bc already in")
                continue
            tournament_ids.append(row[0])
            urls.append(row[1])
            # print(row[1])

    for i in range(len(urls)):
        try: 
            url = urls[i]
            tournament_id = tournament_ids[i]

            time.sleep(5)

            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')

            prize_pool_table = soup.find('div', class_ = 'prizepooltable')

            rows = prize_pool_table.find_all(filter_prize_pool_table_rows)

            player_standings = []

            for row in rows:
                player_stats = {}


                player_stats['id'] = tournament_id

                player_stats['link'] = url

                player_stats['prize'] = '$0'

                possible_div_texts = [x.text.strip() if x.text else "" for x in row.find_all('div', class_ = 'csstable-widget-cell')]

                for txt in possible_div_texts:
                    if '$' in txt:
                        player_stats['prize'] = txt

                player_stats['place'] = row.find('div', class_ = 'prizepooltable-place').text

                # seems like sometimes can have DQ
                if not any(char.isdigit() for char in player_stats['place']):
                    print("vvv DQ Info vvv")
                    print(player_stats['place'], player_stats)
                    print("^^^ DQ INFO ^^^")
                    continue

                if '-' in player_stats['place']:
                    stats = player_stats['place'].split('-')

                    start_place = int(''.join(re.findall(r'\d+', stats[0])))
                    end_place = int(''.join(re.findall(r'\d+', stats[1])))

                    all_names = row.find_all('span', class_ = 'name')

                    for j in range(end_place - start_place + 1):
                        player_stats['place'] = start_place + j

                        if (j < len(all_names)):
                            player_stats['name'] = all_names[j].text
                            player_stats['name'] = player_stats['name'].strip() if player_stats['name'] else None
                        else:
                            player_stats['name'] = ""

                        player_standings.append(copy.deepcopy(player_stats))
                        # print(player_stats, start_place, end_place, j)

                else:
                    player_stats['place'] = int(''.join(re.findall(r'\d+', player_stats['place']))) if player_stats['place'] else None
                
                    player_stats['name'] = row.find('span', class_ = 'name').text
                    player_stats['name'] = player_stats['name'].strip() if player_stats['name'] else None

                    player_standings.append(player_stats)
        except Exception as e:
            print(f'{e}', tournament_ids[i])
            print(response)
            continue

        sql_query = text(f"""
                INSERT INTO tbl_final_standings (
                    tournament_id, player_name, overall_place, prize
                ) VALUES (
                    :tournament_id, :player_name, :overall_place, :prize
                )
            """)


        for ps in player_standings:
            parameters = {
                "tournament_id": ps['id'],
                "player_name": ps['name'],
                "overall_place": ps['place'],
                "prize": ps['prize']
            }
            
            with engine.connect() as conn:
                transaction = conn.begin()
                try:
                    # Execute the query with parameters
                    conn.execute(sql_query, parameters)
                    transaction.commit()
                except Exception as e:
                    print(f"Failed to add, probably bc duplicate tournament id [{ps['id']}]")
                    transaction.rollback()
        print(f"added tourney {ps['id']}")

def update_player_ids_in_final_standings(engine, override = False):

    if override:
        with engine.connect() as conn:
            result = conn.execute(
                text("""
            SELECT player_name FROM tbl_final_standings;
            """)
            )
    else:
        with engine.connect() as conn:
            result = conn.execute(
                text("""
            SELECT player_name FROM tbl_final_standings where player_id is NULL;
            """)
            )

    zips = set()

    with engine.connect() as conn:
        for row in result:
            player_ids = conn.execute(
                text("""
            SELECT player_id FROM tbl_player_aliases where player_name=:player_name;
            """), {'player_name':row[0]}
            )
            for player_id in player_ids:
                zips.add((int(player_id[0]), row[0]))
    
    # print(zips)

    for zip in zips:
        with engine.connect() as conn:
            transaction = conn.begin()
            try:
                conn.execute(text('''UPDATE tbl_final_standings SET player_id=:p_id WHERE player_name=:p_name;'''), 
                             {'p_id':zip[0], 'p_name':zip[1]})
                transaction.commit()
            except Exception as e:
                print(f"Failed to add")
                transaction.rollback()

    print("ALL DONE!")

def add_tournament(
    engine,
    tournament_id,
    tournament_name = None,
    start_date = None,
    end_date = None,
    prize_pool = None,
    region = None,
    num_participants = None,
    tier = None,
    patch = None,
    game_mode = None,
    event_type = None,
    format = None,
    liquipedia_link = None,
    set = None):


    # Prepare the SQL query using named parameters for safe insertions
    sql_query = text(f"""
        INSERT INTO {table_name} (
            tournament_id, tournament_name, start_date, end_date, prize_pool,
            region, num_participants, tier, patch, game_mode, event_type, format,
            liquipedia_link, set
        ) VALUES (
            :tournament_id, :tournament_name, :start_date, :end_date, :prize_pool,
            :region, :num_participants, :tier, :patch, :game_mode, :event_type,
            :format, :liquipedia_link, :set
        )
    """)

    sql_query_2 = text(f"""
        UPDATE {table_name}
        SET
            tournament_name = COALESCE(:tournament_name, tournament_name),
            start_date = COALESCE(:start_date, start_date),
            end_date = COALESCE(:end_date, end_date),
            prize_pool = COALESCE(:prize_pool, prize_pool),
            region = COALESCE(:region, region),
            num_participants = COALESCE(:num_participants, num_participants),
            tier = COALESCE(:tier, tier),
            patch = COALESCE(:patch, patch),
            game_mode = COALESCE(:game_mode, game_mode),
            event_type = COALESCE(:event_type, event_type),
            format = COALESCE(:format, format),
            liquipedia_link = COALESCE(:liquipedia_link, liquipedia_link),
            set = COALESCE(:set, set)
        WHERE
            tournament_id = :tournament_id;
        """)

    # Use a dictionary to pass parameters safely to avoid SQL injection
    parameters = {
        "tournament_id": tournament_id,
        "tournament_name": tournament_name,
        "start_date": start_date,
        "end_date": end_date,
        "prize_pool": prize_pool,
        "region": region,
        "num_participants": num_participants,
        "tier": tier,
        "patch": patch,
        "game_mode": game_mode,
        "event_type": event_type,
        "format": format,
        "liquipedia_link": liquipedia_link,
        "set": set
    }

    with engine.connect() as conn:
        transaction = conn.begin()
        try:
            # Execute the query with parameters
            conn.execute(sql_query, parameters)
            transaction.commit()
            return
        except Exception as e:
            print(f"Failed to add, probably bc duplicate tournament id [{tournament_id}]")
            transaction.rollback()

    with engine.connect() as conn:
        transaction = conn.begin()
        try:
            # Execute the query with parameters
            conn.execute(sql_query_2, parameters)
            transaction.commit()
        except Exception as e:
            print(e)
            print(f"Failed to add, probably bc tournament id doesn't exist here [{tournament_id}]")
            transaction.rollback()

def parse_date_range(date_range):

    parts = date_range.split()

    # print(parts)
    
    # Check the format of the date range
    if len(parts) == 7:
        # Format: "Dec 29,2022 - Jan 1, 2023"
        start_year = parts[2]
        start_month = parts[0]
        start_day = parts[1].replace(',', '')
        end_year = parts[6]
        end_month = parts[4]
        end_day = parts[5].replace(',', '')
    elif len(parts) == 6:
        # Format: "Apr 29 - May 1, 2022"
        start_month = parts[0]
        start_day = parts[1]
        end_month = parts[3]
        end_day = parts[4].replace(',', '')
        start_year, end_year = parts[5], parts[5]
    elif len(parts) == 5:
        # Format: "Apr 29 - 30, 2022"
        start_month = parts[0]
        start_day = parts[1]
        end_month = parts[0]  # Same month as start month
        end_day = parts[3].replace(',', '')
        start_year, end_year = parts[4], parts[4]
    elif len(parts) == 3:
        # Format: "Apr 29, 2022"
        start_month = parts[0]
        start_day = parts[1].replace(',', '')
        end_month = parts[0]  # Same month as start month
        end_day = start_day
        start_year, end_year = parts[2], parts[2]
    elif len(parts) == 0:
        return "", ""
    else:
        raise ValueError("Unsupported date range format")

    # Create datetime objects
    start_date = datetime.datetime.strptime(f"{start_month} {start_day} {start_year}", "%b %d %Y")
    end_date = datetime.datetime.strptime(f"{end_month} {end_day} {end_year}", "%b %d %Y")
    
    # Format the dates into PostgreSQL format (YYYY-MM-DD)
    start_date_postgresql = start_date.strftime("%Y-%m-%d")
    end_date_postgresql = end_date.strftime("%Y-%m-%d")
    
    return start_date_postgresql, end_date_postgresql


def scrape_tourneys_by_tier(tiers = ['s','a','b', 'qualifiers']):

    engine = create_engine(f'postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}')

    urls = []

    if 's' in tiers:
        urls.append(('https://liquipedia.net/tft/S-Tier_Tournaments', 'S'))
    
    if 'a' in tiers:
        urls.append(('https://liquipedia.net/tft/A-Tier_Tournaments', 'A'))

    if 'b' in tiers:
        urls.append(('https://liquipedia.net/tft/B-Tier_Tournaments', 'B'))

    if 'qualifiers' in tiers:
        urls.append(('https://liquipedia.net/tft/Qualifiers_Tournaments', 'qual'))

    tourney_names = []
    cumulative_content_groups = []

    for pack in urls:
        
        url = pack[0]
        tier = pack[1]

        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        # Step 3: Initialize variables for grouping
        content_groups = []
        current_group = []

        # Step 4: Iterate through elements and group by mw-headline
        for element in soup.find_all(['div', 'span'], class_=['gridRow', 'mw-headline']):
            if 'mw-headline' in element.get('class', []):
                if current_group:
                    content_groups.append(current_group)
                    current_group = []
                current_group.append({'set': element.text, 'content': []})
            elif 'gridRow' in element.get('class', []):
                # print(element)
                content = {}

                # tournament name
                tournament_name_div = element.find('div', class_='gridCell Tournament Header')
                content['tournament_name'] = tournament_name_div.text.strip() if tournament_name_div else ""
                links = tournament_name_div.find_all('a')

                tourney_names.append(content['tournament_name'])

                content['tournament_link'] = "https://liquipedia.net"+links[-1]['href'].strip() if links else ""

                tournament_date = element.find('div', class_='gridCell EventDetails Date Header')
                content['start_date'], content['end_date'] = parse_date_range(tournament_date.text.strip() if tournament_date else "")

                tournament_prize = element.find('div', class_='gridCell EventDetails Prize Header')
                content['prize_pool'] = tournament_prize.text.strip() if tournament_prize else ""

                tournament_region = element.find('div', class_='gridCell EventDetails Location Header')
                content['region'] = tournament_region.text.strip() if parse_date_range else ""

                tournament_players = element.find('div', class_='gridCell EventDetails PlayerNumber Header')
                tournament_players_span = tournament_players.find('span', style=lambda value: value and 'vertical-align:top' in value) if tournament_players else ""
                content['num_participants'] = int(tournament_players_span.text.strip().replace(',','')) if tournament_players_span else None

                content['tier'] = tier

                if current_group:
                    current_group[-1]['content'].append(content)
                else:
                    current_group.append({'set': None, 'content': [content]})

        # Add the last group if it exists
        if current_group:
            content_groups.append(current_group)
        
        cumulative_content_groups += content_groups
    
    hash_tournaments.append_unique_to_csv(tourney_names, '/root/tft-tourneys/misc/tournament_hashes.csv')
    hash_tournaments.process_csv('/root/tft-tourneys/misc/tournament_hashes.csv')

    t_ids = hash_tournaments.get_tournament_id_dict('/root/tft-tourneys/misc/tournament_hashes.csv')

    for content_group in cumulative_content_groups:
        content_dict = content_group[0]
        set = content_dict['set']
        for t_dict in content_dict['content']:
            # print(t_dict)
            add_tournament(engine, 
                        tournament_id = t_ids[t_dict['tournament_name']],
                        tournament_name = t_dict['tournament_name'],
                        liquipedia_link = t_dict['tournament_link'],
                        start_date = t_dict['start_date'],
                        end_date = t_dict['end_date'],
                        prize_pool = t_dict['prize_pool'],
                        region = t_dict['region'],
                        num_participants = t_dict['num_participants'],
                        set = set,
                        tier = t_dict['tier']
                        )


if __name__ == '__main__':
    scrape_tourneys_by_tier()