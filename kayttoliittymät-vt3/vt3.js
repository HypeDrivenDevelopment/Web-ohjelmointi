"use strict";

console.log(data);

window.onload = function(){
	//kutsutaan lomakkeen ja joukkuelistauksen luovia funktioita
	hae_tiedot();
	hae_tiimit();

	//luodaan tapahtumankäsittelijä, joka poistaa mahdolliset customvalidityt kaikista checkboxeista, jos yhtäkin painetaan
	let inputs = document.querySelectorAll("input[type='checkbox']");
	for (let i = 0; i<inputs.length; i++){
		inputs[i].addEventListener("input", function (e) {
			for (let c of inputs) {
				c.setCustomValidity("");
			}	 
		});
	}
	
	//lisätään nimellekkin tapahtumankäsittelijä, joka poistaa mahdolliset customvalidityt kun jotain syötteitä tulee
	let nimi = document.querySelector('input[type="text"]');
	nimi.addEventListener("input", function (e) {
		nimi.setCustomValidity("");
	});
	

	//kaikki submit tapahtuman tarkistukset
	document.querySelector('form').addEventListener("submit", function (e) {
		let nimi = document.querySelector('input[type="text"]');
		
		//testataan onko trimmattu merkkijono liian lyhyt (ilman trimmiä testattu jo html puolella)
		let trimmed = nimi.value.trim()
		if (trimmed.length < 2){
			nimi.setCustomValidity("Nimi on liian lyhyt");
		}
		
		//käydään tietorakenne läpi ja katsotaan onko nimi jo käytössä
		for (let i = 0; i < data[2].sarjat.length; i++){
			for (let j = 0; j < data[2].sarjat[i].joukkueet.length; j++){
				let vanha = data[2].sarjat[i].joukkueet[j].nimi;
				//trimmataan myös ennestään rakenteesta löytyvän tiimin nimi kun siellä näkyy olevan välilyöntejä perässä
				vanha = vanha.trim();
				if (vanha == trimmed){
					nimi.setCustomValidity("Nimi on jo käytossä");
				}
			}
		}
		  
		let inputs = document.querySelectorAll("input[type='checkbox']");
		let leimaustavat = new Array();
        for(let i = 0; i < inputs.length; i++) {
            if (inputs[i].checked){leimaustavat.push(inputs[i].value);}
        }
		
		//tarkastetaan onko annettu vähintään 1 leimaustapa
        for (let c of inputs) {
            if ( leimaustavat.length == 0 ) {
				c.setCustomValidity("Valitse vähintään yksi leimaustapa");
            } else {
                c.setCustomValidity("");
            }   
        }	
        e.target.reportValidity();
        e.preventDefault();

		//jos ei virheitä niin jatketaan joukkueen lisäämiseen
		if (e.target.checkValidity() == true){
			lisaa_joukkue();
		}	 
    });
}

/*
funktio joka lisää joukkueen tietorakenteeseen annettujen tietojen ja generoidun idn perusteella
*/
function lisaa_joukkue(){
	
	let sarja = document.querySelector('input[name="sarja"]:checked').value;
	let inputs = document.querySelectorAll("input[type='checkbox']");
	let leimaustavat = new Array();
        for(let i = 0; i < inputs.length; i++) {
            if (inputs[i].checked){leimaustavat.push(inputs[i].value);}
        }
		
	let nimi = document.getElementById("nimi");
	
	nimi = nimi.value;
	
	//generoidaan tietynmittainen id ja tarkistetaan että se on uniikki
	let uusiId;
	let uniikki = true;
	do {
		uniikki = true;
		uusiId = getRandomNumber(1000000000000000, 9999999999999999);
		for (let i = 0; i < data[2].sarjat.length; i++){
			for (let j = 0; j < data[2].sarjat[i].joukkueet.length; j++){
				let id = data[2].sarjat[i].joukkueet[j].id;
				if (id == uusiId){
					uniikki = false;
				}
			
			}
		}
	}
	while (!uniikki)
		
	let lisays = { 
		"nimi": nimi,
		"jasenet": [
			"Foo Bar",
			"Bar Foo"
		],
		"id": uusiId,
		"leimaustapa": leimaustavat
	}
	//lisätään muuttujat tietorakenteeseen
	for (let i = 0; i<data[2].sarjat.length; i++){
		if (data[2].sarjat[i].nimi == sarja){
			data[2].sarjat[i].joukkueet.push(lisays);
		}
	}
	
	//tyhjennetään lomake
	document.getElementById("lomake").reset();
	
	//haetaan uusiksi tiimilistaus
	hae_tiimit();
	
	//lisätään teksti että joukkue on lisätty
	let div = document.getElementById("ilmoitus");
	
	while (div.firstChild) {
		div.removeChild(div.firstChild);
	}
	
	let p = document.createElement("p");
	p.textContent = "Joukkue " + nimi + " on lisätty.";
	div.appendChild(p);
	
}

