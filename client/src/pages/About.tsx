// src/pages/About.tsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./About.module.css";

type TeamMember = {
  name: string;
  designation: string;
  description: string;
  accent: "blue" | "green" | "gray";
};

type Section = {
  id: string;
  num: string;
  title: string;
};

const sections: Section[] = [
  { id: "overview", num: "01", title: "Overview" },
  { id: "mission", num: "02", title: "Mission" },
  { id: "product", num: "03", title: "Product" },
  { id: "architecture", num: "04", title: "Architecture" },
  { id: "stack", num: "05", title: "Technology Stack" },
  { id: "team", num: "06", title: "Team" },
  { id: "delivery", num: "07", title: "Delivery" },
];

const team: TeamMember[] = [
  {
    name: "Vivek Prashad",
    designation: "System Architect",
    description:
      "Planned the system architecture, module separation, and overall technical structure of the project.",
    accent: "gray",
  },
  {
    name: "Somnath Banerjee",
    designation: "Backend Developer",
    description:
      "Designed the backend services, API flow, business logic, and server-side integration for the project.",
    accent: "blue",
  },
  {
    name: "Surojit Mahanta",
    designation: "Frontend Developer",
    description:
      "Built the responsive UI, component structure, and user-facing interactions across the application.",
    accent: "green",
  },
  {
    name: "Sabyasachi Ghosh",
    designation: "Project Coordinator",
    description:
      "Managed documentation, task planning, coordination, and overall project progress among the team.",
    accent: "blue",
  },
  {
    name: "Abdul Saif",
    designation: "Support Developer",
    description:
      "Supported implementation, testing, debugging, and integration across different parts of the project.",
    accent: "green",
  },
];

const techStack = [
  "React",
  "TypeScript",
  "FastAPI",
  "Python",
  "REST APIs",
  "Responsive UI",
  "Modular Codebase",
  "AI-assisted Matching",
];

const stats = [
  { label: "Core Modules", value: "6+" },
  { label: "Platforms Compared", value: "3" },
  { label: "Frontend + Backend", value: "Full Stack" },
  { label: "UI Approach", value: "Minimal" },
];

export default function About() {
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
        <aside className={styles.toc} aria-label="About page navigation">
          <div className={styles.tocTitle}>About</div>

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
                A
              </div>
              <span className={styles.brandName}>About AutonShop</span>
            </div>

            <h1 className={styles.heroTitle}>
              Smarter Product Search.
              <br />
              Better Buying Decisions.
            </h1>

            <p className={styles.heroDesc}>
              AutonShop is an intelligent product comparison platform designed
              to simplify online shopping. Instead of manually searching across
              multiple marketplaces, users can compare products, prices,
              ratings, and availability from different e-commerce platforms
              through a single interface.
            </p>

            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.blue}`}>
                <span className={styles.badgeDot} />
                Responsive web application
              </span>
              <span className={`${styles.badge} ${styles.green}`}>
                <span className={styles.badgeDot} />
                Final-year B.Tech project
              </span>
              <span className={`${styles.badge} ${styles.gray}`}>
                <span className={styles.badgeDot} />
                Minimal Google-style UI
              </span>
            </div>
          </header>

          <section className={styles.sectionCard} id="mission">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>02</span>
                <h2 className={styles.secTitle}>Mission</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                Our mission is to make online shopping more transparent,
                efficient, and user-friendly. AutonShop helps users make better
                decisions by collecting product information from multiple
                platforms and presenting it in one organized view.
              </p>
              <p>
                The project focuses on simplicity, clarity, and speed so that
                users can quickly compare options without switching between
                different websites again and again.
              </p>
            </div>
          </section>

          <section className={styles.sectionCard} id="product">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>03</span>
                <h2 className={styles.secTitle}>Product Overview</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                AutonShop works as a unified product comparison and search
                system. It receives a search query, finds matching products
                across different marketplaces, normalizes the result data, and
                displays a single comparison-friendly output to the user.
              </p>

              <ul className={styles.featureList}>
                <li>Unified product search</li>
                <li>Cross-platform price comparison</li>
                <li>Intelligent product matching</li>
                <li>Fast API-driven response flow</li>
                <li>Clean and responsive frontend</li>
              </ul>
            </div>
          </section>

          <section className={styles.sectionCard} id="architecture">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>04</span>
                <h2 className={styles.secTitle}>System Architecture</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                The project follows a modular full-stack structure. The frontend
                is built with React and TypeScript, while the backend handles
                search processing, data normalization, and response generation
                through API endpoints.
              </p>

              <div className={styles.statsGrid}>
                {stats.map((item) => (
                  <div key={item.label} className={styles.statCard}>
                    <div className={styles.statValue}>{item.value}</div>
                    <div className={styles.statLabel}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.sectionCard} id="stack">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>05</span>
                <h2 className={styles.secTitle}>Technology Stack</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                The application uses modern technologies for maintainability,
                performance, and responsive design.
              </p>

              <div className={styles.techGrid}>
                {techStack.map((tech) => (
                  <div key={tech} className={styles.techCard}>
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.sectionCard} id="team">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>06</span>
                <h2 className={styles.secTitle}>Meet the Team</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                AutonShop was created collaboratively by a small team, with each
                member contributing to a specific part of the project lifecycle.
              </p>

              <div className={styles.teamGrid}>
                {team.map((member) => (
                  <div key={member.name} className={styles.teamCard}>
                    <div className={`${styles.avatar} ${styles[member.accent]}`}>
                      {member.name.charAt(0)}
                    </div>

                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberRole}>{member.designation}</p>
                    <p className={styles.memberDesc}>{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.sectionCard} id="delivery">
            <div className={styles.sectionHeader}>
              <div className={styles.secLeft}>
                <span className={styles.secNum}>07</span>
                <h2 className={styles.secTitle}>Project Delivery</h2>
              </div>
            </div>

            <div className={styles.sectionBody}>
              <p>
                This project was developed as part of the Bachelor of Technology
                final-year curriculum. The final output demonstrates practical
                implementation of full-stack concepts, modular development, and
                clean UI principles.
              </p>

              <p>
                The design language intentionally stays minimal, structured, and
                professional so it can fit naturally into a formal report or a
                polished product presentation.
              </p>
            </div>
          </section>

          <footer className={styles.footerCard}>
            <p className={styles.footerText}>
              AutonShop is built to make product discovery simpler and more
              organized.
            </p>
            <p className={styles.footerSub}>
              Final-year B.Tech project • React • TypeScript • FastAPI
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}