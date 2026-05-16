import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background animate-[fade-in_0.2s_ease-out]">
      <div className="flex flex-col items-center gap-3 animate-[scale-in_0.5s_ease-out]">
        <div className="scale-150">
          <Logo />
        </div>
        <div className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-surface">
          <div className="h-full w-1/3 animate-[slide-up_1s_ease-in-out_infinite] bg-[image:var(--gradient-primary)]" />
        </div>
      </div>
    </div>
  );
}
