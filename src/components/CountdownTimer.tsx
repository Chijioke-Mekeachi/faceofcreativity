import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, label = 'Voting Closes In' }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = Math.max(0, target - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center">
      {label && (
        <span className="text-xs text-[#E5A93C] font-semibold mb-2">
          {label}
        </span>
      )}
      <div className="flex items-center gap-2 sm:gap-3">
        {[
          { label: 'Days', val: timeLeft.days },
          { label: 'Hours', val: timeLeft.hours },
          { label: 'Mins', val: timeLeft.minutes },
          { label: 'Secs', val: timeLeft.seconds }
        ].map((unit, idx) => (
          <React.Fragment key={unit.label}>
            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-inner">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {String(unit.val).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1.5 font-medium">
                {unit.label}
              </span>
            </div>
            {idx < 3 && <span className="text-zinc-600 font-bold text-xl mb-4">:</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
