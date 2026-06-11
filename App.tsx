import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppearanceProvider } from '@/contexts/AppearanceProvider';
import { usePageTracking } from '@/hooks/use-page-tracking';
import { useCapacitor } from '@/hooks/use-capacitor';
import BottomNav from '@/components/native/BottomNav';
import OfflineIndicator from '@/components/native/OfflineIndicator';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminAnnonces from '@/pages/admin/AdminAnnonces';
import AdminUtilisateurs from '@/pages/admin/AdminUtilisateurs';
import AdminPublicites from '@/pages/admin/AdminPublicites';
import AdminDemandesPublicite from '@/pages/admin/AdminDemandesPublicite';
import AdminParametres from '@/pages/admin/AdminParametres';
import AdminPaiements from '@/pages/admin/AdminPaiements';
import HomePage from '@/pages/HomePage';
import AnnoncesPage from '@/pages/AnnoncesPage';
import AnnonceDetailPage from '@/pages/AnnonceDetailPage';
import ContactPage from '@/pages/ContactPage';
import ConnexionPage from '@/pages/ConnexionPage';
import InscriptionPage from '@/pages/InscriptionPage';
import DemandePublicitePage from '@/pages/DemandePublicitePage';
import FavorisPage from '@/pages/FavorisPage';
import ProfilPage from '@/pages/ProfilPage';
import TableauDeBordPage from '@/pages/proprietaire/TableauDeBordPage';
import NouvelleAnnoncePage from '@/pages/proprietaire/NouvelleAnnoncePage';
import EtapePaiementPage from '@/pages/proprietaire/EtapePaiementPage';
import ReelsPage from '@/pages/ReelsPage';
import ArchitecturePage from '@/pages/ArchitecturePage';

// Composant interne pour activer le tracking + composants natifs
const AppRoutes: React.FC = () => {
  usePageTracking();
  const { isOnline } = useCapacitor();

  return (
    <>
      <OfflineIndicator isOnline={isOnline} />
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/annonces" element={<AnnoncesPage />} />
        <Route path="/annonces/:id" element={<AnnonceDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/publicite/creer" element={<DemandePublicitePage />} />

        {/* Navigation mobile */}
        <Route path="/favoris" element={<FavorisPage />} />
        <Route path="/profil" element={<ProfilPage />} />

        {/* Authentification */}
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />

        {/* Espace propriétaire */}
        <Route path="/proprietaire/tableau-de-bord" element={<TableauDeBordPage />} />
        <Route path="/proprietaire/nouvelle-annonce" element={<NouvelleAnnoncePage />} />
        <Route path="/proprietaire/modifier-annonce/:id" element={<NouvelleAnnoncePage />} />
        <Route path="/proprietaire/paiement" element={<EtapePaiementPage />} />

        {/* Administration (routes imbriquées) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="annonces" element={<AdminAnnonces />} />
          <Route path="utilisateurs" element={<AdminUtilisateurs />} />
          <Route path="publicites" element={<AdminPublicites />} />
          <Route path="demandes-publicite" element={<AdminDemandesPublicite />} />
          <Route path="paiements" element={<AdminPaiements />} />
          <Route path="parametres" element={<AdminParametres />} />
        </Route>

        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppearanceProvider>
          <AppRoutes />
          <Toaster richColors position="top-right" />
        </AppearanceProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
