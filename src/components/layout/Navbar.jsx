import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useFeatures } from '@/lib/FeatureContext';
import { isPreviewingAsGuest } from './MemberPreviewBanner';

const navLinks = [
  { label: 'Home', path: '/' },
];

const churchLinksAll = [
  { label: 'Sermons', sub: 'Watch & listen', path: '/sermons', featureKey: 'page_sermons', pageKey: 'page_sermons' },
  { label: 'Care', sub: 'Something for every season', path: '/services', featureKey: 'link_community_care', pageKey: 'page_services' },
  { label: 'Contact', sub: 'Get in touch with us', path: '/contact', featureKey: null, pageKey: null },
];

const communityLinksAll = [
  { label: 'Groups', sub: 'Do life Together', path: '/groups', featureKey: 'link_community_groups', pageKey: 'page_groups' },
  { label: 'Schedule', sub: 'When we gather', path: '/schedule', featureKey: 'link_community_schedule', pageKey: 'page_schedule' },
  { label: 'Milestones', sub: 'Life\'s sacred moments', path: '/milestones', featureKey: 'link_community_milestones', pageKey: 'page_milestones' },
  { label: 'Memories', sub: 'Photos & videos from our year', path: '/memories', featureKey: 'link_community_memories', pageKey: 'page_memories' },
];

const giveLinksAll = [
  { label: 'Give Time', sub: 'Volunteer & serve', path: '/volunteer', featureKey: 'link_give_time', pageKey: 'page_volunteer' },
  { label: 'Give Financially', sub: 'Support our mission', path: '/giving', featureKey: 'link_give_financially', pageKey: 'page_giving' },
  { label: 'Support Each Other', sub: 'Community support board', path: '/community-support', featureKey: 'link_give_to_each_other', pageKey: 'page_community_support' },
];

export default function Navbar() {
  const location = useLocation();
  const { isEnabled } = useFeatures();
  const [scrolled, setScrolled] = useState(false);
  const lightPages = ['/admin', '/sermons', '/groups', '/services', '/schedule', '/milestones', '/volunteer', '/giving', '/contact', '/community-support', '/carpool', '/vision', '/memories'];
  const useWhiteNav = !scrolled && !lightPages.includes(location.pathname);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [churchOpen, setChurchOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [giveOpen, setGiveOpen] = useState(false);
  const filteredNavLinks = navLinks.filter(l => !l.featureKey || isEnabled(l.featureKey));
  const churchLinks = churchLinksAll.filter(l => (!l.featureKey || isEnabled(l.featureKey)) && (!l.pageKey || isEnabled(l.pageKey)));
  const communityLinks = communityLinksAll.filter(l => isEnabled(l.featureKey) && isEnabled(l.pageKey));
  const giveLinks = giveLinksAll.filter(l => isEnabled(l.featureKey) && isEnabled(l.pageKey));
  const churchRef = useRef(null);
  const communityRef = useRef(null);
  const giveRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (churchRef.current && !churchRef.current.contains(e.target)) setChurchOpen(false);
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
    if (isPreviewingAsGuest()) {
      setUser(null); // Explicitly clear user so member-only nav items are hidden
      return;
    }
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
      }
    });
  }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !useWhiteNav ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={
                useWhiteNav
                  ? "https://media.base44.com/images/public/69e6c4f50b822603e6dbc272/9955edb85_ChatGPTImageApr20202608_31_25PM.png"
                  : "https://media.base44.com/images/public/user_68598e69bed8319e5429445e/a32da92c7_image.png"
              }
              alt="Hope Santa Barbara" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {filteredNavLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm tracking-wide transition-colors ${
                  useWhiteNav
                    ? location.pathname === link.path ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                    : location.pathname === link.path ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Church dropdown — always visible */}
            {churchLinks.length > 0 && (
              <div className="relative" ref={churchRef}>
                <button
                  onClick={() => setChurchOpen(v => !v)}
                  className={`flex items-center gap-1 font-body text-sm tracking-wide transition-colors ${
                    useWhiteNav
                      ? churchLinks.some(l => l.path === location.pathname) ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                      : churchLinks.some(l => l.path === location.pathname) ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Church
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${churchOpen ? 'rotate-180' : ''}`} />
                </button>
                {churchOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden z-50">
                    {churchLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setChurchOpen(false)}
                        className={`flex flex-col px-4 py-3 hover:bg-secondary/60 transition-colors border-b border-border/40 last:border-0 ${location.pathname === link.path ? 'bg-secondary/40' : ''}`}
                      >
                        <span className="font-body text-sm font-medium text-foreground">{link.label}</span>
                        <span className="font-body text-xs text-muted-foreground">{link.sub}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Community dropdown — members only */}
            {user && (
              <div className="relative" ref={communityRef}>
                <button
                  onClick={() => setCommunityOpen(v => !v)}
                  className={`flex items-center gap-1 font-body text-sm tracking-wide transition-colors ${
                    useWhiteNav
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
            )}

            {/* Give dropdown — members only */}
            {user && (
              <div className="relative" ref={giveRef}>
                <button
                  onClick={() => setGiveOpen(v => !v)}
                  className={`flex items-center gap-1 font-body text-sm tracking-wide transition-colors ${
                    useWhiteNav
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
            )}

            {user ? (
              <div className="flex items-center gap-3">
                {(user.role === 'admin' || user.role === 'staff') && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className={`font-body text-xs ${useWhiteNav ? 'text-white border-white/60 hover:bg-white/10 hover:text-white' : ''}`}>
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`font-body text-xs ${useWhiteNav ? 'text-white hover:bg-white/10 hover:text-white' : ''}`}
                  onClick={() => base44.auth.logout()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                className={`font-body text-xs ${useWhiteNav ? 'bg-white/20 text-white hover:bg-white/30 border border-white/40' : 'bg-primary hover:bg-primary/90'}`}
                onClick={() => base44.auth.redirectToLogin()}
              >
                Member Login
              </Button>
            )}
          </div>

          {/* Mobile nav */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={`h-16 w-16 ${useWhiteNav ? 'text-white hover:bg-white/20' : 'text-primary hover:bg-secondary'}`} style={{ minWidth: '4rem', minHeight: '4rem' }}>
                <Menu strokeWidth={2.5} className="h-12 w-12" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                {filteredNavLinks.map(link => (
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
                {/* Church submenu in mobile — always visible */}
                {churchLinks.length > 0 && (
                  <div>
                    <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mb-3">Church</p>
                    <div className="flex flex-col gap-4 pl-2">
                      {churchLinks.map(link => (
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
                )}
                {/* Community submenu in mobile — members only */}
                {user && (
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
                )}
                {/* Give submenu in mobile — members only */}
                {user && (
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
                )}
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