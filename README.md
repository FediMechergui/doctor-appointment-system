# Tableau de Bord pour la Gestion des Rendez-vous Médicaux

## Description du Projet
Ce projet est un tableau de bord interactif destiné aux médecins pour gérer et organiser leurs rendez-vous, les données des patients, et les fichiers médicaux. L'application offre une authentification sécurisée pour les médecins, leur permettant d'accéder à un calendrier interactif, une gestion complète des patients, des fichiers médicaux, un historique des rendez-vous, des notes, et des statistiques en temps réel.

---

## Fonctionnalités Principales

- **Authentification des Médecins** : Accès sécurisé au tableau de bord.
- **Calendrier Interactif** : Affichage, ajout, et gestion des rendez-vous (date & heure).
- **Liste des Patients** : Visualisation et gestion des dossiers patients.
- **Dossiers Médicaux** : Stockage local des documents médicaux via Multer, avec possibilité de renommer les fichiers lors de l'upload.
- **Historique des Rendez-vous** : Suivi complet de tous les rendez-vous passés.
- **Notes et Mises à Jour** : Ajout de notes et de mises à jour pour chaque rendez-vous.
- **Statistiques & Insights** : Vue d'ensemble des rendez-vous du jour et autres statistiques sur la page principale.
- **Pages en Français** : L'intégralité de l'interface est en français.

---

## Structure Technique

- **Backend** : Node.js avec Express.js
- **Base de Données** : MySQL (via XAMPP)
- **Stockage Local** : Dossiers `uploads` pour les fichiers médicaux, gérés avec Multer
- **Frontend** : React.js (pages et composants en français)

---

## Dossier Patient
Chaque patient possède un dossier complet contenant :
- Informations personnelles
- Documents médicaux (stockés localement)
- Historique des rendez-vous
- Notes et observations

---

## Installation & Lancement

1. **Cloner le dépôt**
```bash
git clone <url-du-depot>
```

2. **Backend**
   - Installer les dépendances :
     ```bash
     cd backend
     npm install
     ```
   - Lancer le serveur Express :
     ```bash
     npm start
     ```
   - Assurez-vous que XAMPP/MySQL est démarré et la base de données configurée.

3. **Frontend**
   - Installer les dépendances :
     ```bash
     cd frontend
     npm install
     ```
   - Lancer l'application React :
     ```bash
     npm start
     ```

4. **Configuration**
   - Créez un fichier `.env` pour configurer les variables d'environnement nécessaires (connexion MySQL, chemins d'upload, etc).

---

## Notes Supplémentaires
- Tous les fichiers médicaux sont stockés localement dans le dossier `uploads`.
- Les noms de fichiers peuvent être modifiés lors de l'upload pour une meilleure organisation.
- L'application respecte la confidentialité des données médicales.

---

## Auteurs
- Projet développé par Fedi Mechergui

---

## Licence
Ce projet est sous licence MIT.

---

## Contact
Pour toute question ou suggestion, merci de contacter : [Votre Email]
