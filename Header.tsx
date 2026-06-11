import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, LayoutDashboard, Shield, PlusCircle, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarDisplay } from '@/components/AvatarUpload';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import PubliciteBanner from '@/components/layouts/PubliciteBanner';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/annonces', label: 'Annonces' },
    { to: '/reels', label: '🎬 Réels' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) =>
    location.pathname === path ? 'text-primary font-semibold' : 'text-foreground/80 hover:text-primary';

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      {/* Bannière publicitaire défilante */}
      <PubliciteBanner />

      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo size={40} withText linked />

        {/* Navigation desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={`text-sm transition-colors ${isActive(link.to)}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions desktop */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin"><Shield className="w-4 h-4 mr-1" />Admin</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link to="/proprietaire/tableau-de-bord">
                  <LayoutDashboard className="w-4 h-4 mr-1" />Tableau de bord
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/proprietaire/nouvelle-annonce">
                  <PlusCircle className="w-4 h-4 mr-1" />Publier
                </Link>
              </Button>
              {/* Avatar utilisateur */}
              <Link to="/proprietaire/tableau-de-bord" title={profile?.full_name ?? undefined}>
                <AvatarDisplay url={profile?.avatar_url ?? null} name={profile?.full_name} size="sm" />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-1" />Déconnexion
              </Button>            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/connexion"><LogIn className="w-4 h-4 mr-1" />Connexion</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/publicite/creer"><Megaphone className="w-4 h-4 mr-1" />Créer une publicité</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/inscription">Publier une annonce</Link>
              </Button>
            </>
          )}
        </div>

        {/* Menu mobile */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-sidebar p-0">
            <div className="flex flex-col h-full">
              {/* En-tête sidebar mobile */}
              <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
                <Logo size={36} withText={false} linked={false} />
                <span className="font-bold text-sidebar-foreground">IMMO CONGO 🇨🇬</span>
              </div>

              {/* Liens navigation */}
              <nav className="flex-1 p-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-3 rounded-md text-sm font-medium transition-colors min-h-12 flex items-center
                      ${location.pathname === link.to
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
                  >
                    {link.label}
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="my-2 border-t border-sidebar-border" />
                    {profile?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)}
                        className="px-3 py-3 rounded-md text-sm font-medium min-h-12 flex items-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <Shield className="w-4 h-4" />Administration
                      </Link>
                    )}
                    <Link to="/proprietaire/tableau-de-bord" onClick={() => setMobileOpen(false)}
                      className="px-3 py-3 rounded-md text-sm font-medium min-h-12 flex items-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                      <LayoutDashboard className="w-4 h-4" />Tableau de bord
                    </Link>
                    <Link to="/proprietaire/nouvelle-annonce" onClick={() => setMobileOpen(false)}
                      className="px-3 py-3 rounded-md text-sm font-medium min-h-12 flex items-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                      <PlusCircle className="w-4 h-4" />Publier une annonce
                    </Link>
                  </>
                )}
              </nav>

              {/* Bas sidebar mobile */}
              <div className="p-4 border-t border-sidebar-border">
                {user ? (
                  <div className="space-y-3">
                    {/* Mini profil utilisateur */}
                    <Link to="/proprietaire/profil" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                      <AvatarDisplay url={profile?.avatar_url ?? null} name={profile?.full_name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-sidebar-foreground truncate">
                          {profile?.full_name ?? 'Mon compte'}
                        </p>
                        <p className="text-xs text-sidebar-foreground/60 truncate">
                          {profile?.phone ?? profile?.email ?? ''}
                        </p>
                      </div>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start border border-white/20 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild className="w-full">
                      <Link to="/connexion" onClick={() => setMobileOpen(false)}>
                        <LogIn className="w-4 h-4 mr-2" />Connexion
                      </Link>
                    </Button>
                    <Button variant="secondary" asChild className="w-full">
                      <Link to="/publicite/creer" onClick={() => setMobileOpen(false)}>
                        <Megaphone className="w-4 h-4 mr-2" />Créer une publicité
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full border border-white/20 text-sidebar-foreground hover:bg-sidebar-accent">
                      <Link to="/inscription" onClick={() => setMobileOpen(false)}>Inscription</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
