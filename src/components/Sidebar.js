import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useStore } from "../store";
import { useTranslation } from "react-i18next";

const Sidebar = ({ onSelectTest }) => {
  const { state } = useStore();
  const { categories, selectedCategory, selectedTest } = state;
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedTests, setExpandedTests] = useState(false);
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const { t } = useTranslation();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-xl sticky top-0 overflow-y-auto h-full transition-colors duration-300" role="navigation" aria-label="Quiz categories">
      <div className="p-6">
        <h2 className="text-l font-bold mb-6 text-gray-800 dark:text-white" id="categories-heading">
          {t("categories")}
        </h2>
        <ul className="space-y-2" aria-labelledby="categories-heading">
          {categories &&
            Object.entries(categories).map(([category, { tests }]) => (
              <li key={category} className="mb-2">
                <button
                  className={`w-full text-left p-2 rounded-md flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    selectedCategory === category
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                  onClick={() => toggleCategory(category)}
                  aria-expanded={expandedCategories[category]}
                  aria-controls={`category-${category}-content`}
                >
                  {/* <span>{category}</span> */}
                  <span>
                    {category === "Auxiliary Engines"
                      ? t("auxEngines")
                      : category === "Main Engine"
                      ? t("mainEngine")
                      : category === "Maritime English"
                      ? t("maritimeEnglish")
                      : category === "Maritime Law"
                      ? t("maritimeLaw")
                      : category === "Maritime Safety"
                      ? t("maritimeSafety")
                      : ""}
                  </span>
                  <ChevronRight
                    size={20}
                    className={`transition-transform duration-200 ${
                      expandedCategories[category] ? "transform rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedCategories[category] && (
                  <ul className="ml-4 mt-2 space-y-1" id={`category-${category}-content`}>
                    <li key="all-questions">
                      <button
                        className={`w-full text-left p-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                          selectedTest === "All Questions" &&
                          selectedCategory === category
                            ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => onSelectTest(category, "All Questions")}
                        aria-current={selectedTest === "All Questions" && selectedCategory === category ? "page" : undefined}
                      >
                        {t("allQuestions")}
                      </button>
                    </li>
                    <li key={category} className="mb-2">
                      <button
                        className={`w-full text-left p-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                          expandedTests ? "text-blue-700 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => setExpandedTests(!expandedTests)}
                      >
                        <span>{t("tests")}</span>
                        <ChevronRight
                          size={20}
                          className={`transition-transform duration-200 ${
                            expandedTests ? "transform rotate-90" : ""
                          }`}
                        />
                      </button>
                      {expandedTests && (
                        <div className="relative">
                          <ul className="ml-4 mt-2 space-y-1 max-h-40 overflow-y-scroll scroll-shadow">
                            {tests &&
                              Object.keys(tests).map((test) => (
                                <li key={test}>
                                  <button
                                    className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                                      selectedTest === test &&
                                      selectedCategory === category
                                        ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                                    }`}
                                    onClick={() => onSelectTest(category, test)}
                                  >
                                    {test}
                                  </button>
                                </li>
                              ))}
                          </ul>
                          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-100 dark:from-gray-800 to-transparent pointer-events-none" />
                        </div>
                      )}
                    </li>
                  </ul>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
