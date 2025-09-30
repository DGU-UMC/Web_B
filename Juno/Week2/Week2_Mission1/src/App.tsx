import "./App.css";
import ThemeToggleButton from "../../context(2주차)/ThemeToggleButton";
import Todo from "./components/Todo";
import { ThemeProvider } from "../../context(2주차)/ThemeProvider";
import { TodoProvider } from "./context/TodoContext";

function App(): Element {
  return (
    <ThemeProvider>
      <TodoProvider>
        <Todo />
      </TodoProvider>
      <ThemeToggleButton />
    </ThemeProvider>
  );
}

export default App;
