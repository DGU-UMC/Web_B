import { useCallback, useState } from "react";
import CountButton from "../components/CountButton";
import TextInput from "../components/TextInput";

const UseCallbackPage = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // 리렌더링 방지를 위한 패턴: useCallback
  // 처음 렌더링할 때 캐싱해두고 의존하고 있는 값이 변경될 때만 리렌더링
  // useCallback TradeOff 주의: 함수를 메모리에 저장한다 -> 메모리 사용량 증가
  const handleIncreaseCount = useCallback((number: number) => {
    setCount((prev) => prev + number);
  }, []); // 의존성 주입, 빈 배열이므로 첫 렌더링 이후 리렌더링되지 않음

  const handleText = useCallback((text: string) => {
    setText(text);
  }, []);

  return (
    // memo 미사용 시 CountButton만 눌러도 TextInput까지 불필요하게 같이 리렌더링됨.
    <div>
      <h1>같이 배우는 리액트 useCallback 편</h1>
      <h2>Count: {count}</h2>
      <CountButton onClick={handleIncreaseCount} />

      <h2>Text</h2>
      <TextInput onChange={handleText} />
      <p>{text}</p>
    </div>
  );
};

export default UseCallbackPage;
