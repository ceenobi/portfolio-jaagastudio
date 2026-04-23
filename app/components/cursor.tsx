import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePerformance } from "~/hooks/usePerformance";

export default function Cursor() {
  const { isLowPower } = usePerformance();
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Simplified spring physics for low power devices
  const springConfig = isLowPower 
    ? { stiffness: 1000, damping: 50, mass: 0.1 } // Almost instant, less "springy" math
    : { stiffness: 500, damping: 28, mass: 0.5 };

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    // Only activate cursor tracking on devices with a fine pointer (mouse/trackpad)
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }
    setHasPointer(true);
    
    const minDotSize = document.querySelector(".cursor-dot");
    
    const manageMouseMove = (e: MouseEvent) => {
      // Offset by half the size of the cursor to perfectly center it
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if we should hide the custom cursor entirely
      const shouldHide = target.closest("[data-cursor-hide]");
      setIsHidden(!!shouldHide);

      // Look up the DOM tree for a [data-hover-text] attribute
      const magneticElement = target.closest("[data-hover-text]") as HTMLElement;
      
      if (magneticElement) {
        setIsHovered(true);
        setHoverText(magneticElement.getAttribute("data-hover-text") || "");
      } else {
        setIsHovered(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", manageMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!hasPointer) return null;

  return (
    <motion.div
      className="cursor-dot fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-9999 mix-blend-difference"
      style={{
        x: springX,
        y: springY,
      }}
      animate={{
        width: isHidden ? 0 : (isHovered ? 80 : 32),
        height: isHidden ? 0 : (isHovered ? 80 : 32),
        opacity: isHidden ? 0 : 1,
        backgroundColor: "rgba(255, 255, 255, 1)",
        x: isHovered ? "-24px" : "0px", // adjust center offset on grown state
        y: isHovered ? "-24px" : "0px",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered && !isHidden ? 1 : 0,
          scale: !isHidden ? 1 : 0
        }}
        className="text-[10px] font-black tracking-[0.2em] uppercase text-black"
      >
        {hoverText}
      </motion.span>
    </motion.div>
  );
}
