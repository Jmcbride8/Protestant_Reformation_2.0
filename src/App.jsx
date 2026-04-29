import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { FeatureProvider } from '@/lib/FeatureContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import PageLayout from './components/layout/PageLayout';
import ScrollToTop from './components/ScrollToTop';
import MemberRoute from './components/MemberRoute';
import FeatureRoute from './components/FeatureRoute';
import Home from './pages/Home';
import Services from './pages/Services';
import Giving from './pages/Giving';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Sermons from './pages/Sermons';
import CommunitySupport from './pages/CommunitySupport';
import Groups from './pages/Groups';
import Schedule from './pages/Schedule';
import Milestones from './pages/Milestones';
import Carpool from './pages/Carpool';
import Vision from './pages/Vision';
import Memories from './pages/Memories';
import You from './pages/You';
import GroupAdmin from './pages/GroupAdmin';
import About from './pages/About';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <img 
            src="https://media.base44.com/images/public/user_68598e69bed8319e5429445e/a32da92c7_image.png" 
            alt="Hope Santa Barbara" 
            className="h-16 w-auto mx-auto mb-4 animate-pulse"
          />
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/sermons" element={<FeatureRoute featureKey="page_sermons" isPublic><Sermons /></FeatureRoute>} />
        <Route path="/vision" element={<Vision />} />
        {/* Member-only routes */}
        <Route path="/services" element={<FeatureRoute featureKey="page_services" isPublic><Services /></FeatureRoute>} />
        <Route path="/giving" element={<FeatureRoute featureKey="page_giving"><Giving /></FeatureRoute>} />
        <Route path="/volunteer" element={<FeatureRoute featureKey="page_volunteer"><Volunteer /></FeatureRoute>} />
        <Route path="/admin" element={<MemberRoute><Admin /></MemberRoute>} />
        <Route path="/community-support" element={<FeatureRoute featureKey="page_community_support"><CommunitySupport /></FeatureRoute>} />
        <Route path="/groups" element={<FeatureRoute featureKey="page_groups"><Groups /></FeatureRoute>} />
        <Route path="/schedule" element={<FeatureRoute featureKey="page_schedule" isPublic><Schedule /></FeatureRoute>} />
        <Route path="/milestones" element={<FeatureRoute featureKey="page_milestones" isPublic><Milestones /></FeatureRoute>} />
        <Route path="/carpool" element={<FeatureRoute featureKey="page_carpool"><Carpool /></FeatureRoute>} />
        <Route path="/memories" element={<FeatureRoute featureKey="page_memories"><Memories /></FeatureRoute>} />
        <Route path="/you" element={<MemberRoute><You /></MemberRoute>} />
        <Route path="/group-admin" element={<MemberRoute><GroupAdmin /></MemberRoute>} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <FeatureProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </FeatureProvider>
    </AuthProvider>
  )
}

export default App