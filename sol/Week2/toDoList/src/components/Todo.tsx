import "../App.css";
import TodoForm from "./TodoForm.tsx";
import TodoList from "./TodoList.tsx";
import { useTodo } from "../context/TodoContext.tsx";

const Todo = () => {
  // 1. html 요소 선택
  // -> 리액트에서는 HTML요소 선택 할 필요가 없음.
  // - 할 일 목록 렌더링 하는 함수를 정의
  // -> 이거 역시 리액트에서는 할 필요가 없음.
  // 2. 할 일 어떻게 생긴지 type 정의

  const { todos, completeTodo, deleteTodo, doneTodos } = useTodo();

  return (
    <>
      <div className="todo-container">
        <h1 className="todo-container_header">SOL TODO</h1>
        <TodoForm />
        <div className="render-container">
          <TodoList
            title="할 일"
            todos={todos}
            buttonLabel="완료"
            buttonColor="#28a745"
            onClick={completeTodo}
          />
          <TodoList
            title="완료"
            todos={doneTodos}
            buttonLabel="삭제"
            buttonColor="#dc3545"
            onClick={deleteTodo}
          />
        </div>
      </div>
    </>
  );
};

export default Todo;
