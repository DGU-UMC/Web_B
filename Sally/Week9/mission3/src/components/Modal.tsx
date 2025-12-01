import { useSelector, useDispatch } from "../hooks/useCustomRedux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/cartSlice";

const Modal = () => {
  const { isOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    // clear cart then close modal
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      aria-hidden={!isOpen}
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={handleClose}
      />

      {/* modal box */}
      <div className="relative bg-white rounded-md p-6 z-10 w-11/12 max-w-md">
        <h2 className="text-xl font-semibold mb-4">장바구니 비우기</h2>
        <p className="mb-6">정말로 장바구니를 초기화 하시겠습니까?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
