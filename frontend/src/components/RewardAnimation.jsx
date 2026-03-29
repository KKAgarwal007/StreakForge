import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Shield, Diamond, Award } from 'lucide-react';

export default function RewardAnimation({ badge, onClose }) {
  const getIcon = () => {
    if (badge.includes('Bronze')) return <Shield size={70} className="text-orange-100 drop-shadow-md" />;
    if (badge.includes('Silver')) return <Star size={70} className="text-white drop-shadow-md" />;
    if (badge.includes('Gold')) return <Trophy size={70} className="text-yellow-50 drop-shadow-md" />;
    if (badge.includes('Diamond')) return <Diamond size={70} className="text-cyan-50 drop-shadow-md" />;
    if (badge.includes('Legendary')) return <Award size={70} className="text-purple-100 drop-shadow-md" />;
    return <Award size={70} className="text-yellow-50 drop-shadow-md" />;
  };

  const getColors = () => {
    if (badge.includes('Bronze')) return 'from-amber-700 via-orange-500 to-amber-800 border-orange-400/50 shadow-[0_0_50px_rgba(217,119,6,0.6),inset_0_0_20px_rgba(255,255,255,0.3)]';
    if (badge.includes('Silver')) return 'from-slate-400 via-gray-200 to-slate-500 border-gray-100/50 shadow-[0_0_50px_rgba(209,213,219,0.6),inset_0_0_20px_rgba(255,255,255,0.5)]';
    if (badge.includes('Gold')) return 'from-yellow-600 via-yellow-300 to-yellow-600 border-yellow-200/60 shadow-[0_0_50px_rgba(253,224,71,0.6),inset_0_0_20px_rgba(255,255,255,0.6)]';
    if (badge.includes('Diamond')) return 'from-cyan-500 via-cyan-200 to-blue-500 border-cyan-100/60 shadow-[0_0_50px_rgba(103,232,249,0.6),inset_0_0_20px_rgba(255,255,255,0.6)]';
    if (badge.includes('Legendary')) return 'from-fuchsia-600 via-purple-400 to-fuchsia-600 border-purple-300/60 shadow-[0_0_50px_rgba(192,38,211,0.6),inset_0_0_20px_rgba(255,255,255,0.6)]';
    return 'from-yellow-600 via-yellow-300 to-yellow-600 border-yellow-200/60 shadow-[0_0_50px_rgba(253,224,71,0.6),inset_0_0_20px_rgba(255,255,255,0.6)]';
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden"
        onClick={onClose}
      >
        {/* Continuous Rainfall Confetti */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(120)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${Math.random() * 100}vw`,
                y: -100,
                opacity: 0,
                rotate: Math.random() * 360,
                scale: Math.random() * 0.8 + 0.4
              }}
              animate={{
                y: "110vh",
                opacity: [0, 1, 1, 0],
                rotate: Math.random() * 720
              }}
              transition={{
                duration: 0.8 + Math.random() * 1.5,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "linear"
              }}
              className={`absolute w-2 h-6 rounded-sm ${
                ['bg-blue-500', 'bg-yellow-400', 'bg-emerald-400', 'bg-pink-500', 'bg-purple-500', 'bg-red-500'][Math.floor(Math.random() * 6)]
              }`}
            />
          ))}
        </div>

        <motion.div 
          initial={{ scale: 0.5, y: 50, rotate: -10 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="flex flex-col items-center justify-center p-8 text-center relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div 
            animate={{ 
              rotateY: [0, 360],
              y: [0, -10, 0] 
            }}
            transition={{ 
              rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="mb-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className={`w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br border-[4px] relative ${getColors()}`}>
              {/* Embossed inner rim */}
              <div className="absolute inset-2 rounded-full border-2 border-white/20 bg-gradient-to-tr from-black/20 to-transparent"></div>
              {/* Highlight to make it shiny */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full mix-blend-overlay"></div>
              {/* Icon Container */}
              <div className="relative z-10 p-4 rounded-full bg-gradient-to-b from-white/10 to-black/20 shadow-inner">
                {getIcon()}
              </div>
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-2 text-white drop-shadow-lg"
          >
            Milestone Reached!
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-200 drop-shadow-md"
          >
            You've unlocked the <span className="font-bold text-white text-2xl mx-1">{badge}</span> badge!
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1 }}
            className="mt-8 text-sm text-gray-400 font-medium"
          >
            Click anywhere to continue
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
