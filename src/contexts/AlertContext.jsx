import React, { createContext, useContext, useState, useCallback } from 'react';
import GlassAlert from '../components/GlassAlert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newAlert = { id, message, type, duration };
    
    setAlerts(prev => [...prev, newAlert]);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  // Enhanced alert methods for different types
  const alert = {
    info: (message, duration) => showAlert(message, 'info', duration),
    success: (message, duration) => showAlert(message, 'success', duration),
    warning: (message, duration) => showAlert(message, 'warning', duration),
    error: (message, duration) => showAlert(message, 'error', duration),
    // Default method for backward compatibility
    show: showAlert
  };

  return (
    <AlertContext.Provider value={alert}>
      {children}
      {alerts.map((alertItem) => (
        <GlassAlert
          key={alertItem.id}
          message={alertItem.message}
          type={alertItem.type}
          duration={alertItem.duration}
          onClose={() => removeAlert(alertItem.id)}
        />
      ))}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
