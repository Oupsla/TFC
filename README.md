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
Mais encore faut-il que votre assistant ne plante pas à la première question posée ou mette une éternité à réfléchir à la réponse...

## Contexte et But
Les tests unitaires pour chatbot ne sont pas différents des tests unitaires des applications serveurs. Ce sont les mêmes outils dépendamment du langage/framework utilisé (par exemple *Mocha* pour *NodeJs*).  
Mais ceux-ci ne permettent pas de se mettre à la place de l'utilisateur et de tester réellement le chatbot (vitesse de traitement, ...). Et pourquoi ne pas tirer parti du coté universel d'un chatbot (accessible depuis n'importe quelle plateforme et non soucieux de la technologie serveur utilisée) ?  
C'est à travers ce projet (TFC) que nous avons voulu agir et développer un framework de test End-To-End (de bout en bout) qui se propose de monitorer et tester n'importe quel chatbot.

Notre but principal est donc de proposer un système de test pour chatbot.
Celui-ci doit accepter un ensemble de tests à effectuer (sous la même forme que de tests unitaires avec la question à poser et les réponses attendues) ainsi qu'une configuration minimale permettant de cible un chatbot précis.  

## Travail technique

Ce travail est pour le moment au stade de *Proof-of-concept*, c'est pour cela que nous avons décidé de nous limiter aux chatbots disponibles seulement sur Messenger (voir la partie Limitation pour plus d'informations).  

Nous avons développer notre framework de test sous *NodeJs* et nous avons pu grâce à ce choix profiter de plusieurs avantages comme la réutilisation de package existant pour pouvoir dialoguer facilement aux utilisateurs et autres chatbots sur Messenger.

## Evaluation

## Limitation

Pour le moment notre framework de test se limite aux chatbots Messenger mais il est facilement envisageable de l'étendre à d'autres plateformes. Nous avons choisi de nous limiter à Messenger car cette plateforme regroupe pour le moment le nombre le plus important de chatbots.  



## Conclusion

## Référence
