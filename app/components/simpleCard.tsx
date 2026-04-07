import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

const cardContent = {
  title: "Let's Create Something Extraordinary",
  description:
    "Have an inquiry, suggestion, a collaboration offer or even trouble sleeping? Get in touch with me now.",
};
const CardBody = ({ className = "p-4" }) => (
  <div className={cn("text-start relative", className)}>
    <h3 className="text-lg font-bold mb-1 text-gray-400">
      {cardContent.title}
    </h3>
    <p className="text-gray-300">{cardContent.description}</p>
  </div>
);
//======================================
export const SimpleCard_V2 = () => {
  const Line = ({ className = "" }) => (
    <div
      className={cn(
        "h-px w-full via-zinc-400 from-1% from-zinc-200 to-zinc-600 absolute z-0 dark:via-zinc-700 dark:from-zinc-900 dark:to-zinc-500",
        className,
      )}
    />
  );
  const Container = ({ children }: { children: React.ReactNode }) => (
    <div className="relative mx-auto w-full px-4 sm:px-6 md:px-8">
      <Line className="bg-linear-to-l left-0 top-2 sm:top-4 md:top-6" />
      <Line className="bg-linear-to-r bottom-2 sm:bottom-4 md:bottom-6 left-0" />

      <Line className="w-px bg-linear-to-t right-2 sm:right-4 md:right-6 h-full inset-y-0" />
      <Line className="w-px bg-linear-to-t left-2 sm:left-4 md:left-6 h-full inset-y-0" />
      <div className="relative z-20 mx-auto py-8">{children}</div>
      <Link to="/contact" className="group relative inline-flex items-center gap-4 text-xl md:text-2xl font-bold uppercase tracking-widest text-white hover:text-SoftApricot transition-colors">
      <span className="absolute bottom-8 left-8 z-20 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-VanillaCustard hover:text-VanillaCustard group-hover:border-SoftApricot group-hover:rotate-45 transition-all duration-300">
        <ArrowUpRight size={18} />
      </span>
    </Link>
    </div>
  );
  return (
    <Container>
      <div className="p-4 w-full center">
        <CardBody />
      </div>
    </Container>
  );
};
