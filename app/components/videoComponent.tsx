import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  getCloudinaryVideo,
  getCloudinaryVideoPoster,
  VIDEO_BREAKPOINTS,
} from "~/lib/utils";

interface VideoCarouselProps {
  /** Array of Cloudinary video URLs */
  urls: string[];
  /** Duration per slide in ms (default 5000) */
  interval?: number;
  /** Whether to show navigation controls */
  showControls?: boolean;
  /** Whether to show slide indicators */
  showIndicators?: boolean;
  /** Overlay content to render on top of the video */
  overlayContent?: React.ReactNode;
}

/**
 * Detects the current device breakpoint based on viewport width.
 */
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<
    keyof typeof VIDEO_BREAKPOINTS
  >("desktop");

  useEffect(() => {
    function detect() {
      const w = window.innerWidth;
      if (w < 768) setBreakpoint("mobile");
      else if (w < 1280) setBreakpoint("tablet");
      else setBreakpoint("desktop");
    }
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  return breakpoint;
}

/** Fade transition variants */
const slideVariants: Variants = {
  enter: {
    opacity: 0,
    scale: 0.95,
  },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { duration: 0.6 },
      scale: { duration: 0.8, ease: "easeOut" },
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: {
      opacity: { duration: 0.4 },
      scale: { duration: 0.4, ease: "easeIn" },
    },
  },
};

/** Smooth progress indicator driven by MotionValue */
function VideoProgressBar({ videoEl }: { videoEl: HTMLVideoElement | null }) {
  const rawProgress = useMotionValue(0);
  const scaleX = useSpring(rawProgress, { stiffness: 80, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (!videoEl) return;

    // Reset when video changes
    rawProgress.set(0);

    const onTimeUpdate = () => {
      if (videoEl.duration > 0) {
        rawProgress.set(videoEl.currentTime / videoEl.duration);
      }
    };

    const onEnded = () => rawProgress.set(1);

    videoEl.addEventListener("timeupdate", onTimeUpdate);
    videoEl.addEventListener("ended", onEnded);
    return () => {
      videoEl.removeEventListener("timeupdate", onTimeUpdate);
      videoEl.removeEventListener("ended", onEnded);
    };
  }, [videoEl, rawProgress]);

  return (
    <motion.span
      className="video-carousel__dot-progress"
      style={{ scaleX, originX: 0 }}
    />
  );
}

export default function VideoCarousel({
  urls,
  interval = 10000,
  showControls = true,
  showIndicators = true,
  overlayContent,
}: VideoCarouselProps) {
  const [[currentIndex, direction], setSlide] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeVideoEl, setActiveVideoEl] = useState<HTMLVideoElement | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breakpoint = useBreakpoint();

  const totalSlides = urls.length;

  /** Navigate to next or previous slide */
  const paginate = useCallback(
    (newDirection: number) => {
      setSlide(([prev]) => {
        const next =
          (prev + newDirection + totalSlides) % totalSlides;
        return [next, newDirection];
      });
      setIsLoaded(false);
    },
    [totalSlides],
  );

  // The auto-advance timer has been removed in favor of the native video onEnded event

  /** Play the current video, pause all others, and track the active element */
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (idx === currentIndex) {
        video.currentTime = 0;
        video.muted = true; // Always mute first to ensure autoplay works
        video.play().catch(() => {});
        setActiveVideoEl(video);
      } else {
        video.pause();
      }
    });
  }, [currentIndex]);

  /** Apply mute state to the active video */
  useEffect(() => {
    const activeVideo = videoRefs.current.get(currentIndex);
    if (activeVideo) activeVideo.muted = isMuted;
  }, [isMuted, currentIndex]);

  const bp = VIDEO_BREAKPOINTS[breakpoint];

  /** Generate optimised URL for this breakpoint */
  const getOptimizedUrl = useCallback(
    (url: string) => getCloudinaryVideo(url, bp.width, bp.height, bp.quality),
    [bp],
  );

  /** Generate poster thumbnail */
  const getPoster = useCallback(
    (url: string) => getCloudinaryVideoPoster(url, bp.width, bp.height, 1),
    [bp],
  );

  /** Touch/swipe support */
  const touchStartX = useRef(0);

  if (!urls.length) return null;

  return (
    <section
      className="video-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) paginate(dx < 0 ? 1 : -1);
      }}
    >
      {/* Video slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="video-carousel__slide"
        >
          <video
            ref={(el) => {
              if (el) {
                videoRefs.current.set(currentIndex, el);
              }
            }}
            src={getOptimizedUrl(urls[currentIndex])}
            poster={getPoster(urls[currentIndex])}
            muted
            autoPlay
            playsInline
            loop={totalSlides === 1}
            preload="auto"
            onEnded={() => {
              if (totalSlides > 1) paginate(1);
            }}
            onLoadedData={() => {
              setIsLoaded(true);
              const el = videoRefs.current.get(currentIndex);
              if (el) {
                el.play().catch(() => {});
                setActiveVideoEl(el);
              }
            }}
            className="video-carousel__video"
          />
          {/* Dark gradient overlay for readability */}
          <div className="video-carousel__gradient" />
        </motion.div>
      </AnimatePresence>

      {/* Loading shimmer */}
      {/* {!isLoaded && (
        <div className="video-carousel__loader">
          <div className="video-carousel__loader-pulse" />
        </div>
      )} */}

      {/* Overlay content (e.g. hero text) */}
      {overlayContent && (
        <div className="video-carousel__overlay">{overlayContent}</div>
      )}

      {/* Navigation arrows */}
      {/* {showControls && totalSlides > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="video-carousel__arrow video-carousel__arrow--left"
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => paginate(1)}
            className="video-carousel__arrow video-carousel__arrow--right"
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )} */}

      {/* Bottom bar: indicators + mute btn */}
      <div className="video-carousel__bottom">
        {/* Slide indicators — Apple-style live progress pills */}
        {showIndicators && totalSlides > 1 && (
          <div className="video-carousel__indicators">
            {urls.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide([i, i > currentIndex ? 1 : -1])}
                className={`video-carousel__dot ${
                  i === currentIndex
                    ? "video-carousel__dot--active"
                    : i < currentIndex
                      ? "video-carousel__dot--played"
                      : ""
                }`}
                aria-label={`Go to slide ${i + 1}`}
              >
                {i === currentIndex && (
                  <VideoProgressBar key={currentIndex} videoEl={activeVideoEl} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Mute / unmute */}
        {/* <button
          onClick={() => setIsMuted((m) => !m)}
          className="video-carousel__mute-btn"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button> */}
      </div>

      {/* Slide counter */}
      {/* {totalSlides > 1 && (
        <div className="video-carousel__counter">
          <span>{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="video-carousel__counter-sep">/</span>
          <span className="opacity-60">
            {String(totalSlides).padStart(2, "0")}
          </span>
        </div>
      )} */}
    </section>
  );
}
