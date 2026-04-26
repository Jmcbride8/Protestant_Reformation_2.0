import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import PageLayout from './components/layout/PageLayout';
import MemberRoute from './components/MemberRoute';
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
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sermons" element={<Sermons />} />
        <Route path="/vision" element={<Vision />} />
        {/* Member-only routes */}
        <Route path="/services" element={<MemberRoute><Services /></MemberRoute>} />
        <Route path="/giving" element={<MemberRoute><Giving /></MemberRoute>} />
        <Route path="/volunteer" element={<MemberRoute><Volunteer /></MemberRoute>} />
        <Route path="/admin" element={<MemberRoute><Admin /></MemberRoute>} />
        <Route path="/community-support" element={<MemberRoute><CommunitySupport /></MemberRoute>} />
        <Route path="/groups" element={<MemberRoute><Groups /></MemberRoute>} />
        <Route path="/schedule" element={<MemberRoute><Schedule /></MemberRoute>} />
        <Route path="/milestones" element={<MemberRoute><Milestones /></MemberRoute>} />
        <Route path="/carpool" element={<MemberRoute><Carpool /></MemberRoute>} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App