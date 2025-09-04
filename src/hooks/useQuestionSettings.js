import { createContext, useContext, useEffect, useState } from 'react';

const QuestionSettingsContext = createContext();

export const useQuestionSettings = () => {
  const context = useContext(QuestionSettingsContext);
  if (!context) {
    throw new Error('useQuestionSettings must be used within a QuestionSettingsProvider');
  }
  return context;
};

export const QuestionSettingsProvider = ({ children }) => {
  const [avoidRepeatQuestions, setAvoidRepeatQuestions] = useState(true);

  // Load setting from localStorage on mount
  useEffect(() => {
    const savedSetting = localStorage.getItem('avoidRepeatQuestions');
    if (savedSetting !== null) {
      setAvoidRepeatQuestions(JSON.parse(savedSetting));
    }
  }, []);

  const setAvoidRepeatQuestionsPreference = (newValue) => {
    setAvoidRepeatQuestions(newValue);
    localStorage.setItem('avoidRepeatQuestions', JSON.stringify(newValue));
  };

  const value = {
    avoidRepeatQuestions,
    setAvoidRepeatQuestions: setAvoidRepeatQuestionsPreference,
  };

  return (
    <QuestionSettingsContext.Provider value={value}>
      {children}
    </QuestionSettingsContext.Provider>
  );
};