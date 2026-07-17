import React, { useEffect, useMemo, useState } from "react";
import styles from "./About.module.css";

type Section = {
  id: string;
  num: string;
  title: string;
};

const sections: Section[] = [
  { id: "overview", num: "01", title: "Overview" },
  { id: "collection", num: "02", title: "Information We Collect" },
  { id: "use", num: "03", title: "How We Use Information" },
  { id: "sharing", num: "04", title: "Sharing and Disclosure" },
  { id: "security", num: "05", title: "Security Practices" },
  { id: "retention", num: "06", title: "Retention" },
  { id: "rights", num: "07", title: "User Rights" },
  { id: "thirdparty", num: "08", title: "Third-Party Services" },
  { id: "minors", num: "09", title: "Children and Minors" },
  { id: "openroot", num: "10", title: "OpenRoot Systems" },
  { id: "changes", num: "11", title: "Policy Updates" },
  { id: "contact", num: "12", title: "Contact" },
];

export default function Privacy() {
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
        <aside className={styles.toc} aria-label="Privacy page navigation">
          <div className={styles.tocTitle}>Privacy</div>

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
                P
              </div>
              <span className={styles.brandName}>Privacy Policy</span>
            </div>

            <h1 className={styles.heroTitle}>
              Privacy that is clear,
              <br />
              simple, and respectful.
            </h1>

            <p className={styles.heroDesc}>
              This Privacy Policy explains how AutonShop handles information
              when the platform is used under OpenRoot Systems for academic and
              project purposes. It is written as a clean India-friendly
              template and should be reviewed before any public release.
            </p>

            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.blue}`}>
                <span className={styles.badgeDot} />
                OpenRoot Systems project
              </span>
              <span className={`${styles.badge} ${styles.green}`}>
                <span className={styles.badgeDot} />
                India-law aligned template
              </span>
              <span className={`${styles.badge} ${styles.gray}`}>
                <span className={styles.badgeDot} />
                Review before publishing
              </span>
            </div>
          </header>

          <section className={styles.sectionCard} id="collection">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>02</span>
                <h2 className={styles.secTitle}>Information We Collect</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                AutonShop may collect information that you provide directly,
                such as search inputs, feedback, contact details, or any other
                content you submit through the platform.
              </p>
              <p>
                We may also collect limited technical information such as
                device details, browser type, session logs, and usage data to
                keep the service working properly.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="use">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>03</span>
                <h2 className={styles.secTitle}>How We Use Information</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                We use collected information to provide the core search and
                comparison features of the platform, improve performance,
                troubleshoot issues, and maintain security.
              </p>
              <p>
                In India, privacy and digital processing are commonly framed
                around electronic records, reasonable security practices, and
                lawful processing of digital personal data under the
                Information Technology Act, 2000, the SPDI Rules, 2011, and the
                Digital Personal Data Protection Act, 2023. 
              </p>

              <ul className={styles.featureList}>
                <li>To operate search and comparison features</li>
                <li>To improve reliability and user experience</li>
                <li>To respond to support or contact requests</li>
                <li>To detect abuse, misuse, or security issues</li>
              </ul>
            </div>
          </section>

          <section className={styles.sectionCard} id="sharing">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>04</span>
                <h2 className={styles.secTitle}>Sharing and Disclosure</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                We do not sell your personal information. Information may be
                shared only when needed to run the service, comply with law, or
                protect the platform and its users.
              </p>
              <p>
                Sharing may also occur with trusted service providers who help
                host, secure, analyze, or deliver the application, subject to
                appropriate safeguards.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="security">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>05</span>
                <h2 className={styles.secTitle}>Security Practices</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                We maintain reasonable security practices intended to protect
                the platform from unauthorized access, misuse, loss, alteration,
                or destruction of information.
              </p>
              <p>
                The IT Act, 2000 includes provisions connected with data
                protection, confidentiality, privacy, and computer-related
                offences, including Section 43A for failure to protect data and
                Section 72 for breach of confidentiality and privacy. 
              </p>
              <p>
                No system can be guaranteed 100% secure, but we aim to keep the
                application protected using sensible engineering and access
                control practices.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="retention">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>06</span>
                <h2 className={styles.secTitle}>Retention</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                Information is retained only for as long as needed to operate
                the project, resolve technical issues, support reporting
                requirements, or comply with applicable law.
              </p>
              <p>
                Once data is no longer required, it should be deleted,
                anonymized, or archived in a secure manner depending on the
                project’s needs.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="rights">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>07</span>
                <h2 className={styles.secTitle}>User Rights</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                Subject to applicable law, you may request access to your
                information, corrections where appropriate, or deletion when the
                data is no longer needed for the stated purpose.
              </p>
              <p>
                Where the application processes digital personal data, the
                Digital Personal Data Protection Act, 2023 recognizes the need
                to process such data for lawful purposes while protecting the
                individual’s right over that data. 
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="thirdparty">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>08</span>
                <h2 className={styles.secTitle}>Third-Party Services</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                AutonShop may use third-party services for hosting, analytics,
                email delivery, or product search support. Those services have
                their own privacy policies and terms.
              </p>
              <p>
                We are not responsible for the privacy practices of external
                platforms beyond the scope of our control.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="minors">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>09</span>
                <h2 className={styles.secTitle}>Children and Minors</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                This project is intended primarily for general users and
                academic demonstration purposes. If a minor uses the platform,
                the use should be supervised by a parent, guardian, teacher, or
                responsible adult where appropriate.
              </p>
              <p>
                We do not knowingly collect sensitive information from children
                unless the project specifically requires it and proper consent
                rules have been followed.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="openroot">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>10</span>
                <h2 className={styles.secTitle}>Openroot Systems</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                AutonShop is maintained as part of the Openroot Systems project
                environment. The branding, documentation, and supporting
                materials may reference Openroot Systems as the parent project
                structure.
              </p>
              <p>
                This means any internal data handling, documentation, and
                deployment notes should be read in the context of the Openroot
                Systems ecosystem used for development and academic submission.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="changes">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>11</span>
                <h2 className={styles.secTitle}>Policy Updates</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in features, legal requirements, or project structure.
              </p>
              <p>
                The latest version should always be shown on this page with a
                clearly visible last-updated date.
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
                For questions about this Privacy Policy or the handling of
                information in AutonShop, contact the Openroot Systems /
                AutonShop development team through the official project email or
                the communication channel used for the final submission.
              </p>
            </div>
          </section>

          <footer className={styles.footerCard}>
            <p className={styles.footerText}>
              This is an academic privacy template aligned to the project
              structure and should be reviewed before release.
            </p>
            <p className={styles.footerSub}>
              AutonShop • Privacy Policy • Openroot Systems
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}