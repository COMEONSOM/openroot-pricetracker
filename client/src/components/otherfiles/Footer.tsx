"use client";

import { memo, useMemo } from "react";
import "../../styles/Footer.css";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Feedback", href: "/feedback" },
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

const SOCIAL_LINKS: FooterLink[] = [
  { label: "GitHub", href: "https://github.com/comeonsom", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/comeonsom/", external: true },
];

const FooterLinkItem = memo(({ link }: { link: FooterLink }) => {
  const externalProps = link.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a href={link.href} className="footer__link" {...externalProps}>
      {link.label}
      {link.external && (
        <span className="footer__external-icon" aria-hidden="true">
          ↗
        </span>
      )}
    </a>
  );
});

FooterLinkItem.displayName = "FooterLinkItem";

function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__brand">
          <span className="footer__logo">AutonShop Inc.</span>
          <span className="footer__copyright">
            © {currentYear} Compare smarter across stores.
          </span>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <ul className="footer__list">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label} className="footer__item">
                <FooterLinkItem link={link} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__social">
          {SOCIAL_LINKS.map((link) => (
            <FooterLinkItem key={link.label} link={link} />
          ))}
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
