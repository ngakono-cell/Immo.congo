import HomePage from './pages/HomePage';
import AnnoncesPage from './pages/AnnoncesPage';
import AnnonceDetailPage from './pages/AnnonceDetailPage';
import ContactPage from './pages/ContactPage';
import ConnexionPage from './pages/ConnexionPage';
import InscriptionPage from './pages/InscriptionPage';
import PublicitesPage from './pages/PublicitesPage';
import DemandePublicitePage from './pages/DemandePublicitePage';
import ReelsPage from './pages/ReelsPage';
import ArchitecturePage from './pages/ArchitecturePage';
import TableauDeBordPage from './pages/proprietaire/TableauDeBordPage';
import NouvelleAnnoncePage from './pages/proprietaire/NouvelleAnnoncePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnnonces from './pages/admin/AdminAnnonces';
import AdminUtilisateurs from './pages/admin/AdminUtilisateurs';
import AdminPublicites from './pages/admin/AdminPublicites';
import AdminDemandesPublicite from './pages/admin/AdminDemandesPublicite';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  { name: 'Accueil',         path: '/',          element: <HomePage />,          public: true },
  { name: 'Annonces',        path: '/annonces',  element: <AnnoncesPage />,      public: true },
  { name: 'Détail annonce',  path: '/annonces/:id', element: <AnnonceDetailPage />, public: true },
  { name: 'Publicités',      path: '/publicites', element: <PublicitesPage />,    public: true },
  { name: 'Créer publicité', path: '/publicite/creer', element: <DemandePublicitePage />, public: true },
  { name: 'Réels',           path: '/reels',     element: <ReelsPage />,         public: true },
  { name: 'Architecture',    path: '/architecture', element: <ArchitecturePage />, public: true },
  { name: 'Contact',         path: '/contact',   element: <ContactPage />,       public: true },
  { name: 'Connexion',       path: '/connexion', element: <ConnexionPage />,     public: true },
  { name: 'Inscription',     path: '/inscription', element: <InscriptionPage />, public: true },
  {
    name: 'Tableau de bord',
    path: '/proprietaire/tableau-de-bord',
    element: <TableauDeBordPage />,
  },
  {
    name: 'Nouvelle annonce',
    path: '/proprietaire/nouvelle-annonce',
    element: <NouvelleAnnoncePage />,
  },
  {
    name: 'Modifier annonce',
    path: '/proprietaire/modifier-annonce/:id',
    element: <NouvelleAnnoncePage />,
  },
  {
    name: 'Administration',
    path: '/admin',
    element: (
      <AdminLayout />
    ),
    public: false,
  },
];
