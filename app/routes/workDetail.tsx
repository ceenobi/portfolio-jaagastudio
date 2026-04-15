import { Suspense, lazy, useRef, useState, useEffect } from "react";
import { PageSection, PageWrapper } from "~/components/pageWrapper";
import SuspenseUi from "~/components/suspenseUi";
import { useParams } from "react-router";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { WORKS } from "~/lib/constants";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function meta({ params }: { params: { workId: string } }) {
  return [
    { title: `Work Detail - ${params.workId}` },
    {
      name: "description",
      content:
        "Get in touch with Jaaga Studios, a specialized Creative and VFX director.",
    },
  ];
}

export default function WorkDetail() {
  const { workId } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const selectedWork = WORKS.find(
    (work) =>
      work.title.split(" ").join("-").toLowerCase() === workId?.toLowerCase(),
  );

  // -- Advanced Scroll Parallax Hook Logic --
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Hero Title & Text Parallax
  const titleY = useTransform(scrollYProgress, [0, 0.2], ["0%", "-50%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // 2. Background Focal Text Parallax (Large background name)
  const bgTextX = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]);
  const bgTextOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.6, 0.8],
    [0, 0.05, 0.05, 0],
  );

  // 3. Video Section Scaling Parallax
  const videoScale = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.7],
    [0.9, 1, 0.95],
  );
  const videoRotate = useTransform(scrollYProgress, [0.1, 0.4], [5, 0]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const p = (video.currentTime / video.duration) * 100;
      setProgress(p);
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-DarkBg text-TextWhite selection:bg-SoftApricot selection:text-black min-h-screen relative w-full flex flex-col"
    >
      {/* Cinematic Background Focal Text Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ x: bgTextX, opacity: bgTextOpacity, willChange: "transform, opacity" }}
          className="absolute inset-0 flex items-center justify-center select-none mix-blend-difference"
        >
          <h2 className="text-[20vw] md:text-[25vw] lg:text-[30vw] font-black uppercase text-TextWhite leading-none whitespace-nowrap">
            {selectedWork?.format}
          </h2>
        </motion.div>
      </div>

      <Suspense fallback={<SuspenseUi />}>
        <PageWrapper>
          <PageSection index={0}>
            <motion.div
              style={{ y: titleY, opacity: titleOpacity, scale: titleScale, willChange: "transform, opacity" }}
              className="mt-20 md:mt-48 flex flex-col items-center justify-center text-center relative z-10 w-full"
            >
              <motion.span
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, letterSpacing: "0.4em" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-SoftApricot text-[10px] md:text-xs font-bold uppercase mb-4"
              >
                Case Study
              </motion.span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-black uppercase tracking-tighter leading-none md:leading-[0.8] mb-8 md:mb-12 font-Grotesk wrap-break-word break-all md:wrap-break-word w-full px-4">
                {selectedWork?.title.split(" ").map((word, i) => (
                  <span key={i} className="block last:text-white/50">
                    {word}
                  </span>
                ))}
              </h1>
            </motion.div>
          </PageSection>

          <PageSection index={2}>
            <motion.div
              style={{ scale: videoScale, rotateX: videoRotate, willChange: "transform" }}
              className="w-full mx-auto my-16 md:my-32 relative z-10 perspective-1000"
              data-hover-text="DRAG / PLAY"
            >
              <div className="relative group rounded-3xl md:rounded-[4rem] overflow-hidden bg-white/5 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full aspect-4/3 md:aspect-video lg:aspect-21/9">
                <video
                  ref={videoRef}
                  src={selectedWork?.video}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover block"
                />

                {/* Cinematic Overlay Vignette */}
                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

                {/* Apple-style Bottom Controls */}
                <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 z-30 w-[90%] md:w-auto justify-center">
                  {/* Progress Pill */}
                  <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full h-10 md:h-12 flex items-center px-4 md:px-6 gap-2 group/progress relative overflow-hidden transition-all duration-500 hover:bg-white/15">
                    {/* Scene Dots */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 hidden md:block ${
                          progress > (i / 6) * 100
                            ? "bg-TextWhite scale-125"
                            : "bg-white/20"
                        }`}
                      />
                    ))}
                    {/* Visual Slide active bar */}
                    <motion.div
                      initial={false}
                      animate={{ x: `${(progress / 100) * 80}px` }}
                      className="absolute bottom-2 left-6 h-0.5 w-[calc(100%-48px)] bg-white rounded-full opacity-0 group-hover/progress:opacity-50 transition-opacity hidden md:block"
                    />
                    <div className="md:hidden text-xs font-mono text-white/80">
                      {Math.round(progress)}%
                    </div>
                  </div>

                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="w-8 md:w-12 h-8 md:h-12 rounded-full bg-white text-black flex items-center justify-center border border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={isPlaying ? "pause" : "play"}
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isPlaying ? (
                          <Pause size={20} fill="currentColor" />
                        ) : (
                          <Play
                            size={20}
                            fill="currentColor"
                            className="ml-0.5"
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </button>

                  {/* Mute/Unmute Button */}
                  <button
                    onClick={toggleMute}
                    className="w-8 md:w-12 h-8 md:h-12 rounded-full bg-white text-black flex items-center justify-center border border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={isMuted ? "muted" : "unmuted"}
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isMuted ? (
                          <VolumeX size={20} fill="currentColor" />
                        ) : (
                          <Volume2 size={20} fill="currentColor" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>

                {/* Top Details (Optional site link) */}
                {/* <div className="absolute top-8 right-8 z-30">
                  <a
                    href={selectedWork?.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                  >
                    Launch Site
                  </a>
                </div> */}
              </div>
            </motion.div>
          </PageSection>

          <PageSection index={3}>
            <div className="w-full pb-32 md:pb-60 relative z-10 px-2 sm:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                {/* Left: Summary */}
                <div className="lg:col-span-8">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8 md:space-y-12"
                  >
                    <div>
                      <span className="text-SoftApricot text-[10px] mb-6 md:mb-8 block opacity-40 uppercase tracking-[0.4em] font-Grotesk">
                        01 / OVERVIEW
                      </span>
                      <div className="space-y-6">
                        {selectedWork?.desc.split("\n\n").map((para, i) => (
                          <p
                            key={i}
                            className="text-lg sm:text-xl md:text-2xl text-white/80 leading-relaxed font-light tracking-tight"
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                    {selectedWork?.credit && (
                      <div className="w-full h-auto max-h-[300px] md:max-h-[600px] rounded-2xl overflow-hidden mt-8 md:mt-12 bg-white/5">
                        <img
                          src={selectedWork.credit}
                          alt="project credit"
                          className="w-full h-full object-cover rounded-2xl"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Right: Stack */}
                <div className="lg:col-span-4 lg:border-l lg:border-white/10 lg:pl-12">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      duration: 1,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.2,
                    }}
                    className="space-y-8 md:space-y-12 pt-8 lg:pt-0"
                  >
                    <div>
                      <span className="text-SoftApricot font-mono text-[10px] mb-6 md:mb-12 block opacity-40 uppercase tracking-[0.4em]">
                        02 / HIGHLIGHTS
                      </span>
                      <div className="flex flex-wrap gap-3 md:gap-4">
                        {selectedWork?.stack?.map((item, i) => (
                          <motion.span
                            key={item}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold tracking-widest md:tracking-[0.2em] uppercase text-white/60 hover:border-SoftApricot/30 hover:text-white hover:bg-white/10 transition-all cursor-default w-full sm:w-auto text-center md:text-left"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </PageSection>
        </PageWrapper>
      </Suspense>
    </div>
  );
}
