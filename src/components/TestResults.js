// File: components/TestResults.js
import React from "react";

const TestResults = ({ correctCount, totalQuestions }) => (
  <div className="bg-green-100 rounded-md shadow-md p-6 mb-6">
    <h3 className="text-xl font-semibold mb-4">Test Results:</h3>
    <p>
      You got {correctCount} out of {totalQuestions} correct!
    </p>
  </div>
);

export default TestResults;
