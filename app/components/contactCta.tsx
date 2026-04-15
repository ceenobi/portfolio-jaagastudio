import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const MotionLink = motion.create(Link);

interface ContactCTAProps {
  title?: string;
  className?: string;
  isFullHeight?: boolean;
}

export default function ContactCTA({
  title = "Got a vision?",
  className = "",
  isFullHeight = false,
}: ContactCTAProps) {
  const shouldReduceMotion = useReducedMotion();
  const appleEase: [number, number, number, number] = [0.33, 1, 0.68, 1];

  return (
    <section
      className={`px-6 text-center border-t border-white/10 relative z-10 bg-DarkBg flex flex-col items-center justify-center ${isFullHeight ? "min-h-screen py-0 border-none" : "py-40"} ${className}`}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: shouldReduceMotion ? 0 : 0.1,
              delayChildren: 0.2,
            },
          },
        }}
        className="flex flex-col items-center max-w-4xl mx-auto"
      >
        <div className="overflow-hidden mb-8 flex flex-wrap justify-center gap-[0.3em]">
          {title.split(" ").map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: appleEase },
                },
              }}
              className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter text-VanillaCustard inline-block font-Grotesk"
            >
              {word}
            </motion.span>
          ))}
        </div>

        <MotionLink
          to="/contact"
          prefetch="intent"
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          className="group relative inline-flex items-center gap-4 text-xl md:text-2xl font-bold uppercase tracking-widest text-white hover:text-SoftApricot transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-SoftApricot focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-full px-6 py-2"
          aria-label="Navigate to contact page to start a project"
        >
          Let's Talk
          <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-SoftApricot group-hover:rotate-45 transition-all duration-300">
            <ArrowUpRight size={24} />
          </span>
        </MotionLink>
      </motion.div>
    </section>
  );
}
