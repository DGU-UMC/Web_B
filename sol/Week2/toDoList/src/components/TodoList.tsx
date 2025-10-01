import type { TTodo } from "../types/todo";

interface TodoListProps {
  title: string;
  todos?: TTodo[];
  buttonLabel: string;
  buttonColor: string;
  onClick: (todo: TTodo) => void;
}

const TodoList = ({
  title,
  todos,
  buttonLabel,
  buttonColor,
  onClick,
}: TodoListProps) => {
  return (
    <>
      <div className="render-container_section">
        <h2 className="render-container_title">{title}</h2>
        {/* 할 일 아이템 생성 함수가 여기에 직접 추가됨. */}
        <ul id="todo-list" className="render-container_list">
          {todos?.map((todo) => (
            <li key={todo.id} className="render-container_item">
              {todo.text}
              <button
                className="render-container_item_button"
                style={{ backgroundColor: buttonColor }}
                onClick={() => onClick(todo)}
              >
                {buttonLabel}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoList;
