import { useEffect, useState } from 'react';
import axios from 'axios';
import MonthlyGrid from '../components/MonthlyGrid';
import RewardAnimation from '../components/RewardAnimation';
import { LogOut, Flame, Award } from 'lucide-react';

export default function Dashboard({ setAuth }) {
  const [data, setData] = useState({ streak: 0, badges: [], dailyStatus: {} });
  const [loading, setLoading] = useState(true);
  const [showReward, setShowReward] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/habit/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleMarkToday = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/habit/mark', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const newBadges = res.data.badges.filter(b => !data.badges.includes(b));
      if (newBadges.length > 0) {
        setShowReward(newBadges[0]);
      }
      
      setData({
        streak: res.data.streak,
        badges: res.data.badges,
        dailyStatus: res.data.dailyStatus
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error marking today');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          StreakForge
        </h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
          <div className="bg-orange-500/20 p-4 rounded-full text-orange-400">
            <Flame size={32} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Current Streak</p>
            <p className="text-3xl font-bold">{data.streak} Days</p>
          </div>
        </div>
        
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-yellow-400" size={20} />
            <h2 className="font-semibold text-gray-300">Badges Earned</h2>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {data.badges.length === 0 ? (
              <span className="text-sm text-gray-500">No badges yet</span>
            ) : (
              data.badges.map(b => (
                <span key={b} className="px-3 py-1 bg-yellow-400/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-400/20">
                  {b}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {data.streak >= 180 && data.streak < 240 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center animate-pulse">
          <p className="text-xl font-medium text-white text-center">
            You are <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{240 - data.streak} days</span> away from becoming Legendary 👑
          </p>
        </div>
      )}

      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6">Consistency Grid</h2>
        <MonthlyGrid 
          dailyStatus={data.dailyStatus} 
          onMarkToday={handleMarkToday} 
        />
      </div>

      {showReward && (
        <RewardAnimation 
          badge={showReward} 
          onClose={() => setShowReward(null)} 
        />
      )}
    </div>
  );
}
