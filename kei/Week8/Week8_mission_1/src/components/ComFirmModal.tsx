interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "안내",
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg bg-white dark:bg-zinc-900 shadow-xl">
          <div className="px-5 pt-5">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {message}
            </p>
          </div>
          <div className="mt-5 flex justify-end gap-2 px-5 pb-5">
            <button
              onClick={onCancel}
              className="px-3 py-2 rounded bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
