import React, { useState } from 'react';

const tabs = ['Movies', 'Series', 'Cartoons', 'Featured', 'New'];

const HeaderTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Movies');

    return (
        <div className="w-full h-16 flex items-center bg-transparent mt-4 mb-2 overflow-hidden">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-6 max-w-full">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase border transition-all duration-300 flex-shrink-0 ${
                                isActive 
                                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                                : 'bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10'
                            }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default HeaderTabs;
