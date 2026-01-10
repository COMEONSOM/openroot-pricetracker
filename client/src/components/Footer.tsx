import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <span className="footer-copy">
          © {new Date().getFullYear()} Openroot. All Rights Reserved.
        </span>

        <div className="footer-links">
          <a href="#" className="footer-link">Developers Details</a>
          <a href="#" className="footer-link">User Feedback</a>
          <a href="#" className="footer-link">Contact Us</a>
          <a href="#" className="footer-link">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}
