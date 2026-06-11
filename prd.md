# Document d'Exigences

## 1. Aperçu de l'Application

### 1.1 Nom de l'Application
IMMO CONGO

### 1.2 Description
Plateforme immobilière professionnelle pour le marché congolais, disponible en version web et application mobile native (Android/iOS). Le site web React existant est encapsulé avec Capacitor pour générer des applications mobiles installables, tout en conservant l'intégralité des fonctionnalités web. L'application intègre un logo moderne généré par IA représentant une maison et est déployée initialement à Brazzaville et Pointe-Noire.

### 1.3 Modification Actuelle
Transformation de l'application web existante en application mobile native via Capacitor, avec ajout de fonctionnalités natives spécifiques (caméra, notifications push, géolocalisation, mode hors-ligne) et optimisations mobile-first.

## 2. Utilisateurs et Scénarios d'Utilisation

### 2.1 Utilisateurs Cibles
- Locataires recherchant un logement à Brazzaville ou Pointe-Noire
- Propriétaires souhaitant publier des annonces de location
- Administrateurs gérant la plateforme

### 2.2 Scénarios Principaux
- Recherche et consultation d'annonces immobilières sur mobile
- Publication d'annonces avec photos prises directement depuis le smartphone
- Réception de notifications push pour les nouvelles annonces correspondant aux critères
- Consultation hors-ligne des annonces favorites et récemment consultées
- Accès direct à une annonce via lien partagé (deep linking)

## 3. Structure des Pages et Fonctionnalités

### 3.1 Architecture Globale

```
IMMO CONGO Mobile App
├── Écran d'accueil (Home)
│   ├── Liste des annonces
│   ├── Barre de recherche
│   └── Filtres rapides
├── Recherche (Search)
│   ├── Filtres avancés
│   └── Résultats de recherche
├── Favoris (Favorites)
│   └── Annonces sauvegardées
├── Messages (Messages)
│   └── Conversations avec propriétaires
├── Profil (Profile)
│   ├── Informations utilisateur
│   ├── Mes annonces (pour propriétaires)
│   └── Paramètres
├── Détail d'annonce
│   ├── Galerie photos (swipe)
│   ├── Informations détaillées
│   └── Actions (contacter, favoris)
├── Publication d'annonce (Propriétaires)
│   ├── Formulaire de création
│   └── Ajout de photos (caméra native)
├── Administration (Admin)
│   ├── Gestion des annonces
│   ├── Gestion des utilisateurs
│   └── Gestion des publicités
├── Paiement
│   └── Processus de paiement sécurisé
└── Page Architecture Technique (/architecture)
    └── Affichage du document technique
```

### 3.2 Navigation Mobile Native

#### 3.2.1 Bottom Tabs (Barre de Navigation Inférieure)
- Remplace le header web pour la navigation principale
- 5 onglets principaux :
  + Accueil (icône maison)
  + Recherche (icône loupe)
  + Favoris (icône cœur)
  + Messages (icône bulle)
  + Profil (icône utilisateur)
- Zones tactiles minimales : 48×48px
- Indicateur visuel de l'onglet actif

#### 3.2.2 Navigation Contextuelle
- Bouton retour natif dans la barre supérieure pour les pages secondaires
- Gestes de swipe pour revenir en arrière (iOS/Android)

### 3.3 Écran d'Accueil

#### 3.3.1 Fonctionnalités Existantes (Web)
- Affichage de la liste des annonces disponibles
- Barre de recherche rapide
- Filtres de base (ville, type de bien, prix)
- Accès aux annonces détaillées

#### 3.3.2 Optimisations Mobile
- Pull-to-refresh pour actualiser la liste des annonces
- Skeleton loading pendant le chargement initial
- Grandes zones tactiles pour les cartes d'annonces
- Scroll infini pour charger plus d'annonces

### 3.4 Recherche et Filtres

