#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, session, redirect, url_for, escape, request, Response, render_template
import hashlib
import sys
from functools import wraps
import sqlite3
import logging
import os
import datetime

app = Flask(__name__)

def connect_db():
    # tietokantaan yhdistys
    con = sqlite3.connect(os.path.abspath('db/video'))
    con.row_factory = sqlite3.Row
    return con

# etusivu jossa näkyvät vuokraustiedot
@app.route('/', methods=['POST','GET'])
def kanta():
    # tietokantayhteyden avaaminen
    db = connect_db() 

    # kysely avoimeen tietokantaan
    cur = db.execute('select jasen.nimi AS JasenNimi, elokuva.nimi AS ElokuvaNimi, vuokraus.vuokrauspvm AS Vuokrauspvm, vuokraus.palautuspvm AS Palautuspvm, vuokraus.maksettu AS Maksettu from vuokraus, jasen, elokuva where jasen.jasenid = vuokraus.jasenid and elokuva.elokuvaid = vuokraus.elokuvaid')
    vuokrat = []
    
    # lisätään tulokset pareina vuokrataulukkoon
    for row in cur.fetchall():
        vuokrat.append( dict(jasennimi=row['JasenNimi'], elokuvanimi=row['ElokuvaNimi'], vuokrauspvm=row['Vuokrauspvm'], palautuspvm=row['Palautuspvm'], maksettu=row['Maksettu']) ) 
        
    # tietokantayhteyden sulkeminen
    db.close()

    # ladataan sivu ja viedään sille vuokrataulukko
    return render_template('video.html', vuokrat=vuokrat)
    
# sivu jolta uusi varaus lisätään
@app.route('/lisaa', methods=['POST','GET'])
def lisays():
    # tietokantayhteyden avaaminen
    db = connect_db()
    
    # jäsenten kysely avoimeen tietokantaan
    cur = db.execute('select jasenid AS JID, nimi AS JNimi from jasen')
    jasenet = []
    
    # lisätään jäsenet pareina vuokrataulukkoon
    for row in cur.fetchall():
        jasenet.append( dict(jasenid=row['JID'], jasennimi=row['JNimi']) ) 
    
    # elokuvien kysely avoimeen tietokantaan
    cur = db.execute('select elokuvaid AS EID, nimi AS ENimi from elokuva')
    elokuvat = []
    
    # lisätään elokuvat pareina vuokrataulukkoon
    for row in cur.fetchall():
        elokuvat.append( dict(elokuvaid=row['EID'], elokuvanimi=row['ENimi']) )
        
    ohje = ""
    
    # suoritetaan jos lomake lähetetään
    if request.method == 'POST':
        
        # haetaan lomakkeen arvot muuttujiin
        jasen = request.form['jasen']
        elokuva = request.form['elokuva']
        vpvm = request.form['vpvm']
        ppvm = request.form['ppvm']
        maksettu = request.form['maksettu']
        
        # lisätään muuttujat tietokantaan
        try:
            cur = db.execute(
                "INSERT INTO Vuokraus VALUES (?, ?, ?, ?, ?)",
                (jasen, elokuva, vpvm, ppvm, maksettu))
        
        # jos ei onnistu niin rollback, suljetaan tietokanta ja lisätään virheteksti ohje-muuttujaan ja palataan lomakkeelle
        except:
            db.rollback()
            db.close()
            ohje = "Virheellinen syöte, täytä lomake uudelleen".decode("UTF-8")
            return render_template('lisaa.html', elokuvat=elokuvat, jasenet=jasenet, ohje=ohje).encode("UTF-8")
        
        # jos onnistuu niin hyväksytään lisäykset, suljetaan tietokanta ja siirytään tietokantanäkymään
        db.commit()
        db.close()
        return redirect(url_for('kanta'))
    
    db.close()
    return render_template('lisaa.html', elokuvat=elokuvat, jasenet=jasenet, ohje=ohje)
    
if __name__ == '__main__':
    app.debug = True
    app.run(debug=True)