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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{question}</h2>
      <div className="space-y-2">
        {options.map((option, index) => {
          const isCorrect = option === correctAnswer;
          const isSelected = selectedAnswer === option;

          let optionClasses = "text-gray-700";
          if (isSubmitted) {
            if (isSelected && isCorrect) {
              optionClasses = "text-green-600 font-semibold";
            } else if (isSelected && !isCorrect) {
              optionClasses = "text-red-600 font-semibold";
            } else if (isCorrect) {
              optionClasses = "text-green-600 font-semibold";
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
                className="mr-2"
                disabled={isSubmitted}
              />
              <label
                htmlFor={`option-${questionId}-${index}`}
                className={optionClasses}
              >
                {option}
              </label>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center text-blue-500 hover:text-blue-700"
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
          <p className="mt-2 text-green-600 font-semibold">{correctAnswer}</p>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
