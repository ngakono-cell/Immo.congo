import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Logo size={40} withText={false} linked={false} />
              <span className="font-bold text-lg text-primary-foreground">IMMO CONGO 🇨🇬</span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              La plateforme de référence pour la location immobilière au Congo.
              Simple, rapide et accessible.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-primary-foreground/60">Navigation</h3>
            <ul className="flex flex-col gap-2">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/annonces', label: 'Toutes les annonces' },
                { to: '/connexion', label: 'Espace propriétaire' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-primary-foreground/60">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4 shrink-0" />
                Brazzaville & Pointe-Noire, Congo
              </li>
              <li>
                <a href="tel:+242064081787" className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <Phone className="w-4 h-4 shrink-0" />+242 06 408 17 87
                </a>
              </li>
              <li>
                <a href="mailto:immocongo23@gmail.com" className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <Mail className="w-4 h-4 shrink-0" />immocongo23@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/20 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/60">
          <span>© {new Date().getFullYear()} IMMO CONGO. Tous droits réservés.</span>
          <div className="flex gap-4">
            <Link to="/confidentialite" className="hover:text-primary-foreground transition-colors">Confidentialité</Link>
            <Link to="/conditions" className="hover:text-primary-foreground transition-colors">Conditions d'utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
