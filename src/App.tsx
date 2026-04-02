import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import Home from './pages/Home.tsx';
import Movies from './pages/Movies.tsx';
import TVShows from './pages/TVShows.tsx';
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
import { MovieProvider } from './context/MovieContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import VideoPlayer from './components/VideoPlayer.tsx';

// Internal component to handle hardware back button
const BackButtonHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handler = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
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
            handler.then(h => h.remove());
        };
    }, [navigate, location]);

    return null;
};

const App: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <AuthProvider>
            <MovieProvider>
                {showSplash ? (
                    <SplashScreen onFinish={() => setShowSplash(false)} />
                ) : (
                    <Router>
                        <BackButtonHandler />
                        <Navbar />
                        <div className="flex flex-col min-h-screen">
                            <main className="flex-grow">
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<SignUp />} />

                                    {/* Protected Routes */}
                                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                                    <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
                                    <Route path="/tvshows" element={<ProtectedRoute><TVShows /></ProtectedRoute>} />
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
                        <VideoPlayer />
                    </Router>
                )}
            </MovieProvider>
        </AuthProvider>
    );
};

export default App;
