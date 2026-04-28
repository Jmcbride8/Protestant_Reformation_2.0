import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useFeatures } from '@/lib/FeatureContext';
import { isPreviewingAsGuest } from './MemberPreviewBanner';

const navLinks = [
  { label: 'Home', path: '/' },
];

const churchLinksAll = [
  { label: 'Sermons', sub: 'Watch & listen', path: '/sermons', featureKey: 'page_sermons', pageKey: 'page_sermons' },
  { label: 'Programs', sub: 'Something for every season', path: '/services', featureKey: 'link_community_care', pageKey: 'page_services' },
  { label: 'Schedule', sub: 'When we gather', path: '/schedule', featureKey: 'link_community_schedule', pageKey: 'page_schedule' },
  { label: 'Milestones', sub: 'Life\'s sacred moments', path: '/milestones', featureKey: 'link_community_milestones', pageKey: 'page_milestones' },
  { label: 'Contact', sub: 'Get in touch with us', path: '/contact', featureKey: null, pageKey: null },
];

const communityLinksAll = [
  { label: 'Groups', sub: 'Do life together', path: '/groups', featureKey: 'link_community_groups', pageKey: 'page_groups' },
  { label: 'Care & Support', sub: 'Community support board', path: '/community-support', featureKey: 'link_give_to_each_other', pageKey: 'page_community_support' },
  { label: 'Memories', sub: 'Photos & videos', path: '/memories', featureKey: 'link_community_memories', pageKey: 'page_memories' },
  { label: 'Give Time', sub: 'Volunteer & serve', path: '/volunteer', featureKey: 'link_give_time', pageKey: 'page_volunteer' },
  { label: 'Give Financially', sub: 'Support our mission', path: '/giving', featureKey: 'link_give_financially', pageKey: 'page_giving' },
];

