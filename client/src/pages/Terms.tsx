import React, { useEffect, useMemo, useState } from "react";
import styles from "./About.module.css";

type Section = {
  id: string;
  num: string;
  title: string;
};

const sections: Section[] = [
  { id: "overview", num: "01", title: "Overview" },
  { id: "acceptance", num: "02", title: "Acceptance" },
  { id: "eligibility", num: "03", title: "Eligibility" },
  { id: "use", num: "04", title: "Use of Service" },
  { id: "content", num: "05", title: "User Content" },
  { id: "ip", num: "06", title: "Intellectual Property" },
  { id: "thirdparty", num: "07", title: "Third-Party Services" },
  { id: "privacy", num: "08", title: "Privacy" },
  { id: "liability", num: "09", title: "Limitation of Liability" },
  { id: "law", num: "10", title: "Governing Law" },
  { id: "changes", num: "11", title: "Changes" },
  { id: "contact", num: "12", title: "Contact" },
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const sectionIds = useMemo(() => sections.map((s) => s.id), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio ||
              a.boundingClientRect.top - b.boundingClientRect.top
          )[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        root: null,
        threshold: [0.12, 0.2, 0.35, 0.5],
        rootMargin: "-12% 0px -65% 0px",
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <aside className={styles.toc} aria-label="Terms page navigation">
          <div className={styles.tocTitle}>Terms</div>

          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`${styles.tocItem} ${
                activeSection === section.id ? styles.tocItemActive : ""
              }`}
            >
              {section.num}. {section.title}
            </button>
          ))}
        </aside>

        <article className={styles.main}>
          <header className={styles.hero} id="overview">
            <div className={styles.brand}>
              <div className={styles.logoMark} aria-hidden="true">
                T
              </div>
              <span className={styles.brandName}>Terms of Use</span>
            </div>

            <h1 className={styles.heroTitle}>
              Clear terms.
              <br />
              Simple usage rules.
            </h1>

            <p className={styles.heroDesc}>
              These Terms of Use govern access to and use of the AutonShop
              platform. They are written as a clean academic template for an
              Indian college project and should be reviewed before any public
              launch or legal submission.
            </p>

            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.blue}`}>
                <span className={styles.badgeDot} />
                Applicable to platform use
              </span>
              <span className={`${styles.badge} ${styles.green}`}>
                <span className={styles.badgeDot} />
                General India-law template
              </span>
              <span className={`${styles.badge} ${styles.gray}`}>
                <span className={styles.badgeDot} />
                Review before publishing
              </span>
            </div>
          </header>

          <section className={styles.sectionCard} id="acceptance">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>02</span>
                <h2 className={styles.secTitle}>Acceptance of Terms</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                By accessing, browsing, or using AutonShop, you agree to be
                bound by these Terms. If you do not agree, please stop using the
                platform immediately.
              </p>
              <p>
                These terms form a basic online service agreement and are meant
                to describe how users may interact with the website, content,
                and features.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="eligibility">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>03</span>
                <h2 className={styles.secTitle}>Eligibility</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                You must use the platform only if you are legally capable of
                entering into a binding contract under applicable law. If you
                are using the service on behalf of an institution, company, or
                team, you confirm that you are authorized to do so.
              </p>
              <p>
                For an online project in India, it is common to align such
                clauses with the general law of contracts and electronic
                transactions; the Indian Contract Act, 1872 and the Information
                Technology Act, 2000 are the key reference points for those
                subjects. 
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="use">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>04</span>
                <h2 className={styles.secTitle}>Permitted Use</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                You may use AutonShop only for lawful purposes and in a way that
                does not harm the service, other users, or third-party systems.
                You agree not to misuse search results, interfere with the
                backend, or attempt unauthorized access.
              </p>

              <ul className={styles.featureList}>
                <li>Do not submit harmful, abusive, or illegal queries.</li>
                <li>Do not attempt to break security or overload the system.</li>
                <li>Do not copy or redistribute protected content without permission.</li>
                <li>Do not use the service in a way that violates any law or rule.</li>
              </ul>
            </div>
          </section>

          <section className={styles.sectionCard} id="content">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>05</span>
                <h2 className={styles.secTitle}>User Content and Inputs</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                If the platform allows you to enter search text, upload data, or
                submit feedback, you remain responsible for the information you
                provide. You should ensure that your input is accurate and does
                not violate any rights of others.
              </p>
              <p>
                The team may use user input only to provide the intended
                functionality, improve the service, or troubleshoot technical
                issues, subject to the privacy policy and applicable law.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="ip">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>06</span>
                <h2 className={styles.secTitle}>Intellectual Property</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                The AutonShop name, logo, interface design, source code, layout,
                and documentation are protected and remain the property of the
                project owners unless otherwise stated.
              </p>
              <p>
                You may not reproduce, modify, or reuse substantial parts of the
                platform without prior written permission, except where
                permitted for academic review or fair use under applicable law.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="thirdparty">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>07</span>
                <h2 className={styles.secTitle}>Third-Party Services</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                AutonShop may display or rely on external services, APIs, or
                third-party websites for search results, product data, hosting,
                analytics, or other supporting functions.
              </p>
              <p>
                Those services are governed by their own terms and policies. We
                are not responsible for changes, interruptions, or content
                provided by external platforms.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="privacy">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>08</span>
                <h2 className={styles.secTitle}>Privacy and Data</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                Any collection or use of personal data should be explained in
                the Privacy Policy. This Terms page should be read together with
                that policy so users understand what data is collected and how
                it is handled.
              </p>
              <p>
                Where electronic records or transactions are involved, Indian
                e-commerce style contracts often sit alongside the Information
                Technology Act framework. 
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="liability">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>09</span>
                <h2 className={styles.secTitle}>Limitation of Liability</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                The platform is provided on an “as is” and “as available” basis.
                While the team tries to keep the system accurate and stable, we
                do not guarantee that every feature will be uninterrupted,
                error-free, or perfectly current.
              </p>
              <p>
                To the extent permitted by applicable law, the project team will
                not be liable for indirect, incidental, or consequential losses
                arising from use of the platform.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="law">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>10</span>
                <h2 className={styles.secTitle}>Governing Law and Jurisdiction</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                These Terms should be governed by the applicable laws of India.
                Any dispute relating to the platform should, where permitted,
                be subject to the jurisdiction of the competent courts in the
                relevant city or state chosen for the project.
              </p>
              <p>
                For a final submission, you can replace the jurisdiction line
                with the exact location that your college or project team wants
                to use.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="changes">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>11</span>
                <h2 className={styles.secTitle}>Changes to These Terms</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                The team may update these Terms when the product, laws, or
                project requirements change. The latest version should always
                appear on this page.
              </p>
              <p>
                Continued use of the service after an update means you accept
                the revised version.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="contact">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>12</span>
                <h2 className={styles.secTitle}>Contact</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                For questions about these Terms, project ownership, or legal
                wording, please contact the AutonShop development team through
                the official project email or institute-approved communication
                channel.
              </p>
              <p>
                You should also keep a simple “last updated” date on the live
                page once the final version is approved.
              </p>
            </div>
          </section>

          <footer className={styles.footerCard}>
            <p className={styles.footerText}>
              This is a general academic template and should be reviewed before
              any public release.
            </p>
            <p className={styles.footerSub}>
              AutonShop • Terms of Use • India-law friendly layout
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}