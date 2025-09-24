import "./App.css";
import ContextPage from "./components/ContextPage.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";

function App() {
  return (
    <ThemeProvider>
      <ContextPage />
    </ThemeProvider>
  );
}
export default App;
