import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Trophy, Star, Shield, Diamond, Award } from 'lucide-react';

export default function RewardAnimation({ badge, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (badge) {
      case 'Bronze': return <Shield size={80} className="text-orange-400" />;
      case 'Silver': return <Star size={80} className="text-gray-300" />;
      case 'Gold': return <Trophy size={80} className="text-yellow-400" />;
      case 'Diamond': return <Diamond size={80} className="text-cyan-400" />;
      default: return <Award size={80} className="text-yellow-400" />;
    }
  };

  const getColors = () => {
    switch (badge) {
      case 'Bronze': return 'from-orange-600 to-orange-400 shadow-[0_0_50px_rgba(251,146,60,0.5)]';
      case 'Silver': return 'from-gray-400 to-gray-200 shadow-[0_0_50px_rgba(209,213,219,0.5)]';
      case 'Gold': return 'from-yellow-600 to-yellow-300 shadow-[0_0_50px_rgba(253,224,71,0.5)]';
      case 'Diamond': return 'from-cyan-600 to-cyan-300 shadow-[0_0_50px_rgba(103,232,249,0.5)]';
      default: return 'from-yellow-600 to-yellow-300';
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.5, y: 50, rotate: -10 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="flex flex-col items-center justify-center p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div 
            animate={{ 
              rotateY: [0, 360],
              y: [0, -10, 0] 
            }}
            transition={{ 
              rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className={`w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br ${getColors()} p-1 mb-8 relative`}
          >
            <div className="absolute inset-1 bg-black/80 rounded-full flex items-center justify-center backdrop-blur-sm">
              {getIcon()}
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-2 text-white"
          >
            Milestone Reached!
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300"
          >
            You've unlocked the <span className="font-bold text-white">{badge}</span> badge
          </motion.p>
        </motion.div>
        
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: "50vw",
              y: "50vh",
              opacity: 1,
              scale: Math.random() * 1 + 0.5
            }}
            animate={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              opacity: 0,
            }}
            transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
            className={`absolute w-3 h-3 rounded-full ${
              ['bg-blue-500', 'bg-yellow-400', 'bg-emerald-400', 'bg-pink-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]
            }`}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
