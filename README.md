# artisan-backend
Le backend d'un site pour un artisan (projet de formation)


Il s'agit du back end de mon projet de formation SPPN à l'Aliptic.

Ce backend est une API en NODE.js avec Express et MangoDB.
Le front END lié à ce projet se trouve sur le git:

https://github.com/BenjaminBarriere/projet-artisan

Pour faire fonctionner ce projet, il faut copier le .env-sample en un .env et remplir les configurations.
Ces configurations sont une clé de token (un salt pour le JWT), l'email et le mot de passe de cette email pour l'envoi de mail, le host SMTP correspondant et l'adresse da la DB.

Ensuite il faut aussi utiliser la commande "npm install" ou équivalent avec yarn, etc... pour installer les dépendences.
