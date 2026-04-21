import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Sermons', path: '/sermons' },
  { label: 'Services', path: '/services' },
  { label: 'Giving', path: '/giving' },
  { label: 'Volunteer', path: '/volunteer' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
      }
    });
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="https://media.base44.com/images/public/user_68598e69bed8319e5429445e/a32da92c7_image.png" 
              alt="Hope Santa Barbara" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm tracking-wide transition-colors hover:text-accent ${
                  location.pathname === link.path ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="font-body text-xs">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-body text-xs"
                  onClick={() => base44.auth.logout()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                className="font-body text-xs bg-primary hover:bg-primary/90"
                onClick={() => base44.auth.redirectToLogin()}
              >
                Member Login
              </Button>
            )}
          </div>

          {/* Mobile nav */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`font-body text-lg tracking-wide ${
                      location.pathname === link.path ? 'text-primary font-semibold' : 'text-muted-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-2">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setOpen(false)}>
                          <Button variant="outline" className="w-full font-body">Admin Dashboard</Button>
                        </Link>
                      )}
                      <Button variant="ghost" className="font-body" onClick={() => base44.auth.logout()}>
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full font-body bg-primary"
                      onClick={() => base44.auth.redirectToLogin()}
                    >
                      Member Login
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}