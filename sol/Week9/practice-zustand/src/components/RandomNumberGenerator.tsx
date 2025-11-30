import { useShallow } from "zustand/shallow";
import { useCounterStore } from "../stores/counterStore";

const RandomNumberGenerator = () => {
  const { randomNumber, random } = useCounterStore(
    useShallow((state) => ({
      randomNumber: state.randomNumber,
      random: state.random,
    }))
  );
  // 위와 같음
  // const randomNumber = useCounterStore((state) => state.randomNumber);
  // const random = useCounterStore((state) => state.random);

  return (
    <div>
      <h1>{randomNumber}</h1>
      <button onClick={random}>랜덤 번호 생성기</button>
    </div>
  );
};

export default RandomNumberGenerator;
