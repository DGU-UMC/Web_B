// import { useState } from "react";
import { useReducer } from "react";
import "./App.css";

// useReducer 사용을 위한 interface 정의
interface IState {
  count: number;
}

interface IAction {
  type: "INCREASE" | "DECREASE" | "RESET_TO_ZERO";
  payload?: number; // 개발자가 원하는 값을 입력할 수 있다.
}

function reducer(state: IState, action: IAction) {
  const { type } = action;
  switch (type) {
    default:
      return state;
    case "INCREASE":
      return {
        ...state, // 원본 유지
        count: state.count + 1,
      };
    case "DECREASE":
      return {
        ...state, // 원본 유지
        count: state.count - 1,
      };
    case "RESET_TO_ZERO":
      return {
        ...state, // 원본 유지
        count: 0,
      };
  }
}

function App() {
  // useState를 이용한 counter
  // const [count, setCount] = useState(0);
  // const handleIncrease = () => {
  //   setCount((prev) => prev + 1);
  // };

  // useReducer를 이용한 counter
  // state의 사본을 만들고, 그 사본의 값을 변경
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
  });

  return (
    <div className="h-dvh w-dvw flex flex-col justify-center items-center space-y-12">
      <h1 className="font-bold text-6xl">{state.count}</h1>
      <div className="flex space-x-2">
        <button
          className="border px-2 py-1 rounded-lg"
          onClick={() =>
            dispatch({
              type: "INCREASE",
            })
          }
        >
          Increase
        </button>
        <button
          className="border px-2 py-1 rounded-lg"
          onClick={() =>
            dispatch({
              type: "DECREASE",
            })
          }
        >
          Decrease
        </button>
        <button
          className="border px-2 py-1 rounded-lg"
          onClick={() =>
            dispatch({
              type: "RESET_TO_ZERO",
            })
          }
        >
          Reset to zero
        </button>
      </div>
    </div>
  );
}

export default App;
