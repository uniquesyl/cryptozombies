import React, { useState, useEffect } from 'react';

const CooldownTimer = ({ readyTime, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const readyTimeNum = parseInt(readyTime);
      const remaining = Math.max(0, readyTimeNum - now);
      
      setTimeLeft(remaining);
      setIsReady(remaining <= 0);
    };

    // 立即更新一次
    updateTimer();

    // 每秒更新一次
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [readyTime]);

  if (isReady) {
    return (
      <div className={`text-xs text-green-600 ${className}`}>
        ✅ 准备就绪
      </div>
    );
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`text-xs text-red-600 ${className}`}>
      ⏰ 冷却中: {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default CooldownTimer; 