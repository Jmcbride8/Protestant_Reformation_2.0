import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, Cross } from 'lucide-react';
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
  { label: 'Groups', sub: 'Do life Together', path: '/groups', featureKey: 'link_community_groups', pageKey: 'page_groups' },
  { label: 'Care & Support', sub: 'Community support board', path: '/community-support', featureKey: 'link_give_to_each_other', pageKey: 'page_community_support' },
  { label: 'Memories', sub: 'Photos & videos from our year', path: '/memories', featureKey: 'link_community_memories', pageKey: 'page_memories' },
  { label: 'Give Time', sub: 'Volunteer & serve', path: '/volunteer', featureKey: 'link_give_time', pageKey: 'page_volunteer' },
  { label: 'Give Financially', sub: 'Support our mission', path: '/giving', featureKey: 'link_give_financially', pageKey: 'page_giving' },
];



export default function Navbar() {
  const location = useLocation();
  const { isEnabled } = useFeatures();
  const [scrolled, setScrolled] = useState(false);
  const lightPages = ['/admin', '/sermons', '/groups', '/services', '/schedule', '/milestones', '/volunteer', '/giving', '/contact', '/community-support', '/carpool', '/vision', '/memories', '/you'];
  const useWhiteNav = !scrolled && !lightPages.includes(location.pathname);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [churchOpen, setChurchOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  const [meOpen, setMeOpen] = useState(false);
  const meRef = useRef(null);
  const filteredNavLinks = navLinks.filter(l => !l.featureKey || isEnabled(l.featureKey));
  const churchLinks = churchLinksAll.filter(l => (!l.featureKey || isEnabled(l.featureKey)) && (!l.pageKey || isEnabled(l.pageKey)));
  const communityLinks = communityLinksAll.filter(l => isEnabled(l.featureKey) && isEnabled(l.pageKey));

  const churchRef = useRef(null);
  const communityRef = useRef(null);


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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || !useWhiteNav
        ? 'backdrop-blur-md shadow-lg border-b'
        : 'bg-transparent'
    }`} style={scrolled || !useWhiteNav ? { background: 'rgba(26,10,8,0.97)', borderColor: 'rgba(200,146,42,0.2)' } : {}}>
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
                className={`font-ui text-xs tracking-[0.2em] uppercase transition-colors ${
                  useWhiteNav
                    ? location.pathname === link.path ? 'text-[#c8922a] font-semibold' : 'text-white/80 hover:text-[#c8922a]'
                    : location.pathname === link.path ? 'text-[#c8922a] font-semibold' : 'text-white/70 hover:text-[#c8922a]'
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
                  className={`flex items-center gap-1 font-ui text-xs tracking-[0.2em] uppercase transition-colors ${
                    useWhiteNav
                      ? churchLinks.some(l => l.path === location.pathname) ? 'text-[#c8922a] font-semibold' : 'text-white/80 hover:text-[#c8922a]'
                      : churchLinks.some(l => l.path === location.pathname) ? 'text-[#c8922a] font-semibold' : 'text-white/70 hover:text-[#c8922a]'
                  }`}
                >
                  Church
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${churchOpen ? 'rotate-180' : ''}`} />
                </button>
                {churchOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 overflow-hidden z-50 rounded border" style={{ background: 'rgba(26,10,8,0.98)', borderColor: 'rgba(200,146,42,0.25)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
                    {churchLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setChurchOpen(false)}
                        className={`flex flex-col px-4 py-3 transition-colors border-b last:border-0 ${location.pathname === link.path ? 'bg-[#c8922a]/10' : 'hover:bg-white/5'}`}
                        style={{ borderColor: 'rgba(200,146,42,0.12)' }}
                      >
                        <span className="font-ui text-xs tracking-wider uppercase text-white/90">{link.label}</span>
                        <span className="font-body text-sm text-white/40 mt-0.5">{link.sub}</span>
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
                  className={`flex items-center gap-1 font-ui text-xs tracking-[0.2em] uppercase transition-colors ${
                    useWhiteNav
                      ? communityLinks.some(l => l.path === location.pathname) ? 'text-[#c8922a] font-semibold' : 'text-white/80 hover:text-[#c8922a]'
                      : communityLinks.some(l => l.path === location.pathname) ? 'text-[#c8922a] font-semibold' : 'text-white/70 hover:text-[#c8922a]'
                  }`}
                >
                  Community
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${communityOpen ? 'rotate-180' : ''}`} />
                </button>
                {communityOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 overflow-hidden z-50 rounded border" style={{ background: 'rgba(26,10,8,0.98)', borderColor: 'rgba(200,146,42,0.25)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
                    {communityLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setCommunityOpen(false)}
                        className={`flex flex-col px-4 py-3 transition-colors border-b last:border-0 ${location.pathname === link.path ? 'bg-[#c8922a]/10' : 'hover:bg-white/5'}`}
                        style={{ borderColor: 'rgba(200,146,42,0.12)' }}
                      >
                        <span className="font-ui text-xs tracking-wider uppercase text-white/90">{link.label}</span>
                        <span className="font-body text-sm text-white/40 mt-0.5">{link.sub}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}



            {user ? (
              <div className="flex items-center gap-3">
                {/* Me dropdown */}
                <div className="relative" ref={meRef}>
                  <button
                    onClick={() => setMeOpen(v => !v)}
                    className={`flex items-center gap-1 font-ui text-xs tracking-[0.2em] uppercase transition-colors ${
                      useWhiteNav
                        ? ['/you', '/admin'].includes(location.pathname) ? 'text-[#c8922a] font-semibold' : 'text-white/80 hover:text-[#c8922a]'
                        : ['/you', '/admin'].includes(location.pathname) ? 'text-[#c8922a] font-semibold' : 'text-white/70 hover:text-[#c8922a]'
                    }`}
                  >
                    Me
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${meOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {meOpen && (
                    <div className="absolute top-full right-0 mt-3 w-48 overflow-hidden z-50 rounded border" style={{ background: 'rgba(26,10,8,0.98)', borderColor: 'rgba(200,146,42,0.25)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
                      <Link
                        to="/you"
                        onClick={() => setMeOpen(false)}
                        className={`flex flex-col px-4 py-3 transition-colors border-b ${location.pathname === '/you' ? 'bg-[#c8922a]/10' : 'hover:bg-white/5'}`}
                        style={{ borderColor: 'rgba(200,146,42,0.12)' }}
                      >
                        <span className="font-ui text-xs tracking-wider uppercase text-white/90">Profile</span>
                        <span className="font-body text-sm text-white/40 mt-0.5">Your info & settings</span>
                      </Link>
                      {['admin', 'staff', 'pastor'].includes(user.role?.toLowerCase()) && (
                        <Link
                          to="/admin"
                          onClick={() => setMeOpen(false)}
                          className={`flex flex-col px-4 py-3 transition-colors ${location.pathname === '/admin' ? 'bg-[#c8922a]/10' : 'hover:bg-white/5'}`}
                        >
                          <span className="font-ui text-xs tracking-wider uppercase text-white/90">Admin Dashboard</span>
                          <span className="font-body text-sm text-white/40 mt-0.5">Manage the church</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-ui text-xs tracking-widest uppercase text-white/50 hover:text-white/80 hover:bg-white/5"
                  onClick={() => base44.auth.logout()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                className="font-ui text-xs tracking-widest uppercase px-5 border hover:opacity-90 transition-all"
                style={{ background: '#c8922a', color: '#1a0a08', borderColor: '#c8922a' }}
                onClick={() => base44.auth.redirectToLogin()}
              >
                Member Login
              </Button>
            )}
          </div>

          {/* Mobile nav */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-16 w-16 text-white hover:bg-white/10" style={{ minWidth: '4rem', minHeight: '4rem' }}>
                <Menu strokeWidth={2.5} className="h-12 w-12" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-l" style={{ background: '#1a0a08', borderColor: 'rgba(200,146,42,0.2)' }}>
              <div className="flex flex-col gap-6 mt-8">
                {filteredNavLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`font-ui text-xs tracking-[0.25em] uppercase transition-colors ${
                      location.pathname === link.path ? 'text-[#c8922a]' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Church submenu in mobile */}
                {churchLinks.length > 0 && (
                  <div>
                    <p className="font-ui text-xs tracking-[0.3em] uppercase text-[#c8922a]/60 mb-3">Church</p>
                    <div className="flex flex-col gap-4 pl-2 border-l border-[#c8922a]/20">
                      {churchLinks.map(link => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setOpen(false)}
                          className={`font-ui text-xs tracking-[0.2em] uppercase transition-colors ${
                            location.pathname === link.path ? 'text-[#c8922a]' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {/* Community submenu — members only */}
                {user && (
                  <div>
                    <p className="font-ui text-xs tracking-[0.3em] uppercase text-[#c8922a]/60 mb-3">Community</p>
                    <div className="flex flex-col gap-4 pl-2 border-l border-[#c8922a]/20">
                      {communityLinks.map(link => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setOpen(false)}
                          className={`font-ui text-xs tracking-[0.2em] uppercase transition-colors ${
                            location.pathname === link.path ? 'text-[#c8922a]' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 mt-2" style={{ borderTop: '1px solid rgba(200,146,42,0.15)' }}>
                   {user ? (
                     <div className="flex flex-col gap-3">
                       <p className="font-ui text-xs tracking-[0.3em] uppercase text-[#c8922a]/60">Me</p>
                       <div className="flex flex-col gap-4 pl-2 border-l border-[#c8922a]/20">
                         <Link
                           to="/you"
                           onClick={() => setOpen(false)}
                           className={`font-ui text-xs tracking-[0.2em] uppercase transition-colors ${location.pathname === '/you' ? 'text-[#c8922a]' : 'text-white/60 hover:text-white'}`}
                         >
                           Profile
                         </Link>
                         {['admin', 'staff', 'pastor'].includes(user.role?.toLowerCase()) && (
                           <Link
                             to="/admin"
                             onClick={() => setOpen(false)}
                             className={`font-ui text-xs tracking-[0.2em] uppercase transition-colors ${location.pathname === '/admin' ? 'text-[#c8922a]' : 'text-white/60 hover:text-white'}`}
                           >
                             Admin Dashboard
                           </Link>
                         )}
                       </div>
                      <Button variant="ghost" className="font-ui text-xs tracking-widest uppercase text-white/40 hover:text-white/70 mt-2" onClick={() => base44.auth.logout()}>
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full font-ui text-xs tracking-widest uppercase border"
                      style={{ background: '#c8922a', color: '#1a0a08', borderColor: '#c8922a' }}
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