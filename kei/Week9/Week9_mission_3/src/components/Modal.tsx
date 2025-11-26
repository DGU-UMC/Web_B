import { useCartActions } from "../hooks/useCartStore";
import { useModalStore } from "../hooks/useModalStore";

const Modal = () => {
  const { clearCart } = useCartActions();
  const { isOpen, close } = useModalStore();

  if (!isOpen) return null; // 안 열려 있으면 렌더 X

  const handleCancel = () => {
    close();
  };

  const handleConfirm = () => {
    clearCart();
    close();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          정말 삭제하시겠습니까?
        </h2>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 cursor-pointer"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
