import React, { useEffect, useMemo, useState } from "react";
import styles from "./About.module.css";

type Section = {
  id: string;
  num: string;
  title: string;
};

const sections: Section[] = [
  { id: "overview", num: "01", title: "Overview" },
  { id: "contact-methods", num: "02", title: "Contact Methods" },
  { id: "support", num: "03", title: "Support & Response" },
  { id: "project-info", num: "04", title: "Project Information" },
  { id: "faq", num: "05", title: "FAQ" },
  { id: "note", num: "06", title: "Important Note" },
];

export default function Contact() {
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
        <aside className={styles.toc} aria-label="Contact page navigation">
          <div className={styles.tocTitle}>Contact</div>

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
                C
              </div>
              <span className={styles.brandName}>Contact Us</span>
            </div>

            <h1 className={styles.heroTitle}>
              Reach the AutonShop team
              <br />
              quickly and simply.
            </h1>

            <p className={styles.heroDesc}>
              For project discussion, support, academic queries, collaboration,
              or report-related communication, you can contact the AutonShop
              team through WhatsApp or email. This page is designed in the same
              clean style as the rest of the project.
            </p>

            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.blue}`}>
                <span className={styles.badgeDot} />
                Fast response channel
              </span>
              <span className={`${styles.badge} ${styles.green}`}>
                <span className={styles.badgeDot} />
                AutonShop
              </span>
              <span className={`${styles.badge} ${styles.gray}`}>
                <span className={styles.badgeDot} />
                Academic project support
              </span>
            </div>
          </header>

          <section className={styles.sectionCard} id="contact-methods">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>02</span>
                <h2 className={styles.secTitle}>Contact Methods</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                Choose the method that is easiest for you. WhatsApp is best for
                quick messages, while email is better for detailed queries,
                documentation, or formal communication.
              </p>

              <div className={styles.teamGrid}>
                <a
                  href="https://wa.me/917866049865"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.teamCard}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className={`${styles.avatar} ${styles.green}`}>W</div>
                  <h3 className={styles.memberName}>WhatsApp</h3>
                  <p className={styles.memberRole}>+91 7866049865</p>
                  <p className={styles.memberDesc}>
                    Send a direct message for quick support, coordination, or
                    project-related discussion.
                  </p>
                </a>

                <a
                  href="mailto:connect.openroot@gmail.com"
                  className={styles.teamCard}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className={`${styles.avatar} ${styles.blue}`}>M</div>
                  <h3 className={styles.memberName}>Email</h3>
                  <p className={styles.memberRole}>connect.openroot@gmail.com</p>
                  <p className={styles.memberDesc}>
                    Use email for formal queries, detailed requests, and report
                    or documentation-related communication.
                  </p>
                </a>
              </div>
            </div>
          </section>

          <section className={styles.sectionCard} id="support">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>03</span>
                <h2 className={styles.secTitle}>Support & Response</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                The team usually checks WhatsApp messages faster for short and
                urgent communication. Email is preferred when the discussion
                includes attachments, screenshots, project files, or long
                explanations.
              </p>
              <p>
                For best results, mention your name, purpose of contact, and a
                short subject line such as “Project report”, “Technical issue”,
                or “Collaboration request”.
              </p>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>WhatsApp</div>
                  <div className={styles.statLabel}>Quick reply for short support messages</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>Email</div>
                  <div className={styles.statLabel}>Best for formal or detailed communication</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>Project</div>
                  <div className={styles.statLabel}>AutonShop under Openroot Systems</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>Use</div>
                  <div className={styles.statLabel}>Academic, support, and coordination purposes</div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.sectionCard} id="project-info">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>04</span>
                <h2 className={styles.secTitle}>Project Information</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                AutonShop is maintained as part of the Openroot Systems project
                ecosystem. Any communication related to the project, report
                submission, design changes, or implementation questions can be
                sent using the contact details above.
              </p>
              <p>
                If you are contacting the team for a college submission, include
                the module name, screenshot, or file name so the correct section
                can be identified quickly.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="faq">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>05</span>
                <h2 className={styles.secTitle}>FAQ</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                <strong>Q: Which is better for fast help?</strong>
                <br />
                WhatsApp is the quickest way for short replies.
              </p>
              <p>
                <strong>Q: Which is better for formal communication?</strong>
                <br />
                Email is best for formal messages and attachments.
              </p>
              <p>
                <strong>Q: Can I ask about the report and codebase?</strong>
                <br />
                Yes. Mention clearly what section or file you are asking about.
              </p>
            </div>
          </section>


          <footer className={styles.footerCard}>
            <p className={styles.footerText}>
              Contact the AutonShop team through WhatsApp or email for
              project-related support.
            </p>
            <p className={styles.footerSub}>
              AutonShop • Contact Page • Openroot Systems
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}