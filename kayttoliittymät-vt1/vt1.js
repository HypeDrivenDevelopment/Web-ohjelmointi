// voit tutkia tarkemmin käsiteltäviä tietorakenteita konsolin kautta 
// tai json-editorin kautta osoitteessa http://jsoneditoronline.org/
// Jos käytät json-editoria niin avaa data osoitteesta:
// http://appro.mit.jyu.fi/tiea2120/vt/vt1/2019/data.json

// Seuraavilla voit tutkia selaimen konsolissa käytössäsi olevaa tietorakennetta. 

//console.log(data);

//console.dir(data);

// voit vapaasti luoda data-rakenteen pohjalta omia aputietorakenteita

// Kirjoita tästä eteenpäin oma ohjelmakoodisi

"use strict";

console.log("----------")
console.log("Taso 3")
console.log("----------")

var tiimi = { 
    "nimi": "Mallijoukkue",
    "jasenet": [
        "Tommi Lahtonen",
        "Matti Meikäläinen"
    ],
    "id": 99999
}

lisaaJoukkue(data, "Jäärogaining", tiimi, "8h")

/*
funktio joka käy tietorakenteen läpi ja lisää annetun joukkueen tiedot kilpailua ja sarjaa vastaavaan kohtaan
*/
function lisaaJoukkue(data, kilpailu, joukkue, sarja) {
	for(let i=0; i<data.length; i++){
		for(let j=0; j<data[i].sarjat.length; j++){
			if (data[i].nimi == kilpailu && data[i].sarjat[j].nimi == sarja) { 
				data[i].sarjat[j].joukkueet.push(joukkue);
			}
		}
	}
}

poistaJoukkue(data, "Jäärogaining", "4h", "Vapaat");
poistaJoukkue(data, "Jäärogaining", "8h", "Vara 1");
poistaJoukkue(data, "Jäärogaining", "8h", "Vara 2");

let taulukko = new Array();

//kerätään taulukkoon joukkueiden nimet ja rastit
for(let i=0; i<data.length; i++){
	for(let j=0; j<data[i].sarjat.length; j++){
		for(let k=0; k<data[i].sarjat[j].joukkueet.length; k++){
			taulukko[taulukko.length] = {nimi: data[i].sarjat[j].joukkueet[k].nimi, rastit: data[i].sarjat[j].joukkueet[k].rastit, pisteet: ""};
		}
	}
}

//kutsutaan pisteidenlaskufunktiota joukkueille joilla on rasteja
for(let n=0; n<taulukko.length; n++) {
	if (taulukko[n].rastit != undefined){
		let yhteensa = laskePisteet(taulukko[n].rastit);
		taulukko[n].pisteet = yhteensa;
	}
	else{
		taulukko[n].pisteet = 0;
	}
}

taulukko.sort(compare);

/*
funktio joka muuttaa joukkueiden käymät rastit pisteiksi ja palauttaa yhteispisteet
*/
function laskePisteet(taulukko){
	let pisteet = 0;
	let rastit = new Array();
	
	for (let i = 0; i<taulukko.length; i++){
		rastit.push(taulukko[i].rasti);
	}
	
	//poistetaan rasteista duplikaatit
	var uniikit = rastit.filter( onlyUnique );
	let lahdetty = false;
	for (let i = 0; i<uniikit.length; i++){
		let rasti = uniikit[i];
		let find = data[2].rastit.find( osumat => osumat.id == rasti );
		if (find != undefined){
			
			// katsotaan rastin nimen ensimmäistä merkkiä, L=lähtö niin aletaan laskea pisteitä, 
			// M=maali lopetetaan pisteiden lasku, niiden välissä olevat numeroarvot lisätään summaan
			let piste = find.koodi.charAt(0);
			if (piste == "L"){
				lahdetty = true;
				continue;
			}
			if (lahdetty == false){
				continue;
			}
			if (piste == "M"){
				break;
			}
			let pisteint = parseInt(piste, 10);
			pisteet = pisteet + pisteint;
		}
	}
	return pisteet;
	
}

/*
pisteiden ja nimien järjestämiseen käytettävä funktio
*/
function compare( a, b ) {
	if ( a.pisteet > b.pisteet ){
		return -1;
	}
	if ( a.pisteet < b.pisteet ){
		return 1;
	}
	if ( a.sarja == b.sarja ){
		if ( a.nimi < b.nimi ){
			return -1;
		}
		if ( a.nimi > b.nimi ){
			return 1;
		}
	}
	return 0;
}

/*
duplikaattien etsimiseen käytettävä funktio
*/
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

haeRastit();

/*
funktio joka käy rastirakenteen läpi ja lisää jonoon rastit jotka alkavat numerolla
*/
function haeRastit() {
	let numeroRastit = new Array();
	for(let i=0; i<data.length; i++){
			for(let j=0; j<data[i].rastit.length; j++){
				if (isNaN(data[i].rastit[j].koodi.charAt(0))){}
				else { 
					numeroRastit.push(data[i].rastit[j].koodi);
				}
			}
	}
	numeroRastit.sort();
	let jono = numeroRastit.join(";");
	console.log(jono);
}

/*
funktio joka käy tietorakenteen läpi ja poistaa annettuja tietoja vastaavan joukkueen
*/
function poistaJoukkue(data, kilpailu, sarja, joukkue) {
	for(let i=0; i<data.length; i++){
		for(let j=0; j<data[i].sarjat.length; j++){
		if (data[i].nimi == kilpailu && data[i].sarjat[j].nimi == sarja) {
			for (let k = 0; k<data[i].sarjat[j].joukkueet.length; k++){
			if (data[i].sarjat[j].joukkueet[k].nimi == joukkue){
				data[i].sarjat[j].joukkueet.splice(k, 1);
				break;
			}
			
			}
		}
		}
	}
}

for (let i = 0; i<taulukko.length;i++){
	console.log(taulukko[i].nimi +" ("+ taulukko[i].pisteet + " p)");
}