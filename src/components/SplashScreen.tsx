import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 800); // Wait for exit animation
        }, 3500);
        return () => clearTimeout(timer);
    }, [onFinish]);

    const title = "FILAMU TIMES";
    const letters = Array.from(title);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5
            }
        },
        exit: {
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    const letterVariants: Variants = {
        hidden: { 
            opacity: 0, 
            y: 30, 
            scale: 0.5,
            skewX: -20,
            filter: "blur(12px)"
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            skewX: 0,
            filter: "blur(0px)",
            transition: { 
                type: "spring", 
                damping: 8, 
                stiffness: 150 
            }
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-[#E50914]/10 rounded-full blur-[180px] animate-pulse" />
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#E50914]/10 rounded-full blur-[140px]" 
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-12">
                        <div className="flex flex-col items-center gap-8">
                            {/* Staggered Text Reveal */}
                            <div className="flex items-center gap-1.5 md:gap-3">
                                {letters.map((char, i) => (
                                    <motion.span
                                        key={i}
                                        variants={letterVariants}
                                        className={`text-6xl md:text-9xl font-black tracking-tighter select-none ${
                                            ['F', 'I', 'L', 'A', 'M', 'U'].includes(char) ? 'text-[#E50914]' : 'text-white'
                                        } drop-shadow-[0_0_30px_rgba(229,9,20,0.3)]`}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Cinematic Scanning Line */}
                            <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                                <motion.div 
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E50914] to-transparent shadow-[0_0_15px_#E50914]"
                                />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, letterSpacing: "1em" }}
                                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                                transition={{ delay: 1.5, duration: 1.5 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <span className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-widest text-center">
                                    Original Cinema
                                </span>
                                <div className="h-px w-8 bg-[#E50914]/50" />
                                <span className="text-[#E50914] text-[8px] font-black uppercase tracking-[0.8em]">
                                    Across Africa
                                </span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer Branding */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 2.5 }}
                        className="absolute bottom-16 flex items-center gap-4"
                    >
                        <div className="h-[1px] w-8 bg-white/20" />
                        <span className="text-gray-700 text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                             Member of the Originals Network
                        </span>
                        <div className="h-[1px] w-8 bg-white/20" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
