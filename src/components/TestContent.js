import React from "react";
import QuestionCard from "./QuestionCard";

const TestContent = ({
  questions,
  answers,
  showResults,
  onAnswerSelect,
  onSubmitTest,
  calculateResults,
}) => {
  return (
    <div>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          {...question}
          onAnswerSelect={onAnswerSelect}
          questionId={question.id}
          selectedAnswer={answers[question.id]?.selectedAnswer || ""}
          isSubmitted={showResults}
        />
      ))}

      {!showResults && (
        <button
          onClick={onSubmitTest}
          className="mt-6 bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          Submit Test
        </button>
      )}
      {showResults && (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border dark:border-green-800 rounded-md">
          <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-300">Test Results:</h3>
          <p className="text-green-700 dark:text-green-300">
            You got {calculateResults()} out of {questions.length} correct!
          </p>
        </div>
      )}
    </div>
  );
};

export default TestContent;
