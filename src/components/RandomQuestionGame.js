import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useStore } from "../store";
import axios from "axios";
import Markdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { useQuestionSettings } from "../hooks/useQuestionSettings";

const HISTORY_BUFFER_SIZE = 5;

const RandomQuestionGame = () => {
  const { t, i18n } = useTranslation();
  const { state } = useStore();
  const { selectedCategory, questions } = state;
  const { avoidRepeatQuestions } = useQuestionSettings();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const askedQuestionIds = useRef(new Set());
  const [score, setScore] = useState({
    correct: 0,
    incorrect: 0,
  });
  const [fetchGeminiData, setFetchGeminiData] = useState(false);
  const [geminiData, setGeminiData] = useState("");
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState(null);

  useEffect(() => {
    if (fetchGeminiData) {
      const fetchData = async () => {
        setIsGeminiLoading(true);
        setGeminiError(null);
        const geminiData = `${
          currentQuestion?.question
        } ${currentQuestion?.options.join(" ")}\nDoğru Cevap: ${
          currentQuestion?.correctAnswer
        }\nSoruyu açıkla.`;
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;
          const response = await axios.post(url, {
            contents: [
              {
                parts: [{ text: geminiData }],
              },
            ],
          });
          setGeminiData(response.data.candidates[0].content.parts[0].text);
          setIsGeminiLoading(false);
        } catch (error) {
          setGeminiError(error);
        } finally {
          setIsGeminiLoading(false);
        }
        setFetchGeminiData(false);
      };

      fetchData();
    }
  }, [fetchGeminiData, currentQuestion]);

  const loadNewQuestion = useCallback(() => {
    if (questions.length === 0) return;

    let newQuestion;

    if (avoidRepeatQuestions) {
      // Filter out questions that have already been asked in this session
      const unaskedQuestions = questions.filter(question => !askedQuestionIds.current.has(question.id));
      
      // If all questions have been asked, reset and start over
      if (unaskedQuestions.length === 0) {
        askedQuestionIds.current = new Set();
        newQuestion = questions[Math.floor(Math.random() * questions.length)];
      } else {
        // Select a random question from unasked questions
        newQuestion = unaskedQuestions[Math.floor(Math.random() * unaskedQuestions.length)];
      }
    } else {
      // Select any random question without avoiding repetition
      newQuestion = questions[Math.floor(Math.random() * questions.length)];
    }

    if (!newQuestion) return;

    // Add this question to the asked questions set only if avoiding repetition
    if (avoidRepeatQuestions) {
      askedQuestionIds.current.add(newQuestion.id);
    }

    setCurrentQuestion(newQuestion);
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(false);

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
    setGeminiData("");
  }, [questions, avoidRepeatQuestions]);

  useEffect(() => {
    // Reset asked questions when category or questions change
    askedQuestionIds.current = new Set();
  }, [selectedCategory, questions]);

  useEffect(() => {
    loadNewQuestion();
  }, [selectedCategory, questions, loadNewQuestion]);

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
    [currentQuestion, historyIndex, checkAnswerCorrectness]
  );

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
              if (avoidRepeatQuestions) {
                askedQuestionIds.current = new Set();
              }
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
      {/* {isGeminiLoading ? (
        <p className="text-gray-700">Generating explanation...</p>
      ) : (
        <button
          onClick={() => setFetchGeminiData(true)}
          className="mt-2 bg-gray-100 text-black px-1 py-1 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-xs my-2"
        >
          Generate Explanation
        </button>
      )}
      {geminiError && (
        <p className="text-red-600 text-sm">Failed to generate explanation.</p>
      )}
      {geminiData && (
        <div className="bg-gray-100 p-4 rounded-lg mt-2">
          <Markdown>{geminiData}</Markdown>
        </div>
      )} */}
    </div>
  );
};

export default RandomQuestionGame;
