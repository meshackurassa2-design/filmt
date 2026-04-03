import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
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
import SplashScreen from './components/SplashScreen.tsx';
import BottomNav from './components/BottomNav.tsx';
import Navbar from './components/Navbar.tsx';
import MobileHeader from './components/MobileHeader.tsx';
import { MovieProvider } from './context/MovieContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
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
                    await StatusBar.setStyle({ style: 'DARK' as any }); // 'DARK' = dark content on light bg, 'LIGHT' = light content on dark bg. Capacitor 5/6 uses 'Dark' and 'Light'. Actually it depends on the version. Let's use 'DARK' (white text) for black bg.
                } catch (e) {
                    console.warn('Status bar hide failed:', e);
                }
            }
        };
        hideStatus();
    }, [location]);

    return null;
};

const App: React.FC = () => {
    const [showSplash, setShowSplash] = React.useState(() => {
        return !sessionStorage.getItem('filamu_splash_shown');
    });

    useEffect(() => {
        if (showSplash) {
            sessionStorage.setItem('filamu_splash_shown', 'true');
        }
        
        // Global Immersive Mode (Fullscreen)
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
    }, [showSplash]);

    return (
        <AuthProvider>
            <MovieProvider>
                {showSplash ? (
                   <SplashScreen onFinish={() => setShowSplash(false)} />
                ) : (
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

                                    {/* Protected Routes */}
                                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                                    <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
                                    <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                                    <Route path="/profiles" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
                                    <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                                    <Route path="/watch/:id" element={<ProtectedRoute><Watch /></ProtectedRoute>} />
                                    <Route path="/trending" element={<ProtectedRoute><Trending /></ProtectedRoute>} />
                                    
                                    {/* Admin Route */}
                                    <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />

                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </main>
                            <BottomNav />
                        </div>
                    </Router>
                 )}
            </MovieProvider>
        </AuthProvider>
    );
};

export default App;
