type Props = { onClick: () => void; label?: string };

export default function FAB({ onClick, label = "글 작성" }: Props) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={label}
      className="
        fixed bottom-4 right-4 z-[1000]
        flex h-14 w-14 items-center justify-center
        rounded-full text-white text-3xl
        shadow-lg hover:shadow-xl transition
        md:bottom-6 md:right-6
        focus:outline-none focus:ring-2 focus:ring-white/60
      "
      style={{
        background: "#ff2ea6",
        marginRight: "max(1rem, env(safe-area-inset-right))",
        marginBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      +
    </button>
  );
}
