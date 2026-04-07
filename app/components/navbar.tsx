import Logo from "./logo";
import Menu from "./menu";

export default function Navbar() {
  const links = [
    { name: "Work", href: "work" },
    { name: "Profile", href: "profile" },
    { name: "Contact", href: "contact" },
  ];
  return (
    <header
      className={`fixed top-6 left-2 right-2 z-50 transition-all duration-300 max-w-[1350px] mx-auto`}
    >
      <div className="flex justify-between items-center lg:px-2">
        <Logo />
        <Menu links={links} />
      </div>
    </header>
  );
}
