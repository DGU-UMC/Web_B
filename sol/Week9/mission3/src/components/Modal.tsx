import { useCartActions } from "../hooks/useCartStore";
import { useModalActions, useModalInfo } from "../hooks/useModalStore";

const Modal = () => {
  const { isOpen } = useModalInfo();
  const { closeModal } = useModalActions();
  const { clearCart } = useCartActions();

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    clearCart();
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-semibold mb-2">정말 삭제하시겠습니까?</h2>
        <p className="text-sm text-gray-700 mb-4">
          장바구니의 모든 아이템이 삭제됩니다.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
