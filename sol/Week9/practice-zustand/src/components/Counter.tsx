import { useShallow } from "zustand/shallow";
import { useCounterStore } from "../stores/counterStore";

const Counter = () => {
  const { count, increment, decrement } = useCounterStore(
    useShallow((state) => ({
      count: state.count,
      increment: state.increment,
      decrement: state.decrement,
    }))
  );
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>증가</button>
      <button onClick={decrement}>감소</button>
    </div>
  );
};
export default Counter;
