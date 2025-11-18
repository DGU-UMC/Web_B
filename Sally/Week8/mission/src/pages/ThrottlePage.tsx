import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrottle";

const ThrottlePage = () => {
  const [scrollY, setScrollY] = useState<number>(0);

  const handleScroll = useThrottle(() => {
    setScrollY(window.scrollY);
  }, 2000);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      <div>
        <h1>Throttle Page</h1>
        <p>ScrollY: {scrollY}</p>
      </div>
    </div>
  );
};
export default ThrottlePage;
