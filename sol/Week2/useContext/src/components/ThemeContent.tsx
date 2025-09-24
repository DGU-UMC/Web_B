import clsx from "clsx";
import { THEME, useTheme } from "../context/ThemeProvider";

export default function ThemeContent() {
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;
  return (
    <div
      className={clsx("p-4 h-dvh", isLightMode ? "bg-white" : "bg-gray-800")}
    >
      <h1
        className={clsx(
          "text-xl font-bold",
          isLightMode ? "text-black" : "text-white"
        )}
      >
        Theme Content
      </h1>
      <p className={clsx("mt-2", isLightMode ? "text-black" : "text-white")}>
        영원할 줄 알았던 사랑도 저물고 이젠 그 흔한 친구마저 떠나가네요. 나이가
        들어서 나 철이 안드나봐요. 왜 이렇게 불안할까.
      </p>
    </div>
  );
}
