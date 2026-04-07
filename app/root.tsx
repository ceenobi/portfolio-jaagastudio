import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type { Route } from "./+types/root";
import "./app.css";
import "@fontsource/kanit";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "000";
  let title = "SYSTEM ANOMALY";
  let details = "An unexpected error occurred.";
  let showHome = true;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "404";
      title = "LOST IN SPACE";
      details = "The page you're searching for has drifted into deep space.";
    } else {
      message = String(error.status);
      title = error.statusText || "UNKNOWN ERROR";
    }
  } else if (error && error instanceof Error) {
    title = error.name;
    details = error.message;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-SoftApricot selection:text-black">
      {/* ── Background VFX ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] animate-pulse-slow" />
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/ceenobi/image/upload/v1698242371/noise_lqz7vx.png')",
          }}
        />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
      >
        {/* Large Decorative Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
          animate={{ opacity: 0.15, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] font-black tracking-[-0.08em] opacity-10 select-none pointer-events-none mix-blend-overlay"
        >
          {message}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.33, 1, 0.68, 1] }}
          className="space-y-4"
        >
          <motion.p className="text-SoftApricot text-sm font-bold tracking-[0.5em] uppercase mb-4">
            {title}
          </motion.p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none">
            STRANDED
          </h1>
          <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light max-w-lg mx-auto">
            {details}
          </p>
        </motion.div>

        {/* Navigation Action */}
        {showHome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <a
              href="/"
              className="group relative inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all duration-300"
            >
              Recalibrate Home
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-SoftApricot rounded-full -z-10 group-hover:scale-110 opacity-0 group-hover:opacity-20 transition-all duration-500" />
            </a>
          </motion.div>
        )}
      </motion.main>

      {/* Decorative Branding */}
      <div className="absolute bottom-10 left-10 hidden md:flex items-center gap-4 opacity-30 select-none">
        <div className="w-12 h-px bg-white/20" />
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase">
          SYSTEM.LOG // 004
        </span>
      </div>
    </div>
  );
}
