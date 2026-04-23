import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Sermons', path: '/sermons' },
];

const communityLinks = [
  { label: 'Groups', sub: 'Do life Together', path: '/groups' },
  { label: 'Services', sub: 'Something for every Season', path: '/services' },
  { label: 'Schedule', sub: 'When we gather', path: '/schedule' },
  { label: 'Milestones', sub: 'Life\'s sacred moments', path: '/milestones' },
];

const giveLinks = [
  { label: 'Give Time', sub: 'Volunteer & serve', path: '/volunteer' },
  { label: 'Give Financially', sub: 'Support our mission', path: '/giving' },
  { label: 'Give to Each Other', sub: 'Community support board', path: '/community-support' },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [giveOpen, setGiveOpen] = useState(false);
  const communityRef = useRef(null);
  const giveRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (communityRef.current && !communityRef.current.contains(e.target)) setCommunityOpen(false);
      if (giveRef.current && !giveRef.current.contains(e.target)) setGiveOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
              src={
                scrolled
                  ? "https://media.base44.com/images/public/user_68598e69bed8319e5429445e/a32da92c7_image.png"
                  : "https://media.base44.com/images/public/69e6c4f50b822603e6dbc272/9955edb85_ChatGPTImageApr20202608_31_25PM.png"
              }
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
                className={`font-body text-sm tracking-wide transition-colors ${
                  !scrolled
                    ? location.pathname === link.path ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                    : location.pathname === link.path ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Community dropdown */}
            <div className="relative" ref={communityRef}>
              <button
                onClick={() => setCommunityOpen(v => !v)}
                className={`flex items-center gap-1 font-body text-sm tracking-wide transition-colors ${
                  !scrolled
                    ? communityLinks.some(l => l.path === location.pathname) ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                    : communityLinks.some(l => l.path === location.pathname) ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Community
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${communityOpen ? 'rotate-180' : ''}`} />
              </button>
              {communityOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden z-50">
                  {communityLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setCommunityOpen(false)}
                      className={`flex flex-col px-4 py-3 hover:bg-secondary/60 transition-colors border-b border-border/40 last:border-0 ${location.pathname === link.path ? 'bg-secondary/40' : ''}`}
                    >
                      <span className="font-body text-sm font-medium text-foreground">{link.label}</span>
                      <span className="font-body text-xs text-muted-foreground">{link.sub}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Give dropdown */}
            <div className="relative" ref={giveRef}>
              <button
                onClick={() => setGiveOpen(v => !v)}
                className={`flex items-center gap-1 font-body text-sm tracking-wide transition-colors ${
                  !scrolled
                    ? giveLinks.some(l => l.path === location.pathname) ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                    : giveLinks.some(l => l.path === location.pathname) ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Give
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${giveOpen ? 'rotate-180' : ''}`} />
              </button>
              {giveOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden z-50">
                  {giveLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setGiveOpen(false)}
                      className={`flex flex-col px-4 py-3 hover:bg-secondary/60 transition-colors border-b border-border/40 last:border-0 ${location.pathname === link.path ? 'bg-secondary/40' : ''}`}
                    >
                      <span className="font-body text-sm font-medium text-foreground">{link.label}</span>
                      <span className="font-body text-xs text-muted-foreground">{link.sub}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className={`font-body text-sm tracking-wide transition-colors ${
                !scrolled
                  ? location.pathname === '/contact' ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                  : location.pathname === '/contact' ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Contact
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                {(user.role === 'admin' || user.role === 'staff') && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className={`font-body text-xs ${!scrolled ? 'text-white border-white/60 hover:bg-white/10 hover:text-white' : ''}`}>
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`font-body text-xs ${!scrolled ? 'text-white hover:bg-white/10 hover:text-white' : ''}`}
                  onClick={() => base44.auth.logout()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                className={`font-body text-xs ${!scrolled ? 'bg-white/20 text-white hover:bg-white/30 border border-white/40' : 'bg-primary hover:bg-primary/90'}`}
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
                {/* Community submenu in mobile */}
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">Community</p>
                  <div className="flex flex-col gap-4 pl-2">
                    {communityLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className={`font-body text-base tracking-wide ${
                          location.pathname === link.path ? 'text-primary font-semibold' : 'text-muted-foreground'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
                {/* Give submenu in mobile */}
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">Give</p>
                  <div className="flex flex-col gap-4 pl-2">
                    {giveLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className={`font-body text-base tracking-wide ${
                          location.pathname === link.path ? 'text-primary font-semibold' : 'text-muted-foreground'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4 mt-2">
                   {user ? (
                     <div className="flex flex-col gap-3">
                       {(user.role === 'admin' || user.role === 'staff') && (
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