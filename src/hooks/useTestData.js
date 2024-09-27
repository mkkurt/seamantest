import { useState, useEffect } from "react";

export const useTestData = () => {
  const [categories, setCategories] = useState({});
  const [questions, setQuestions] = useState([]);

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

    const testFiles = importAll(require.context("../tests", true, /\.json$/));
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
    setCategories(sortedCategories);
  }, []);

  const loadTest = (category, testName) => {
    if (testName === "All Questions") {
      setQuestions(categories[category].allQuestions);
    } else {
      setQuestions(categories[category].tests[testName]);
    }
  };

  const loadAllQuestionsForCategory = (category) => {
    setQuestions(categories[category].allQuestions);
  };

  return { categories, questions, loadTest, loadAllQuestionsForCategory };
};
