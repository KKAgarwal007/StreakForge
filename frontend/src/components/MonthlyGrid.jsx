import { Check, X, Lock, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MonthlyGrid({ dailyStatus, onMarkToday }) {
  const [gridData, setGridData] = useState([]);
  
  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate current month grid
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Find the starting day of the week (0 = Sunday)
    const startOffset = firstDayOfMonth.getDay(); 
    
    const totalCells = startOffset + lastDayOfMonth.getDate();
    const gridRows = Math.ceil(totalCells / 7);
    const cells = gridRows * 7;
    
    const newGridData = [];
    
    for (let i = 0; i < cells; i++) {
      if (i < startOffset || i >= totalCells) {
        newGridData.push(null); // empty cells
      } else {
        const dateNum = i - startOffset + 1;
        const cellDate = new Date(year, month, dateNum);
        cellDate.setHours(0, 0, 0, 0);
        
        const dateStr = getLocalDateString(cellDate);
        const status = dailyStatus[dateStr];
        
        const isToday = cellDate.getTime() === today.getTime();
        const isPast = cellDate.getTime() < today.getTime();
        
        let state = 'future';
        if (isToday) {
          if (status === 'done') state = 'completed';
          else if (status === 'leave') state = 'leave';
          else state = 'today';
        } else if (isPast) {
          if (status === 'done') state = 'completed';
          else if (status === 'leave') state = 'leave';
          else if (status === 'missed') state = 'missed';
          else state = 'locked'; // past and not marked
        }
        
        newGridData.push({
          date: dateNum,
          dateStr,
          state,
          isToday
        });
      }
    }
    setGridData(newGridData);
  }, [dailyStatus]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {gridData.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="aspect-square rounded-xl bg-transparent" />;
          }
          
          let bgColor = "bg-gray-800/50 border-gray-700 text-gray-400"; // default/future
          let icon = null;
          let interactable = false;
          
          if (cell.state === 'today') {
            bgColor = "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] ring-1 ring-blue-500/30";
          } else if (cell.state === 'completed') {
            bgColor = "bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/50";
            icon = <Check size={20} />;
          } else if (cell.state === 'leave') {
            bgColor = "bg-orange-500/20 border-orange-500/50 text-orange-400 ring-1 ring-orange-500/50";
            icon = <Moon size={18} />;
          } else if (cell.state === 'missed') {
            bgColor = "bg-red-500/10 border-red-500/30 text-red-400/70";
            icon = <X size={20} />;
          } else if (cell.state === 'locked') {
            bgColor = "bg-gray-900 border-gray-800 text-gray-600 opacity-70";
            icon = <Lock size={16} />;
          }
          
          return (
            <div 
              key={cell.dateStr}
              className={`aspect-square rounded-xl md:rounded-2xl border flex flex-col items-center justify-center relative overflow-hidden group ${bgColor}`}
            >
              <span className={`text-sm md:text-lg font-bold z-10 ${icon ? 'opacity-30' : ''}`}>
                {cell.date}
              </span>
              {icon && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  {icon}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
