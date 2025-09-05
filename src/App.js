import i18next from "i18next";
import { Helmet } from "react-helmet";
import "./App.css";
import DynamicTest from "./DynamicTest";
import { StoreProvider } from "./store";
import { ThemeProvider } from "./hooks/useTheme";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const currentLanguage = i18next.language;
  return (
    <ErrorBoundary>
      <Helmet>
        <html lang={currentLanguage} />
        <title>
          {currentLanguage === "en" ? "Seaman's Test" : "Gemiadamı Soruları"}
        </title>
        <meta
          name="description"
          content={
            currentLanguage === "en" 
              ? "Interactive quiz application for seaman certification exam preparation" 
              : "Gemiadamı sertifikasyon sınav hazırlığı için interaktif quiz uygulaması"
          }
        />
        <meta
          name="keywords"
          content={
            currentLanguage === "en"
              ? "seaman, test, maritime, navigation, safety, certification"
              : "gemiadamı, gemiadamları sınav soruları, gemiadamları soruları, gemiadamı sınav, gemiadamı sınavı, denizcilik"
          }
        />
      </Helmet>
      <ThemeProvider>
        <StoreProvider>
          <div className="App bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <DynamicTest />
          </div>
        </StoreProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
