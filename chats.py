from flask import json, jsonify
from datetime import datetime

LOGFAILS = "chats.txt"

def lasi(adresats):
    chata_rindas = []
    with open(LOGFAILS, "r", encoding="utf-8") as f:
        for rinda in f:
            r = json.loads(rinda)
            if "adresats" in r:
                if r["adresats"] == adresats or r["adresats"] == "visi" or r["vards"] == adresats:
                    chata_rindas.append(r)
            
    return jsonify({"chats": chata_rindas})


def pieraksti_zinju(dati):
    dati["chats"]["zinja"] = dati["chats"]["zinja"][0:140] # limitējam ziņas garumu 
    now = datetime.now()
    laiks = now.strftime("%Y/%m/%d, %H:%M:%S")
    
    / import colorama
from colorama import Fore, Back, Style
colorama.init()
print(Fore.RED + 'Красный текст')
print(Back.BLUE + 'Синий фон')
print(Style.RESET_ALL)
print('Снова обычный текст')/

    with open(LOGFAILS, "a", newline="", encoding="utf-8") as f:
        dati["chats"]["laiks"]=laiks
        f.write(json.dumps(dati["chats"]) + "\n")
