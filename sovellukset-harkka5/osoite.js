
window.onload = function() {

	$("#laheta").on("click", lisaa_tietokantaan);

	hae_vuokraukset();

}

/* ajax kutsu jolla haetaan olemassaolevat vuokraukset */
function hae_vuokraukset() {
$.ajax({
        async: true,
        url: "/~samipelt/cgi-bin/vt5/flask.cgi/hae_vuokraukset",
        type: "GET",
        dataType: "text",
        success: lisaa_vuokraukset,
        error: ajax_virhe
});
}

/* ajax kutsu jolla lisätään vuokraus tietokantaan */
function lisaa_tietokantaan(e) {
e.preventDefault();
$.ajax({
        async: true,
        url: "/~samipelt/cgi-bin/vt5/flask.cgi/lisaa_tietokantaan",
        type: "POST",
        dataType: "text",
		
		data: { "jasen":$("#jasen").val(),
        "elokuva":$("#elokuva").val(),
        "vuokrauspvm":$("#vuokrauspvm").val(),
        "palautuspvm":$("#palautuspvm").val(),
        "maksettu":$("#maksettu").val(), 
        },
        
        success: lisaaminen_onnistu,
        error: ajax_virhe
});
}

/* funktio joka lisää saadun datan html sivulle */
function lisaa_vuokraukset(data, textStatus, request) {	
	$('#taulu').replaceWith( data );
	console.log( data );
}

/* funktio joka varmentaa lisäämisen onnistumisen */
function lisaaminen_onnistu(data, textStatus, request) {
	console.log( data );
	$( "#virhe" ).attr("class", "hidden");
	hae_vuokraukset();
}

/* funktio joka virheen sattuessa tulostaa saatavilla olevat syyt */
function ajax_virhe(xhr, status, error) {
        console.log( "Error: " + error );
        console.log( "Status: " + status );
        console.log( xhr );
		$('#virhe').removeClass("hidden");
}