export default function Navbar() {
  const location = useLocation();
  const { isEnabled } = useFeatures();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [churchOpen, setChurchOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [meOpen, setMeOpen] = useState(false);

  const meRef = useRef(null);
  const churchRef = useRef(null);
  const communityRef = useRef(null);

  const filteredNavLinks = navLinks.filter(l => !l.featureKey || isEnabled(l.featureKey));
  const churchLinks = churchLinksAll.filter(l => (!l.featureKey || isEnabled(l.featureKey)) && (!l.pageKey || isEnabled(l.pageKey)));
  const communityLinks = communityLinksAll.filter(l => isEnabled(l.featureKey) && isEnabled(l.pageKey));

  useEffect(() => {
    const handleClick = (e) => {
      if (churchRef.current && !churchRef.current.contains(e.target)) setChurchOpen(false);
      if (communityRef.current && !communityRef.current.contains(e.target)) setCommunityOpen(false);
      if (meRef.current && !meRef.current.contains(e.target)) setMeOpen(false);
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
    if (isPreviewingAsGuest()) { setUser(null); return; }
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) { const me = await base44.auth.me(); setUser(me); }
    });
  }, [location.pathname]);

  const navBase = scrolled
    ? 'bg-background/95 backdrop-blur-md border-b border-white/5'
    : 'bg-transparent border-b border-transparent';

  const linkClass = (active) =>
    `font-mono text-xs tracking-[0.2em] uppercase transition-colors ${
      active ? 'text-accent' : 'text-foreground/50 hover:text-foreground'
    }`;

  const DropdownMenu = ({ links, label, isOpen, setIsOpen, refEl, activeCheck }) => (
    <div className="relative" ref={refEl}>
      <button
        onClick={() => setIsOpen(v => !v)}
        className={`flex items-center gap-1.5 ${linkClass(activeCheck)}`}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 bg-background border border-white/10 shadow-2xl shadow-black/60 z-50">
          {/* accent top border */}
          <div className="h-px w-full bg-accent" />
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex flex-col px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group ${location.pathname === link.path ? 'bg-white/5' : ''}`}
            >
              <span className="font-mono text-xs text-foreground group-hover:text-accent transition-colors">{link.label}</span>
              <span className="font-body text-xs text-foreground/30 mt-0.5">{link.sub}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBase}`}>
      {/* Accent line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/80 via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/user_68598e69bed8319e5429445e/a32da92c7_image.png"
              alt="Hope Santa Barbara"
              className="h-12 w-auto brightness-0 invert"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {filteredNavLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={linkClass(location.pathname === link.path)}
              >
                {link.label}
              </Link>
            ))}

            {churchLinks.length > 0 && (
              <DropdownMenu
                links={churchLinks}
                label="Church"
                isOpen={churchOpen}
                setIsOpen={setChurchOpen}
                refEl={churchRef}
                activeCheck={churchLinks.some(l => l.path === location.pathname)}
              />
            )}

            {user && (
              <DropdownMenu
                links={communityLinks}
                label="Community"
                isOpen={communityOpen}
                setIsOpen={setCommunityOpen}
                refEl={communityRef}
                activeCheck={communityLinks.some(l => l.path === location.pathname)}
              />
            )}

            {user ? (
              <div className="flex items-center gap-6">
                {/* Me dropdown */}
                <div className="relative" ref={meRef}>
                  <button
                    onClick={() => setMeOpen(v => !v)}
                    className={`flex items-center gap-1.5 ${linkClass(['/you', '/admin'].includes(location.pathname))}`}
                  >
                    Me
                    <ChevronDown className={`w-3 h-3 transition-transform ${meOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {meOpen && (
                    <div className="absolute top-full right-0 mt-4 w-48 bg-background border border-white/10 shadow-2xl shadow-black/60 z-50">
                      <div className="h-px w-full bg-accent" />
                      <Link
                        to="/you"
                        onClick={() => setMeOpen(false)}
                        className={`flex flex-col px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 group ${location.pathname === '/you' ? 'bg-white/5' : ''}`}
                      >
                        <span className="font-mono text-xs text-foreground group-hover:text-accent transition-colors">Profile</span>
                        <span className="font-body text-xs text-foreground/30 mt-0.5">Your info & settings</span>
                      </Link>
                      {['admin', 'staff', 'pastor'].includes(user.role?.toLowerCase()) && (
                        <Link
                          to="/admin"
                          onClick={() => setMeOpen(false)}
                          className={`flex flex-col px-4 py-3 hover:bg-white/5 transition-colors group ${location.pathname === '/admin' ? 'bg-white/5' : ''}`}
                        >
                          <span className="font-mono text-xs text-foreground group-hover:text-accent transition-colors">Admin Dashboard</span>
                          <span className="font-body text-xs text-foreground/30 mt-0.5">Manage the church</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => base44.auth.logout()}
                  className="font-mono text-xs tracking-widest uppercase text-foreground/30 hover:text-foreground transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => base44.auth.redirectToLogin()}
                className="flex items-center gap-2 border border-accent/40 text-accent px-5 py-2.5 font-mono text-xs tracking-widest uppercase hover:bg-accent/10 hover:border-accent transition-all group"
              >
                Member Login
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button className="p-3 text-foreground/60 hover:text-foreground transition-colors">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background border-l border-white/10 p-0">
              <div className="h-px w-full bg-accent" />
              <div className="flex flex-col gap-0 mt-0 p-6">
                {filteredNavLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`py-4 border-b border-white/5 font-mono text-xs tracking-widest uppercase ${location.pathname === link.path ? 'text-accent' : 'text-foreground/50'}`}
                  >
                    {link.label}
                  </Link>
                ))}

                {churchLinks.length > 0 && (
                  <div className="py-4 border-b border-white/5">
                    <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-3">Church</p>
                    <div className="flex flex-col gap-3 pl-2">
                      {churchLinks.map(link => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setOpen(false)}
                          className={`font-mono text-xs tracking-widest uppercase ${location.pathname === link.path ? 'text-accent' : 'text-foreground/40'}`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {user && (
                  <div className="py-4 border-b border-white/5">
                    <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-3">Community</p>
                    <div className="flex flex-col gap-3 pl-2">
                      {communityLinks.map(link => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setOpen(false)}
                          className={`font-mono text-xs tracking-widest uppercase ${location.pathname === link.path ? 'text-accent' : 'text-foreground/40'}`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">Me</p>
                      <div className="flex flex-col gap-3 pl-2">
                        <Link to="/you" onClick={() => setOpen(false)} className={`font-mono text-xs tracking-widest uppercase ${location.pathname === '/you' ? 'text-accent' : 'text-foreground/40'}`}>Profile</Link>
                        {['admin', 'staff', 'pastor'].includes(user.role?.toLowerCase()) && (
                          <Link to="/admin" onClick={() => setOpen(false)} className={`font-mono text-xs tracking-widest uppercase ${location.pathname === '/admin' ? 'text-accent' : 'text-foreground/40'}`}>Admin Dashboard</Link>
                        )}
                      </div>
                      <button onClick={() => base44.auth.logout()} className="mt-2 text-left font-mono text-xs tracking-widest uppercase text-foreground/30 hover:text-foreground transition-colors">
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => base44.auth.redirectToLogin()}
                      className="w-full flex items-center justify-center gap-2 border border-accent text-accent px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-accent/10 transition-all"
                    >
                      Member Login <ArrowRight className="w-3 h-3" />
                    </button>
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