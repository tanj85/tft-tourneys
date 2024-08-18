from time import sleep
import requests


url = "https://127.0.0.1/tournaments/"

if __name__ == "__main__":

    while True:
        try:
            response = requests.post("http://127.0.0.1:5000/tournaments")
            print(response.json())
        except:
            print("couldn't get repsonse")
        sleep(1)
