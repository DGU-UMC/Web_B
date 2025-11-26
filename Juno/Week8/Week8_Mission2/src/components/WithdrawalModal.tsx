import { X } from "lucide-react";
import { useEffect } from "react";
import useDeleteMyInfo from "../hooks/mutations/useDeleteMyInfo";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
  // ESC 키로 모달 끄기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

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

  // 회원 탈퇴 로직
  const { mutateAsync, isLoading } = useDeleteMyInfo();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed inset-1/4 bg-gray-50 flex flex-col items-center box-border p-4 rounded-xl shadow-2xl z-60 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={onClose}
          className="cursor-pointer flex w-full justify-end"
        >
          <X />
        </button>
        <div className="flex-1 flex flex-col justify-center items-center space-y-8">
          <p className="font-bold text-xl">정말 탈퇴하시겠습니까?</p>
          <div className="flex justify-center space-x-8">
            <button
              onClick={async () => {
                try {
                  await mutateAsync();
                } catch (e) {
                  console.error("탈퇴 실패", e);
                }
              }}
              disabled={isLoading}
              className="cursor-pointer w-24 box-border px-4 py-2 border border-gray-950 bg-gray-50 text-gray-950 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              예
            </button>
            <button
              onClick={onClose}
              className="cursor-pointer w-24 box-border px-4 py-2 bg-gray-950 text-gray-50 rounded-xl"
            >
              아니오
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawalModal;
