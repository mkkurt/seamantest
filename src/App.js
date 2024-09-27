import i18next from "i18next";
import { Helmet } from "react-helmet";
import "./App.css";
import DynamicTest from "./DynamicTest";
import { StoreProvider } from "./store";

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
      <StoreProvider>
        <div className="App">
          <DynamicTest />
        </div>
      </StoreProvider>
    </>
  );
}

export default App;
