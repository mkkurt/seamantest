import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const StoreContext = createContext();

const initialState = {
  categories: {},
  questions: [],
  answers: {},
  selectedCategory: "",
  selectedTest: "",
  showResults: false,
  quizMode: "standard",
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };
    case "SET_ANSWERS":
      return { ...state, answers: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_SELECTED_TEST":
      return { ...state, selectedTest: action.payload };
    case "SET_SHOW_RESULTS":
      return { ...state, showResults: action.payload };
    case "SET_QUIZ_MODE":
      return { ...state, quizMode: action.payload };
    case "RESET_ANSWERS":
      return { ...state, answers: {} };
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };
    case "LOGIN_FAIL":
    case "REGISTER_FAIL":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const importAll = (r) => {
      let categories = {};
      r.keys().forEach((key) => {
        const [, category, file] = key.split("/");
        const testName = file.replace(".json", "");
        if (!categories[category]) {
          categories[category] = { tests: {}, allQuestions: [] };
        }
        const testQuestions = r(key);
        categories[category].tests[testName] = testQuestions;
        categories[category].allQuestions.push(...testQuestions);
      });
      return categories;
    };

    const testFiles = importAll(require.context("./tests", true, /\.json$/));
    const sortedCategories = Object.keys(testFiles)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, key) => {
        acc[key] = {
          tests: Object.keys(testFiles[key].tests)
            .sort((a, b) => {
              const idA = parseInt(a.match(/\d+/)[0]);
              const idB = parseInt(b.match(/\d+/)[0]);
              return idA - idB;
            })
            .reduce((testsAcc, test) => {
              testsAcc[test] = testFiles[key].tests[test];
              return testsAcc;
            }, {}),
          allQuestions: testFiles[key].allQuestions,
        };
        return acc;
      }, {});

    dispatch({ type: "SET_CATEGORIES", payload: sortedCategories });
  }, []);

  // Load a specific test or all questions for a category
  const loadTest = (category, testName) => {
    if (testName === "All Questions") {
      dispatch({
        type: "SET_QUESTIONS",
        payload: state.categories[category].allQuestions,
      });
    } else {
      dispatch({
        type: "SET_QUESTIONS",
        payload: state.categories[category].tests[testName],
      });
    }
    dispatch({ type: "RESET_ANSWERS" });
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, isCorrect, selectedAnswer) => {
    dispatch({
      type: "SET_ANSWERS",
      payload: {
        ...state.answers,
        [questionId]: { isCorrect, selectedAnswer },
      },
    });
  };

  // Calculate results
  const calculateResults = () => {
    return Object.values(state.answers).filter((ans) => ans.isCorrect).length;
  };

  // Authentication functions
  const register = async (username, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        username,
        password,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: res.data.token, user: { username } },
      });
    } catch (error) {
      dispatch({ type: "REGISTER_FAIL", payload: error.response.data.message });
    }
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: res.data.token, user: { username } },
      });
    } catch (error) {
      dispatch({ type: "LOGIN_FAIL", payload: error.response.data.message });
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        loadTest,
        handleAnswerSelect,
        calculateResults,
        register,
        login,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

// Usage:
// Wrap your app with the StoreProvider component
// <StoreProvider>
//   <App />
// </StoreProvider>
//
// Then use the useStore hook in your components to access the store
// const { state, dispatch } = useStore();
// dispatch({ type: "SET_SELECTED_CATEGORY", payload: "Math" });
// const { selectedCategory } = state;
