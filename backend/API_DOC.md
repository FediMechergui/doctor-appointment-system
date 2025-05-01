# Documentation de l'API Backend — Tableau de Bord Médical

## Authentification (Médecins)

- **POST /api/auth/register**
  - Inscription d'un médecin
  - Body: `{ nom, prenom, email, mot_de_passe }`
  - Response: `{ message }`

- **POST /api/auth/login**
  - Connexion médecin
  - Body: `{ email, mot_de_passe }`
  - Response: `{ token, doctor }`

---

## Médecins

- **GET /api/doctors/me** _(auth requis)_
  - Récupère le profil du médecin connecté
  - Header: `Authorization: Bearer <token>`

---

## Patients

- **GET /api/patients** _(auth requis)_
  - Liste tous les patients
- **GET /api/patients/:id** _(auth requis)_
  - Dossier complet d'un patient
- **POST /api/patients** _(auth requis)_
  - Ajouter un patient
  - Body: `{ nom, prenom, date_naissance, sexe, telephone, email, adresse, allergies, maladies_chroniques, maladies_actuelles, antecedents_medicaux, medicaments_actuels, autres_notes }`
- **PUT /api/patients/:id** _(auth requis)_
  - Modifier un patient
  - Body: (identique à POST)
- **DELETE /api/patients/:id** _(auth requis)_
  - Supprimer un patient

---

## Rendez-vous (Appointments)

- **GET /api/appointments** _(auth requis)_
  - Liste tous les rendez-vous du médecin connecté
- **POST /api/appointments** _(auth requis)_
  - Ajouter un rendez-vous
  - Body: `{ patient_id, date_rdv, motif, statut, note }`
- **PUT /api/appointments/:id** _(auth requis)_
  - Modifier un rendez-vous
  - Body: `{ date_rdv, motif, statut, note }`
- **DELETE /api/appointments/:id** _(auth requis)_
  - Supprimer un rendez-vous

---

## Fichiers Médicaux (Medical Files)

- **POST /api/files/:patient_id** _(auth requis, multipart/form-data)_
  - Upload d'un fichier médical pour un patient
  - FormData: `file`, `nom_fichier` (optionnel)
- **GET /api/files/:patient_id** _(auth requis)_
  - Liste des fichiers d'un patient
- **PUT /api/files/rename/:file_id** _(auth requis)_
  - Renommer un fichier
  - Body: `{ nouveau_nom }`

---

## Ordonnances

- **GET /api/ordonnances/:patient_id** _(auth requis)_
  - Liste des ordonnances d'un patient
- **POST /api/ordonnances/:patient_id** _(auth requis)_
  - Ajouter une ordonnance
  - Body: `{ contenu }`

---

## Sécurité
Toutes les routes (sauf /auth) nécessitent le header `Authorization: Bearer <token>` obtenu lors de la connexion.

---

# Workflow & Conseils pour le Frontend (React)

## 1. Authentification
- Stockez le token JWT après connexion dans le localStorage ou context.
- Ajoutez le header `Authorization` à chaque requête protégée.

## 2. Navigation & Structure
- Page de login → Redirige vers le dashboard après succès.
- Dashboard principal :
  - Calendrier interactif (affiche les rendez-vous du jour)
  - Liste des patients (tableau avec recherche)
  - Statistiques/insights (nombre de RDV aujourd'hui, total patients, etc.)

## 3. Patients
- CRUD complet (ajout, modification, suppression, affichage)
- Affichage détaillé du dossier patient (inclut allergies, maladies, ordonnances, fichiers, etc.)

## 4. Rendez-vous
- CRUD complet
- Lier chaque RDV à un patient
- Affichage calendrier (utilisez une librairie comme react-calendar ou FullCalendar)

## 5. Fichiers Médicaux
- Upload (avec Multer côté backend)
- Affichage liste, téléchargement, renommage

## 6. Ordonnances
- Ajout et affichage des ordonnances par patient

## 7. Internationalisation
- Utilisez i18n ou gardez tous les textes en français dans les composants

## 8. Sécurité
- Ne stockez jamais le mot de passe en clair côté frontend
- Protégez les routes frontend par vérification du token

---

## Conseils
- Utilisez Axios ou Fetch pour les appels API
- Centralisez la gestion des erreurs et des notifications utilisateur
- Utilisez des composants réutilisables (modals, formulaires, tables)
- Structurez le code React par pages et composants

---

Pour toute question sur l’API ou la logique frontend, n’hésitez pas à demander plus de détails !
