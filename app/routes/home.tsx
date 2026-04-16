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
            ? "left-4 right-4 md:left-auto md:-right-24 text-left md:text-right items-start md:items-end"
            : "right-4 left-4 md:right-auto md:-left-24 text-right md:text-left items-end md:items-start"
        }`}
      >
        <p className="text-VanillaCustard text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 drop-shadow-lg">
          {work.format || "Selected Work"}
        </p>
        <h3 className="text-4xl md:text-7xl lg:text-8xl xl:text-[8rem] font-black uppercase text-white leading-[0.85] tracking-tighter drop-shadow-2xl font-Grotesk wrap-break-word">
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
    <div className="bg-DarkBg text-TextWhite selection:bg-SoftApricot selection:text-black overflow-x-hidden w-full flex flex-col relative">
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
                  <div className="absolute inset-0 bg-black/20 blur-3xl rounded-full scale-150 pointer-events-none" />

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
                      className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 uppercase font-Grotesk mix-blend-difference wrap-break-word break-all md:wrap-break-word w-full px-2"
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
              className="text-3xl md:text-4xl lg:text-[2.5rem] xl:text-5xl font-medium leading-tight md:leading-tight lg:leading-tight text-white/90 md:w-3/4 font-Grotesk"
            >
              We don’t just render; we architect. We anchor raw African
              narratives with heavy cinematic rigor and AI-native scale. We
              don't chase the future—we build the universes where it lives. VFX.
              World-Building. Absolute Command.
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-12 lg:gap-16">
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
        className="relative z-10 w-full bg-DarkBg rounded-t-[3rem] md:rounded-t-[5rem] -mt-24 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-x-hidden"
      >
        {/* Layer 1 (Background): fixed Focal Text */}
        {/* It pins to the top and stays behind the cards until the section ends */}
        <div className="fixed top-0 h-screen w-full flex items-center justify-center pointer-events-none z-0 overflow-hidden">
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
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 md:px-12 pt-[20vh] pb-40">
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
              Explore <span className="hidden md:block">Works</span>{" "}
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

      <section className="relative z-10 w-full max-w-[1500px] mx-auto px-6 md:px-12 py-32 md:py-48 border-t border-white/5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Section 8 Left: Sticky Intro */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-SoftApricot text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-6 block">
                004 / Engineering Music Cinema
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white/95 font-Grotesk mb-8 leading-[1.1]">
                The Audio-Visual Blueprint
              </h2>
              <div className="w-12 h-px bg-SoftApricot/30 mb-8" />
              <div className="space-y-6 text-lg md:text-xl text-white/70 leading-relaxed font-light tracking-tight">
                <p>
                  <strong className="text-white font-medium">
                    The Rhythm-to-Render Pipeline:{" "}
                  </strong>
                  At Jaaga Studios, we do not just react to a beat; we
                  reverse-engineer the frequency.
                </p>
                <p>
                  To match the heavy cultural weight of contemporary Afrobeats
                  and the global standard set by artists like Wizkid, Asake,
                  Rema, and Odumodublvck, our visual pipeline treats audio as
                  the baseline for digital physics. This explains our exact
                  process to A&R reps and record labels.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Section 8 Right: The Pipeline Steps */}
          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-12 lg:pt-12">
            {[
              {
                title: "Audio Deconstruction",
                desc: "We break down the track's percussive heavy-lifting and vocal cadences to build a visual shot list that matches the exact BPM and psychological energy of the song.",
              },
              {
                title: "AI-Native Pre-Visualization",
                desc: "We generate rapid, high-fidelity storyboards and environmental concepts, allowing artists and labels to see the world-building before rendering begins.",
              },
              {
                title: "The Visual Drop (Execution)",
                desc: "We deploy our Top 1% compositing arsenal to build hyper-luxury environments, dynamic vehicle chases, and high-stakes street narratives that elevate the track from a simple audio file into a global cultural moment.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 1,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative group p-8 md:p-12 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className="absolute top-4 md:top-8 right-6 md:right-10 text-white/5 font-black text-6xl md:text-8xl select-none font-mono pointer-events-none">
                  0{index + 1}
                </div>
                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-white/60 leading-relaxed font-light max-w-xl">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section IX: Key Art & Poster Division */}
      <section className="relative w-full max-w-[1500px] mx-auto px-6 md:px-12 py-20 md:py-32 mb-20 md:mb-32 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-[#050505] border border-white/10 py-24 md:py-32 px-6 md:px-20 text-center shadow-[0_100px_200px_-50px_rgba(0,0,0,1)]"
        >
          {/* Subtle glow orb behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] max-w-3xl bg-SoftApricot/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
            <span className="text-SoftApricot text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-8 md:mb-12 block">
              005 / Key Art & Poster Division
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic text-white/90 leading-tight tracking-tight mb-16 md:mb-24">
              "A film or a track does not exist until the promotional artwork
              stops the scroll."
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 text-left pt-12 md:pt-16 border-t border-white/10">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-6 uppercase tracking-widest text-center lg:text-left font-Grotesk">
                  Cinematic Posters
                </h3>
                <p className="text-base md:text-lg text-white/60 leading-relaxed font-light">
                  The visual campaign starts long before the video drops. Jaaga
                  Studios engineers high-retention, cinematic key art and
                  promotional posters that command immediate authority.
                </p>
              </div>
              <div className="lg:mt-14">
                <p className="text-base md:text-lg text-white/60 leading-relaxed font-light">
                  From freezing the chaotic energy of Lagos traffic to designing
                  high-fashion, neon-drenched heist announcements, our posters
                  are built with the same rigorous 3D lighting and compositing
                  standards as our motion pictures. We design the visual hook
                  that makes the global audience click{" "}
                  <strong className="text-white font-medium">"Play"</strong>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Shared Contact Footer */}
      <Suspense fallback={<SuspenseUi />}>
        <ContactCTA title="Got a vision? Let's bring it to life." />
      </Suspense>
    </div>
  );
}
