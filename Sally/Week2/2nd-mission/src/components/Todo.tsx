import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { useTodo } from "../context/TodoContext";

const Todo = () => {
  const { todos, completeTodo, deleteTodo, doneTodos, theme, toggleTheme } =
    useTodo();

  return (
    <div className={`todo-container ${theme}`}>
      <div className="todo-container__header">
        <h1>Todo</h1>
        <button onClick={toggleTheme}>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
      <TodoForm />
      <div className="render-container">
        <TodoList
          title="할 일"
          todos={todos}
          buttonLabel="완료"
          buttonColor="#6FCC7D"
          onClick={completeTodo}
        />
        <TodoList
          title="완료"
          todos={doneTodos}
          buttonLabel="삭제"
          buttonColor="#FF6B6B"
          onClick={deleteTodo}
        />
      </div>
    </div>
  );
};

export default Todo;
