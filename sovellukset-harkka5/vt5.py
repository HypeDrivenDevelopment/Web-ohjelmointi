#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, session, redirect, url_for, escape, request, Response, render_template, make_response
import sqlite3
import logging
import os

logging.basicConfig(filename=os.path.abspath('../hidden/flask.log'),level=logging.DEBUG)
app = Flask(__name__) 
app.debug = True

@app.route('/hae_vuokraukset', methods=['GET']) 
def hae_vuokraukset():
    
    # tietokantayhteys auki
    con = sqlite3.connect( os.path.abspath('../vt4/db/video'))
    con.row_factory = sqlite3.Row
    
    cur = con.cursor()
    
    #yritetään suorittaa kysely tietokannan vuokraustiedoista, virheestä jätetään logi
    try:
        cur.execute('select jasen.nimi AS JasenNimi, elokuva.nimi AS ElokuvaNimi, vuokraus.vuokrauspvm AS Vuokrauspvm, vuokraus.palautuspvm AS Palautuspvm from vuokraus, jasen, elokuva where jasen.jasenid = vuokraus.jasenid and elokuva.elokuvaid = vuokraus.elokuvaid order by elokuva.nimi, vuokraus.vuokrauspvm')
    except:
        logging.debug( sys.exc_info()[0] )
    
    #tehdään vuokraustiedoista merkkijono, jossa listatägit
    osoitteet = ""
    for o in cur:
        osoitteet = osoitteet + "<li>" + o["JasenNimi"] + " | " + o["ElokuvaNimi"] + " | " + o["Vuokrauspvm"] + " | " + o["Palautuspvm"] + "</li>" #"\n"# + o["Maksettu"]# + "\n"

    osoitteet = '<ul id="taulu">' + osoitteet + '</ul>'  
    
    con.close()
    
    resp = make_response(osoitteet, 200)
    resp.charset = "UTF-8"
    resp.mimetype = "text/plain"
    return resp
    
@app.route('/lisaa_tietokantaan', methods=['GET','POST']) 
def lisaa_tietokantaan():

    # tietokantayhteys auki
    con = sqlite3.connect( os.path.abspath('../vt4/db/video')) 
    con.row_factory = sqlite3.Row
    
    resp = make_response( "" )
    
    # sijoitetaan lomakkeen arvot muuttujiin
    jasen = request.form.get('jasen', "")
    elokuva = request.form.get('elokuva', "")
    vuokrauspvm = request.form.get('vuokrauspvm', "")
    palautuspvm = request.form.get('palautuspvm', "")
    maksettu = request.form.get('maksettu', "")
    
    # yritetään lisätä muuttujat tietokantaan, virheestä palautetaan infot
    try:
        con.execute(
            "INSERT INTO Vuokraus VALUES (?, ?, ?, ?, ?)",
            (jasen, elokuva, vuokrauspvm, palautuspvm, maksettu))
            
    except:
        con.rollback()
        Response = make_response("virhe: %s" % sys.exc_info()[0], content_type="text/plain; charset=UTF-8")
        return Response
            
    con.commit()
    con.close()
    
    resp = make_response("toimii")
    resp.charset = "UTF-8"
    resp.mimetype = "text/plain"
    return resp
    

if __name__ == '__main__':
    app.debug = True
    app.run(debug=True)