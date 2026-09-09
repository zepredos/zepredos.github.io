import { about } from "../content/about";
import { getPost, posts } from "../content/blog";
import { cv } from "../content/cv";
import { getProject, projects } from "../content/projects";
import { socials } from "../content/socials";
import { site } from "../site";
import { escapeHtml, renderBody, setMeta } from "../app/html";
import { navigate, type Route } from "../app/router";

const nav = [
  { href: "/professional", label: "Home" },
  { href: "/professional/about", label: "About" },
  { href: "/professional/projects", label: "Projects" },
  { href: "/professional/blog", label: "Technical Blogs" },
];

export function renderProfessional(root: HTMLElement, route: Extract<Route, { name: "professional" }>): void {
  const page = route.page;
  root.innerHTML = `
    <div class="pro">
      <header class="pro-header">
        <a class="pro-mark" href="/professional">
          <img src="/assets/pink-pixel-avatar.png" alt="" width="40" height="40" />
          <span>${escapeHtml(site.name)}</span>
        </a>
        <nav class="pro-nav" aria-label="Professional">
          ${nav
            .map(
              (item) =>
                `<a href="${item.href}" ${isActive(page, item.href) ? 'aria-current="page"' : ""}>${item.label}</a>`,
            )
            .join("")}
          <a href="/professional/cv" ${isActive(page, "/professional/cv") ? 'aria-current="page"' : ""}>Work Experience</a>
          <button class="theme-toggle" type="button" aria-label="Switch to dark theme" aria-pressed="false">
            <span aria-hidden="true">◐</span><span class="theme-label">Dark</span>
          </button>
        </nav>
      </header>
      <main class="pro-main">${pageHtml(route)}</main>
    </div>
  `;
  root.querySelectorAll("a[href^='/']").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = (anchor as HTMLAnchorElement).getAttribute("href");
      if (!href || href.startsWith("http")) return;
      event.preventDefault();
      navigate(href);
    });
  });
  const themeToggle = root.querySelector<HTMLButtonElement>(".theme-toggle");
  const savedTheme = localStorage.getItem("professional-theme");
  const dark = savedTheme === "dark";
  root.querySelector(".pro")?.classList.toggle("dark", dark);
  updateThemeToggle(themeToggle, dark);
  themeToggle?.addEventListener("click", () => {
    const isDark = !root.querySelector(".pro")?.classList.contains("dark");
    root.querySelector(".pro")?.classList.toggle("dark", isDark);
    localStorage.setItem("professional-theme", isDark ? "dark" : "light");
    updateThemeToggle(themeToggle, isDark);
  });
}

function updateThemeToggle(toggle: HTMLButtonElement | null, isDark: boolean): void {
  if (!toggle) return;
  toggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  toggle.setAttribute("aria-pressed", String(isDark));
  const label = toggle.querySelector(".theme-label");
  if (label) label.textContent = isDark ? "Light" : "Dark";
}

function isActive(page: string, href: string): boolean {
  if (href === "/professional") return page === "home";
  return href === `/professional/${page}`;
}

