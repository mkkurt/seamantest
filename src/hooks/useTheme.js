import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  // Get system preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Get time-based theme (6 AM - 6 PM = light, otherwise dark)
  const getTimeBasedTheme = () => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? 'light' : 'dark';
  };

  // Auto-detect theme based on system preference and time
  const getAutoTheme = () => {
    const systemTheme = getSystemTheme();
    const timeBasedTheme = getTimeBasedTheme();
    
    // Prioritize system preference, but fall back to time-based if system is light during night hours
    if (systemTheme === 'dark') return 'dark';
    if (timeBasedTheme === 'dark' && systemTheme === 'light') {
      // During night hours, prefer dark even if system prefers light
      const hour = new Date().getHours();
      if (hour >= 20 || hour < 6) return 'dark';
    }
    return systemTheme;
  };

  // Apply theme to document
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    let themeToApply = newTheme;
    if (newTheme === 'system') {
      themeToApply = getAutoTheme();
    }
    
    root.classList.add(themeToApply);
    setResolvedTheme(themeToApply);
  }, []);

  // Initialize theme from localStorage or system
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update theme every hour for time-based detection
  useEffect(() => {
    if (theme === 'system') {
      const interval = setInterval(() => {
        applyTheme('system');
      }, 60 * 60 * 1000); // Check every hour

      return () => clearInterval(interval);
    }
  }, [theme]);

  const setThemePreference = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setThemePreference(newTheme);
  };

  const value = {
    theme,
    resolvedTheme,
    setTheme: setThemePreference,
    toggleTheme,
    isSystem: theme === 'system'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};