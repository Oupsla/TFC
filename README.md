![Test Framework Chatbot](http://img11.hostingpics.net/pics/326731LogoTfc.png)  

[![Build Status](https://travis-ci.org/Oupsla/TFC.svg?branch=master)](https://travis-ci.org/Oupsla/TFC) [![Coverage Status](https://coveralls.io/repos/github/Oupsla/TFC/badge.svg)](https://coveralls.io/github/Oupsla/TFC)

## Auteurs
Benjamin Coenen - Nicolas Delperdange

## Table des matières
**[Introduction](#introduction)**  
**[Contexte et But](#contexte-et-but)**  
**[Travail technique](#travail-technique)**  
**[Evaluation](#evaluation)**  
**[Limitation](#limitation)**  
**[Conclusion](#conclusion)**  
**[Référence](#référence)**  

## Introduction
Faire des chatbots c'est un peu être le nouveau **hipster** du développeur. Plus besoin d'interface graphique *(au revoir les UX et UI designers)*, juste quelques lignes de codes, une ligne de commande pour lancer le serveur, quelques clics sur votre messagerie préférée et voila votre petit robot virtuel est prêt.  
Tout cela est génial, vous avez enfin le compagnon idéal qui répond ce que vous voulez ! *(Oh mon petit chatbot qui est le meilleur dev ?)*   
Les défis aujourd'hui avec ce type d'interface vont surtout être de réaliser une discussion fun, ludique, et surtout qu'ils répondent correctement aux questions et pas au bout de 5 minutes par exemple. Pour cela il faut s'outiller afin de tester et s'assurer de la pertinence d'un bot ainsi que son temps de réponse.

## Contexte et But
Les tests unitaires pour chatbot ne sont pas différents des tests unitaires des applications serveurs. Ce sont les mêmes outils dépendamment du langage/framework utilisé (par exemple *Mocha* pour *NodeJs*).  
Mais ceux-ci ne permettent pas de se mettre à la place de l'utilisateur et de tester réellement le chatbot (vitesse de traitement, ...). Et pourquoi ne pas tirer parti du coté universel d'un chatbot (accessible depuis n'importe quelle plateforme et non soucieux de la technologie serveur utilisée) ?  
C'est à travers ce projet (TFC) que nous avons voulu agir et développer un framework de test End-To-End (de bout en bout) qui se propose de monitorer et tester n'importe quel chatbot.


## Travail technique
*Remarque* : Ce travail est pour le moment au stade de *Proof-of-concept*, c'est pour cela que nous avons décidé de nous limiter aux chatbots disponibles seulement sur Messenger (voir la partie Limitation pour plus d'informations).

Notre but principal est donc de proposer un système de test pour chatbot mais aussi de pouvoir avoir un aperçu de l'évolution du temps de réponse au fur et à mesure des versions.
Celui-ci doit accepter un ensemble de tests à effectuer (sous la même forme que de tests unitaires avec la question à poser et les réponses attendues) ainsi qu'une configuration minimale permettant de cibler un chatbot précis.

### Vue d'ensemble

Voici une vue d'ensemble de notre système :
```javascript
    jsonFile = getJson() // Récupération du fichier de configuration contenant les tests
    api = getApi() // Récupération de l'API par rapport à la plateforme choisie
    for test in jsonFile {
        startTimer() // Début du timer pour les métriques
        api.send(test.question) // Envoi de la question
        reponse = api.listen() // Attente de la réponse
        stopTimer()
        if (testReponse(reponse, test.reponsesPossibles)) // Test de la réponse avec l'ensemble des réponses possibles
            log("Test Ok !"); // Affichage et sauvegarde du test réussi
        else
            log("Test KO !"); // Affichage et sauvegarde du test raté
       saveTimer() // Sauvegarde des performances
    }
    sendMetrics() // Envois des métriques en db pour visualisation future
```

### Architecture
Nous avons développé **TFC** sous *NodeJs*. Nous avons découpé notre projet de la façon suivante :

- `testRunner.js`, qui est le coeur de notre framework et s'occupe d'initialiser le système et de vérifier les réponses des chatbots.
- Les façades des plateformes (`messengerFacade.js` par exemple) : qui s'occupe de tous les appels vers les API afin d'envoyer des messages aux chatbots et de récupérer leurs réponses.
- `monitor.js`, qui s'occupe de la visualisation des données (performance des requêtes).

Nous avons opté pour ce découpage afin de pouvoir facilement rajouter de nouvelles façades vers d'autres plateformes (Slack, Cisco Spark, SMS, ...). Il suffit simplement de réécrire deux méthodes (une de connexion et une d'envoi/réception de message) afin de rajouter la compatibilité vers une nouvelle plateforme.

Nous avons également utilisé de nombreux packages **npm** afin de ne pas réinventer la roue :
- Bluebird : librairie permettant d'utiliser des 'promises' (système asynchrone) **[[1]](#référence)**
- validator : librairie de validation de paramètres **[[2]](#référence)**
- time : librairie de mesure de performance **[[3]](#référence)**
- facebook-chat-api : librairie permettant d'utiliser facilement l'API de messenger **[[4]](#référence)**
- command-line-args : librairie pour récupérer les arguments en ligne de commandes **[[5]](#référence)**
- command-line-usage : librairie pour afficher un beau helper **[[6]](#référence)**

### Utilisation
Notre système s'utilise actuellement seulement en ligne de commande, et à cet effet nous avons développé un manuel simple permettant de savoir comment l'utiliser :
![Help](http://img11.hostingpics.net/pics/682992Capturedu20170211132912.png)  

Il suffit donc simplement d'avoir node installé sous la machine exécutant notre système et de lui fournir un fichier json comprenant la configuration et les différents tests à exécuter (un exemple est fourni dans le dépot Github dans le dossier test).  

Concernant la visualisation, celle-ci s'effectue en passant le paramètre `-m` en lançant le système et affiche un graphique dans la console. Celui-ci permet de visualiser les performances de toutes les questions ou de chaque test en particulier.  
![Monitor](http://img11.hostingpics.net/pics/586372Capturedu20170211132547.png)  

## Evaluation
### Efficacité
### Complexité
### Performance
### Facilité d'utilisation

## Limitation
Pour le moment notre framework de test se limite aux chatbots Messenger mais il est facilement envisageable de l'étendre à d'autres plateformes. Nous avons choisi de nous limiter à Messenger car cette plateforme regroupe pour le moment le nombre le plus important de chatbots.  

Nous avons également rencontré une autre limitation concernant les limitations de connection pour certains chatbots. Ceux-ci nécessite parfois une connection à un service externe (l'API de XEE dans notre cas, qui ouvre une pop-up) et donc il n'est pas possible pour notre framework de test de passer automatiquement cette étape. L'alternative est de manuellement connecter notre framework de test afin qu'il ne doive plus se connecter.


## Conclusion

## Référence
- [1] Bluebird : https://github.com/petkaantonov/bluebird
- [2] validator : https://github.com/chriso/validator.js
- [3] time : https://github.com/TooTallNate/node-time
- [4] facebook-chat-api : https://github.com/Schmavery/facebook-chat-api
- [5] command-line-args : https://github.com/75lb/command-line-args
- [6] command-line-usage : https://github.com/75lb/command-line-usage
- [10] Istanbul : https://github.com/gotwarlost/istanbul
- [11] Mocha : https://mochajs.org/
- [12] Travis CI : https://travis-ci.org
