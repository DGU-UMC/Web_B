import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteConfirmModal({
  open,
  title = "정말 탈퇴하시겠습니까?",
  description = "탈퇴 시 게시글/댓글/좋아요 등이 삭제됩니다. 이 작업을 진행하시겠습니까?",
  confirmText = "예",
  cancelText = "아니오",
  onConfirm,
  onClose,
}: Props) {
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    firstBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] bg-black/50 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-neutral-800 text-white shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-white/10"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="py-2 text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-3 text-white/80">{description}</p>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            ref={firstBtnRef}
            onClick={onConfirm}
            className="min-w-[96px] rounded-md bg-pink-500 hover:bg-pink-600 py-2"
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="min-w-[96px] rounded-md bg-white/30 hover:bg-white/40 py-2"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
