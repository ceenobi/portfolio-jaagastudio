import { PageSection, PageWrapper } from "~/components/pageWrapper";
import { useRef } from "react";
import type { Route } from "./+types/profile";
import { motion, useScroll, useTransform } from "framer-motion";
import ImageComponent from "~/components/imageComponent";
import { GradualSpacing } from "~/components/gradualSpacing";
import ContactCTA from "~/components/contactCta";

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
  const bioY = useTransform(scrollYProgress, [0.1, 0.5], [400, 0]);
  const bioOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.6], // Early intro, then stay visible
    [0, 1],
  );

  // Section 2 (Card) transitions - "Subtle Rise and Lock"
  const cardY = useTransform(scrollYProgress, [0.7, 0.95], [60, 100]);
  const cardOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [0.7, 0.95], [0.98, 1]);

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
      className="min-h-screen overflow-x-clip text-white selection:bg-SoftApricot selection:text-black py-4 transition-colors duration-700 ease-out"
    >
      <PageWrapper>
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-0"
        >
          <PageSection index={0}>
            <motion.h2 className="mx-auto text-sm font-bold tracking-[0.3em] uppercase text-SoftApricot my-10">
              Bio
            </motion.h2>
            <div className="flex flex-col gap-4">
              <GradualSpacing
                text="Visual storyteller blending design, motion, and VFX. I create bold, cinematic content that captures attention and sticks. With a strong eye for detail and a deep understanding of aesthetics, I transform ideas into striking visuals that captivate and engage audiences."
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium md:leading-tight text-white/90"
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
          style={{ y: bioY, opacity: bioOpacity }}
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
                    <ImageComponent cellValue="https://res.cloudinary.com/ceenobi/image/upload/v1673425503/Fashion/679170_9PLP8_9520_004_100_0000_Light-520-Marina-Scarlet-Limited-Edition-Rouge-Lvres-Voile_xcrfai.jpg" />
                  </motion.div>

                  {/* Subtle Overlay Glow */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a]/60 via-transparent to-transparent pointer-events-none" />
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
                    className="text-4xl md:text-6xl font-bold tracking-tight text-white/95"
                  >
                    Jaaga Studios
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
                      Hello! I'm a visual architect dedicated to the craft of{" "}
                      <span className="text-white font-medium">cinematic storytelling</span>. 
                      My journey as a VFX Director is driven by the obsession of blending 
                      photorealistic detail with abstract imagination, ensuring every frame 
                      tells a story that words cannot.
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
                      Today, I lead creative directions that redefine{" "}
                      <span className="text-white font-medium">
                        visual boundaries
                      </span>. 
                      From complex simulations to high-end digital aesthetics, I bridge 
                      the gap between abstract concepts and hyper-realistic execution, 
                      crafting experiences that are both technically sound and emotionally resonant.
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
                    "I don't just create visuals; I direct digital symphonies that manipulate light, motion, and perception."
                  </p>
                </motion.div>
              </div>
            </div>
          </PageSection>
        </motion.div>
        <motion.div
          style={{ opacity: cardOpacity, y: cardY, scale: cardScale }}
        >
          <PageSection index={2} className="">
            <ContactCTA
              title="Want to build something together?"
              isFullHeight={false}
              className="w-full border-none bg-transparent"
            />
          </PageSection>
        </motion.div>
      </PageWrapper>
    </motion.div>
  );
}