/*
funktio satunnaisen kokonaisluvun generoimiselle tietyltä väliltä
*/
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

/*
kaikkien joukkueiden ja niiden jäsenten hakeminen ja HTML kaksoislistan generoiminen
*/
function hae_tiimit() {
	let div = document.getElementById("listaus");
	
	while (div.firstChild) {
		div.removeChild(div.firstChild);
	}
	
	let taulukko = new Array();

	for(let i=0; i<data.length; i++){
		for(let j=0; j<data[i].sarjat.length; j++){
			for(let k=0; k<data[i].sarjat[j].joukkueet.length; k++){
				taulukko[taulukko.length] = {jasenet: data[i].sarjat[j].joukkueet[k].jasenet, joukkue: data[i].sarjat[j].joukkueet[k].nimi};
			}
		}
	}
	
	taulukko.sort(compare);
	
	for (let t=0; t<taulukko.length; t++){
		let ul = document.createElement("ul");
		let li = document.createElement("li");
		li.textContent = taulukko[t].joukkue;
		taulukko[t].jasenet.sort(compare2);
		let ul2 = document.createElement("ul");
		for (let i = 0; i<taulukko[t].jasenet.length; i++){
			let li2 = document.createElement("li");
			li2.textContent = taulukko[t].jasenet[i];
			ul2.appendChild(li2);
		}
		li.appendChild(ul2);
		ul.appendChild(li);
		div.appendChild(ul);
	}
}

/*
vertailufunktio joukkueiden aakkosjärjestykseen
*/
function compare( a, b ) {
	if ( a.joukkue < b.joukkue ){
		return -1;
	}
	if ( a.joukkue > b.joukkue ){
		return 1;
	}
	return 0;
}

/*
vertailufunktio jäsenten aakkosjärjestykseen
*/
function compare2( a, b ) {
	if ( a < b ){
		return -1;
	}
	if ( a > b ){
		return 1;
	}
	return 0;
}

/*
funktio joka hakee lomakkeen generoimisessa vaadittavat tiedot ja generoi niiden pohjalta html kentät radiobuttoneille ja checkboxeille
*/
function hae_tiedot(){
	
	let tallennustavat = new Array();
	let sarjat = new Array();
	
	for (let i = 0; i<data[2].leimaustapa.length; i++){
		tallennustavat.push(data[2].leimaustapa[i]);
	}
	for (let j = 0; j<data[2].sarjat.length; j++){
		sarjat.push(data[2].sarjat[j].nimi);
	}
	
	sarjat.sort();
	
	let leimaustavat = document.getElementById("leimaustavat");
	let s = document.getElementById("sarjat");
	
	for (let k = 0; k<tallennustavat.length; k++){
		let label = document.createElement("label");
		label.textContent = tallennustavat[k];
		label.setAttribute("class", "input");
		
		let input = document.createElement("input");
		input.setAttribute("type", "checkbox");
		input.setAttribute("name", "leimaus");
		input.setAttribute("id", "leimaus"+k);
		input.setAttribute("value", tallennustavat[k]);
		
		label.appendChild(input);
		leimaustavat.appendChild(label);
	}
	
	for (let l = 0; l<sarjat.length; l++){
		let label = document.createElement("label");
		label.textContent = sarjat[l];
		label.setAttribute("class", "input");
		
		let input = document.createElement("input");
		input.setAttribute("type", "radio");
		input.setAttribute("name", "sarja");
		input.setAttribute("id", "sarja"+l);
		input.setAttribute("value", sarjat[l]);
		if (l==0){input.setAttribute("checked", "checked");}
		
		label.appendChild(input);
		s.appendChild(label);
	}
}
