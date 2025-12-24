const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <span>
          © {new Date().getFullYear()} Openroot. All Rights Reserved.
        </span>

        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
