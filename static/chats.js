const ATJAUNOT = 1000;
const VERSIJA = "0.51"
var vards = "Viesis"


/*
Klase, kas satur visu chata saturu, struktūru un metainformāciju
Inicializē ar no servera atgriezto json objektu
Un veic dažas vienkāršas pārbaudes
*/
class Chats {
  constructor(dati) {
    this.vards = vards;
    this.zinjas = [];

    // pārbaudām vai ir vispār kāda jau esoša ziņa
    // ja nav, parādām paziņojumu (tikai lokāli!)
    if (dati.chats.length == 0) {
      this.zinjas = [new Zinja("Pārlūkprogramma", "Čatā pašlaik ziņu nav, uzrakstiet kaut ko!")];
    }

    // no atsūtītajiem datiem izveidojam masīvu ar zinju objektiem
    for (const rinda of dati.chats) {
      const zinja = new Zinja(rinda.vards, rinda.zinja, rinda.laiks);
      zinja.adresats = rinda.adresats;
      this.add(zinja);
    }
  }

  add(zinja) {
    this.zinjas.push(zinja);
  }

  raadiChataRindas() {
    const chatUL = document.getElementById("chats");
    // novaacam ieprieksheejo saturu
    while (chatUL.firstChild) {
        chatUL.firstChild.remove();
    }
    // pievienojam visas zinjas
    for (const zinja of this.zinjas) {
      let chatLI = zinja.formateRindu();
      chatUL.appendChild(chatLI);
    }
    // noskrolleejam uz leju pie peedeejaa chata texta
    var chatScrollBox = chatUL.parentNode;
    chatScrollBox.scrollTop = chatScrollBox.scrollHeight;
  }
}

/*
Klase, kas satur visu vienas ziņas saturu, struktūru un metainformāciju
Inicializē ar no servera atgrieztā json objekta vienu rindu
*/
class Zinja {
  constructor(vards, zinja, laiks="") {
    this.vards = vards;
    this.zinja = zinja;
    this.laiks = laiks;
    this.adresats = "visi"; // nedrīkst izvēlties šādu vārdu
  }

  formateRindu() {
    const LIclassName = "left clearfix";
    const newDivclassName = "chat-body clearfix";
    
    let teksts = "";
    let newLI = document.createElement("li");
    newLI.className = LIclassName;
    let newDiv = document.createElement("div"); 
    newDiv.className = newDivclassName;
    if (this.adresats == "visi") {
      teksts = this.laiks + "~" + this.vards + ": " + this.zinja;      
    } else {
      teksts = this.laiks + "~" + this.vards + "->" + this.adresats + ": " + this.zinja;
      newDiv.className = newDivclassName + " privata-zinja";
    }
    let newContent = "";
    /*Izveido image tagu, ja tajā ir links
    */
    if (this.zinja.startsWith("http")){
      newContent = document.createElement("img");
      newContent.src = this.zinja;
    
    } else {
      newContent = document.createTextNode(teksts);  
    }
    newLI.appendChild(newDiv); 
    newDiv.appendChild(newContent); 
    return newLI;
  }
}


/*
Ielādē tērzēšanas datus no servera
Uzstāda laiku pēc kāda atkārtoti izsaukt šo pašu funkciju
*/
async function lasiChatu() {
    const atbilde = await fetch('/chats/lasi/' + vards);
    const datuObjekts = await atbilde.json();
    let dati = new Chats(datuObjekts);
    dati.raadiChataRindas();
    await new Promise(resolve => setTimeout(resolve, ATJAUNOT));
    await lasiChatu();
}


/*
Publicē tērzēšanas ziņas datus uz serveri
*/
async function suutiZinju() {
    // Nolasa ievades lauka saturu
    let zinjasElements = document.getElementById("zinja");
    let zinja = zinjasElements.value;
    let rindas_objekts;

    // pārbaudām vai ir vispār kaut kas ierakstīts
    if (zinja.length > 0) {

        if (zinja.startsWith("/")) {
          rindas_objekts = saprotiKomandu(zinja);
        } else {
          rindas_objekts = new Zinja(vards, zinja)
        }

        // izdzēš ievades lauku
        zinjasElements.value = "";

        const atbilde = await fetch('/chats/suuti', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "chats": rindas_objekts })
        });
        const datuObjekts = await atbilde.json();

        // parāda jauno chata saturu
        let dati = new Chats(datuObjekts);
        dati.raadiChataRindas();
    } else {
        console.log("Tukšu ziņu nesūtām uz serveri")
    }
}


function saprotiKomandu(ievades_teksts) {
  let ievades_vardi = ievades_teksts.split(" ");
  let komanda = ievades_vardi[0];
  let zinja = "";
  // izveido jaunu chata rindinju no vārda, ziņas utml datiem
  let chata_rinda = new Zinja(vards, zinja)

  switch (komanda) {
    case "/vards":
    case "/vaards":
      if (ievades_vardi.length < 2) {
        chata_rinda.zinja = "Norādi jauno vārdu, piemēram: /vards MansJaunaisVards";
      } else {
        chata_rinda.zinja = uzstadiVaardu(ievades_vardi[1]);
      }
      break;
    case "/uptime":
      servera_uptime();
      break;
    case "/versija":
    case "/v":
      chata_rinda.zinja = "Javascript versija: " + VERSIJA;
      break;
    case "/suns":
      chata_rinda.zinja = "http://placedog.net/200?random";
      break;
    case "/vau":
    case "/msg":
      if (ievades_vardi.length < 3) {
        chata_rinda.zinja = "Lai nosūtītu privātu VAU, ierakstiet adresāta vārdu un ziņu formā /vau Adresats Zinja";  
      } else {
        chata_rinda.adresats = ievades_vardi[1];
        // izmetam pirmos divus vaardus, jo tie ir komanda un adresats
        ievades_vardi.shift();
        ievades_vardi.shift();
        chata_rinda.zinja = ievades_vardi.join(" ");
      }
      break;
    case "/paliigaa":
    case "/paliga":
    case "/help":
    case "/?":
    default:
      chata_rinda.zinja = paradiPalidzibu();
      break;
  }
  return chata_rinda;
}

async function servera_uptime() {
  const atbilde = await fetch('/uptime');
  uptaims = await atbilde.text();
  var uptimeLauks = document.getElementById("uptime");
  uptimeLauks.innerHTML = "Servera darbības laiks: " + uptaims;
}

function uzstadiVaardu(jaunaisVards) {
  let vecaisVards = vards;
  vards = jaunaisVards;
  let teksts = vecaisVards + " kļuva par " + vards;
  return teksts;
}


function paradiPalidzibu() {
  return 'Pieejamās komandas : "/vards JaunaisVards", "/palidziba", "/versija"'
}


// Ērtības funkcionalitāte
var versijasLauks = document.getElementById("versija");
versijasLauks.innerHTML = "JS versija: " + VERSIJA;
// Atrod ievades lauku
var ievadesLauks = document.getElementById("zinja");
// Gaida signālu no klaviatūras, ka ir nospiests Enter taustiņš
ievadesLauks.addEventListener("keyup", function(event) {
  // Numur 13 ir "Enter" taustiņš
  if (event.keyCode === 13) {
    suutiZinju();
  }
});
