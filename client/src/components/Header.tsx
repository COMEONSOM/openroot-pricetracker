import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <img
          src="/logo.png"
          alt="Openroot Logo"
          className="header-logo-img"
        />
      </div>

      {/* Tagline */}
      <span className="header-tagline">
        Login/Signup
      </span>
    </header>
  );
}
