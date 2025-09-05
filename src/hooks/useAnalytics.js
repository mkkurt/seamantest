import { useEffect } from 'react';

// Google Analytics 4 configuration
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'secure;samesite=none',
  });
};

// Track page views
export const trackPageView = (path, title) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
};

// Track custom events
export const trackEvent = (action, category = 'general', label = '', value = 0) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track quiz events
export const trackQuizStart = (category, testType) => {
  trackEvent('quiz_start', 'quiz', `${category}_${testType}`);
};

export const trackQuizComplete = (category, testType, score, totalQuestions) => {
  trackEvent('quiz_complete', 'quiz', `${category}_${testType}`, score);
  trackEvent('quiz_score', 'quiz', `${category}_${testType}`, Math.round((score / totalQuestions) * 100));
};

export const trackAnswerSubmitted = (category, questionId, isCorrect) => {
  trackEvent('answer_submitted', 'quiz', `${category}_q${questionId}_${isCorrect ? 'correct' : 'incorrect'}`);
};

export const trackThemeChange = (theme) => {
  trackEvent('theme_change', 'ui', theme);
};

export const trackLanguageChange = (language) => {
  trackEvent('language_change', 'ui', language);
};

// Privacy-friendly analytics hook
export const useAnalytics = () => {
  useEffect(() => {
    // Only initialize if user hasn't opted out
    const hasOptedOut = localStorage.getItem('analytics-opt-out') === 'true';
    if (!hasOptedOut) {
      initGA();
    }
  }, []);

  const optOut = () => {
    localStorage.setItem('analytics-opt-out', 'true');
    // Disable existing tracking
    if (window.gtag) {
      window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
    }
  };

  const optIn = () => {
    localStorage.removeItem('analytics-opt-out');
    initGA();
  };

  return {
    trackPageView,
    trackEvent,
    trackQuizStart,
    trackQuizComplete,
    trackAnswerSubmitted,
    trackThemeChange,
    trackLanguageChange,
    optOut,
    optIn,
  };
};