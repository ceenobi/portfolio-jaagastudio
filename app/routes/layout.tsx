import { Outlet, useLocation } from "react-router";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import Cursor from "~/components/cursor";
import { AnimatePresence, motion } from "framer-motion";
import { ReactLenis } from "lenis/react";

export default function RootLayout() {
  const location = useLocation();

  return (
    <ReactLenis root>
      <div className="grain-overlay" />
      <Cursor />
      <Navbar />
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </ReactLenis>
  );
}
