import { useAppDispatch, useAppSelector } from "../hooks/useCostomRedux";
import { clearCart } from "../slices/cartSlice";

const PriceBox = () => {
  const { total } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const handleInitializeCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="p-12 flex justify-end">
      <button
        onClick={handleInitializeCart}
        className="p-12 flex justify-between cursor-pointer"
      >
        장바구니 초기화
      </button>
      <div>총 가격: {total}원</div>
    </div>
  );
};
export default PriceBox;
