import React, { useEffect, useState } from 'react';

const GlassAlert = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Entry animation
    setIsVisible(true);

    // Auto-dismiss
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const getAlertClasses = () => {
    const baseClasses = `
      fixed top-6 right-6 z-50
      w-[320px]
      rounded-xl
      px-5 py-4
      text-[#F8FAFC]
      backdrop-blur-xl
      bg-[rgba(30,41,59,0.4)]
      border-t border-white/20
      border-b border-black/30
      shadow-[0_20px_50px_rgba(0,0,0,0.5),0_5px_15px_rgba(0,0,0,0.8),0_0_25px_rgba(99,102,241,0.15)]
      transition-all duration-300 ease-in-out
    `;

    const typeClasses = {
      info: 'border-l-4 border-l-indigo-400 ring-1 ring-indigo-400/30',
      success: 'border-l-4 border-l-emerald-400 ring-1 ring-emerald-400/30',
      warning: 'border-l-4 border-l-amber-400 ring-1 ring-amber-400/30',
      error: 'border-l-4 border-l-red-400 ring-1 ring-red-400/30'
    };

    const animationClasses = isVisible 
      ? (isExiting ? 'translate-x-full scale-95 opacity-0' : 'translate-x-0 scale-100 opacity-100')
      : 'translate-x-full scale-95 opacity-0';

    return `${baseClasses} ${typeClasses[type]} ${animationClasses}`;
  };

  const getIcon = () => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || icons.info;
  };

  return (
    <div
      className={`${getAlertClasses()} animate-alert`}
      onMouseEnter={(e) => {
        e.currentTarget.classList.remove('translate-x-0', 'scale-100');
        e.currentTarget.classList.add('-translate-x-1', 'scale-105');
        e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.6), 0 8px 20px rgba(0, 0, 0, 0.9), 0 0 35px rgba(99, 102, 241, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.classList.remove('-translate-x-1', 'scale-105');
        e.currentTarget.classList.add('translate-x-0', 'scale-100');
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.8), 0 0 25px rgba(99, 102, 241, 0.15)';
      }}
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-[-2px] rounded-[14px] bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.1),transparent_70%)] pointer-events-none -z-10" />
      
      <div className="flex items-center gap-3">
        <span className="text-lg flex-shrink-0">{getIcon()}</span>
        <span className="text-sm leading-[1.4] break-words">
          {message}
        </span>
      </div>
      
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="
          absolute top-2 right-2
          bg-white/10 border border-white/20
          rounded-md
          text-[#F8FAFC]
          w-6 h-6
          flex items-center justify-center
          cursor-pointer
          text-xs
          transition-all duration-200
          hover:bg-white/20 hover:scale-110
        "
      >
        ×
      </button>
    </div>
  );
};

export default GlassAlert;
