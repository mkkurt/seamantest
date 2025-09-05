import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useStore } from "../store";
import { useTranslation } from "react-i18next";
import useGemini from "../hooks/useGemini";
import ReactMarkdown from "react-markdown";

const HISTORY_BUFFER_SIZE = 5;

const RandomQuestionGame = () => {
  const { t, i18n } = useTranslation();
  const { state } = useStore();
  const { selectedCategory, questions } = state;
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [score, setScore] = useState({
    correct: 0,
    incorrect: 0,
  });
  const [questionWeights, setQuestionWeights] = useState({});
  
  // Gemini AI explanation state
  const { data: geminiData, loading: geminiLoading, error: geminiError, generateExplanation, reset: resetGemini } = useGemini();
  const [showExplanation, setShowExplanation] = useState(false);
  const [geminiAnswer, setGeminiAnswer] = useState("");
  const [answerMismatch, setAnswerMismatch] = useState(false);

  // Load question weights from localStorage
  useEffect(() => {
    const storedWeights = JSON.parse(localStorage.getItem("questionWeights")) || {};
    setQuestionWeights(storedWeights);
  }, []);

  // Initialize weights for new questions
  const getQuestionWeight = useCallback((questionId) => {
    return questionWeights[questionId] || 1.0; // Default weight is 1.0
  }, [questionWeights]);

  // Update question weight based on answer result
  const updateQuestionWeight = useCallback((questionId, isCorrect, isVeryEasy = false) => {
    setQuestionWeights(prev => {
      const currentWeight = prev[questionId] || 1.0;
      let newWeight;
      
      if (isCorrect) {
        if (isVeryEasy) {
          // Very easy: weight drops significantly (almost retired)
          newWeight = Math.max(currentWeight * 0.1, 0.01);
        } else {
          // Correct: weight decreases
          newWeight = Math.max(currentWeight * 0.7, 0.1);
        }
      } else {
        // Wrong: weight increases
        newWeight = Math.min(currentWeight * 1.5, 10.0);
      }
      
      const updated = { ...prev, [questionId]: newWeight };
      localStorage.setItem("questionWeights", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Weighted random question selection
  const getWeightedRandomQuestion = useCallback((questions) => {
    if (questions.length === 0) return null;
    
    // Calculate total weight
    const totalWeight = questions.reduce((total, question) => {
      return total + getQuestionWeight(question.id);
    }, 0);

    if (totalWeight === 0) return questions[0]; // Fallback if all weights are 0

    // Select based on weight
    let randomWeight = Math.random() * totalWeight;
    
    for (const question of questions) {
      const weight = getQuestionWeight(question.id);
      randomWeight -= weight;
      if (randomWeight <= 0) {
        return question;
      }
    }
    
    return questions[0]; // Fallback
  }, [getQuestionWeight]);

  const loadNewQuestion = useCallback(() => {
    if (questions.length === 0) return;

    // Use weighted selection instead of random selection
    const newQuestion = getWeightedRandomQuestion(questions);
    
    if (!newQuestion) return;

    setCurrentQuestion(newQuestion);
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(false);
    
    // Reset Gemini explanation state for new question
    setShowExplanation(false);
    setGeminiAnswer("");
    setAnswerMismatch(false);
    resetGemini();

    setQuestionHistory((prev) => {
      const updatedHistory = [
        ...prev,
        {
          question: newQuestion,
          userAnswer: "",
          showResult: false,
          isCorrect: false,
        },
      ];
      return updatedHistory.slice(-HISTORY_BUFFER_SIZE);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, HISTORY_BUFFER_SIZE - 1));
  }, [questions, getWeightedRandomQuestion, resetGemini]);

  useEffect(() => {
    loadNewQuestion();
  }, [selectedCategory, questions]); // eslint-disable-line react-hooks/exhaustive-deps

  const goBackToPreviousQuestion = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousQuestionState = questionHistory[newIndex];
      setCurrentQuestion(previousQuestionState.question);
      setUserAnswer(previousQuestionState.userAnswer);
      setShowResult(previousQuestionState.showResult);
      setIsCorrect(previousQuestionState.isCorrect);
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, questionHistory]);

  const checkAnswerCorrectness = useCallback(
    (selectedAnswer, correctAnswer) => {
      const cleanAnswer = (answer) =>
        answer
          // .replace(/^\d+\)\s*/, "")
          // .trim()
          // .toLowerCase();
          .charAt(0)
          .toLowerCase();
      return cleanAnswer(selectedAnswer) === cleanAnswer(correctAnswer);
    },
    []
  );

  const handleAnswerSelection = useCallback(
    (selectedAnswer) => {
      const isAnswerCorrect = checkAnswerCorrectness(
        selectedAnswer,
        currentQuestion.correctAnswer
      );

      setUserAnswer(selectedAnswer);
      setIsCorrect(isAnswerCorrect);
      setShowResult(true);
      setScore((prev) => ({
        correct: isAnswerCorrect ? prev.correct + 1 : prev.correct,
        incorrect: !isAnswerCorrect ? prev.incorrect + 1 : prev.incorrect,
      }));

      // Update question weight based on answer correctness
      updateQuestionWeight(currentQuestion.id, isAnswerCorrect);

      setQuestionHistory((prev) => {
        const updated = [...prev];
        updated[historyIndex] = {
          ...updated[historyIndex],
          userAnswer: selectedAnswer,
          showResult: true,
          isCorrect: isAnswerCorrect,
        };
        return updated;
      });
    },
    [currentQuestion, historyIndex, checkAnswerCorrectness, updateQuestionWeight]
  );

  // Handle "Very Easy" button click
  const handleVeryEasy = useCallback(() => {
    if (currentQuestion && isCorrect) {
      // Apply additional weight reduction for "very easy" questions
      updateQuestionWeight(currentQuestion.id, true, true);
    }
  }, [currentQuestion, isCorrect, updateQuestionWeight]);

  // Handle Gemini explanation request
  const handleExplanationRequest = useCallback(async () => {
    if (!currentQuestion) return;
    
    setShowExplanation(true);
    await generateExplanation(currentQuestion.question, currentQuestion.options, i18n.language);
  }, [currentQuestion, generateExplanation, i18n.language]);

  // Parse Gemini response to extract answer and explanation
  const parseGeminiResponse = useCallback((geminiText) => {
    if (!geminiText) return { answer: "", explanation: "" };
    
    const lines = geminiText.split('\n');
    let answer = "";
    let explanation = "";
    let isExplanationSection = false;
    
    for (const line of lines) {
      // Handle both English and Turkish response formats
      if (line.toLowerCase().startsWith('answer:') || line.toLowerCase().startsWith('cevap:')) {
        const colonIndex = line.indexOf(':');
        answer = line.substring(colonIndex + 1).trim();
      } else if (line.toLowerCase().startsWith('explanation:') || line.toLowerCase().startsWith('açıklama:')) {
        const colonIndex = line.indexOf(':');
        explanation = line.substring(colonIndex + 1).trim();
        isExplanationSection = true;
      } else if (isExplanationSection) {
        explanation += '\n' + line;
      }
    }
    
    return { answer: answer.trim(), explanation: explanation.trim() };
  }, []);

  // Compare Gemini answer with system answer
  const compareAnswers = useCallback((geminiAnswer, systemAnswer) => {
    if (!geminiAnswer || !systemAnswer) return false;
    
    // Clean and normalize answers for comparison
    const cleanAnswer = (answer) => {
      return answer
        .toLowerCase()
        .replace(/^[a-z]\)?\s*/, '') // Remove option prefix like "A)" or "A"
        .replace(/^\d+\.?\s*/, '') // Remove number prefix like "1." or "1"
        .trim();
    };
    
    const cleanGemini = cleanAnswer(geminiAnswer);
    const cleanSystem = cleanAnswer(systemAnswer);
    
    // Also check if the option letters match
    const geminiLetter = geminiAnswer.toLowerCase().match(/^[a-z]/);
    const systemLetter = systemAnswer.toLowerCase().match(/^[a-z]/);
    
    return cleanGemini === cleanSystem || 
           (geminiLetter && systemLetter && geminiLetter[0] === systemLetter[0]);
  }, []);

  // Effect to process Gemini response when it arrives
  useEffect(() => {
    if (geminiData && currentQuestion) {
      const { answer } = parseGeminiResponse(geminiData);
      setGeminiAnswer(answer);
      
      // Compare with system answer
      const mismatch = !compareAnswers(answer, currentQuestion.correctAnswer);
      setAnswerMismatch(mismatch);
    }
  }, [geminiData, currentQuestion, parseGeminiResponse, compareAnswers]);

  const isQuestionAvailable = useMemo(() => questions.length > 0, [questions]);

  if (!isQuestionAvailable) {
    return (
      <div className="text-center py-8 text-xl font-semibold text-gray-600 dark:text-gray-400">
        No questions available for this category.
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-8 text-xl font-semibold text-gray-600 dark:text-gray-400">
        Loading question...
      </div>
    );
  }

  return (
    <div className="rounded-xl max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 transition-colors duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {currentQuestion.question}
        </h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && handleAnswerSelection(option)}
              disabled={showResult}
              className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                showResult
                  ? checkAnswerCorrectness(
                      option,
                      currentQuestion.correctAnswer
                    )
                    ? "bg-green-100 dark:bg-green-900/30"
                    : checkAnswerCorrectness(option, userAnswer)
                    ? "bg-red-100 dark:bg-red-900/30"
                    : "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-indigo-50 dark:hover:bg-indigo-900/30 bg-gray-50 dark:bg-gray-700"
              }`}
            >
              <span
                className={`text-lg ${
                  showResult && option === currentQuestion.correctAnswer
                    ? "font-semibold text-green-600 dark:text-green-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>
      {showResult && (
        <div className="mb-6">
          <p
            className={`text-lg font-semibold ${
              isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {isCorrect ? t("Correct") : t("Incorrect")}
          </p>
          {!isCorrect && (
            <p className="text-gray-700 dark:text-gray-300">
              {t("theCorrectAnswerIs")}:
              <span className="font-semibold">
                {" "}
                {currentQuestion.correctAnswer}
              </span>
            </p>
          )}
          {/* Very Easy button - only shown after correct answers */}
          {isCorrect && (
            <div className="mt-3">
              <button
                onClick={handleVeryEasy}
                className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                {t("veryEasy") || "Very Easy"}
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t("veryEasyHelper") || "Click if this question was very easy for you"}
              </p>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-between items-center">
        <button
          onClick={goBackToPreviousQuestion}
          disabled={historyIndex <= 0}
          className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Question
        </button>
        {showResult && (
          <button
            onClick={loadNewQuestion}
            className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            Next Question
          </button>
        )}
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {/* Score:{" "} */}
            {t("score")}:{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {score.correct}
            </span>{" "}
            {t("correct")},{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">
              {score.incorrect}
            </span>{" "}
            {t("incorrect")}
          </p>
          <button
            onClick={() => {
              setScore({ correct: 0, incorrect: 0 });
              setQuestionHistory([]);
              setHistoryIndex(-1);
              // Clear question weights as well
              setQuestionWeights({});
              localStorage.removeItem("questionWeights");
            }}
            className="mt-2 bg-gray-100 dark:bg-gray-700 text-black dark:text-white px-1 py-1 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 text-xs my-2"
          >
            {t("resetScore")}
          </button>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            {/* {questions.length} questions available */}
            {i18n.language === "en"
              ? `${questions.length} questions available`
              : `${questions.length} soru mevcut`}
          </p>
        </div>
      </div>
      
      {/* Gemini AI Explanation Section */}
      {showResult && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 transition-colors duration-300">
          {!showExplanation ? (
            <button
              onClick={handleExplanationRequest}
              disabled={geminiLoading}
              className="w-full bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {geminiLoading ? 
                (i18n.language === "en" ? "Generating AI Explanation..." : "AI Açıklaması Hazırlanıyor...") : 
                (i18n.language === "en" ? "Get AI Explanation" : "AI Açıklaması Al")
              }
            </button>
          ) : (
            <div>
              {geminiLoading && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {i18n.language === "en" ? "AI is analyzing the question..." : "AI soruyu analiz ediyor..."}
                  </p>
                </div>
              )}
              
              {geminiError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {i18n.language === "en" ? "Failed to generate AI explanation. Please try again." : "AI açıklaması oluşturulamadı. Lütfen tekrar deneyin."}
                  </p>
                </div>
              )}
              
              {geminiData && (
                <div>
                  {answerMismatch && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        ⚠️ {i18n.language === "en" ? "Answer Mismatch Detected" : "Cevap Uyuşmazlığı Tespit Edildi"}
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        {i18n.language === "en" ? 
                          `AI suggests: "${geminiAnswer}" but our system shows: "${currentQuestion.correctAnswer}". The database answer might need review.` :
                          `AI önerisi: "${geminiAnswer}" ancak sistemimiz: "${currentQuestion.correctAnswer}" gösteriyor. Veritabanındaki cevap gözden geçirilmeli olabilir.`
                        }
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      🤖 {i18n.language === "en" ? "AI Explanation" : "AI Açıklaması"}
                    </h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{geminiData}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default RandomQuestionGame;
