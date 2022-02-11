#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgitb
cgitb.enable()
import cgi
import time
import os
from jinja2 import Template, Environment, FileSystemLoader
import urllib

try:
    tmpl_path = os.path.join(os.path.dirname(os.environ['SCRIPT_FILENAME']), 'templates')
except:
    tmpl_path = "templates"

# ympäristön alustus ja autoescapen käyttöönotto
try:
    env = Environment(autoescape=True, loader=FileSystemLoader(tmpl_path), extensions=['jinja2.ext.autoescape'])
except:
    env = Environment(autoescape=True, loader=FileSystemLoader(tmpl_path))
    
# loopcontrollien käyttöönotto
try:
    env = Environment(autoescape=True, loader=FileSystemLoader(tmpl_path), extensions=['jinja2.ext.loopcontrols'])
except:
    env = Environment(autoescape=True, loader=FileSystemLoader(tmpl_path))

# ladataan oma template
template = env.get_template('jinja.html')

print """Content-type: text/html; charset=UTF-8

"""

form = cgi.FieldStorage() 

#haetaan lomakkeelta int muodossa laudan leveys
try:
    leveys = int(form.getfirst("x", "0").decode("UTF-8"))
except:
    leveys = 0

# merkkijonomuuttuja mahdolliselle virhetekstille
virhe = ""

# virheellisen laudan leveyden käsittely
if leveys> 16 or leveys< 8:
    leveys = 0
    virhe = "Syöttämäsi arvo ei kelpaa".decode("UTF-8")
    
# luodaan sopivan kokoinen lista jota käytetään for silmukoissa
laskuri = leveys
taulu = []
while laskuri> 0:
    taulu.append(laskuri)
    laskuri = laskuri - 1

# haetaan lomakkeelta käyttäjän syöttämä merkkijono
teksti = form.getfirst("teksti", "").decode("UTF-8")

# haetaan vielä ilman dekoodausta merkkijono joka käsitellään urlib.quotella
teksti2 = form.getfirst("teksti", "")

# tallennetaan ohjelman tila merkkijonoon jota käytetään urleissa
tallennus = "?teksti=" + urllib.quote_plus(teksti2) + "&x=" + str(leveys)

# haetaan poistettavien nappuloiden id:t listana ja muutetaan merkkijonoksi
try:
    value = form.getlist("poisto")
    jono = "&poisto=".join(value)
except:
    value = []
    jono = ""

# ja lisätään poistettavat nappulat tallennuksen perään jos niitä oli    
if jono != "":
    tallennus += "&poisto="
    tallennus += jono

# haetaan poistettavien nappuloiden id:t listana ja muutetaan arvot int muotoon 
try:
    poistot = form.getlist("poisto")
    poistot = map(int, poistot)
except:
    poistot = [0]

# jos poistettavia arvoja ei ole niin laitetaan kuitenkin nolla listaan että ei tarvitse jinja koodissa huomioida tyhjän listan tapausta 
if poistot == []:
    poistot = [0]

# renderöidään Jinja template
print template.render(taulu=taulu, teksti=teksti, leveys=leveys, virhe=virhe, tallennus=tallennus, poistot=poistot).encode("UTF-8")