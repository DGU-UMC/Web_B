import { useEffect } from "react";
import { useCartActions } from "../hooks/useCartStore";
import { useModalActions, useModalInfo } from "../hooks/useModalStore";

const Modal = () => {
  const { isOpen } = useModalInfo();
  const { close } = useModalActions();

  const handleClose = () => {
    close();
  };

  const { clearCart } = useCartActions();
  const handleInitializeCart = () => {
    clearCart();
    close();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, close]);

  // 모달이 열려있을 때 메인 화면 스크롤 불가
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-30 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      ></div>
      <div
        className={`fixed inset-1/3 rounded-lg flex flex-col justify-center items-center space-y-4 box-border px-4 py-2 bg-gray-50 shadow-2xl z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <h1 className="font-extrabold text-xl">정말 삭제하시겠습니까?</h1>
        <div className="space-x-4">
          <button
            className="bg-gray-300 rounded-lg px-4 py-2 cursor-pointer"
            onClick={handleClose}
          >
            아니오
          </button>
          <button
            className="bg-red-600 text-white rounded-lg px-4 py-2 cursor-pointer"
            onClick={handleInitializeCart}
          >
            네
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
