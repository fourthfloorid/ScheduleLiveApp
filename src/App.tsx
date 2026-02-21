import { useState, useEffect } from 'react';
import Login from './imports/Login';
import Dashboard from './components/Dashboard';
import SignupModal from './components/SignupModal';
import WelcomeGuide from './components/WelcomeGuide';
import { ErrorBoundary } from './components/ErrorBoundary';
import { authAPI, setAuthToken, getAuthToken } from './utils/api';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

export type UserRole = 'host' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  photoUrl?: string;
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('[App] Starting session check...');
        const token = getAuthToken();
        if (token) {
          console.log('[App] Found existing token, checking session...');
          const supabase = createClient(
            `https://${projectId}.supabase.co`,
            publicAnonKey
          );
          
          const { data: { user }, error } = await supabase.auth.getUser(token);
          
          if (user && !error) {
            console.log('[App] Session valid, restoring user:', user.id);
            setCurrentUser({
              id: user.id,
              email: user.email || '',
              role: user.user_metadata?.role || 'host',
              name: user.user_metadata?.name || user.email || 'User',
              photoUrl: user.user_metadata?.photoUrl
            });
          } else {
            console.log('[App] Session invalid or expired, clearing token');
            setAuthToken(null);
          }
        } else {
          console.log('[App] No existing token found');
        }
      } catch (error) {
        console.error('[App] Session check error:', error);
        setAuthToken(null);
        setError('Failed to restore session. Please login again.');
      } finally {
        console.log('[App] Session check complete, setting isLoading to false');
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, session } = await authAPI.signin(email, password);
      
      // Set the access token for authenticated API calls
      if (session?.access_token) {
        console.log('Login successful, setting access token');
        setAuthToken(session.access_token);
      } else {
        console.error('No access token received from login:', { user, session });
      }
      
      setCurrentUser({
        id: user.id,
        email: user.email || '',
        role: user.user_metadata?.role || 'host',
        name: user.user_metadata?.name || user.email || 'User',
        photoUrl: user.user_metadata?.photoUrl
      });
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      await authAPI.signup(email, password, name, role);
      alert('Account created successfully! Please sign in.');
      setShowSignup(false);
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Show loading screen while checking session
  if (isLoading && !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    console.log('[App] Rendering login screen');
    return (
      <>
        <div className="bg-white relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0 overflow-auto p-4 md:p-6 flex items-start justify-center pt-4 md:pt-12">
            <div className="w-full max-w-2xl">
              <WelcomeGuide />
            </div>
          </div>
          <Login onLogin={handleLogin} onSignupClick={() => setShowSignup(true)} isLoading={isLoading} />
        </div>
        {showSignup && (
          <SignupModal
            onSignup={handleSignup}
            onClose={() => setShowSignup(false)}
            isLoading={isLoading}
          />
        )}
      </>
    );
  }

  console.log('[App] Rendering dashboard');
  return <Dashboard user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
}

export default function App() {
  console.log('[App] Rendering App component...');
  
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}