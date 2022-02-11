"use strict";

var mymap;
var varit = new Array();

window.onload = function() {
	
	//luodaan alue kartalle
    let div = $("#map");
	div.css("width", Math.round(window.innerWidth) + "px");
	div.css("height", Math.round(window.innerHeight/2) + "px");
	
	
	//luodaan kartta 
	mymap = new L.map('map', {
     crs: L.TileLayer.MML.get3067Proj()
    }).setView([62.2333, 25.7333], 11);
	L.tileLayer.mml_wmts({ layer: "maastokartta" }).addTo(mymap);
	
	let boundaries = new Array();
	
	//haetaan rastien koordinaatit ja lisätään ne kartalle
	for (let i = 0; i<data[2].rastit.length; i++){
		let lat = data[2].rastit[i].lat;
		let lon = data[2].rastit[i].lon;
		boundaries[boundaries.length] = [lat, lon];
		let circle = L.circle(
			[lat, lon], {
				color: 'red',
				radius: 150
			}
			).addTo(mymap);
	}
	
	//vaihdetaan kartan oletusnäkymä näyttämään kaikki rasitt
	mymap.fitBounds(boundaries);
	hae_tiimit();
}

/*
funktio joka hakee joukkueet ja luo niistä html listan, sekä luo listaelementeille tapahtumankäsittelijät
*/
function hae_tiimit(){
	let joukkueet = new Array();
	for (let i = 0; i<data[2].sarjat.length; i++){
		for (let j = 0; j<data[2].sarjat[i].joukkueet.length; j++){
			joukkueet[joukkueet.length] = {id: data[2].sarjat[i].joukkueet[j].id, nimi: data[2].sarjat[i].joukkueet[j].nimi};
		}
	}
	
	//listaelementtien luominen ja niiden värittäminen
	let div = document.getElementById("joukkueet");
	let ul = document.createElement("ul");
	for (let t=0; t<joukkueet.length; t++){
		let li = document.createElement("li");
		li.textContent = joukkueet[t].nimi;
		li.id = joukkueet[t].id;
		
		let vari = rainbow(joukkueet.length, t+1);
		li.style.backgroundColor = vari;
		
		varit[varit.length] = {id: li.id, vari: vari};
		
		li.setAttribute("draggable", "true");
		li.addEventListener("dragstart", function(e) {

		e.dataTransfer.setData("text/plain", li.getAttribute("id"));
		});
		
		ul.appendChild(li);
	}
		
	div.appendChild(ul);
	
	//efektin luominen raahausalueelle
	let drop = document.getElementById("kartalla");
	
	drop.addEventListener("dragover", function(e) {

		e.preventDefault();
		e.dataTransfer.dropEffect = "move"

	});
		
	//tapahtumankäsittelijän lisääminen listaelementin pudotukselle
	drop.addEventListener("drop", function(e) {
		
		e.preventDefault();

		var data = e.dataTransfer.getData("text");
		lisaa_polku(data);
		let ul = document.getElementById("kartalla");
		
		//jos raahausalueella on muita elementtejä niin lisätään ennen ensimmäistä, muuten lisätään appendChildilla
		if (ul.firstChild){
			ul.insertBefore(document.getElementById(data), ul.firstChild);
		}
		else {
		ul.appendChild(document.getElementById(data));
		}
		let raahattu = document.getElementById(data);
		
		//poistetaan raahatulta listaelementiltä draggable ominaisuus
		raahattu.setAttribute("draggable", "false");

	});
}

/*
funktio joka lisää karttaan joukkueen kulkeman polun
*/
function lisaa_polku(tiimi){
	let rastit = new Array();
	for (let i = 0; i<data[2].sarjat.length; i++){
		for (let j = 0; j<data[2].sarjat[i].joukkueet.length; j++){
			if (tiimi == data[2].sarjat[i].joukkueet[j].id){
			for (let k = 0; k<data[2].sarjat[i].joukkueet[j].rastit.length; k++){
				if (data[2].sarjat[i].joukkueet[j].rastit[k].rasti != 0){
					rastit.push(data[2].sarjat[i].joukkueet[j].rastit[k].rasti)
				}
			}
			}
		}
	}
	
	//kootaan rastitiedoista taulukko koordinaateista oikeassa formaatissa
	let koordinaatit = new Array();
	
	for (let i = 0; i<rastit.length; i++){
		for (let j = 0; j<data[2].rastit.length; j++){
			if (data[2].rastit[j].id == rastit[i]){
				koordinaatit[koordinaatit.length] = [data[2].rastit[j].lat, data[2].rastit[j].lon];
			}
		}
	}
	
	let viivanVari = "#ff00c7";
	
	//haetaan aiemmin idn perusteella säilötty väri jota käytetään viivan värittämisessä
	for (let i = 0; i<varit.length; i++){
		if (varit[i].id == tiimi){
			viivanVari = varit[i].vari;
		}
	}
	//piirretään polyline viiva
	let polyline = L.polyline(koordinaatit, {color: viivanVari}).addTo(mymap);			
}

function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    let c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}