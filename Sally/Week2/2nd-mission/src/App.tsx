import "./App.css";
import Todo from "./components/Todo";
import { TodoProvider } from "./context/TodoContext";
// import TodoBefore from "./components/TodoBefore";

function App() {
  return (
    <>
      <TodoProvider>
        <Todo />
      </TodoProvider>
      {/* <TodoBefore /> */}
    </>
  );
}

export default App;
