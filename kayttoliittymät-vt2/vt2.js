// data-muuttuja on sama kuin viikkotehtävässä 1.
//

"use strict";

window.onload = function(){
	hae_tiimit();
	luo_lomake();
	
	//tapahtumankäsittelijä submitille
	let submit = document.getElementById("rasti");
	submit.addEventListener("click", lisaa_rasti);
}

/*
funktio joka hakee tiimit ja niiden sarjat tietorakenteesta, järjestää ne, sekä luo niistä taulukkorakenteen
*/
function hae_tiimit() {
	let taulukko = new Array();
	
	for(let i=0; i<data.length; i++){
		for(let j=0; j<data[i].sarjat.length; j++){
			for(let k=0; k<data[i].sarjat[j].joukkueet.length; k++){
				taulukko[taulukko.length] = {sarja: data[i].sarjat[j].nimi, joukkue: data[i].sarjat[j].joukkueet[k].nimi};
			}
		}
	}
	
	taulukko.sort( compare );
	
	let table = document.createElement("table");
	
	for (let t=0; t<taulukko.length; t++){
		let td = document.createElement("td");
		td.textContent = taulukko[t].sarja;
		let td2 = document.createElement("td");
		td2.textContent = taulukko[t].joukkue;
		let tr = document.createElement("tr");
		tr.appendChild(td);
		tr.appendChild(td2);
		table.appendChild(tr);
	}
	let div = document.getElementById("tupa");
	div.appendChild(table);
	
}

/*
vertailufunktio, jossa ensisijaisesti verrataan sarjaa, ja toissijaisesti joukkueen nimeä
*/
function compare( a, b ) {
	if ( a.sarja < b.sarja ){
		return -1;
	}
	if ( a.sarja > b.sarja ){
		return 1;
	}
	if ( a.sarja == b.sarja ){
		if ( a.joukkue < b.joukkue ){
			return -1;
		}
		if ( a.joukkue > b.joukkue ){
			return 1;
		}
	}
	return 0;
}

/*
funktio, joka lisää rastin annetuilla tiedoilla ja generoidulla idllä tietorakenteeseen
*/
function lisaa_rasti(e) {
	e.preventDefault();
	let koodi = document.getElementById("koodi");
	koodi = koodi.value;
	let lat = document.getElementById("lat");
	lat = lat.value;
	let lon = document.getElementById("lon");
	lon = lon.value;
	
	//jos on tyhjiä kenttiä niin lisäystä ei tehdä
	if (koodi == false || lat == false || lon == false){
		return;
	}
	
	//id generoidaan tietyn mittaiseksi, ja jos sattuu käymään niin että id on jo käytössä niin generoidaan seuraava
	let uusiId;
	let uniikki = true;
	do {
		uniikki = true;
		uusiId = getRandomNumber(1000000000000000, 9999999999999999);
		for (let i = 0; i < data[2].rastit.length; i++){
			let id = data[2].rastit[i].id;
			if (id == uusiId){
				uniikki = false;
			}
		}
	}
	while (!uniikki)
		
	let pituus = data[2].rastit.length;
	
	//sijoitetaan muuttujat lisättävään rakenteeseen ja lisätään se
	let lisays = { 
		"lon": lon,
		"koodi": koodi,
		"lat": lat,
		"id": uusiId
	}
	data[2].rastit[pituus] = lisays;
	
	//tulostetaan kaikkien rastien koodit ja koordinaatit
	for(let i=0;i<data.length;i++){
		for(let j=0;j<data[i].rastit.length;j++){
			console.log("koodi: "+data[i].rastit[j].koodi +", lat: "+ data[i].rastit[j].lat +", lon: "+ data[i].rastit[j].lon);
		}
	}
}

/*
funktio jolla arvotaan kokonaisluku tietyltä väliltä
*/
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

/*
funktio joka luo hmtl-lomakkeen kolmella tekstisyötekentällä
*/
function luo_lomake() {
	let fieldset = document.createElement("fieldset");

 	let input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("size", "3");
	input.setAttribute("id", "koodi");
	
	let input2 = document.createElement("input");
	input2.setAttribute("type", "text");
	input2.setAttribute("size", "3");
	input2.setAttribute("id", "lat");
	
	let input3 = document.createElement("input");
	input3.setAttribute("type", "text");
	input3.setAttribute("size", "3");
	input3.setAttribute("id", "lon");

	let l1 = document.createElement("label");
	l1.textContent = "koodi ";
	
	let l2 = document.createElement("label");
	l2.textContent = "lat ";
	
	let l3 = document.createElement("label");
	l3.textContent = "lon ";
	
	let button = document.createElement("button");
	button.textContent = "Lisää rasti ";
	button.id = "rasti";
	button.name = "rasti";

	l1.appendChild(input);
	l2.appendChild(input2);
	l3.appendChild(input3);
	
	let p1 = document.createElement("p");
	let p2 = document.createElement("p");
	let p3 = document.createElement("p");
	let p4 = document.createElement("p");
	
	p1.appendChild(l1);
	p2.appendChild(l2);
	p3.appendChild(l3);
	p4.appendChild(button);
	
	let legend = document.createElement("legend");
	legend.textContent = "Rastin tiedot";
	
	fieldset.appendChild(legend);
	fieldset.appendChild(p1);
	fieldset.appendChild(p2);
	fieldset.appendChild(p3);
	fieldset.appendChild(p4);
	
	let forms = document.getElementsByTagName("form");
	let form = forms[0];
	form.appendChild(fieldset);
}
