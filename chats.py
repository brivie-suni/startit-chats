from flask import json, jsonify


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

    with open(LOGFAILS, "a", newline="", encoding="utf-8") as f:
        f.write(json.dumps(dati["chats"]) + "\n")
