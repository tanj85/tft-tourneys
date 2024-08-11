import pandas as pd
import hashlib

def hash_tournament_name(tournament_name, seed=0):
    # Create a hash object using MD5, including the seed in the hash input for collision resolution
    hash_input = f"{tournament_name}-{seed}".encode()
    hash_object = hashlib.md5(hash_input)
    # Convert the hash to an 8-digit number
    eight_digit_hash = int(hash_object.hexdigest(), 16) % 100000000
    return int(eight_digit_hash)

def get_tournament_id_dict(csv_file):

    try:
        existing_data = pd.read_csv(csv_file)
    except FileNotFoundError:
        print("No file found")
        return
    
    return dict(zip(existing_data['tourney_name'], existing_data['id']))
    
    

def append_unique_to_csv(strings, csv_file):
    # Load existing data if the CSV file exists, otherwise create an empty DataFrame
    try:
        existing_data = pd.read_csv(csv_file)
    except FileNotFoundError:
        existing_data = pd.DataFrame(columns=['tourney_name'])
    
    unique_strings = set(strings) - set(existing_data['tourney_name'])
    
    new_data = pd.DataFrame(list(unique_strings), columns=['tourney_name'])
    
    updated_data = pd.concat([existing_data, new_data], ignore_index=True)
    
    updated_data.to_csv(csv_file, index=False)
    print(f"Added {len(new_data)} new entries to the CSV.")

def process_csv(file_path, output_path=None):
    # Read the CSV file
    df = pd.read_csv(file_path)
    
    # Ensure there's a column named 'tourney_name'
    if 'tourney_name' not in df.columns:
        raise ValueError("CSV must contain a 'tourney_name' column.")
    
    # Create a dictionary to track tourney names and their corresponding seeds and ids
    name_to_seed = {}
    name_to_id = {}
    
    unique_ids = set()
    
    for index, row in df.iterrows():
        name = row['tourney_name']
        if name not in name_to_seed:
            seed = 0
            current_id = hash_tournament_name(name, seed)
            # Resolve conflicts by incrementing the seed if necessary
            while current_id in unique_ids:
                seed += 1
                current_id = hash_tournament_name(name, seed)
            name_to_seed[name] = seed
            name_to_id[name] = current_id
        else:
            current_id = name_to_id[name]
        
        df.at[index, 'id'] = current_id
        unique_ids.add(current_id)
    
    df['id'] = df['id'].astype('Int64')
    # Save the DataFrame back to a CSV file
    if output_path:
        df.to_csv(output_path, index=False)
    else:
        df.to_csv(file_path, index=False)  # Overwrite the original file if no output path is specified
    
    return df

# Example usage:

if __name__ == '__main__':
    csv_path = '/root/tft-tourneys/misc/tourney_info.csv'
    result_df = process_csv(csv_path)
    print(result_df)
