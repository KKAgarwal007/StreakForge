import { useEffect, useState } from 'react';
import axios from 'axios';
import MonthlyGrid from '../components/MonthlyGrid';
import RewardAnimation from '../components/RewardAnimation';
import { LogOut, Flame, Award, Activity, CheckCircle, PauseCircle } from 'lucide-react';

export default function Dashboard({ setAuth }) {
  const [data, setData] = useState({ streak: 0, badges: [], dailyStatus: {}, consistency: 0 });
  const [loading, setLoading] = useState(true);
  const [showReward, setShowReward] = useState(null);

  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayStr = getLocalDateString();
  const todayStatus = data.dailyStatus[todayStr];

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

  const handleAction = async (action) => {
    if (action === 'leave') {
      const confirm = window.confirm("Your streak will continue, but your consistency score will decrease. Apply Leave?");
      if (!confirm) return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/habit/mark', { action }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const newBadges = res.data.badges.filter(b => !data.badges.includes(b));
      if (newBadges.length > 0) {
        setShowReward(newBadges[0]);
      }
      
      setData({
        streak: res.data.streak,
        badges: res.data.badges,
        dailyStatus: res.data.dailyStatus,
        consistency: res.data.consistency
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing action');
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
        
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-blue-400" size={20} />
            <h2 className="font-semibold text-gray-300">Consistency</h2>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold">{Math.floor((data.consistency || 0) * 10000) / 100}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  (data.consistency || 0) >= 0.8 ? 'bg-emerald-500' : 
                  (data.consistency || 0) >= 0.6 ? 'bg-yellow-400' : 'bg-red-500'
                }`} 
                style={{ width: `${Math.floor((data.consistency || 0) * 10000) / 100}%` }}
              ></div>
            </div>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Consistency Grid</h2>
          {!todayStatus && (
            <div className="flex gap-3">
              <button 
                onClick={() => handleAction('done')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-xl font-medium transition-colors cursor-pointer"
                title="Mark today as Done"
              >
                <CheckCircle size={18} /> Mark Done
              </button>
              <button 
                onClick={() => handleAction('leave')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/50 rounded-xl font-medium transition-colors cursor-pointer"
                title="Apply Leave"
              >
                <PauseCircle size={18} /> Apply Leave
              </button>
            </div>
          )}
          {todayStatus === 'done' && (
             <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-medium flex items-center gap-2">
               <CheckCircle size={18} /> Completed Today
             </div>
          )}
          {todayStatus === 'leave' && (
             <div className="px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl font-medium flex items-center gap-2">
               <PauseCircle size={18} /> Leave Applied
             </div>
          )}
        </div>
        <MonthlyGrid 
          dailyStatus={data.dailyStatus} 
          onMarkToday={() => handleAction('done')} 
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
