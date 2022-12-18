import { useEffect, useState } from "react";

const DESKTOP_BREAKPOINT = 960;
const MOBILE_BREAKPOINT = 600;

type ScreenVariant = "mobile" | "tablet" | "desktop";

export function useWindowSize() {
  const [screen, setScreen] = useState<ScreenVariant>("desktop");
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    function updateSize() {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        setScreen("desktop");
      } else if (window.innerWidth < MOBILE_BREAKPOINT) {
        setScreen("mobile");
      } else {
        setScreen("tablet");
      }
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return { screen, windowWidth };
}
