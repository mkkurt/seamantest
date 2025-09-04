import i18next from "i18next";
import { Helmet } from "react-helmet";
import "./App.css";
import DynamicTest from "./DynamicTest";
import { StoreProvider } from "./store";
import { ThemeProvider } from "./hooks/useTheme";
import { QuestionSettingsProvider } from "./hooks/useQuestionSettings";

function App() {
  const currentLanguage = i18next.language;
  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
        <title>
          {currentLanguage === "en" ? "Seaman's Test" : "Gemiadamı Soruları"}
        </title>
        <meta
          name="description"
          content={
            currentLanguage === "en" ? "Seaman's Test" : "Gemiadamı Soruları"
          }
        />
        <meta
          name="keywords"
          content={
            currentLanguage === "en"
              ? "seaman, test, maritime"
              : "gemiadamı, gemiadamları sınav soruları, gemiadamları soruları, gemiadamı sınav, gemiadamı sınavı"
          }
        />
      </Helmet>
      <ThemeProvider>
        <QuestionSettingsProvider>
          <StoreProvider>
            <div className="App bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
              <DynamicTest />
            </div>
          </StoreProvider>
        </QuestionSettingsProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
