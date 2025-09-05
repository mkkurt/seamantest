// File: components/QuestionCard.js
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const QuestionCard = ({
  question,
  options,
  correctAnswer,
  onAnswerSelect,
  questionId,
  selectedAnswer,
  isSubmitted,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswerChange = (e) => {
    const selected = e.target.value;
    onAnswerSelect(questionId, selected === correctAnswer, selected);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300"
      role="article"
      aria-labelledby={`question-title-${questionId}`}
    >
      <h2 
        id={`question-title-${questionId}`}
        className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
      >
        {question}
      </h2>
      <fieldset className="space-y-2">
        <legend className="sr-only">Answer options for question {questionId}</legend>
        {options.map((option, index) => {
          const isCorrect = option === correctAnswer;
          const isSelected = selectedAnswer === option;

          let optionClasses = "text-gray-700 dark:text-gray-300";
          if (isSubmitted) {
            if (isSelected && isCorrect) {
              optionClasses = "text-green-600 dark:text-green-400 font-semibold";
            } else if (isSelected && !isCorrect) {
              optionClasses = "text-red-600 dark:text-red-400 font-semibold";
            } else if (isCorrect) {
              optionClasses = "text-green-600 dark:text-green-400 font-semibold";
            }
          }

          return (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`option-${questionId}-${index}`}
                name={`question-${questionId}`}
                value={option}
                checked={selectedAnswer === option}
                onChange={handleAnswerChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 focus:ring-2 border-gray-300 dark:border-gray-600"
                disabled={isSubmitted}
                aria-describedby={isSubmitted && isCorrect ? `correct-answer-${questionId}` : undefined}
              />
              <label
                htmlFor={`option-${questionId}-${index}`}
                className={`${optionClasses} cursor-pointer flex-1 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
              >
                {option}
              </label>
            </div>
          );
        })}
      </fieldset>

      {isSubmitted && (
        <div 
          id={`correct-answer-${questionId}`}
          className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
          role="status"
          aria-live="polite"
        >
          <p className="text-green-700 dark:text-green-300 font-medium">
            Correct answer: {correctAnswer}
          </p>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
          aria-expanded={showAnswer}
          aria-controls={`answer-details-${questionId}`}
        >
          {showAnswer ? (
            <>
              <ChevronUp size={20} />
              <span className="ml-1">Hide Answer</span>
            </>
          ) : (
            <>
              <ChevronDown size={20} />
              <span className="ml-1">Show Answer</span>
            </>
          )}
        </button>
        {showAnswer && (
          <div 
            id={`answer-details-${questionId}`}
            className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md"
          >
            <p className="text-blue-700 dark:text-blue-300 font-semibold">
              Correct Answer: {correctAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
