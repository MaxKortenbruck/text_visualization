# text_visualization

## Hier entsteht DAS BESTE tool aller Zeiten.

### Branching

Bitte alle Teilprojekte in seperaten branch aufteilen

Github free erlaubt leider keine Merge requests, also falls ihr auf den master merged, bitte keine force-pushes durchführen!

Und natürlich nur mergen, wenn ihr euch absolut sicher seid.

### Git Hub mit vs code

Für vs code gibt es eine Version Control extension, die passenderweise auch github pull requests heisst, dann muss man die Versionskontrolle nicht über das terminal machen. 
Ist das addon installiert, könnt ihr in der Commandpalette (Ctrl+Shift+P)  *Git: Clone*  eingeben und dann die URL  *https://github.com/MaxKortenbruck/text_visualization*  einfügen und Enter hauen. 
Da es sich um ein privates repo handelt, müsst ihr euch noch mit euren github daten einloggen, da wird man von vscode aber durchgeführt. 



Nutzung des Webservers:

Es muss Docker auf dem System installiert sein. Bei Linux muss zusätzlich noch Docker Compose installiert sein. 

Im Wurzelverzeichnis

>docker-compose build

dann

>docker-compose up -d

zum beenden:

>docker-compose down


Hinweise zum Programmieren:

Das css File wir in firefox durch strg+F5 mit neu geladen, sonst wird es im Cache gespeichert und nicht immer neu geladen.
