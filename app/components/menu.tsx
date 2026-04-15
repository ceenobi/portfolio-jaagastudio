import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import { cn } from "~/lib/utils";

interface MenuProps {
  links: { name: string; href: string }[];
}

export default function Menu({ links }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  // Apple-style smooth spring transitions
  const overlayVariants: Variants = {
    closed: {
      opacity: 0,
      pointerEvents: "none",
    },
    open: {
      opacity: 1,
      pointerEvents: "auto",
    },
  };

  const cardVariants: Variants = {
    closed: {
      y: -100,
      opacity: 0,
      scale: 0.95,
    },
    open: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    closed: { y: 20, opacity: 0 },
    open: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
    },
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="z-100 flex items-center bg-CrimsonRed text-white rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl border border-white/5 h-12 pr-4 overflow-hidden cursor-pointer"
      >
        <div className="flex items-center gap-3 h-full pl-6 pr-2">
          <span className="text-xs font-bold tracking-[0.2em] uppercase">
            {isOpen ? "Close" : path === "/" ? "Menu" : path.split("/")[1]}
          </span>
          <div className="w-px h-4 bg-white/20 ml-2" />
        </div>
        <div className="flex flex-col gap-1 justify-center">
          {links.map((link) => (
            <span
              key={link.href}
              className={cn(
                " w-1 h-1 bg-white rounded-full",
                path.split("/")[1] === link.href ? "" : "opacity-40",
              )}
            />
          ))}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-90 flex p-4 lg:p-10 pointer-events-none"
          >
            {/* Backdrop Blur */}
            <motion.div
              initial={{
                backdropFilter: "blur(0px)",
                backgroundColor: "rgba(10, 10, 10, 0)",
              }}
              animate={{
                backdropFilter: "blur(12px)",
                backgroundColor: "rgba(10, 10, 10, 0.4)",
              }}
              exit={{
                backdropFilter: "blur(0px)",
                backgroundColor: "rgba(10, 10, 10, 0)",
              }}
              className="absolute inset-0 pointer-events-auto cursor-pointer"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Card */}
            <motion.div
              variants={cardVariants}
              className="relative w-full max-w-[1200px] m-auto bg-AmberStreet rounded-[3rem] p-10 lg:p-20 shadow-[0_100px_80px_rgba(0,0,0,0.1)] pointer-events-auto flex flex-col md:flex-row justify-between"
            >
              <div className="flex flex-col gap-6 lg:gap-10">
                {links.map((link) => (
                  <motion.div key={link.href} variants={itemVariants}>
                    <NavLink
                      to={link.href}
                      prefetch="intent"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `text-[4rem] lg:text-[7rem] font-bold leading-none tracking-tight block transition-all duration-500 will-change-transform active:scale-95 ${
                          isActive
                            ? "text-BlackBerryCream"
                            : "text-[#955413] hover:text-BlackBerryCream hover:pl-4"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <div className="hidden lg:flex flex-col justify-end items-end text-BlackBerryCream/40 max-w-[300px] text-right">
                <p className="text-sm font-medium leading-relaxed uppercase tracking-[0.3em] mb-4 text-BlackBerryCream/60">
                  Creative Bureau & VFX Studio
                </p>
                <div className="w-[100px] h-px bg-BlackBerryCream/20 mb-8" />
                <p className="text-xs tracking-wider">
                  Pushing boundaries of visual experiences through light,
                  texture, and motion.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
