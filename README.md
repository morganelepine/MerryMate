# MerryMate

MerryMate est une application web de gestion de listes de cadeaux.
Le backend est construit avec Laravel, le frontend avec React via Inertia.js, et la base de données est MySQL.

Démo en ligne : https://www.merrymate.fr/

## Fonctionnalités implémentées

### Comptes et sécurité

- Inscription et connexion utilisateur·ice
- Vérification de l'e-mail (workflow Laravel Breeze)
- reCAPTCHA à l'inscription
- Réinitialisation de mot de passe
- Suppression de compte avec confirmation du mot de passe

### Gestion des listes

- Trois types de listes :
    - listes publiques créées
    - listes privées créées
    - listes suivies
- Création, édition et suppression d'une liste
- Recherche de listes publiques à suivre
- Consultation d'une liste suivie avec tri par statuts des idées (disponibles, réservées, achetées)
- Archivage d'une liste (les idées achetées passent en statut archivé)
- Alerte lorsqu'il reste moins de 6 idées disponibles dans la liste (=ni réservées ni achetées)

### Suivi d'une liste

- Seule les listes publiques peuvent être suivies
- Possibilité de suivre une liste de deux façons :
    - Vérification via un code privé
    - Demande d'accès via une notification envoyée au·à la propriétaire
- Acceptation/refus d'une demande d'accès par le·a propriétaire : envoi d'une notification à la personne qui a effectué la demande

### Gestion des idées cadeaux

- Dans une liste suivie :
    - Possibilité de :
        - réserver une idée
        - indiquer qu'une idée a été achetée
        - annuler la réservation ou l'achat
    - Mode Secret Santa : la nom de la personne qui a acheté/réservé est gardé secret
- Dans une liste créée :
    - Ajout, modification, suppression d'idées dans la liste
    - Protection sur la suppression : une idée réservée/achetée ne peut pas être supprimée
    - Champs disponibles :
        - titre, marque, lien, détails, prix
        - idée favorite
        - idée multiple (peut être offerte plusieurs fois)
        - informations de réduction/adhésion
    - Le·a propriétaire ne voit pas les idées réservées/achetées

### Notifications

- Notification par e-mail des demandes/réponses d'accès
- Marquage lu/non lu sur la page dédiée
- Types de notifications :
    - confirmation de suivi de liste
    - demande d'accès
    - réponse à une demande d'accès

### Autres pages

- Profil : édition du profil utilisateur·ice
- Budget : total des idées achetées/réservées par l'utilisateur·ice par personne
- Cadeaux recus : idées archivées (et donc reçues) de ses propres listes par année
- Notifications

## Stack technique

- PHP 8.1+
- Laravel 10
- Inertia.js (Laravel + React)
- React 18
- Vite
- Tailwind CSS + Bootstrap
- MySQL
- Laravel Sanctum
- PHPUnit (tests backend)
- Vitest + Testing Library (tests frontend)

## Prérequis

- PHP >= 8.1
- Composer
- Node.js >= 18 et npm
- MySQL

## Installation locale

1. Cloner le projet puis se placer dans le dossier
2. Installer les dépendances backend :

```bash
composer install
```

3. Installer les dépendances frontend :

```bash
npm install
```

4. Copier le fichier d'environnement :

```bash
cp .env.example .env
```

5. Générer la clé d'application :

```bash
php artisan key:generate
```

6. Configurer la connexion MySQL dans .env

7. Lancer les migrations :

```bash
php artisan migrate
```

8. (Optionnel) Injecter des données de test :

```bash
php artisan db:seed
```

## Variables d'environnement importantes

En plus des variables Laravel standard (APP*\*, DB*\_, MAIL\_\_), vérifier :

- RECAPTCHA_SECRET_KEY : clé secrète Google reCAPTCHA
- CURL_CA_BUNDLE : chemin vers le certificat CA si nécessaire pour les appels HTTPS

## Lancement en développement

Terminal 1 (backend Laravel) :

```bash
php artisan serve
```

Terminal 2 (frontend Vite) :

```bash
npm run dev
```

Application disponible par defaut sur http://localhost:8000

## Tests

Tests backend (Laravel) :

```bash
php artisan test
```

Tests frontend (Vitest) :

```bash
npm run test
```

## Déploiement Heroku (résumé)

1. Créer une application Heroku
2. Configurer les buildpacks Node.js et PHP
3. Vérifier le Procfile :

```bash
web: vendor/bin/heroku-php-apache2 public/
```

4. Configurer les variables d'environnement (APP*KEY, DB*\_, MAIL\_\_, RECAPTCHA_SECRET_KEY, etc.)
5. Ajouter une base MySQL (ex: JawsDB)
6. Déployer :

```bash
git push heroku main
```

7. Exécuter les migrations :

```bash
heroku run php artisan migrate
```
