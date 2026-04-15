import { Suspense, lazy, useRef } from "react";
import type { Route } from "./+types/home";
import SuspenseUi from "~/components/suspenseUi";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, WORKS, HERO_VIDEOS } from "~/lib/constants";

const VideoCarousel = lazy(() => import("~/components/videoComponent"));
const ContactCTA = lazy(() => import("~/components/contactCta"));
import { Link } from "react-router";
const MotionLink = motion.create(Link);

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "Jaaga Studio — Creative Designer, 3D Motion Designer & VFX Designer in Lagos",
    },
    {
      name: "description",
      content:
        "Portfolio of Jaaga Studio — a premium Creative Designer and 3D Motion Designer based in Lagos. Specializing in high-end VFX Direction and cinematic digital storytelling.",
    },
    {
      name: "keywords",
      content:
        "Vfx designer lagos, creative designer, 3d motion designer, VFX direction, motion graphics, CGI, portfolio",
    },
    {
      property: "og:title",
      content: "Jaaga Studio — Creative Designer & VFX Director",
    },
    {
      property: "og:description",
      content:
        "Cinematic digital experiences and visual storytelling by Jaaga Studio.",
    },
    { property: "og:type", content: "website" },
    { name: "tiktok:card", content: "summary_large_image" },
  ];
}

const WorkItem = ({ work, idx }: { work: (typeof WORKS)[0]; idx: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Unique parallax for the content within the card
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  // Assertive Text parallax for 3D feel
  const textY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);

  const isEven = idx % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative w-full md:w-[85%] lg:w-[75%] flex flex-col gap-6 ${
        isEven ? "self-start" : "self-end"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative block overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-black/60 shadow-2xl aspect-4/5 md:aspect-video border border-white/5 group"
      >
        <MotionLink
          to={`/work/${work.title.split(" ").join("-").toLowerCase()}`}
          className="w-full h-full block"
          data-hover-text="VIEW"
        >
          <motion.img
            style={{ y: imgY, scale: 1.15, willChange: "transform" }}
            src={work.image}
            alt={work.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.25] origin-center"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700 pointer-events-none" />
        </MotionLink>
      </motion.div>

      {/* Breakout Typography Layout */}
      <motion.div
        style={{ y: textY }}
        className={`absolute top-auto bottom-4 md:bottom-12 pointer-events-none flex flex-col z-20 ${
          isEven
            ? "left-6 -right-6 md:left-auto md:-right-24 text-left md:text-right items-start md:items-end"
            : "right-6 -left-6 md:right-auto md:-left-24 text-right md:text-left items-end md:items-start"
        }`}
      >
        <p className="text-VanillaCustard text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 drop-shadow-lg">
          {work.format || "Selected Work"}
        </p>
        <h3 className="text-5xl md:text-7xl lg:text-[7rem] font-black uppercase text-white leading-[0.85] tracking-tighter drop-shadow-2xl font-Grotesk">
          {work.title}
        </h3>
      </motion.div>
    </div>
  );
};

