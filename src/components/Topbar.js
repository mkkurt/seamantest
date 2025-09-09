import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Sun, Moon, Monitor } from "lucide-react";
import { useStore } from "../store";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";

const Topbar = ({ onSelectTest }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { state } = useStore();
  const { categories, selectedCategory, selectedTest } = state;
  const settingsRef = useRef(null);
  const categoriesRef = useRef(null);
  const { theme, setTheme } = useTheme();

  const { t, i18n } = useTranslation();

  const languages = ["tr", "en"];
  const themes = [
    { key: "light", label: t("light"), icon: Sun },
    { key: "dark", label: t("dark"), icon: Moon },
    { key: "system", label: t("system"), icon: Monitor },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const handleCategorySelect = (category, test) => {
    onSelectTest(category, test);
    if (test !== "All Questions") {
      setIsDropdownOpen(false);
    }
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollTop = window.scrollY;
  //     if (currentScrollTop > lastScrollTop) {
  //       setIsVisible(false);
  //     } else {
  //       setIsVisible(true);
  //     }
  //     setLastScrollTop(currentScrollTop);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [lastScrollTop]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    // Function to handle outside click
    const handleClickOutsideSettings = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    // Add event listener for outside clicks
    document.addEventListener("mousedown", handleClickOutsideSettings);

    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutsideSettings);
    };
  }, [settingsRef]);

  useEffect(() => {
    // Function to handle outside click
    const handleClickOutsideCategories = (event) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener for outside clicks
    document.addEventListener("mousedown", handleClickOutsideCategories);

    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutsideCategories);
    };
  }, [categoriesRef]);

  return (
    <div
      className={`w-full bg-white dark:bg-gray-800 shadow-md h-16 flex items-center px-4 transition-all duration-300`}
    >
      <div className="flex items-center w-full justify-between">
        <div className="text-xl font-bold text-gray-800 dark:text-white">
          {t("topBarTitle")}
        </div>

        <div
          className="relative flex items-center md:hidden"
          ref={categoriesRef}
        >
          <button
            className={`text-gray-800 dark:text-white flex items-center space-x-2 p-2 rounded-md transition-colors ${
              isDropdownOpen
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={toggleDropdown}
          >
            {/* <span>{selectedCategory || "Select Category"}</span> */}
            <span>
              {selectedCategory === "All Categories"
                ? t("allCategories")
                : selectedCategory === "Main Engine"
                ? t("mainEngine")
                : selectedCategory === "Auxiliary Engines"
                ? t("auxEngines")
                : selectedCategory === "Maritime English"
                ? t("maritimeEnglish")
                : selectedCategory === "Maritime Law"
                ? t("maritimeLaw")
                : selectedCategory === "Maritime Safety"
                ? t("maritimeSafety")
                : selectedCategory === "Maritime Safety New"
                ? t("maritimeSafetyNew")
                : t("selectCategory")}
            </span>
            {isDropdownOpen ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute top-16 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 border dark:border-gray-700">
              <ul className="py-2">
                {Object.entries(categories).map(([category, { tests }]) => (
                  <li key={category}>
                    <button
                      className={`w-full text-left p-2 rounded-md text-gray-800 dark:text-white transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        toggleCategory(category);
                      }}
                    >
                      {/* {category} */}
                      {category === "Main Engine"
                        ? t("mainEngine")
                        : category === "Auxiliary Engines"
                        ? t("auxEngines")
                        : category === "Maritime English"
                        ? t("maritimeEnglish")
                        : category === "Maritime Law"
                        ? t("maritimeLaw")
                        : category === "Maritime Safety"
                        ? t("maritimeSafety")
                        : category === "Maritime Safety New"
                        ? t("maritimeSafetyNew")
                        : ""}
                    </button>
                    {expandedCategory === category && (
                      <ul className="ml-4 mt-2 space-y-1 h-32 h-64 overflow-y-scroll">
                        <li>
                          <button
                            className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                              selectedTest === "All Questions"
                                ? // ? "bg-blue-50 text-blue-600 font-semibold"
                                  "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                            }`}
                            onClick={() =>
                              handleCategorySelect(category, "All Questions")
                            }
                          >
                            {t("allQuestions")}
                          </button>
                        </li>
                        {Object.keys(tests).map((test) => (
                          <li key={test}>
                            <button
                              className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                                selectedTest === test &&
                                selectedCategory === category
                                  ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                              }`}
                              onClick={() =>
                                handleCategorySelect(category, test)
                              }
                            >
                              {test}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative flex items-center" ref={settingsRef}>
          <button
            className={`text-gray-800 dark:text-white flex items-center space-x-2 p-2 rounded-md transition-colors ${
              isSettingsOpen
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={toggleSettings}
          >
            <span>{i18n.t("settings")}</span>
            {isSettingsOpen ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>
          {isSettingsOpen && (
            <div className="absolute top-16 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 p-3 border dark:border-gray-700">
              {/* Language Section */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("language")}
                </h3>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                        i18n.language === lang
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === "en" ? "English" : "Türkçe"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("appearance")}
                </h3>
                <div className="space-y-1">
                  {themes.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      className={`w-full text-left p-2 rounded-md text-sm transition-colors flex items-center space-x-2 ${
                        theme === key
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => setTheme(key)}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
