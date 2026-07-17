import React, { useEffect, useMemo, useState } from "react";
import styles from "./About.module.css";

type Section = {
  id: string;
  num: string;
  title: string;
};

const GOOGLE_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSfMq-m26q3plyomruYesiG4wigq2HqsRV_85KVdMQ8HkHhqJg/viewform";

const sections: Section[] = [
  { id: "overview", num: "01", title: "Overview" },
  { id: "why", num: "02", title: "Why Feedback Matters" },
  { id: "submit", num: "03", title: "Submit Feedback" },
  { id: "report", num: "04", title: "What to Report" },
  { id: "process", num: "05", title: "Review Process" },
  { id: "privacy", num: "06", title: "Privacy" },
  { id: "contact", num: "07", title: "Contact" },
];

export default function Feedback() {
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
        <aside className={styles.toc} aria-label="Feedback page navigation">
          <div className={styles.tocTitle}>Feedback</div>

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
                F
              </div>
              <span className={styles.brandName}>Feedback Portal</span>
            </div>

            <h1 className={styles.heroTitle}>
              Your feedback helps
              <br />
              improve AutonShop.
            </h1>

            <p className={styles.heroDesc}>
              AutonShop is maintained under Openroot Systems. Your suggestions,
              bug reports, and usability feedback help us refine the platform,
              improve the experience, and plan future updates.
            </p>

            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.blue}`}>
                <span className={styles.badgeDot} />
                Google Form based
              </span>
              <span className={`${styles.badge} ${styles.green}`}>
                <span className={styles.badgeDot} />
                AutonShop
              </span>
              <span className={`${styles.badge} ${styles.gray}`}>
                <span className={styles.badgeDot} />
                Fast and simple
              </span>
            </div>
          </header>

          <section className={styles.sectionCard} id="why">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>02</span>
                <h2 className={styles.secTitle}>Why Feedback Matters</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                Feedback helps us understand what is working well and what needs
                improvement. It also guides future updates and helps us keep the
                platform useful for real users and academic submission.
              </p>

              <ul className={styles.featureList}>
                <li>Report bugs or broken UI areas</li>
                <li>Suggest new features or improvements</li>
                <li>Share thoughts about speed and usability</li>
                <li>Help us improve design and content clarity</li>
              </ul>
            </div>
          </section>

          <section className={styles.sectionCard} id="submit">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>03</span>
                <h2 className={styles.secTitle}>Submit Feedback</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                Click the button below to open the official Google Feedback Form
                in a new tab. Fill in the form and submit your response.
              </p>

              <div
                style={{
                  marginTop: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.9rem",
                }}
              >
                <a
                  href={GOOGLE_FORM}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "14px 30px",
                    background: "#1a73e8",
                    color: "#fff",
                    borderRadius: "999px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "15px",
                    lineHeight: 1,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                >
                  Share Your Feedback →
                </a>

                <p
                  style={{
                    margin: 0,
                    color: "var(--g-muted)",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                  }}
                >
                  The form opens securely in a new browser tab and is managed
                  through Google Forms.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.sectionCard} id="report">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>04</span>
                <h2 className={styles.secTitle}>What to Report</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                You can use the form to share many kinds of useful feedback.
                Please be as clear as possible so we can understand the issue or
                suggestion quickly.
              </p>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>Bugs</div>
                  <div className={styles.statLabel}>
                    Report errors, broken links, or unexpected behavior.
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>UX</div>
                  <div className={styles.statLabel}>
                    Share layout, usability, or navigation concerns.
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>Features</div>
                  <div className={styles.statLabel}>
                    Suggest new ideas, filters, or improvements.
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>Content</div>
                  <div className={styles.statLabel}>
                    Point out missing, unclear, or outdated content.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.sectionCard} id="process">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>05</span>
                <h2 className={styles.secTitle}>Review Process</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                Responses submitted through the Google Form will be reviewed by
                the AutonShop development team. Important
                issues may be prioritized for fixes or future updates.
              </p>
              <p>
                For the best outcome, include a short title, a clear
                description, and if possible a screenshot or example.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="privacy">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>06</span>
                <h2 className={styles.secTitle}>Privacy</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                Feedback responses are collected through Google Forms. Please
                avoid sharing sensitive personal information unless it is
                necessary for the issue you are reporting.
              </p>
              <p>
                Any data you submit should be used only for project improvement,
                support, and academic review purposes.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="contact">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>07</span>
                <h2 className={styles.secTitle}>Contact</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                For urgent communication, use the Contact page. For detailed
                suggestions and structured feedback, use the Google Form above.
              </p>
            </div>
          </section>

          <footer className={styles.footerCard}>
            <p className={styles.footerText}>
              Thank you for helping improve AutonShop.
            </p>
            <p className={styles.footerSub}>
              AutonShop • Feedback Portal • Openroot Systems
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}