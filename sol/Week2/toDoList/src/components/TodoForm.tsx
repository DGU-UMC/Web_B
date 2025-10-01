import React, { useState } from "react";
import { useTodo } from "../context/TodoContext.tsx";

const TodoForm = () => {
  const [input, setInput] = useState("");
  const { addTodo } = useTodo();

  // 7. 할 일 아이템 생성 함수
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const text = input.trim();
    if (text) addTodo(text);
  };

  return (
    <>
      <form className="todo-container_form" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="todo-container_input"
          placeholder="할일 입력"
          required
        />
        <button type="submit" className="todo-container_button">
          할일추가
        </button>
      </form>
    </>
  );
};

export default TodoForm;
