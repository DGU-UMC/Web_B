import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import type { TTodo } from "../types/todo";

interface ITodoContext {
  todos: TTodo[];
  doneTodos: TTodo[];
  addTodo: (text: string) => void;
  completeTodo: (todo: TTodo) => void;
  deleteTodo: (todo: TTodo) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

  // 4. 할 일 추가 처리 함수
  const addTodo = (text: string): void => {
    const newTodo: TTodo = { id: Date.now(), text };
    setTodos((prev) => [...prev, newTodo]);
  };

  // 5. 할일 상태 변경
  const completeTodo = (todo: TTodo): void => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setDoneTodos((prev) => [...prev, todo]);
  };

  // 6. 완료된 할 일 삭제 함수
  const deleteTodo = (todo: TTodo): void => {
    setDoneTodos((prev) => prev.filter((t) => t.id !== todo.id));
  };

  return (
    <>
      <TodoContext.Provider
        value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}
      >
        {children}
      </TodoContext.Provider>
    </>
  );
};

export const useTodo = (): ITodoContext => {
  const context = useContext(TodoContext);
  // 컨텍스트가 없는 경우
  if (!context) {
    throw new Error(
      "useTodo를 사용하기 위해서는, 무조건 TodoProvider로 감싸야합니다."
    );
  }
  return context;
};
