import { memo } from "react"; // props에 전달된 값이 동일하면 리렌더링 X

interface ICountButton {
  onClick: (number: number) => void;
}

const CountButton = ({ onClick }: ICountButton) => {
  console.log("CountButton 렌더링됨");

  return (
    <button className="border p-2 rounded-lg" onClick={() => onClick(10)}>
      증가
    </button>
  );
};

export default memo(CountButton); // Higher-Order Components (HOC)