export default function Home() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const workRef = useRef(null);

  // Hero Parallax
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  // About Parallax
  const { scrollYProgress: aboutScroll } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });
  const aboutTitleY = useTransform(aboutScroll, [0, 1], ["50%", "-50%"]);
  const aboutTextY = useTransform(aboutScroll, [0, 1], ["-15%", "15%"]);

  // Services Parallax
  const { scrollYProgress: servicesScroll } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"],
  });
  const servicesTitleX = useTransform(servicesScroll, [0, 1], ["-5%", "5%"]);
  const servicesBgX = useTransform(servicesScroll, [0, 1], ["-10%", "30%"]);

  // Staggered Y parallax for the 3 service cards
  const servicesY1 = useTransform(servicesScroll, [0, 1], ["5%", "-5%"]);
  const servicesY2 = useTransform(servicesScroll, [0, 1], ["15%", "-15%"]);
  const servicesY3 = useTransform(servicesScroll, [0, 1], ["25%", "-25%"]);
  const servicesYTransforms = [servicesY1, servicesY2, servicesY3];

  // Work Section Parallax (Title area)
  const { scrollYProgress: workScroll } = useScroll({
    target: workRef,
    offset: ["start end", "end start"],
  });
  const workTitleX = useTransform(workScroll, [0, 1], ["0%", "10%"]);

  // Work Section Cinematic Hero (OUR WORK)
  const { scrollYProgress: ourWorkScroll } = useScroll({
    target: workRef,
    offset: ["start end", "end end"],
  });
  const ourWorkScale = useTransform(ourWorkScroll, [0, 0.5, 1], [1, 1, 0.95]);
  const ourWorkOpacity = useTransform(
    ourWorkScroll,
    [0, 0.35, 0.5, 0.8, 1],
    [0, 0, 1, 1, 0],
  );
  // Blur starts high when entering viewport, becomes clear when fully in view and stays clear
  const ourWorkBlurRadius = useTransform(
    ourWorkScroll,
    [0, 0.35, 0.5, 1],
    [20, 15, 0, 0],
  );
  const ourWorkY = useTransform(ourWorkScroll, [0.3, 1], ["0%", "40%"]);
  const ourWorkFilter = useMotionTemplate`blur(${ourWorkBlurRadius}px)`;

  // Professional-grade parallax for gallery columns
  // Column 1: Subtle vertical movement with slight horizontal drift
  const galleryYStep1 = useTransform(
    ourWorkScroll,
    [0.15, 0.4, 0.7, 0.9],
    ["8%", "-5%", "12%", "-8%"],
  );

  // Column 2: More pronounced movement with opposite horizontal drift
  const galleryYStep2 = useTransform(
    ourWorkScroll,
    [0.1, 0.35, 0.65, 0.85],
    ["15%", "-12%", "18%", "-15%"],
  );

  // Cross-section depth transition (Services -> Work)
  const { scrollYProgress: transitionScroll } = useScroll({
    target: workRef,
    offset: ["start end", "start center"],
  });
  const servicesScale = useTransform(transitionScroll, [0, 1], [1, 0.95]);
  const servicesOpacity = useTransform(transitionScroll, [0, 1], [1, 0.1]);
  const servicesYOut = useTransform(transitionScroll, [0, 1], ["0%", "-10%"]);

  return (
    <div className="bg-DarkBg text-TextWhite selection:bg-SoftApricot selection:text-black overflow-hidden relative">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          {/* Global cinematic dim overlay */}
          <div className="absolute inset-0 bg-black/40 z-1 pointer-events-none" />
          <Suspense fallback={<SuspenseUi />}>
            <VideoCarousel
              urls={HERO_VIDEOS}
              interval={10000}
              overlayContent={
                <div className="relative z-20 text-center text-TextWhite px-4">
                  {/* Dark lens overlay for text readability */}
                  <div className="absolute inset-0 -inset-x-20 -inset-y-10 bg-black/20 blur-3xl rounded-full scale-150 pointer-events-none" />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10"
                  >
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 uppercase font-Grotesk mix-blend-difference"
                    >
                      Jaaga Studios
                    </motion.h1>

                    {/* Cinematic accent line */}
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "40%", opacity: 1 }}
                      transition={{
                        duration: 1.5,
                        delay: 0.6,
                        ease: "circOut",
                      }}
                      className="h-px bg-linear-to-r from-transparent via-VanillaCustard to-transparent mx-auto mb-8"
                    />

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-lg md:text-2xl lg:text-3xl font-light tracking-[0.4em] opacity-90 uppercase text-VanillaCustard drop-shadow-md"
                    >
                      Engineering the Future of <br /> African Cinematic
                      Universes.
                    </motion.p>
                  </motion.div>
                </div>
              }
            />
          </Suspense>
        </motion.div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        id="about"
        className="py-40 px-6 md:px-12 lg:px-24 max-w-[1350px] mx-auto relative z-10 bg-DarkBg"
      >
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <motion.h2
              style={{ y: aboutTitleY }}
              className="text-sm font-bold tracking-[0.3em] uppercase text-SoftApricot md:w-1/4 shrink-0 mt-2"
            >
              001 / About
            </motion.h2>
            <motion.p
              style={{ y: aboutTextY }}
              className="text-3xl md:text-5xl font-medium leading-tight md:leading-tight lg:leading-tight text-white/90 md:w-3/4 font-Grotesk"
            >
              We don’t just render; we architect. We anchor raw African narratives with heavy cinematic rigor and AI-native scale. We don't chase the future—we build the universes where it lives. VFX. World-Building. Absolute Command.
              <br />
              <span className="text-white/40 block mt-8 text-2xl md:text-4xl font-sans">
                That’s the mandate.
              </span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section
        ref={servicesRef}
        id="services"
        className="py-40 px-6 md:px-12 lg:px-24 bg-BlackBerryCream/10 relative z-10 overflow-hidden pb-52"
      >
        {/* Parallax background tracking line */}
        <motion.div
          style={{ x: servicesBgX }}
          className="absolute top-0 left-[-50%] w-[200%] h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
        />

        <motion.div
          style={{
            scale: servicesScale,
            opacity: servicesOpacity,
            y: servicesYOut,
          }}
          className="max-w-[1400px] mx-auto relative z-10"
        >
          <motion.h2
            style={{ x: servicesTitleX }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-[0.3em] uppercase text-SoftApricot mb-32"
          >
            002 / Expertise
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-16">
            {SERVICES.map((service, idx) => (
              <motion.div
                key={service.title}
                style={{ y: servicesYTransforms[idx] }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group flex flex-col"
              >
                <h3 className="text-3xl md:text-4xl font-bold uppercase mb-6 text-VanillaCustard font-Grotesk">
                  {service.title}
                </h3>
                <p className="text-lg text-white/60 mb-10 leading-relaxed font-light">
                  {service.description}
                </p>
                <div className="mt-auto flex flex-col gap-3">
                  {service.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-3 text-sm font-medium tracking-widest uppercase text-white/80 group-hover:text-white transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-SoftApricot/50 group-hover:bg-SoftApricot transition-colors" />
                      {tag}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Work Section — True 3D Parallax Unified Architecture */}
      <section
        ref={workRef}
        id="work"
        className="relative z-10 w-full bg-DarkBg rounded-t-[3rem] md:rounded-t-[5rem] -mt-24 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* Layer 1 (Background): fixed Focal Text */}
        {/* It pins to the top and stays behind the cards until the section ends */}
        <div className="fixed top-0 h-screen w-full flex items-center justify-center pointer-events-none z-0">
          <motion.div
            style={{
              scale: ourWorkScale,
              opacity: ourWorkOpacity,
              filter: ourWorkFilter,
              y: ourWorkY,
            }}
            className="relative w-full max-w-4xl px-4"
          >
            {/* Corner camera crop marks */}
            <div className="absolute -top-16 -left-8 md:-left-16 w-8 md:w-16 h-8 md:h-16 border-t border-l border-white/20" />
            <div className="absolute -top-16 -right-8 md:-right-16 w-8 md:w-16 h-8 md:h-16 border-t border-r border-white/20" />
            <div className="absolute -bottom-16 -left-8 md:-left-16 w-8 md:w-16 h-8 md:h-16 border-b border-l border-white/20" />
            <div className="absolute -bottom-16 -right-8 md:-right-16 w-8 md:w-16 h-8 md:h-16 border-b border-r border-white/20" />

            {/* Center tracking marks */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-white/20 text-xl font-light">
              +
            </div>
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-white/20 text-xl font-light">
              +
            </div>

            <h2 className="text-[20vw] md:text-[16vw] xl:text-[14vw] font-black uppercase leading-[0.8] tracking-tighter text-TextWhite text-center">
              MY
              <br />
              WORK
            </h2>
          </motion.div>
        </div>

        {/* Layer 2 (Foreground): The Cinematic Exhibition */}
        {/* Uses a massive top padding so the sticky text is alone for exactly one viewport height before cards slide up */}
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 md:px-12 pt-[80vh] pb-40">
          <div className="flex justify-between items-end mb-20 md:mb-32 py-8 border-b border-white/5">
            <motion.h2
              style={{ x: workTitleX }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-bold tracking-[0.3em] uppercase text-SoftApricot whitespace-nowrap"
            >
              003 / Case Studies
            </motion.h2>
            <MotionLink
              to="/work"
              prefetch="intent"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold tracking-[0.2em] uppercase text-TextWhite hover:text-SoftApricot transition-colors flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-SoftApricot/50"
              aria-label="View all projects in the work archive"
            >
              Explore <span className="hidden md:block">Archive</span>{" "}
              <ArrowUpRight size={16} />
            </MotionLink>
          </div>

          <div className="relative flex flex-col gap-24 md:gap-40 lg:gap-52 w-full mt-10">
            {WORKS.map((work, idx) => (
              <WorkItem key={work.title} work={work} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Shared Contact Footer */}
      <Suspense fallback={<SuspenseUi />}>
        <ContactCTA title="Got a vision? Let's bring it to life." />
      </Suspense>
    </div>
  );
}