function pageHtml(route: Extract<Route, { name: "professional" }>): string {
  switch (route.page) {
    case "about":
      setMeta(`About — ${site.name}`, about.body);
      return `
        <article>
          <h1>About</h1>
          <p class="about-copy">${escapeHtml(about.body)}</p>
        </article>`;
    case "projects":
      if (route.id) {
        const project = getProject(route.id);
        if (!project) {
          setMeta(`Project missing — ${site.name}`, "Unknown project.");
          return `<p>Project not found.</p>`;
        }
        setMeta(`${project.title} — ${site.name}`, project.description);
        return `
          <article>
            <p><a class="back-link" href="/professional/projects">← projects</a></p>
            <h1>${escapeHtml(project.title)}</h1>
            <p class="muted">${escapeHtml(project.status)}${project.date ? ` · ${escapeHtml(project.date)}` : ""}</p>
            <p>${escapeHtml(project.description)}</p>
            <p>${project.technologies.map((tech) => `<span class="tag">${escapeHtml(tech)}</span>`).join(" ")}</p>
            ${project.writeup ? renderBody(project.writeup) : ""}
            <p class="project-links">
              ${project.sourceUrl ? `<a class="button ghost" href="${project.sourceUrl}" target="_blank" rel="noreferrer">GitHub ↗</a>` : ""}
            </p>
          </article>`;
      }
      setMeta(`Projects — ${site.name}`, "Selected work.");
      return `
        <h1>Projects</h1>
        <ul class="card-list">
          ${projects
            .map(
              (project) => `
            <li>
              <a href="/professional/projects/${project.id}">
                <strong>${escapeHtml(project.title)}</strong>
                <span class="muted">${escapeHtml(project.status)}</span>
                <p>${escapeHtml(project.description)}</p>
              </a>
            </li>`,
            )
            .join("")}
        </ul>`;
    case "cv":
      setMeta(`Work Experience — ${site.name}`, cv.summary);
      return `
        <article>
          <h1>Work Experience</h1>
          <h2>Summary</h2>
          <p>${escapeHtml(cv.summary)}</p>
          <h2>Experience</h2>
          ${cv.experience
            .map(
              (job) => `
            <section>
              <h3>${escapeHtml(job.role)} · ${escapeHtml(job.org)}</h3>
              <p class="muted">${escapeHtml(job.period)}</p>
              <ul>${job.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
            </section>`,
            )
            .join("")}
          <h2>Skills</h2>
          <p>${cv.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join(" ")}</p>
          <h2>Leadership</h2>
          ${cv.leadership
            .map(
              (role) => `
            <section>
              <h3>${escapeHtml(role.role)} · ${escapeHtml(role.org)}</h3>
              <p class="muted">${escapeHtml(role.period)}</p>
              <ul>${role.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
            </section>`,
            )
            .join("")}
        </article>`;
    case "blog":
      if (route.id) {
        const post = getPost(route.id);
        if (!post) return `<p>Post not found.</p>`;
        setMeta(`${post.title} — ${site.name}`, post.excerpt);
        return `
          <article class="post">
            <p><a class="back-link" href="/professional/blog">← technical blogs</a></p>
            <h1>${escapeHtml(post.title)}</h1>
            <p class="muted">${escapeHtml(post.date)} · ${post.tags.map(escapeHtml).join(", ")}</p>
            ${renderBody(post.body)}
          </article>`;
      }
      setMeta(`Blog — ${site.name}`, "Technical notes.");
      return `
        <h1>Technical blogs</h1>
        <ul class="card-list">
          ${posts
            .map(
              (post) => `
            <li>
              <a href="/professional/blog/${post.slug}">
                <strong>${escapeHtml(post.title)}</strong>
                <span class="muted">${escapeHtml(post.date)}</span>
                <p>${escapeHtml(post.excerpt)}</p>
              </a>
            </li>`,
            )
            .join("")}
        </ul>`;
    default:
      setMeta(`${site.name} — ${site.title}`, site.tagline);
      return `
        <section class="hero hero-home">
          <img class="hero-avatar" src="/assets/pink-pixel-avatar.png" alt="Pink pixel avatar" width="112" height="112" />
          <p class="eyebrow">${escapeHtml(site.title)}</p>
          <h1>Hi, I’m ${escapeHtml(site.name)}.</h1>
          ${site.introduction
            .map((paragraph, index) => `<p${index === 0 ? ' class="lede"' : ""}>${escapeHtml(paragraph)}</p>`)
            .join("")}
          <div class="home-actions" aria-label="Explore the site">
            ${socials.map((s) => `<a class="button ghost" href="${s.url}" target="_blank" rel="noreferrer">${escapeHtml(s.label)} ↗</a>`).join("")}
            <a class="button ghost" href="/">Boot Menu</a>
          </div>
        </section>`;
  }
}
