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
import ContactCTA from "~/components/contactCta";
import { Link } from "react-router";
const MotionLink = motion(Link);

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

  // Translate the image vertically to create a parallax effect inside its container
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`group rounded-[2.5rem] relative block overflow-hidden bg-black/60 backdrop-blur-md border border-white/5 shadow-2xl aspect-4/3 ${
        idx % 2 === 1 ? "md:mt-32" : ""
      }`}
    >
      <motion.img
        style={{ y, scale: 1.15 }} // Scale up slightly so edges don't show during parallax
        src={work.image}
        alt={work.client}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 origin-center"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />

      <div className="absolute inset-0 p-8 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 pointer-events-none">
        <p className="text-SoftApricot text-sm font-bold tracking-[0.2em] uppercase mb-2">
          {work.role}
        </p>
        <h3 className="text-3xl font-bold uppercase text-white">
          {work.client}
        </h3>
      </div>
    </motion.div>
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
  // const galleryXStep1 = useTransform(
  //   ourWorkScroll,
  //   [0.2, 0.5, 0.8],
  //   ["0%", "-2%", "1%"],
  // );
  // const galleryRotate1 = useTransform(
  //   ourWorkScroll,
  //   [0.3, 0.6],
  //   ["0deg", "0.5deg"],
  // );

  // Column 2: More pronounced movement with opposite horizontal drift
  const galleryYStep2 = useTransform(
    ourWorkScroll,
    [0.1, 0.35, 0.65, 0.85],
    ["15%", "-12%", "18%", "-15%"],
  );
  // const galleryXStep2 = useTransform(
  //   ourWorkScroll,
  //   [0.25, 0.55, 0.75],
  //   ["0%", "3%", "-2%"],
  // );
  // const galleryRotate2 = useTransform(
  //   ourWorkScroll,
  //   [0.4, 0.7],
  //   ["0deg", "-0.3deg"],
  // );

  // Add depth scaling for parallax layers
  // const galleryScale1 = useTransform(ourWorkScroll, [0.2, 0.8], [1, 1.02]);
  // const galleryScale2 = useTransform(ourWorkScroll, [0.25, 0.75], [1, 0.98]);

  // Cross-section depth transition (Services -> Work)
  const { scrollYProgress: transitionScroll } = useScroll({
    target: workRef,
    offset: ["start end", "start center"],
  });
  const servicesScale = useTransform(transitionScroll, [0, 1], [1, 0.95]);
  const servicesOpacity = useTransform(transitionScroll, [0, 1], [1, 0.1]);
  const servicesYOut = useTransform(transitionScroll, [0, 1], ["0%", "-10%"]);

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-SoftApricot selection:text-black overflow-hidden relative">
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
                <div className="relative z-20 text-center text-white px-4">
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
                      className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] uppercase"
                    >
                      Jaaga Studios
                    </motion.h1>
                    
                    {/* Cinematic accent line */}
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "40%", opacity: 1 }}
                      transition={{ duration: 1.5, delay: 0.6, ease: "circOut" }}
                      className="h-px bg-linear-to-r from-transparent via-VanillaCustard to-transparent mx-auto mb-8"
                    />

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="text-lg md:text-2xl lg:text-3xl font-light tracking-[0.4em] opacity-90 uppercase text-VanillaCustard drop-shadow-md"
                    >
                      Creative Designer & VFX Director
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
        className="py-40 px-6 md:px-12 lg:px-24 max-w-[1350px] mx-auto relative z-10 bg-[#0a0a0a]"
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
              className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight md:leading-tight lg:leading-tight text-white/90 md:w-3/4"
            >
              I don’t chase trends. I outgrow them. I care about the work — how
              it hits, how it feels, and whether it still matters years from
              now. Design. Motion. VFX. Built to last.
              <br />
              <span className="text-white/40 block mt-8 text-2xl md:text-4xl">
                That’s it. That’s the pitch.
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
                <h3 className="text-3xl md:text-4xl font-bold uppercase mb-6 text-VanillaCustard">
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
        className="relative z-10 w-full bg-[#0a0a0a] rounded-t-[3rem] md:rounded-t-[5rem] -mt-24 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
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

            <h2 className="text-[20vw] md:text-[16vw] xl:text-[14vw] font-black uppercase leading-[0.8] tracking-tighter text-white text-center">
              MY
              <br />
              WORK
            </h2>
          </motion.div>
        </div>

        {/* Layer 2 (Foreground): The Gallery Grid */}
        {/* Uses a massive top padding so the sticky text is alone for exactly one viewport height before cards slide up */}
        <div className="relative z-10 w-full max-w-[1350px] mx-auto px-6 md:px-12 lg:px-24 pt-[80vh] pb-40">
          <div className="flex justify-between items-end mb-10 md:mb-20 py-8 border-b border-white/5">
            <motion.h2
              style={{ x: workTitleX }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-bold tracking-[0.3em] uppercase text-SoftApricot whitespace-nowrap"
            >
              003 / Selected Work
            </motion.h2>
            <MotionLink
              to="/work"
              prefetch="intent"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold tracking-[0.2em] uppercase text-white hover:text-SoftApricot transition-colors flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-SoftApricot/50"
              aria-label="View all projects in the work archive"
            >
              View <span className="hidden md:block">Archive</span>{" "}
              <ArrowUpRight size={16} />
            </MotionLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              style={{ y: galleryYStep1 }}
              className="flex flex-col gap-8 lg:mt-24"
            >
              {WORKS.filter((_, idx) => idx % 2 === 0).map((work, idx) => (
                <WorkItem key={work.client} work={work} idx={idx} />
              ))}
            </motion.div>

            {/* Column 2 */}
            <motion.div
              style={{ y: galleryYStep2 }}
              className="flex flex-col gap-8"
            >
              {WORKS.filter((_, idx) => idx % 2 !== 0).map((work, idx) => (
                <WorkItem key={work.client} work={work} idx={idx} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shared Contact Footer */}
      <ContactCTA title="Got a vision? Let's bring it to life." />
    </div>
  );
}
