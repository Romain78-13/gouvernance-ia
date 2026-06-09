# AI Governance — Gouvernance IA

Application React standalone de **gouvernance des agents IA** : ticketing des cas
d'usage, grille de décision Champion (valeur métier + risque éthique), avis des
instances expertes, et tableau de bord d'arbitrage AI Cockpit.

Aucun backend, aucune base de données : toutes les données sont gérées en mémoire
(session uniquement) via React `useState` / `useContext`. Les données sont
réinitialisées à chaque rechargement de la page.

## Stack technique

- **React 19** + **Vite** (bundler)
- **Tailwind CSS** (thème sombre)
- **Recharts** (radar, camembert, barres)
- **React Router** (navigation)
- **@headlessui/react** + **lucide-react** (UI / icônes)

## Démarrage local

```bash
npm install
npm run dev      # serveur de développement (http://localhost:5173)
npm run build    # build de production dans /dist
npm run preview  # prévisualise le build de production
```

## Profils de démonstration

L'écran de connexion permet de choisir un profil (sans mot de passe) :

| Profil          | Rôle       | Périmètre        |
| --------------- | ---------- | ---------------- |
| Julie Martin    | Champion   | RH               |
| Thomas Renaud   | Champion   | Finance          |
| Marc Dubois     | Expert     | DPO & Legal      |
| Sarah Chen      | AI Cockpit | —                |
| Admin           | Admin      | Tous les accès   |

Le bouton **« Changer de profil »** (en bas de la barre latérale) permet de
basculer entre les rôles à tout moment.

## Déploiement sur Vercel (5 étapes)

1. **Pousser le projet sur un dépôt Git** (GitHub, GitLab ou Bitbucket).
2. Aller sur [vercel.com](https://vercel.com), se connecter puis cliquer sur
   **« Add New… » → « Project »** et **importer le dépôt**.
3. Vercel détecte automatiquement le framework **Vite**. Laisser les réglages par
   défaut (`Build Command: npm run build`, `Output Directory: dist`).
4. Cliquer sur **« Deploy »** et patienter la fin du build.
5. L'application est en ligne. Le fichier [`vercel.json`](./vercel.json) assure la
   redirection de toutes les routes vers `index.html` (SPA), donc le
   rafraîchissement d'une page profonde (ex. `/tickets/...`) fonctionne sans 404.

> Aucune variable d'environnement ni configuration supplémentaire n'est requise.

## Structure du projet

```
src/
  components/
    layout/   Sidebar, Header, Layout
    ui/       Badge, Gauge, Modal, Toast, Toggle, ScoreSlider, Wizard, Accordion
    charts/   EthicRadarChart, StatusPieChart, MetierBarChart
  pages/
    Login.jsx, Dashboard.jsx
    Tickets/  TicketList, TicketNew, TicketDetail
    Champion/ ChampionGrid          (Module 2)
    Expert/   ExpertReview          (Module 3)
    Cockpit/  CockpitDashboard, CockpitDecisionModal (Module 4)
    Champions/ ChampionsPage        (Module 5)
    Admin/    AdminPage
  context/    AppContext.jsx        (état global + données de démo)
  data/       demoData.js
  utils/      scoring.js, formatters.js, constants.js, notifications.js
  App.jsx, main.jsx, index.css
```

## Modules

1. **Ticketing** — liste filtrable, wizard de création en 4 étapes, détail à onglets.
2. **Grille Champion** — score de valeur métier + évaluation du risque éthique
   (score automatique, jauge, radar).
3. **Avis Experts** — synthèse des 7 instances + formulaire d'avis par instance.
4. **AI Cockpit** — KPIs, graphiques, file d'arbitrage et modal de décision.
5. **Champions** — rôle, grille de sélection, outils et programme de formation.
