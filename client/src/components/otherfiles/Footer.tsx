// Footer.tsx — Theme-Aware Footer Component

import "../../styles/Footer.css";
/**
 * Footer Component
 *
 * Features:
 * ✅ Fully theme-aware (uses CSS variables from global.css)
 * ✅ Responsive design (stacked on mobile, horizontal on desktop)
 * ✅ Smooth theme transitions (0.25s fade)
 * ✅ Accessible (keyboard navigation, focus states, ARIA labels)
 * ✅ Consistent with app design system
 *
 * @example
 * <Footer />
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        {/* Copyright Text */}
        <span className="footer-copy">
          © {currentYear} Openroot. All Rights Reserved.
        </span>

        {/* Footer Links */}
        <nav className="footer-links" aria-label="Footer links">
          <a href="#" className="footer-link">
            Developers Details
          </a>
          <a href="#" className="footer-link">
            User Feedback
          </a>
          <a href="#" className="footer-link">
            Contact Us
          </a>
          <a href="#" className="footer-link">
            Terms & Conditions
          </a>
        </nav>
      </div>
    </footer>
  );
}