import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { SplashScreen as NativeSplashScreen } from '@capacitor/splash-screen';
import Home from './pages/Home.tsx';
import Movies from './pages/Movies.tsx';
import Login from './pages/Login.tsx';
import SignUp from './pages/SignUp.tsx';
import Profiles from './pages/Profiles.tsx';
import Account from './pages/Account.tsx';
import Admin from './pages/Admin.tsx';
import Watch from './pages/Watch.tsx';
import Search from './pages/Search.tsx';
import Trending from './pages/Trending.tsx';
import BottomNav from './components/BottomNav.tsx';
import Navbar from './components/Navbar.tsx';
import MobileHeader from './components/MobileHeader.tsx';
import { MovieProvider } from './context/MovieContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

// Internal component to handle hardware back button
const BackButtonHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handler = CapacitorApp.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
            if (location.pathname === '/' || location.pathname === '/login') {
                // Exit app if on Home or Login
                CapacitorApp.exitApp();
            } else if (canGoBack) {
                // Go back in router history
                window.history.back();
            } else {
                // Fallback to Home
                navigate('/');
            }
        });

        return () => {
            handler.then(h => { if (h) h.remove(); });
        };
    }, [navigate, location]);

    return null;
};

// Internal component to handle persistent immersive mode
const StatusBarHandler = () => {
    const location = useLocation();

    useEffect(() => {
        const hideStatus = async () => {
            if (Capacitor.isNativePlatform()) {
                try {
                    await StatusBar.hide();
                    // Just in case it's visible, ensure it's black
                    await StatusBar.setBackgroundColor({ color: '#000000' });
                    await StatusBar.setStyle({ style: Style.Dark }); 
                } catch (e) {
                    console.warn('Status bar hide failed:', e);
                }
            }
        };
        hideStatus();
    }, [location]);

    return null;
};

const AppContent: React.FC = () => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center gap-6 animate-pulse">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-black italic tracking-tighter text-[#FFB800] leading-none">
                            FILAMU
                        </h1>
                        <h1 className="text-4xl font-black italic tracking-tighter text-white leading-none">
                            TIMES
                        </h1>
                    </div>
                    <div className="w-10 h-10 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,184,0,0.3)]" />
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">Connecting to Filamu</p>
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent opacity-50" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <BackButtonHandler />
            <StatusBarHandler />
            
            <Navbar />
            <MobileHeader />
            <div className="flex flex-col min-h-screen border-t-[0px] border-transparent pt-0">
                <main className="flex-grow">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />

                        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
                        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                        <Route path="/profiles" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
                        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                        <Route path="/watch/:id" element={<ProtectedRoute><Watch /></ProtectedRoute>} />
                        <Route path="/trending" element={<ProtectedRoute><Trending /></ProtectedRoute>} />
                        
                        <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <BottomNav />
            </div>
        </Router>
    );
};

const App: React.FC = () => {
    useEffect(() => {
        const hideSystemUI = async () => {
            if (Capacitor.isNativePlatform()) {
                try {
                    await StatusBar.hide();
                    await NativeSplashScreen.hide();
                } catch (e) {
                    console.warn('System UI interaction failed:', e);
                }
            }
        };
        
        hideSystemUI();
    }, []);

    return (
        <AuthProvider>
            <MovieProvider>
                <AppContent />
            </MovieProvider>
        </AuthProvider>
    );
};

export default App;
