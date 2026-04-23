import { Outlet, useLocation } from "react-router";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import Cursor from "~/components/cursor";
import { AnimatePresence, motion } from "framer-motion";
import { ReactLenis } from "lenis/react";

export default function RootLayout() {
  const location = useLocation();

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.08, 
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
        infinite: false 
      }}
    >
      <div className="grain-overlay" />
      <Cursor />
      <Navbar />
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity, filter" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </ReactLenis>
  );
}
