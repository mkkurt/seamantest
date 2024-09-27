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
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Test
        </button>
      )}
      {showResults && (
        <div className="mt-6 p-4 bg-green-100 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Test Results:</h3>
          <p>
            You got {calculateResults()} out of {questions.length} correct!
          </p>
        </div>
      )}
    </div>
  );
};

export default TestContent;
