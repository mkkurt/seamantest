import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useStore } from "../store";
import { useTranslation } from "react-i18next";
import { use } from "i18next";

const Topbar = ({ onSelectTest }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { state, dispatch } = useStore();
  const { categories, selectedCategory, selectedTest } = state;
  const settingsRef = useRef(null);
  const categoriesRef = useRef(null);

  const { t, i18n } = useTranslation();

  const languages = ["tr", "en"];

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
      className={`w-full bg-white shadow-md h-16 flex items-center px-4 transition-transform duration-300 `}
    >
      <div className="flex items-center w-full justify-between">
        <div className="text-xl font-bold text-gray-800">
          {t("topBarTitle")}
        </div>

        <div
          className="relative flex items-center md:hidden"
          ref={categoriesRef}
        >
          <button
            className={`text-gray-800 flex items-center space-x-2 p-2 rounded-md ${
              isDropdownOpen ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
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
                : t("selectCategory")}
            </span>
            {isDropdownOpen ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute top-16 left-0 w-64 bg-white shadow-lg rounded-md z-10">
              <ul className="py-2">
                {Object.entries(categories).map(([category, { tests }]) => (
                  <li key={category}>
                    <button
                      className={`w-full text-left p-2 rounded-md ${
                        selectedCategory === category
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
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
                        : ""}
                    </button>
                    {expandedCategory === category && (
                      <ul className="ml-4 mt-2 space-y-1 h-32 h-64 overflow-y-scroll">
                        <li>
                          <button
                            className={`w-full text-left p-2 rounded-md text-sm ${
                              selectedTest === "All Questions"
                                ? // ? "bg-blue-50 text-blue-600 font-semibold"
                                  "bg-blue-50 text-blue-600"
                                : "hover:bg-gray-50"
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
                              className={`w-full text-left p-2 rounded-md text-sm ${
                                selectedTest === test &&
                                selectedCategory === category
                                  ? "bg-blue-50 text-blue-600"
                                  : "hover:bg-gray-50"
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
            className={`text-gray-800 flex items-center space-x-2 p-2 rounded-md ${
              isSettingsOpen ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
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
            <div
              className="absolute top-16 right-0 w-64 bg-white shadow-lg rounded-md z-10 p-2
            "
            >
              <ul>
                {languages.map((lang) => (
                  <li key={lang} className="my-2">
                    <button
                      className={`w-full text-left p-2 rounded-md ${
                        i18n.language === lang
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === "en" ? "English" : "Türkçe"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
