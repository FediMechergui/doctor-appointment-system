# Workflow Frontend — Tableau de Bord Médical (React)

Ce guide décrit le workflow recommandé pour créer un frontend moderne, sécurisé et maintenable pour votre API backend de gestion médicale.

---

## 1. Structure du Projet

Organisez votre projet React de façon modulaire :

```
frontend/
├── src/
│   ├── api/           # Fonctions pour appeler l’API backend
│   ├── components/    # Composants réutilisables (Button, Modal, Table, etc.)
│   ├── pages/         # Pages principales (Login, Dashboard, Patients, etc.)
│   ├── context/       # AuthContext, PatientContext, etc.
│   ├── hooks/         # Custom hooks (useAuth, useFetch, etc.)
│   ├── utils/         # Fonctions utilitaires, helpers
│   └── App.js
├── public/
└── package.json
```

---

## 2. Authentification & Sécurité
- Utilisez un contexte React (`AuthContext`) pour stocker le JWT et les infos utilisateur.
- Après login, stockez le token dans `localStorage` ou `sessionStorage`.
- Ajoutez automatiquement le header `Authorization: Bearer <token>` à chaque requête API protégée (via Axios interceptors ou un custom fetch).
- Protégez les routes frontend avec un composant `PrivateRoute` qui vérifie la présence du token.

---

## 3. Navigation & Pages
- **Login** : Page d’authentification (POST `/api/auth/login`).
- **Dashboard** : Vue d’ensemble (statistiques, calendrier des RDV, etc.).
- **Patients** :
  - Liste des patients (GET `/api/patients`)
  - Détail patient (GET `/api/patients/:id`)
  - Ajout/modification/suppression (POST/PUT/DELETE)
- **Rendez-vous** :
  - Liste, création, modification, suppression (CRUD)
  - Utilisez une librairie de calendrier (FullCalendar, react-calendar)
- **Fichiers Médicaux** :
  - Upload (POST `/api/files/:patient_id`)
  - Liste, renommage (GET/PUT)
- **Ordonnances** :
  - Liste et ajout par patient (GET/POST `/api/ordonnances/:patient_id`)

---

## 4. Appels API
- Centralisez les appels API dans `/src/api/` (ex: `api.js`).
- Gérez les erreurs globalement (ex: toast/notification en cas d’erreur réseau ou 401).
- Utilisez Axios ou Fetch.
- Exemple d’appel protégé :
```js
// api.js
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;
```

---

## 5. Gestion d’État
- Utilisez React Context pour l’auth, les patients, etc.
- Utilisez des hooks personnalisés pour factoriser la logique (ex: `usePatients`, `useAppointments`).
- Pour les listes, pensez à la pagination côté backend si besoin.

---

## 6. UI/UX
- Utilisez une librairie de composants (Material UI, Ant Design, Bootstrap, etc.) pour un rendu pro et responsive.
- Préférez les composants réutilisables (Table, Modal, Form, etc.).
- Affichez des loaders/spinners lors des appels réseau.
- Gérez les erreurs et succès via des notifications.

---

## 7. Sécurité & Bonnes Pratiques
- Ne stockez jamais de mot de passe côté frontend.
- Ne montrez jamais le token dans l’UI.
- Déconnectez automatiquement l’utilisateur si le token expire (erreur 401).
- Validez les champs côté frontend avant envoi à l’API.

---

## 8. Internationalisation
- Gardez l’UI en français ou utilisez une solution comme `react-i18next` si besoin de plusieurs langues.

---

## 9. Conseils Divers
- Versionnez votre code avec Git.
- Testez vos composants (Jest, React Testing Library).
- Documentez chaque composant et API dans le code.
- Utilisez des variables d’environnement (`REACT_APP_API_URL`) pour l’URL de l’API.

---

## 10. Exemple de Workflow Utilisateur
1. L’utilisateur arrive sur `/login` et s’authentifie.
2. Le token est stocké et l’utilisateur est redirigé vers `/dashboard`.
3. Il peut naviguer vers Patients, RDV, Fichiers, etc.
4. Chaque action (ajout, modif, suppression) déclenche un appel API et met à jour l’état local.
5. Les erreurs sont affichées, les succès notifiés.

---

> Pour toute question sur l’intégration frontend ou la logique API, demandez plus de détails !
