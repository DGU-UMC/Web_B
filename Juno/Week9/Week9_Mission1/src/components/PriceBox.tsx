import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { clearCart } from "../slices/cartSlices";

const PriceBox = () => {
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleInitializeCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="py-10 px-4 flex justify-between items-center">
      <button
        onClick={handleInitializeCart}
        className="border px-4 py-2 rounded-lg cursor-pointer"
      >
        장바구니 초기화
      </button>
      <div>총 가격: ${total}원</div>
    </div>
  );
};

export default PriceBox;
