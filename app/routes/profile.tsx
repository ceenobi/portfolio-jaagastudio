import { PageSection, PageWrapper } from "~/components/pageWrapper";
import { useRef, lazy, Suspense } from "react";
import SuspenseUi from "~/components/suspenseUi";
import type { Route } from "./+types/profile";
import { motion, useScroll, useTransform } from "framer-motion";
import ImageComponent from "~/components/imageComponent";
import { GradualSpacing } from "~/components/gradualSpacing";
const ContactCTA = lazy(() => import("~/components/contactCta"));
import { Trophy, Award, Globe, Building } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Jaaga Studio — Creative Designer & VFX Designer Lagos" },
    {
      name: "description",
      content:
        "Learn more about Jaaga Studio, a multidisciplinary Creative Designer and 3D Motion Designer based in Lagos. Specializing in bridging the gap between vision and technical execution.",
    },
    {
      name: "keywords",
      content: "Vfx designer lagos, creative designer, 3d motion designer, bio",
    },
  ];
}

const CORE_GOALS = [
  {
    title: "Command the Global Stage",
    desc: "To prove that authentic African narratives, backed by heavy cinematic rigor and AI innovation, belong at the absolute top tier of the international film and tech industries.",
  },
  {
    title: "Shatter Hardware Limitations",
    desc: "To build a borderless, high-speed digital pipeline that leverages generative AI to bypass traditional studio constraints and deliver world-class visual assets at scale.",
  },
  {
    title: "Build Original IP",
    desc: "To engineer deep, psychological, and culturally grounded original franchises—turning local realities and historical lore into premium Afrofuturist and psychological cinematic universes.",
  },
];

const LAURELS = [
  {
    title: "Finalist: Africa AI Creativity Week",
    subtitle: "GITEX Africa 2026, Marrakech",
    icon: Trophy,
  },
  {
    title: "Official Selection",
    subtitle: "Global Network Pinewood UK",
    icon: Award,
  },
  {
    title: "Founding 100 Inductee",
    subtitle: "GenFlix AI Global Platform",
    icon: Globe,
  },
  {
    title: "Registered Entity",
    subtitle: "Corporate Affairs Commission (CAC), Nigeria",
    icon: Building,
  },
];