#### 3.4.1 Fonctionnalités Existantes (Web)
- Recherche par mots-clés
- Filtres avancés (ville, quartier, type de bien, nombre de pièces, prix min/max)
- Affichage des résultats filtrés

#### 3.4.2 Optimisations Mobile
- Interface de filtres adaptée mobile (bottom sheet ou page plein écran)
- Boutons de filtre avec grandes zones tactiles
- Sauvegarde des critères de recherche pour notifications push

### 3.5 Détail d'Annonce

#### 3.5.1 Fonctionnalités Existantes (Web)
- Galerie de photos
- Informations détaillées (description, prix, superficie, équipements)
- Coordonnées du propriétaire
- Bouton de contact
- Ajout aux favoris

#### 3.5.2 Optimisations Mobile
- Galerie photos avec swipe gestures pour navigation entre images
- Zoom pinch sur les photos
- Bouton d'appel direct (utilise le téléphone natif)
- Bouton de partage natif
- Géolocalisation : affichage de la distance depuis la position actuelle de l'utilisateur

### 3.6 Publication d'Annonce (Propriétaires)

#### 3.6.1 Fonctionnalités Existantes (Web)
- Formulaire de création d'annonce (titre, description, prix, type de bien, nombre de pièces, adresse)
- Upload de photos
- Validation et soumission

#### 3.6.2 Fonctionnalités Natives Ajoutées
- Bouton « Prendre une photo » utilisant le plugin Camera de Capacitor
- Accès direct à la caméra du smartphone pour capturer des photos d'annonce
- Sélection de photos depuis la galerie du téléphone
- Compression automatique des images avant upload

### 3.7 Favoris

#### 3.7.1 Fonctionnalités Existantes (Web)
- Liste des annonces ajoutées aux favoris
- Suppression d'un favori
- Accès aux détails des annonces favorites

#### 3.7.2 Fonctionnalités Natives Ajoutées
- Stockage local des favoris via Capacitor Preferences
- Synchronisation automatique des favoris avec le serveur quand la connexion est rétablie
- Accès hors-ligne aux annonces favorites (données stockées dans IndexedDB)

### 3.8 Messages

#### 3.8.1 Fonctionnalités Existantes (Web)
- Liste des conversations avec les propriétaires
- Envoi et réception de messages
- Affichage de l'historique des conversations

#### 3.8.2 Fonctionnalités Natives Ajoutées
- Notifications push pour les nouveaux messages (plugin Push Notifications)
- Stockage local des messages récents pour consultation hors-ligne
- Synchronisation des messages envoyés hors-ligne quand la connexion revient

### 3.9 Profil Utilisateur

#### 3.9.1 Fonctionnalités Existantes (Web)
- Affichage des informations personnelles
- Modification du profil
- Déconnexion
- Pour les propriétaires : accès à « Mes annonces »

#### 3.9.2 Optimisations Mobile
- Paramètres de notifications push (activer/désactiver, choisir les types de notifications)
- Gestion du stockage hors-ligne (vider le cache)

### 3.10 Administration

#### 3.10.1 Fonctionnalités Existantes (Web)
- Gestion des annonces (validation, suppression)
- Gestion des utilisateurs (blocage, suppression)
- Gestion des publicités
- Statistiques de la plateforme

#### 3.10.2 Accès Mobile
- Interface d'administration accessible depuis l'application mobile
- Adaptations mineures pour l'affichage mobile (tableaux scrollables horizontalement)

### 3.11 Paiement

#### 3.11.1 Fonctionnalités Existantes (Web)
- Processus de paiement sécurisé pour les annonces premium ou services payants
- Intégration de passerelles de paiement

#### 3.11.2 Accès Mobile
- Processus de paiement identique, adapté à l'affichage mobile
- Utilisation du navigateur in-app pour les pages de paiement tierces

### 3.12 Page Architecture Technique (/architecture)

