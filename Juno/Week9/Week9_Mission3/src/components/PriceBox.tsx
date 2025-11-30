import { useCartInfo } from "../hooks/useCartStore";
import { useModalActions } from "../hooks/useModalStore";

const PriceBox = () => {
  const { total } = useCartInfo();

  const { open } = useModalActions();
  const handleOpenModal = () => {
    open();
  };

  return (
    <div className="py-10 px-4 flex justify-between items-center">
      <button
        onClick={handleOpenModal}
        className="border px-4 py-2 rounded-lg cursor-pointer"
      >
        장바구니 초기화
      </button>
      <div>총 가격: ${total}원</div>
    </div>
  );
};

export default PriceBox;
