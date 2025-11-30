import { useReducer, useState } from "react";

// 1. state에 대한 interface
interface IState {
  counter: number;
  error: string | null;
}
// 2. reducer 함수에 대한 interface
interface IAction {
  type: "INCREASE" | "DECREASE" | "RESET";
}

function reducer(state: IState, action: IAction): IState | { counter: number } {
  const { type } = action;

  switch (type) {
    case "INCREASE": {
      return {
        ...state,
        counter: state.counter + 1,
      };
    }
    case "DECREASE": {
      return {
        ...state,
        counter: state.counter - 1,
      };
    }
    case "RESET": {
      return {
        ...state,
        counter: 0,
      };
    }
    default:
      return state;
  }
}

export default function useReducerPage() {
  const [count, setCount] = useState(0);
  const [state, dispatch] = useReducer(reducer, { counter: 0 });

  const handleIncrease = (): void => {
    setCount(count + 1);
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-3xl">useState</h2>
        <h2>useState훅 사용: {count}</h2>
        <button onClick={handleIncrease}>Increase</button>
      </div>
      <div>
        <h2 className="text-3xl">useReducer</h2>
        <h2>useReducer훅 사용: {state.counter}</h2>
        <button onClick={() => dispatch({ type: "INCREASE" })}>Increase</button>
        <button onClick={() => dispatch({ type: "DECREASE" })}>Decrease</button>
        <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
      </div>
    </div>
  );
}
