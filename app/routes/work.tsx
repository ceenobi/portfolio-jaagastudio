import { lazy, Suspense, useRef, useState } from "react";
import type { Route } from "./+types/work";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageSection, PageWrapper } from "~/components/pageWrapper";
import { WORKS } from "~/lib/constants";
import SuspenseUi from "~/components/suspenseUi";
import ContactCTA from "~/components/contactCta";

const WorkCards = lazy(() => import("~/components/workCards"));

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "Selected Works — Jaaga Studio | VFX Designer Lagos & 3D Motion Designer",
    },
    {
      name: "description",
      content:
        "Explore the portfolio of Jaaga Studio, a specialized VFX Designer in Lagos and 3D Motion Designer. Featuring high-end CGI, cinematic direction, and industry-leading visual effects.",
    },
    {
      name: "keywords",
      content:
        "Vfx designer lagos, 3d motion designer, creative designer, CGI portfolio, visual effects",
    },
  ];
}

export default function Work() {
  const servicesRef = useRef(null);
  const { scrollYProgress: servicesScroll } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"],
  });
  const servicesTitleX = useTransform(servicesScroll, [0, 1], ["-0%", "0%"]);
  const [activeVideoIdx, setActiveVideoIdx] = useState<number | null>(null);

  const handleVideoToggle = (idx: number) => {
    setActiveVideoIdx(activeVideoIdx === idx ? null : idx);
  };

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-SoftApricot selection:text-black py-4">
      <Suspense fallback={<SuspenseUi />}>
        <PageWrapper>
          <PageSection index={0}>
            <motion.h2
              style={{ x: servicesTitleX }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mx-auto text-sm font-bold tracking-[0.3em] uppercase text-SoftApricot my-10"
            >
              Projects
            </motion.h2>
            <motion.p className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight md:leading-tight lg:leading-tight text-white/90 md:w-4/4">
              Each project I've handled holds sentimental importance and
              showcases my
              <span className="text-SoftApricot leading-relaxed mx-3">
                passion
              </span>
              for expressive art.
            </motion.p>
          </PageSection>
          <PageSection
            index={1}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-16 pb-32"
          >
            {WORKS.map((work, idx) => (
              <WorkCards 
                key={idx} 
                work={work} 
                idx={idx} 
                isPlaying={activeVideoIdx === idx}
                onPlayToggle={() => handleVideoToggle(idx)}
              />
            ))}
          </PageSection>
          <ContactCTA title="Ready to start a project?" />
        </PageWrapper>
      </Suspense>
    </div>
  );
}
