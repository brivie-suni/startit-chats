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


LABAIS_VARDS = "vau"
SLIKTIE_VARDI = ["ņau", "kaķis"]


def pieraksti_zinju(dati):
    # limitējam ziņas garumu
    dati["chats"]["zinja"] = dati["chats"]["zinja"][0:140]
    now = datetime.now()
    laiks = now.strftime("%Y/%m/%d, %H:%M:%S")
    # Cenzūra
    chata_rindas = []
    zinjas_vardi = dati["chats"]["zinja"].split()
    for vards in zinjas_vardi:
        if vards in SLIKTIE_VARDI:
            chata_rindas.append(LABAIS_VARDS)
        else:
            chata_rindas.append(vards)
    dati["chats"]["zinja"]=" ".join(chata_rindas)
    with open(LOGFAILS, "a", newline="", encoding="utf-8") as f:
        dati["chats"]["laiks"] = laiks
        f.write(json.dumps(dati["chats"]) + "\n")
