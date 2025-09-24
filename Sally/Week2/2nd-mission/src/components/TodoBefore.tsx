import { useState, type FormEvent } from "react";
import type { tTodo } from "../types/todo";

function App() {
  const [todos, setTodos] = useState<tTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<tTodo[]>([]);
  const [input, setInput] = useState<string>("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const text = input.trim();
    if (text) {
      const newTodo: tTodo = { id: Date.now(), text };
      setTodos((prevTodos): tTodo[] => [...prevTodos, newTodo]);
      setInput("");
    }
  };
  const completeSubmit = (todo: tTodo): void => {
    setTodos((prevTodos): tTodo[] =>
      prevTodos.filter((t): boolean => t.id !== todo.id)
    );
    setDoneTodos((prevDoneTodos): tTodo[] => [...prevDoneTodos, todo]);
  };
  const deleteSubmit = (todo: tTodo): void => {
    setDoneTodos((prevDoneTodos): tTodo[] =>
      prevDoneTodos.filter((t): boolean => t.id !== todo.id)
    );
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">TODO</h1>
      <form onSubmit={handleSubmit} className="todo-container__form">
        <input
          value={input}
          type="text"
          onChange={(e) => setInput(e.target.value)}
          className="todo-container__input"
          placeholder="할 일을 입력하세요"
          required
        />
        <button type="submit" className="todo-container__button">
          추가
        </button>
      </form>
      <div className="render-container">
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul id="todo-list" className="render-container__list">
            {todos.map((todo) => (
              <li key={todo.id} className="render-todo__item">
                <span className="render-todo__item-text">{todo.text}</span>
                <button
                  onClick={() => completeSubmit(todo)}
                  style={{ backgroundColor: "#6FCC7D" }}
                  className="render-todo__item-button"
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul id="todo-list" className="render-container__list">
            {doneTodos.map((todo) => (
              <li key={todo.id} className="render-todo__item">
                <span className="render-todo__item-text">{todo.text}</span>
                <button
                  onClick={() => deleteSubmit(todo)}
                  style={{ backgroundColor: "#FF6B6B" }}
                  className="render-todo__item-button"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default App;