#### 3.12.1 Fonctionnalités Existantes (Web)
- Affichage du document d'architecture technique complet
- Bouton « Tout copier » pour copier l'intégralité du document
- Boutons « Copier » par section pour copier le contenu d'une section spécifique
- Interface minimaliste : fond blanc, texte noir, police monospace pour les blocs de code

#### 3.12.2 Accès Mobile
- Page accessible via l'URL /architecture dans l'application mobile
- Fonctionnalités de copie fonctionnelles sur mobile
- Affichage adapté à l'écran mobile (scroll vertical)

### 3.13 Écran de Démarrage (Splash Screen)

#### 3.13.1 Fonctionnalités
- Affichage du logo IMMO CONGO au lancement de l'application
- Transition fluide vers l'écran d'accueil
- Configuration via le plugin Splash Screen de Capacitor

### 3.14 Barre de Statut (Status Bar)

#### 3.14.1 Fonctionnalités
- Personnalisation de la barre de statut système (couleur, style)
- Configuration via le plugin Status Bar de Capacitor

## 4. Intégration Capacitor et Plugins Natifs

### 4.1 Configuration Capacitor

#### 4.1.1 Fichier capacitor.config.ts
- Configuration de l'appId, appName, webDir
- Configuration des plugins (Camera, Push Notifications, Geolocation, Splash Screen, Status Bar, Preferences)
- Configuration des plateformes Android et iOS

#### 4.1.2 Projets Natifs
- Génération du projet Android (dossier android/)
- Génération du projet iOS (dossier ios/)
- Synchronisation du code web vers les projets natifs

### 4.2 Plugins Capacitor Utilisés

#### 4.2.1 Camera
- Utilisation : prise de photos pour les annonces depuis la caméra ou la galerie
- Fonctionnalités : capture photo, sélection depuis galerie, compression

#### 4.2.2 Push Notifications
- Utilisation : envoi de notifications pour nouveaux messages, nouvelles annonces correspondant aux critères de recherche sauvegardés
- Fonctionnalités : enregistrement du token, réception de notifications, gestion des actions sur notifications

#### 4.2.3 Geolocation
- Utilisation : calcul de la distance entre la position de l'utilisateur et les annonces
- Fonctionnalités : obtention de la position actuelle, calcul de distance

#### 4.2.4 Splash Screen
- Utilisation : affichage du logo au démarrage de l'application
- Fonctionnalités : configuration de l'image, durée d'affichage, transition

#### 4.2.5 Status Bar
- Utilisation : personnalisation de la barre de statut système
- Fonctionnalités : couleur de fond, style du texte (clair/sombre)

