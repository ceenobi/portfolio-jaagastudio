import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { NavLink } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export default function Drawer({
  links,
}: {
  links: { name: string; href: string }[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          className="relative w-10 h-10 cursor-pointer md:hidden"
        >
          <Menu size={30} className="text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-BlackBerryCream/40 backdrop-blur-2xl border-l-0 p-0"
        showCloseButton={false}
      >
        <div className="relative flex flex-col h-full p-8">
          <div className="flex justify-end h-12">
            <SheetClose asChild>
              <motion.div
                initial={{ opacity: 0, rotate: -90 }}
                animate={
                  isOpen
                    ? { opacity: 1, rotate: 0 }
                    : { opacity: 0, rotate: -90 }
                }
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-full border-VanillaCustard/20 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                >
                  <X size={24} />
                </Button>
              </motion.div>
            </SheetClose>
          </div>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isOpen ? "show" : "hidden"}
              className="flex flex-col gap-8 uppercase items-center"
            >
              {links.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  <NavLink
                    to={link.href}
                    viewTransition
                    className={({ isActive }) =>
                      `text-3xl font-bold tracking-widest transition-all duration-300 ${
                        isActive
                          ? "text-SoftApricot scale-110"
                          : "text-VanillaCustard hover:text-SoftApricot hover:tracking-[0.2em]"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
