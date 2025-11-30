import { useCartInfo } from "../hooks/useCartStore";
import { useModalActions } from "../hooks/useModalStore";

const PriceBox = () => {
  const { total } = useCartInfo();
  const { openModal } = useModalActions();

  const handleInitializeCart = () => {
    openModal();
  };

  return (
    <div className="p-12 flex justify-end items-center gap-6">
      <button
        onClick={handleInitializeCart}
        className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 cursor-pointer"
      >
        장바구니 초기화
      </button>
      <div className="text-lg">총액 {total}</div>
    </div>
  );
};

export default PriceBox;
