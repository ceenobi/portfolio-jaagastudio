import { useRef, useState } from "react";
import { WORKS } from "~/lib/constants";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";

type Props = {
  work: (typeof WORKS)[0];
  idx: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
};

export default function WorkCards({ work, idx, isPlaying, onPlayToggle }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // -- 1. Scroll Parallax --
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Vertical parallax for the image inside the clipping mask
  const y = useTransform(smoothProgress, [0, 1], ["-12%", "12%"]);
  // Subtle scaling effect based on scroll position
  const imgScale = useTransform(smoothProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]); 

  // -- 2. Mouse 3D Tilt & Glare --
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);
  
  const springConfig = { stiffness: 150, damping: 25, mass: 0.5 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayToggle();
  };

  // Apple's signature easing curve
  const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      ref={ref}
      onClick={togglePlay}
      onMouseEnter={handleMouseEnter}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: (idx % 2) * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1200,
      }}
      className={`group relative block overflow-hidden rounded-[2.5rem] bg-BlackBerryCream/5 border border-white/10 shadow-2xl aspect-4/5 md:aspect-3/4 cursor-pointer will-change-transform ${
        idx % 2 === 1 ? "md:mt-24 lg:mt-32" : "" 
      }`}
    >
      {/* 1. Parallax Media Container */}
      <motion.div
        style={{ y, scale: imgScale }}
        className="absolute inset-0 w-full h-[124%] -top-[12%] origin-center pointer-events-none"
      >
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.img
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: appleEase }}
              src={work.image}
              alt={work.client}
              className="w-full h-full object-cover transition-transform duration-[1.5s] delay-75 group-hover:duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08] filter brightness-90 group-hover:brightness-100"
              loading="lazy"
            />
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: appleEase }}
              className="w-full h-full relative"
            >
              <video
                src={work.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Cinematic Vignette Overlay for Video */}
              <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/40" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* VFX Shutter Swipe Effect (Runs on toggle) */}
      <motion.div
        initial={false}
        animate={isPlaying ? { x: ["-100%", "200%"] } : { x: ["200%", "-100%"] }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-20 bg-linear-to-r from-transparent via-white/40 to-transparent w-full h-full pointer-events-none skew-x-12"
      />

      {/* 2. Soft Vignette Shadow */}
      <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/10 to-black/90 opacity-60 group-hover:opacity-90 transition-opacity duration-1000 pointer-events-none" />

      {/* 3. Interactive Mouse Glare & Custom Play Cursor */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-700 mix-blend-overlay"
        style={{
          background: useMotionTemplate`radial-gradient(circle at ${useTransform(mouseX, [0, 1], [0, 100])}% ${useTransform(mouseY, [0, 1], [0, 100])}%, rgba(255,255,255,0.7), transparent 50%)`
        }}
      />

      {/* Class Leading "VIEW" Indicator (Mouse Follower) */}
      <motion.div
        className="hidden md:flex absolute top-0 left-0 w-24 h-24 rounded-full bg-white text-black items-center justify-center font-bold text-[10px] tracking-widest uppercase z-30 pointer-events-none backdrop-blur-md mix-blend-difference"
        style={{
          x: useSpring(useTransform(mouseX, [0, 1], ["0%", "100%"]), { damping: 25, stiffness: 200 }),
          y: useSpring(useTransform(mouseY, [0, 1], ["0%", "100%"]), { damping: 25, stiffness: 200 }),
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
      >
        {isPlaying ? "STOP" : "VIEW"}
      </motion.div>

      {/* 4. Text Container with Apple Glassmorphism Reveal */}
      <div 
        className={`absolute inset-x-6 bottom-6 p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex flex-col justify-end translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          isPlaying ? "opacity-20 translate-y-4 filter blur-sm" : ""
        }`}
      >
        
        {/* Animated Gloss Line on Glass panel */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-150%] transition-transform duration-[1.5s] delay-300 group-hover:translate-x-[150%] ease-in-out pointer-events-none" />

        <div className="overflow-hidden mb-1">
          <p className="text-SoftApricot text-xs font-bold tracking-[0.25em] uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-800 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)]">
            {work.role}
          </p>
        </div>
        <div className="overflow-hidden">
          <h3 className="text-2xl md:text-3xl font-medium uppercase text-white tracking-wider transform translate-y-full group-hover:translate-y-0 transition-transform duration-800 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] drop-shadow-lg">
            {work.client}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

