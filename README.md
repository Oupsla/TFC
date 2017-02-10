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

Notre but principal est donc de proposer un système de test pour chatbot mais aussi de pouvoir avoir un aperçu de l'évolution du temps de réponse au fur et à mesure des versions.
Celui-ci doit accepter un ensemble de tests à effectuer (sous la même forme que de tests unitaires avec la question à poser et les réponses attendues) ainsi qu'une configuration minimale permettant de cibler un chatbot précis.  

## Travail technique

*Remarque : Ce travail est pour le moment au stade de Proof-of-concept, c'est pour cela que nous avons décidé de nous limiter aux chatbots disponibles seulement sur Messenger (voir la partie Limitation pour plus d'informations). *

### Architecture
Nous avons développé notre framework de test sous *NodeJs*. Nous avons découpé notre projet de la façon suivante :

- `testRunner.js`, qui est le coeur de notre framework et s'occupe d'initialiser le système et de vérifier les réponses des chatbots.
- Les façades des plateformes (`messengerFacade.js` par exemple) : qui s'occupe de tous les appels vers les API afin d'envoyer des messages aux chatbots et de récupérer leurs réponses.

Nous avons opté pour ce découpage afin de pouvoir facilement rajouter de nouvelles façades vers d'autres plateformes (Slack, Cisco Spark, SMS, ...). Il suffit simplement de récrire deux méthodes (une de connexion et une d'envoi/réception de message) afin de rajouter la compatibilité vers une nouvelle plateforme.

// Exemple de code

Nous avons également utilisé de nombreux packages **npm** afin de diminuer notre travail :
- Bluebird : librairie permettant d'utiliser des 'promises' (système asynchrone) **[[1]](#référence)**
- validator : librairie de validation de paramètres **[[2]](#référence)**
- time : librairie de mesure de performance **[[3]](#référence)**
- facebook-chat-api : librairie permettant d'utiliser facilement l'API de messenger **[[4]](#référence)**

## Evaluation

## Limitation

Pour le moment notre framework de test se limite aux chatbots Messenger mais il est facilement envisageable de l'étendre à d'autres plateformes. Nous avons choisi de nous limiter à Messenger car cette plateforme regroupe pour le moment le nombre le plus important de chatbots.  



## Conclusion

## Référence
- [1] Bluebird : https://github.com/petkaantonov/bluebird
- [2] validator : https://github.com/chriso/validator.js
- [3] time : https://github.com/TooTallNate/node-time
- [4] facebook-chat-api : https://github.com/Schmavery/facebook-chat-api
- [10] Istanbul : https://github.com/gotwarlost/istanbul
- [11] Mocha : https://mochajs.org/
- [12] Travis CI : https://travis-ci.org
