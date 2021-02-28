#  IntegrationArchitecturesWS2020-2021_Node.js

Dieses Projekt bildet das in Node.js (JavaScript) implementierte Backend einer
Anwendung, die als semesterbegleitendes Projekt in Integration Architectures erstellt
wurde. Die Anwendung soll flexible Boni anhand evaluierter Leistungsdaten und Verkaufsdaten
erstellen.  
Das System ist mit OrangeHRM und OpenCRX integriert. Selbst verwendet es eine MongoDB
Datenbank.  

Die REST-API die diese Anwendung bereitstellt, kann einfach mit dem passenden [Angular Frontend](https://github.com/LUC4R4T0R/IntegrationArchitecturesWS2020-2021_Angular)
verwendet werden.

## Installation

Diese Anwendung wird in Node.js betrieben. Neben der Node Laufzeitumgebung wird ein
MongoDB Server benötigt. Alle Verbindungsdaten können bzw. müssen in der config.json
festgelegt werden.