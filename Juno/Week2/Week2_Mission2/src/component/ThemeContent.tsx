import clsx from "clsx";
import { THEME, useTheme } from "../context/ThemeProvider";

const ThemeContent = () => {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx(
        "p-4 h-dvh w-full",
        isLightMode ? "bg-white" : "bg-gray-800"
      )}
    >
      <h1
        className={clsx(
          "text-wxl font-bold",
          isLightMode ? "text-black" : "text-white"
        )}
      >
        Theme Content
      </h1>
      <p className={clsx("mt-2", isLightMode ? "text-black" : "text-white")}>
        Aliquip aliquip enim magna cillum cillum incididunt magna sit. Aliquip
        sit culpa quis adipisicing enim do consectetur incididunt ut incididunt
        exercitation deserunt irure ut. Nulla reprehenderit id Lorem labore.
        Fugiat voluptate eu irure adipisicing laboris dolore irure elit
        voluptate ipsum consequat amet do. Deserunt proident ad nisi cupidatat
        voluptate irure irure.
      </p>
    </div>
  );
};

export default ThemeContent;
