import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import type { tTodo } from "../types/todo";

interface iTodoContext {
  todos: tTodo[];
  doneTodos: tTodo[];
  addTodo: (text: string) => void;
  completeTodo: (todo: tTodo) => void;
  deleteTodo: (todo: tTodo) => void;
  theme: string;
  toggleTheme: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TodoContext = createContext<iTodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {
  const [todos, setTodos] = useState<tTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<tTodo[]>([]);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const addTodo = (text: string): void => {
    const newTodo: tTodo = { id: Date.now(), text };
    setTodos((prevTodos): tTodo[] => [...prevTodos, newTodo]);
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
    <TodoContext.Provider
      value={{
        todos,
        doneTodos,
        addTodo,
        completeTodo: completeSubmit,
        deleteTodo: deleteSubmit,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTodo = (): iTodoContext => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error(
      "useTodo를 사용하기 위해서는 ,무조건 TodoProvider로 감싸야 합니다."
    );
  }
  return context;
};
