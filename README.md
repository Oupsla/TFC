![Test Framework Chatbot](http://img11.hostingpics.net/pics/326731LogoTfc.png)  

[![Build Status](https://travis-ci.org/Oupsla/TFC.svg?branch=master)](https://travis-ci.org/Oupsla/TFC)

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
**TFC** se positionne dans cette optique et propose en tant qu'un framework de test End-To-End (de bout en bout) complet qui permet de monitorer et tester n'importe quel chatbot.


## Travail technique
*Remarque* : Ce travail est pour le moment au stade de *Proof-of-concept*, c'est pour cela que nous avons décidé de nous limiter aux chatbots disponibles seulement sur Messenger **[[10]](#référence)** (voir la partie Limitation pour plus d'informations).

Le but principal est donc de proposer un système de test pour chatbot mais aussi de pouvoir avoir un aperçu de l'évolution du temps de réponse au fur et à mesure des versions.
Celui-ci doit accepter un ensemble de tests à effectuer (sous la même forme que de tests unitaires avec la question à poser et les réponses attendues) ainsi qu'une configuration minimale permettant de cibler un chatbot précis.

### Architecture
**TFC** est développé sous *NodeJs* **[[11]](#référence)** . Il est découpé de la façon suivante :

- `testRunner.js`, qui est le coeur du framework et s'occupe d'initialiser le système et de vérifier les réponses des chatbots.
- Les façades des plateformes (`messengerFacade.js` par exemple) : qui s'occupe de tous les appels vers les API afin d'envoyer des messages aux chatbots et de récupérer leurs réponses.
- `monitor.js`, qui s'occupe de la visualisation des données (performance des requêtes).

Ce découpage a été choisi afin de pouvoir facilement rajouter de nouvelles façades vers d'autres plateformes (Slack, Cisco Spark, SMS, ...). Il suffit simplement de réécrire deux méthodes (une de connexion et une d'envoi/réception de message) afin de rajouter la compatibilité vers une nouvelle plateforme.

Liste des dépendances **npm** du projet :
- Bluebird : librairie permettant d'utiliser des 'promises' (système asynchrone) **[[1]](#référence)**
- validator : librairie de validation de paramètres **[[2]](#référence)**
- time : librairie de mesure de performance **[[3]](#référence)**
- facebook-chat-api : librairie permettant d'utiliser facilement l'API de messenger **[[4]](#référence)**
- command-line-args : librairie pour récupérer les arguments en ligne de commandes **[[5]](#référence)**
- command-line-usage : librairie pour afficher un beau helper **[[6]](#référence)**

### Algorithme
**TFC** suit le workflow suivant :
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
![Workflow](http://img15.hostingpics.net/pics/710624flc.png)  


### Utilisation
**TFC** s'utilise en ligne de commande actuellement.   
Pour le lancer il suffit simplement d'avoir *NodeJs* installé et de lui fournir un fichier json comprenant la configuration et les différents tests à exécuter (un exemple est fourni dans le dépot Github dans le dossier test). Pour toutes les variables contenues dans une réponse comme par exemple la consommation il suffit d'indiquer cette variable dans le texte de réponse par `%%` pour ne pas réaliser la comparaison de cette partie de phrase. 

```
    git clone https://github.com/Oupsla/TFC
    npm i
    node index.js test/exampleTest.json
```

Afin de faciliter son utilisation un manuel est facilement accessible `node index.js --help`
![Help](http://img11.hostingpics.net/pics/682992Capturedu20170211132912.png)  


Concernant la visualisation, celle-ci s'effectue en passant le paramètre `-m` en lançant le système et affiche un graphique dans la console. Celui-ci permet de visualiser les performances de toutes les questions ou de chaque test en particulier.  
![Monitor](http://img15.hostingpics.net/pics/959972grape.png)  

## Evaluation
L'évaluation de **TFC** s'est réalisée avec un véritable chatbot utilisé en production (environ 200 utilisateurs) : [Talk To My Car](http://talk-to-my-car.com). Celui-ci est un chatbot proposant de pouvoir dialoguer avec sa voiture afin de lui poser plusieurs questions :
- Connaître sa position
- Son niveau de carburant
- Son état général
- ...

Une série de tests a été écrite afin de vérifier le réèl intérêt de **TFC** dans un cas d'utilisation concernant un chatbot en production (`talk to my car` dans ce cas).

### Efficacité
**TFC** a permis à l'auteur de `Talk to my car` de pouvoir améliorer certaines parties de son chatbot en testant différents paramétrages pour les mêmes questions.  
Il a ainsi pu découvrir quelles requêtes prenaient le plus de temps afin de les améliorer mais aussi si en fonction des différentes version qu'il développe si la rapidité de réponses augmente ou diminue. Il a pu de cette manière décelé des mauvaises pratiques de programmation qu'il réalisait et qui allongeait le temps de réponse de son système.  

Autre point important il a pu remarqué que le problème n'était pas toujours dû à son système mais à une API tierce qu'il utilise afin de questionner sa voiture. Celle-ci tombait parfois en panne et de cette façon il a pu ainsi mettre en place un système prévenant l'utilisateur de l'indisponibilité de `Talk to my car`.

### Complexité
La décomposition du code a été mis à l'honneur dans ce projet !
Cette décomposition a permis de développer plus facilement et de pouvoir rajouter des fonctionnalités plus rapidement. Elle permet également comme expliqué précédemment, de pouvoir rajouter aisément de nouvelles connections vers d'autres plateformes de chatbots grâce à l'utilisation du pattern *Facade* afin d'abstraire les appels externes.

### Facilité d'utilisation
**TFC** est très facile à prendre en main. Comme dit précédemment il suffit d'avoir *NodeJs* installé et en 2-3 lignes de commande, le framework est disponible.
L'utilisation d'un fichier JSON pour configurer les tests est aussi un gros avantage et permet à tout à chacun de modifier/ajouter/supprimer des tests aisément.

## Limitation
Pour le moment **TFC** se limite aux chatbots Messenger mais comme dit précédemment il est facilement envisageable de l'étendre à d'autres plateformes. Nous avons choisi de nous limiter à Messenger car cette plateforme regroupe pour le moment le nombre le plus important de chatbots.  

Une autre limitation a également été rencontrée concernant les limitations de connection pour certains chatbots. Ceux-ci nécessite parfois une connection à un service externe (l'API de XEE dans notre cas, qui ouvre une pop-up) et donc il n'est pas possible pour **TFC** de passer automatiquement cette étape. L'alternative est de manuellement le connecter afin de sauter cette étape.


## Conclusion
En conclusion, **TFC** (*The* Test Framework for Chatbot) est une très bonne première approche d'un framework de test End-To-End complet pour les chatbots.
Celui-ci propose une approche facile d'utilisation et simple à comprendre pour n'importe quel développeur.  
En lui ajoutant par exemple une interface graphique (web par exemple), il permettrait de visionner clairement les changements apportés (comme par exemple avec Coveralls **[[9]](#référence)** pour les tests unitaires classiques).

## Référence
- [1] Bluebird : https://github.com/petkaantonov/bluebird
- [2] validator : https://github.com/chriso/validator.js
- [3] time : https://github.com/TooTallNate/node-time
- [4] facebook-chat-api : https://github.com/Schmavery/facebook-chat-api
- [5] command-line-args : https://github.com/75lb/command-line-args
- [6] command-line-usage : https://github.com/75lb/command-line-usage
- [7] Istanbul : https://github.com/gotwarlost/istanbul
- [8] Mocha : https://mochajs.org/
- [9] Coveralls : https://coveralls.io/
- [10] Messenger : https://fr-fr.messenger.com/
- [11] NodeJs : https://nodejs.org/en/
