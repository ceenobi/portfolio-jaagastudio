import {
  AnimatePresence,
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import * as React from "react";

interface GradualSpacingProps {
  text: string;
  className?: string;
  delayPerChar?: number;
}

export function GradualSpacing({
  text = "Gradual Spacing",
  className = "",
  delayPerChar = 0.015,
}: GradualSpacingProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const charVariants: Variants = {
    hidden: { opacity: 0, x: -18 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: i * delayPerChar,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  let charIndexCounter = 0;

  return (
    <div 
      ref={ref} 
      className={`flex flex-wrap items-center justify-start whitespace-normal wrap-break-word leading-tight ${className}`}
    >
      <AnimatePresence>
        {text.split(" ").map((word, wordIdx) => {
          return (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.split("").map((char) => {
                const currentIndex = charIndexCounter++;
                return (
                  <motion.span
                    key={`${wordIdx}-${currentIndex}`}
                    custom={currentIndex}
                    variants={charVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                );
              })}
              {/* Add a space after each word except the last one, still incrementing the counter for rhythm */}
              {wordIdx < text.split(" ").length - 1 && (
                <span key={`space-${wordIdx}`} className="inline-block">
                  &nbsp;
                  {(() => {
                    charIndexCounter++;
                    return null;
                  })()}
                </span>
              )}
            </span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
