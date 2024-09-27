import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import TestContent from "./components/TestContent";
import RandomQuestionGame from "./components/RandomQuestionGame";
import Topbar from "./components/Topbar";
import { useStore } from "./store";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const DynamicTest = () => {
  const { t } = useTranslation();
  const { state, dispatch, loadTest, handleAnswerSelect, calculateResults } =
    useStore();
  const testContentRef = useRef(null);
  const { questions, answers } = state;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSubmitTest = () => {
    dispatch({ type: "SET_SHOW_RESULTS", payload: true });
    testContentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dispatch({ type: "SET_SHOW_RESULTS", payload: false });
  }, [state.selectedCategory, state.selectedTest, state.quizMode, dispatch]);

  const handleSelectTest = (category, test) => {
    loadTest(category, test);
    dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
    dispatch({ type: "SET_SELECTED_TEST", payload: test });
    dispatch({ type: "SET_SHOW_RESULTS", payload: false });
    dispatch({
      type: "SET_QUIZ_MODE",
      payload: test === "All Questions" ? "random" : "standard",
    });
    // testContentRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Topbar onSelectTest={handleSelectTest} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-64" : "w-0"
          } md:w-64 overflow-hidden`}
        >
          <Sidebar onSelectTest={handleSelectTest} />
        </div>

        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-8"
          ref={testContentRef}
        >
          {/* Sidebar toggle button */}
          {/* <button
            onClick={toggleSidebar}
            className="md:hidden mb-4 p-2 bg-blue-500 text-white rounded"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button> */}

          {state.selectedCategory && state.selectedTest && (
            <h1 className="text-xl font-bold mb-4 text-gray-800">
              {state.selectedCategory} - {state.selectedTest}
            </h1>
          )}
          {state.selectedTest ? (
            <>
              <div className="mb-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {["random", "standard"].map((mode) => (
                    <button
                      key={mode}
                      className={`px-4 py-2 rounded transition-colors ${
                        state.quizMode === mode
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() =>
                        dispatch({ type: "SET_QUIZ_MODE", payload: mode })
                      }
                    >
                      {/* {mode.charAt(0).toUpperCase() + mode.slice(1)} */}
                      {mode === "standard"
                        ? t("standardQuiz")
                        : mode === "random"
                        ? t("allQuestionsRandom")
                        : ""}
                    </button>
                  ))}
                </div>
              </div>
              {state.quizMode === "standard" && (
                <TestContent
                  questions={questions}
                  answers={answers}
                  onAnswerSelect={handleAnswerSelect}
                  onSubmit={handleSubmitTest}
                  results={calculateResults()}
                />
              )}
              {state.quizMode === "random" && <RandomQuestionGame />}
            </>
          ) : (
            <p className="text-xl text-gray-600">
              {/* Select a category and test from the sidebar to begin. */}
              {t("selectAcategoryToBegin")}
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default DynamicTest;