export default function Profile() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth color and motion transforms
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    ["#0a0a0a", "#121214", "#161216", "#0a0a0a"],
  );

  // Section 0 (Hero) transitions
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

  // Section 1 (Bio) transitions - "Sliding Up" and "Sustained Visibility"
  const bioY = useTransform(scrollYProgress, [0.05, 0.2], [400, 0]);
  const bioOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.15], // Reveal quickly as hero fades out
    [0, 1],
  );

  // Section 5 (Contact CTA) transitions - "Subtle Rise and Lock"
  const cardY = useTransform(scrollYProgress, [0.8, 0.98], [60, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [0.8, 0.98], [0.98, 1]);

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
      className="min-h-screen overflow-x-clip text-TextWhite selection:bg-SoftApricot selection:text-black py-4 transition-colors duration-700 ease-out"
    >
      <PageWrapper>
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-0"
        >
          <PageSection index={0}>
            <motion.h2 className="mx-auto text-sm font-bold tracking-[0.3em] uppercase text-SoftApricot my-10 font-Grotesk">
              Bio
            </motion.h2>
            <div className="flex flex-col gap-4">
              <GradualSpacing
                text="Headquartered in Lagos, Nigeria, Jaaga Studios is a premier digital animation and VFX house specializing in high-end, AI-native filmmaking. We bridge the gap between authentic African street culture and top-tier global commercial production. We do not just adopt new technology; we command it to build expansive, culturally resonant cinematic universes."
                className="text-3xl md:text-4xl lg:text-5xl font-medium md:leading-tight text-white/90"
              />
              <div className="mt-6">
                <GradualSpacing
                  text="Available for collaborations & creative direction."
                  className="text-white/40 text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight"
                  delayPerChar={0.09}
                />
              </div>
            </div>
          </PageSection>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-6 md:left-12 flex items-center gap-4 text-white/40 font-bold tracking-[0.3em] uppercase text-xs"
        >
          Scroll
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="w-px h-10 bg-linear-to-b from-white/40 to-transparent"
          />
        </motion.div>

        {/* ── Parallax Bio Section ── */}
        <motion.div
          style={{
            y: bioY,
            opacity: bioOpacity,
            willChange: "transform, opacity",
          }}
          className="relative z-10"
        >
          <PageSection index={1} className="mt-20 lg:mt-32 pb-48 px-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
              {/* ── Left: Immersive Image with Parallax ── */}
              <div
                className="lg:col-span-5 relative group"
                id="profile-image-container"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="relative aspect-4/5 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5"
                >
                  <motion.div
                    style={{
                      y: useTransform(scrollYProgress, [0, 1], [-120, 120]),
                      scale: 1.25,
                    }}
                    className="w-full h-full"
                  >
                    <ImageComponent cellValue="https://res.cloudinary.com/ceenobi/image/upload/v1776177332/clientproject/havisClient/80e93e1bf36be47afb45bd818a6a2d74_tplv-tiktokx-cropcenter_1080_1080_ftbw5z.jpg" />
                  </motion.div>

                  {/* Subtle Overlay Glow */}
                  <div className="absolute inset-0 bg-linear-to-t from-DarkBg/60 via-transparent to-transparent pointer-events-none" />
                </motion.div>

                {/* Decorative Pill Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 -right-3 lg:-right-12 bg-VanillaCustard text-BlackBerryCream px-6 py-4 rounded-2xl shadow-2xl z-10"
                >
                  <p className="text-xs font-bold tracking-[0.2em] uppercase">
                    Based in Lagos, NG
                  </p>
                </motion.div>
              </div>

              {/* ── Right: Refined Bio Content ── */}
              <div className="lg:col-span-7 flex flex-col gap-10 lg:pt-12">
                <div className="space-y-4">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-SoftApricot text-sm font-bold tracking-[0.3em] uppercase inline-block"
                  >
                    The Artisan
                  </motion.span>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold tracking-tight text-white/95 font-Grotesk"
                  >
                    Paul Danmole
                  </motion.h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="w-8 h-px bg-SoftApricot/30" />
                    <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                      As the Founder and VFX Director, Paul engineers the
                      creative and technical pipeline for Jaaga Studios.
                      Operating at the intersection of{" "}
                      <span className="text-SoftApricot font-medium">
                        high-level CGI mastery
                      </span>{" "}
                      and cultural authenticity, he directs complex visual
                      effects projects using advanced workflows.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="w-8 h-px bg-SoftApricot/30" />
                    <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                      From managing the dedicated JAAG Elites digital community
                      to executing global corporate retainers, Paul’s mandate is
                      clear: build a borderless studio capable of executing
                      premium, AI-driven commercial art and cinema at the
                      highest possible level.
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 p-8 rounded-3xl bg-white/3 border border-white/5 backdrop-blur-sm"
                >
                  <p className="text-lg italic text-white/50 border-l-2 border-SoftApricot pl-6 py-2">
                    "We do not just make art; we solve massive commercial and
                    narrative problems."
                  </p>
                </motion.div>
              </div>
            </div>
          </PageSection>
        </motion.div>

        <PageSection index={2}>
          <div className="py-32 lg:py-48 px-0 border-t border-white/5">
            <div className="mb-24">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-SoftApricot text-sm font-bold tracking-[0.3em] uppercase block mb-4"
              >
                Vision
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white font-Grotesk"
              >
                The Core Goals of <br className="hidden md:block" /> Jaaga
                Studios
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CORE_GOALS.map((goal, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: idx * 0.15,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group p-8 md:p-10 rounded-[2rem] bg-white/3 border border-white/5 hover:border-SoftApricot/30 transition-all duration-500 backdrop-blur-sm relative overflow-hidden h-full flex flex-col"
                >
                  <div className="absolute inset-0 bg-linear-to-tr from-SoftApricot/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <span className="text-SoftApricot/20 font-mono text-5xl md:text-6xl font-black mb-10 block group-hover:text-SoftApricot/40 transition-colors">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-6 font-Grotesk uppercase tracking-tight">
                    {goal.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed font-light text-base md:text-lg">
                    {goal.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </PageSection>
        <PageSection index={3}>
          <div className="py-32 lg:py-48 px-0 border-t border-white/5">
            <div className="mb-24">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-SoftApricot text-sm font-bold tracking-[0.3em] uppercase block mb-4"
              >
                Validation
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white font-Grotesk"
              >
                Global Laurels & <br className="hidden md:block" /> Validation
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {LAURELS.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: idx * 0.1,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group flex gap-6 p-8 rounded-[2rem] bg-white/3 border border-white/5 hover:bg-white/5 transition-all duration-500 backdrop-blur-sm"
                >
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-SoftApricot/10 flex items-center justify-center text-SoftApricot group-hover:scale-110 transition-transform duration-500">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 font-Grotesk">
                      {item.title}
                    </h3>
                    <p className="text-white/40 text-sm tracking-wide uppercase font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </PageSection>

        {/* ── The Directive ── */}
        <PageSection index={4}>
          <div className="py-40 lg:py-60 px-0 border-y border-white/5 relative overflow-hidden">
            {/* Dynamic Background Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-SoftApricot/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-SoftApricot text-xs font-bold tracking-[0.5em] uppercase block mb-12"
              >
                The Directive
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-[8rem] font-black tracking-tighter text-white mb-16 leading-[0.9] uppercase font-Grotesk"
              >
                Deploy <br /> Jaaga Studios
              </motion.h2>

              <div className="h-px w-24 bg-SoftApricot/30 mx-auto mb-16" />

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-2xl md:text-3xl lg:text-4xl text-white/80 font-light leading-snug tracking-tight font-Grotesk"
              >
                The tools are changing, but the cinematic rigor stays the same.
                Whether you are launching a global SaaS product, dropping a
                heavy Afrobeats record, or funding the next great sci-fi
                franchise,{" "}
                <span className="text-white font-bold">
                  Jaaga Studios is ready to execute.
                </span>
              </motion.p>
            </div>
          </div>
        </PageSection>

        <motion.div
          style={{
            opacity: cardOpacity,
            y: cardY,
            scale: cardScale,
            willChange: "transform, opacity",
          }}
        >
          <PageSection index={5} className="">
            <Suspense fallback={<SuspenseUi />}>
              <ContactCTA
                title="Want to build something together?"
                isFullHeight={false}
                className="w-full border-none bg-transparent"
              />
            </Suspense>
          </PageSection>
        </motion.div>
      </PageWrapper>
    </motion.div>
  );
}
