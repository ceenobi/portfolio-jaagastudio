import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Logo() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Link
      to="/"
      viewTransition
      className="inline-flex items-center gap-1 group transition-all duration-300 font-Grotesk"
    >
      <div className="w-12 h-12 bg-CrimsonRed rounded-full flex items-center justify-center shadow-lg border border-white/10 shrink-0">
        <h1 className="font-bold text-xl text-white">JS</h1>
      </div>
      <div
        className={`flex flex-col justify-center transition-all duration-500 ease-in-out overflow-hidden ${
          isScrolled
            ? "max-w-0 opacity-0 -translate-x-2"
            : "max-w-[200px] opacity-100 translate-x-0"
        }`}
      >
        <h1 className="font-bold text-xl leading-none text-white whitespace-nowrap truncate">
          JAAGA STUDIOS
        </h1>
      </div>
    </Link>
  );
}