#### 4.2.6 Preferences
- Utilisation : stockage local de données simples (favoris, paramètres utilisateur, token d'authentification)
- Fonctionnalités : sauvegarde clé-valeur, récupération, suppression

### 4.3 Réutilisation du Code React Existant

#### 4.3.1 Composants Réutilisés Sans Modification
- Composants de liste d'annonces
- Composants de formulaires (recherche, publication)
- Composants de détail d'annonce (hors galerie)
- Composants d'administration
- Composants de paiement
- Page architecture technique

#### 4.3.2 Composants Modifiés pour Mobile
- Header web remplacé par BottomTabs (nouveau composant)
- Galerie photos : ajout de swipe gestures et zoom pinch
- Formulaire de publication : ajout du bouton caméra native
- Liste d'annonces : ajout de pull-to-refresh
- Écrans principaux : ajout de skeleton loading

#### 4.3.3 Nouveaux Composants Créés
- BottomTabs : barre de navigation inférieure avec 5 onglets
- CameraButton : bouton d'accès à la caméra native
- PullToRefresh : composant de rafraîchissement par glissement
- SkeletonLoader : composant de chargement squelette
- NotificationSettings : paramètres de notifications push
- OfflineIndicator : indicateur de mode hors-ligne

## 5. Stockage Hors-Ligne et Synchronisation

### 5.1 Stockage Local

#### 5.1.1 Capacitor Preferences
- Stockage des favoris (liste des IDs d'annonces)
- Stockage des paramètres utilisateur (notifications activées/désactivées)
- Stockage du token d'authentification

#### 5.1.2 IndexedDB
- Stockage des annonces consultées récemment (données complètes)
- Stockage des annonces favorites (données complètes)
- Stockage des messages récents

### 5.2 Mode Hors-Ligne

#### 5.2.1 Consultation Hors-Ligne
- Accès aux annonces favorites stockées localement
- Accès aux annonces récemment consultées
- Accès aux messages récents
- Affichage d'un indicateur « Mode hors-ligne » en haut de l'écran

#### 5.2.2 Actions Hors-Ligne
- Ajout/suppression de favoris (stocké localement)
- Envoi de messages (mis en file d'attente)
- Affichage d'un message indiquant que l'action sera synchronisée à la reconnexion

### 5.3 Synchronisation Automatique

#### 5.3.1 Détection de Reconnexion
- Écoute de l'événement de changement de statut réseau
- Déclenchement automatique de la synchronisation quand la connexion est rétablie

#### 5.3.2 Processus de Synchronisation
- Envoi des favoris ajoutés/supprimés hors-ligne vers le serveur
- Envoi des messages en file d'attente vers le serveur
- Récupération des nouvelles annonces et messages depuis le serveur
- Mise à jour des données locales (IndexedDB)
- Affichage d'un message de confirmation de synchronisation réussie

## 6. Optimisations Mobile-First

### 6.1 Zones Tactiles
- Taille minimale : 48×48px pour tous les boutons et éléments interactifs
- Espacement suffisant entre les éléments cliquables (minimum 8px)

### 6.2 Swipe Gestures
- Galerie photos : swipe horizontal pour naviguer entre les images
- Retour arrière : swipe depuis le bord gauche (iOS) ou bouton retour natif (Android)

### 6.3 Pull-to-Refresh
- Liste d'annonces sur l'écran d'accueil : glissement vers le bas pour actualiser
- Liste de favoris : glissement vers le bas pour actualiser
- Liste de messages : glissement vers le bas pour actualiser

### 6.4 App Shell Pattern
- Chargement instantané de la structure de l'application (header, bottom tabs, zones de contenu vides)
- Affichage de skeleton loaders pendant le chargement des données
- Transition fluide vers le contenu réel une fois chargé

### 6.5 Performances
- Lazy loading des images d'annonces
- Compression des images avant upload
- Mise en cache des données fréquemment consultées

## 7. Deep Linking

### 7.1 Fonctionnalités
- Ouverture de l'application depuis un lien externe (SMS, email, réseaux sociaux)
- Navigation directe vers une annonce spécifique via son ID
- Format de lien : immocongo://annonce/{id}

### 7.2 Comportement
- Si l'application est installée : ouverture de l'application et navigation vers l'annonce
- Si l'application n'est pas installée : redirection vers le site web ou la page de téléchargement de l'app

## 8. Règles Métier et Logique

### 8.1 Authentification
- Connexion et inscription identiques à la version web
- Stockage du token d'authentification dans Capacitor Preferences
- Maintien de la session entre les lancements de l'application

### 8.2 Notifications Push
- Envoi de notifications pour les nouveaux messages
- Envoi de notifications pour les nouvelles annonces correspondant aux critères de recherche sauvegardés de l'utilisateur
- L'utilisateur peut activer/désactiver les notifications depuis les paramètres

### 8.3 Géolocalisation
- Demande de permission d'accès à la localisation au premier lancement
- Calcul de la distance entre la position de l'utilisateur et les annonces affichées
- Affichage de la distance dans les cartes d'annonces et la page de détail

### 8.4 Stockage et Synchronisation
- Les favoris et messages sont stockés localement et synchronisés avec le serveur
- En mode hors-ligne, les actions sont mises en file d'attente et exécutées à la reconnexion
- Les annonces consultées récemment sont stockées localement pour consultation hors-ligne (limite de 50 annonces)

### 8.5 Prise de Photos
- L'utilisateur peut choisir entre prendre une photo avec la caméra ou sélectionner une photo depuis la galerie
- Les photos sont compressées avant upload pour réduire la taille
- Limite de 10 photos par annonce

## 9. Exceptions et Cas Limites

| Situation | Comportement Attendu |
|-----------|----------------------|
| Permission caméra refusée | Affichage d'un message expliquant que la permission est nécessaire, bouton pour ouvrir les paramètres de l'application |
| Permission géolocalisation refusée | Pas d'affichage de distance, fonctionnalités de recherche et consultation restent disponibles |
| Permission notifications refusée | Pas de notifications push, l'utilisateur peut les activer depuis les paramètres |
| Échec de synchronisation après reconnexion | Nouvelle tentative automatique après 30 secondes, affichage d'un message d'erreur si échec persistant |
| Stockage local plein (IndexedDB) | Suppression automatique des annonces les plus anciennes pour libérer de l'espace |
| Deep link vers une annonce supprimée | Affichage d'un message « Annonce non disponible », redirection vers l'écran d'accueil |
| Utilisateur hors-ligne tente de publier une annonce | Affichage d'un message indiquant que la connexion est nécessaire pour publier |
| Utilisateur hors-ligne tente de payer | Affichage d'un message indiquant que la connexion est nécessaire pour effectuer un paiement |
| Échec de compression d'image | Affichage d'un message d'erreur, possibilité de réessayer ou de sélectionner une autre image |
| Notification push reçue alors que l'application est ouverte | Affichage d'une notification in-app (banner en haut de l'écran) |

## 10. Critères d'Acceptation

1. Un utilisateur télécharge et installe l'application IMMO CONGO depuis Google Play Store ou Apple App Store
2. Au premier lancement, l'écran de démarrage avec le logo s'affiche, puis l'application charge l'écran d'accueil avec la liste des annonces
3. L'utilisateur navigue entre les sections (Accueil, Recherche, Favoris, Messages, Profil) via la barre de navigation inférieure (bottom tabs)
4. L'utilisateur consulte une annonce, swipe horizontalement pour voir les photos, ajoute l'annonce aux favoris
5. L'utilisateur active le mode avion (hors-ligne), accède à ses favoris et consulte les annonces stockées localement
6. L'utilisateur désactive le mode avion, l'application détecte la reconnexion et synchronise automatiquement les favoris avec le serveur
7. L'utilisateur (propriétaire) crée une nouvelle annonce, clique sur « Prendre une photo », la caméra native s'ouvre, il prend une photo qui est ajoutée à l'annonce
8. L'utilisateur reçoit une notification push pour un nouveau message, clique dessus, l'application s'ouvre et affiche la conversation
9. L'utilisateur clique sur un lien immocongo://annonce/123 depuis un SMS, l'application s'ouvre et affiche l'annonce correspondante
10. L'utilisateur effectue un pull-to-refresh sur l'écran d'accueil, la liste des annonces se rafraîchit

## 11. Fonctionnalités Non Implémentées dans cette Version

- Mode sombre pour l'application mobile
- Partage d'annonces via réseaux sociaux natifs (Facebook, WhatsApp)
- Sauvegarde automatique des brouillons d'annonces
- Notifications push personnalisées par type d'annonce (appartement, maison, terrain)
- Carte interactive pour visualiser les annonces par localisation
- Filtres de recherche sauvegardés (favoris de recherche)
- Historique de navigation dans l'application
- Support de plusieurs langues (français uniquement pour cette version)
- Authentification biométrique (empreinte digitale, Face ID)
- Mode lecture hors-ligne pour le document d'architecture technique
- Export des annonces favorites en PDF
- Statistiques d'utilisation pour les propriétaires (vues, contacts)
- Chat en temps réel avec WebSocket
- Appels vidéo pour visites virtuelles
- Intégration avec calendrier natif pour planifier des visites