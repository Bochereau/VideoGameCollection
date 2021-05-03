# Dictionnaire de données

## User

Champ|Type|Spécificités|Description|
|-|-|-|-|
|id|INT|PRIMARY KEY, NOT NULL, UNSIGNED, AUTO_INCREMENT|L'identifiant de l'utilisateur|
|pseudo|VARCHAR|NOT NULL|Le pseudo de l'utilisateur|
|email|VARCHAR|NOT NULL|L'email de l'utilisateur|
|password|vARCHAR|NOT NULL|Le mot de passe de l'utilisateur|
|created_at|timestamp[current_timestamp()]| NOT NULL|La date de création du profil|
|updated_at|timestamp||La date de dernière mise à jour du profil|

## Hardware

Champ|Type|Spécificités|Description|
|-|-|-|-|
|id|INT|PRIMARY KEY, NOT NULL, UNSIGNED, AUTO_INCREMENT|L'identifiant de la console|
|name|VARCHAR|NOT NULL|Le nom de la console|
|constructor|VARCHAR|NOT NULL|Le constructeur de la console|
|created_at|timestamp[current_timestamp()]|NOT NULL|La date de création de la console|
|updated_at|timestamp||La date de dernière mise à jour de la console|
|user_id|INT|NOT NULL, UNSIGNED|L'id de l'utilisateur|

## Videogames

Champ|Type|Spécificités|Description|
|-|-|-|-|
|id|INT|PRIMARY KEY, NOT NULL, UNSIGNED, AUTO_INCREMENT|L'identifiant du jeu|
|name|VARCHAR|NOT NULL|Le nom du jeu|
|editor|VARCHAR|NOT NULL|L'éditeur du jeu|
|developer|VARCHAR|NOT NULL|Le développeur du jeu|
|release|DATE|NOT NULL|L'année de sortie du jeu|
|finished|TINYINT|1: FINISHED, 2: NOT FINISHED|Savoir si le jeu est terminé ou non|
|picture|VARCHAR|L'url de l'image du jeu|
|description|TEXT||La description du jeu ou de son contenu|
|box|TINYINT|1: CHECKED, 2: UNCHECKED|Savoir si la boite du jeu est présente|
|manual|TINYINT|1: CHECKED, 2: UNCHECKED|Savoir si le manuel du jeu est présent|
|physical|TINYINT|1: CHECKED, 2: UNCHECKED|Savoir si le jeu est en physique|
|demat|TINYINT|1: CHECKED, 2: UNCHECKED|Savoir si le jeu est en dématérialisé|
|created_at|timestamp[current_timestamp()]| NOT NULL|La date de création du jeu|
|updated_at|timestamp||La date de dernière mise à jour du jeu|
|user_id|INT|NOT NULL, UNSIGNED|L'id de l'utilisateur|
|hardware_id|INT|NOT NULL, UNSIGNED|L'id de la console|
