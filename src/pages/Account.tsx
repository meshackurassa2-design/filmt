import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Camera, 
  ChevronLeft,
  Trash2,
  Settings as SettingsIcon,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
const maleDefault = '/avatars/male-black-avatar.png';
const femaleDefault = '/avatars/female-black-avatar.png';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
}

const Account: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, isAdmin, signOut } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [uploading, setUploading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showKeyForm, setShowKeyForm] = useState(false);

    const fetchNotifications = React.useCallback(async () => {
        if (!user) return;
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        if (data) setNotifications(data as Notification[]);
    }, [user]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const getProfileImage = () => {
        if (profile?.avatar_url) return profile.avatar_url;
        if (profile?.gender?.toLowerCase() === 'female') return femaleDefault;
        return maleDefault;
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file || !user) return;

            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
            
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: data.publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;
            
            window.location.reload();
        } catch (err: unknown) {
            const error = err as Error;
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) {
            alert('Security Update Failed: ' + error.message);
        } else {
            alert('Success: Access Key Updated!');
            setNewPassword('');
            setShowKeyForm(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#E50914]">
            {/* Minimal Header */}
            <div className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] px-6 pb-6 flex items-center justify-between transition-all bg-black/80 backdrop-blur-xl border-b border-white/5`}>
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="font-black tracking-widest text-[10px] uppercase">Filamu Times</span>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="pt-[calc(env(safe-area-inset-top)+6rem)] pb-[calc(env(safe-area-inset-bottom)+8rem)] max-w-2xl mx-auto">
                {/* Profile Mastery */}
                <div className="px-6 flex flex-col items-center mb-12">
                     <div className="relative group mb-4">
                        <div className="w-28 h-28 rounded-md overflow-hidden border-2 border-white/10 group-hover:border-white transition-all shadow-2xl">
                            <img src={getProfileImage()} alt="Me" className={`w-full h-full object-cover ${uploading ? 'opacity-30' : ''}`} />
                            {uploading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}
                        </div>
                        <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 active:scale-95 transition-all">
                            <Camera className="w-4 h-4" />
                            <input type="file" className="hidden" onChange={handleAvatarUpload} />
                        </label>
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">{profile?.username || user?.email?.split('@')[0]}</h2>
                    <p className="text-zinc-500 font-bold text-[10px] tracking-widest uppercase">{user?.email}</p>
                    
                    {isAdmin && (
                        <div className="mt-4 px-3 py-1 bg-primary text-black text-[8px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(255,184,0,0.4)] flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" /> NETWORK ADMIN
                        </div>
                    )}
                </div>

                {/* Settings List */}
                <div className="space-y-1">
                    <div className="px-6 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Account & Security</div>
                    
                    <button 
                        onClick={() => setShowKeyForm(!showKeyForm)}
                        className="w-full flex items-center justify-between px-6 py-5 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all border-y border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block font-black text-xs uppercase tracking-tight text-zinc-200">Access Key</span>
                                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Update your biometric/password key</span>
                            </div>
                        </div>
                        <SettingsIcon className={`w-4 h-4 text-zinc-600 transition-transform ${showKeyForm ? 'rotate-90 text-primary' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showKeyForm && (
                            <motion.form 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                onSubmit={handlePasswordChange}
                                className="px-6 py-8 bg-zinc-900/60 border-b border-white/5 overflow-hidden"
                            >
                                <div className="flex gap-2">
                                    <input 
                                        type="password" 
                                        placeholder="NEW SECURITY KEY"
                                        className="flex-1 bg-black p-4 rounded-lg border border-white/10 text-white font-black text-[10px] uppercase outline-none focus:border-primary/50"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button className="px-6 rounded-lg bg-primary text-black font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                                        Update
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <button 
                        onClick={() => navigate('/profiles')}
                        className="w-full flex items-center justify-between px-6 py-5 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all border-b border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block font-black text-xs uppercase tracking-tight text-zinc-200">Profile Switcher</span>
                                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Manage sub-operator profiles</span>
                            </div>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-zinc-600 rotate-180" />
                    </button>

                    <div className="pt-8 px-6 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Network Health</div>
                    
                    <div className="px-6 py-1 space-y-2">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div key={n.id} className="p-4 bg-zinc-900/20 rounded-xl border border-white/5 flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-white uppercase tracking-tight">{n.title}</p>
                                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{n.message}</p>
                                    </div>
                                    <button 
                                        onClick={async () => {
                                            await supabase.from('notifications').delete().eq('id', n.id);
                                            fetchNotifications();
                                        }}
                                        className="p-2 text-zinc-800 hover:text-[#E50914] transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center opacity-20">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Logs Found</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 px-6">
                        <button 
                            onClick={handleSignOut}
                            className="w-full py-5 rounded-xl bg-zinc-900 text-zinc-400 font-black text-[10px] uppercase tracking-[0.5em] hover:bg-primary hover:text-black transition-all shadow-xl"
                        >
                            <LogOut className="w-4 h-4 mr-2 inline" />
                            Log Out from Network
                        </button>
                        <p className="mt-8 text-center text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">Ver 8.0.2 Cinematic Discovery</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
