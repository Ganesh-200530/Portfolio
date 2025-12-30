const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
// Configure API base via body[data-api-base]; falls back to localhost for dev.
const API_BASE = (document.body?.dataset.apiBase || "http://127.0.0.1:8000").replace(/\/$/, "");

// --- Dynamic content fetch/render ---
async function fetchSection(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function renderEducation(items = []) {
  const container = document.getElementById("education-list");
  if (!container) return;
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = '<p class="muted">No education records yet.</p>';
    return;
  }
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "code-row reveal";
    row.innerHTML = `
      <span class="code-col">${item.degree || ""}${item.focus ? `, ${item.focus}` : ""}</span>
      <span class="code-col code-muted">${item.institution || ""}${item.start_year ? ` · ${item.start_year}` : ""}${item.end_year ? ` - ${item.end_year}` : ""}${item.location ? ` · ${item.location}` : ""}</span>
      <span class="code-tag">${item.focus || item.degree || ""}</span>
    `;
    container.appendChild(row);
  });
  observeNewReveals();
}

function renderProjects(items = []) {
  const container = document.getElementById("projects-list");
  if (!container) return;
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = '<p class="muted">Projects coming soon.</p>';
    return;
  }
  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "project reveal";
    const tags = Array.isArray(item.tags) ? item.tags.join(" · ") : item.tags || "";
    article.innerHTML = `
      <div class="project__meta">
        <p class="pill">${tags || "Project"}</p>
        <h3>${item.title || "Untitled"}</h3>
        <p class="muted">${item.summary || ""}</p>
      </div>
      <div class="project__links">
        ${item.live_url ? `<a href="${item.live_url}" target="_blank" rel="noreferrer">Live</a>` : ""}
        ${item.code_url ? `<a href="${item.code_url}" target="_blank" rel="noreferrer">Code</a>` : ""}
      </div>
    `;
    container.appendChild(article);
  });
  observeNewReveals();
  wireRipples();
}

function renderSkills(items = []) {
  const container = document.getElementById("skills-list");
  if (!container) return;
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = '<p class="muted">Skills coming soon.</p>';
    return;
  }
  items.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "reveal";
    const chips = Array.isArray(item.items) ? item.items : [];
    wrapper.innerHTML = `
      <p class="muted">${item.category || ""}</p>
      <div class="chips">${chips.map((chip) => `<span class="chip">${chip}</span>`).join("")}</div>
    `;
    container.appendChild(wrapper);
  });
  observeNewReveals();
}

function renderCertifications(items = []) {
  const container = document.getElementById("certifications-list");
  if (!container) return;
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = '<p class="muted">Certifications coming soon.</p>';
    return;
  }
  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "project reveal";
    article.innerHTML = `
      <div class="project__meta">
        <p class="pill">${item.provider || "Certification"}</p>
        <h3>${item.name || "Untitled"}</h3>
        <p class="muted">${[item.provider, item.year].filter(Boolean).join(" · ")} — ${item.details || ""}</p>
      </div>
    `;
    container.appendChild(article);
  });
  observeNewReveals();
  wireRipples();
}

function renderSocial(items = []) {
  const container = document.getElementById("social-links");
  if (!container) return;
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = '<p class="muted">Add social links in the dashboard.</p>';
    return;
  }
  items.forEach((item) => {
    const link = document.createElement("a");
    link.className = "social-card reveal";
    link.href = item.url || "#";
    link.target = "_blank";
    link.rel = "noreferrer";
    link.innerHTML = `
      <span class="social-icon" aria-hidden="true">${item.icon || "↗"}</span>
      <span class="social-value">${item.label || item.url || ""}</span>
    `;
    container.appendChild(link);
  });
  observeNewReveals();
  wireRipples();
}

async function hydrateContent() {
  try {
    const [edu, proj, skill, cert, social] = await Promise.all([
      fetchSection("/api/education"),
      fetchSection("/api/projects"),
      fetchSection("/api/skills"),
      fetchSection("/api/certifications"),
      fetchSection("/api/social"),
    ]);

    renderEducation(edu);
    renderProjects(proj);
    renderSkills(skill);
    renderCertifications(cert);
    renderSocial(social);
  } catch (err) {
    console.error("Content load failed", err);
  }
}

async function submitForm(event) {
  event.preventDefault();
  statusEl.textContent = "Sending...";
  statusEl.style.color = "#c08c5a";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Error" }));
      throw new Error(error.message || "Failed to send");
    }

    statusEl.textContent = "Thanks for reaching out — I will reply soon.";
    statusEl.style.color = "#76e0a6";
    form.reset();
  } catch (err) {
    statusEl.textContent = err.message || "Something went wrong. Please try again.";
    statusEl.style.color = "#ff9d92";
  }
}

form?.addEventListener("submit", submitForm);

// Scroll reveal for cards and sections
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
);

function observeNewReveals() {
  document.querySelectorAll(".reveal").forEach((el) => {
    if (!el.dataset.observed) {
      observer.observe(el);
      el.dataset.observed = "true";
    }
  });
}

observeNewReveals();

// Safety: ensure everything shows even if IntersectionObserver misses
setTimeout(() => {
  document.querySelectorAll(".reveal").forEach((el) => {
    if (!el.classList.contains("visible")) {
      el.classList.add("visible");
    }
  });
}, 600);

// Ripple interaction on click targets
function addRipple(event) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  target.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
}

  function wireRipples() {
    const rippleTargets = document.querySelectorAll(".button, .project, .social-card");
    rippleTargets.forEach((el) => {
      if (el.dataset.rippleBound) return;
      el.style.position = el.style.position || "relative";
      el.style.overflow = "hidden";
      el.addEventListener("click", addRipple);
      el.dataset.rippleBound = "true";
    });
  }

  wireRipples();

// Loader hide after load or fallback timeout
const loader = document.getElementById("loader");
function hideLoader() {
  if (loader) loader.classList.add("hidden");
}
window.addEventListener("load", () => {
  hideLoader();
  setTimeout(hideLoader, 1200);
  hydrateContent();
  observeNewReveals();
  wireRipples();
});

// Nav micro loading bar synced to active section
const navLinks = document.querySelectorAll(".nav nav a");
const sections = Array.from(document.querySelectorAll("section[id]"));
let navBar;

function ensureNavBar() {
  if (!navBar) {
    navBar = document.createElement("span");
    navBar.className = "nav-progress";
    const navContainer = document.querySelector(".nav nav");
    navContainer?.appendChild(navBar);
  }
}

ensureNavBar();

function setActiveSection() {
  const scrollPos = window.scrollY || document.documentElement.scrollTop;
  const viewportMid = scrollPos + window.innerHeight * 0.45;
  const nearBottom = scrollPos + window.innerHeight >= document.documentElement.scrollHeight - 2;
  let currentId = sections[0]?.id;

  if (nearBottom && sections.length) {
    currentId = sections[sections.length - 1].id;
  } else {
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (viewportMid >= top && viewportMid < bottom) {
        currentId = sec.id;
      }
    });
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const id = href.replace("#", "");
    const isActive = id === currentId;
    link.classList.toggle("active", isActive);
    if (isActive && navBar) {
      const rect = link.getBoundingClientRect();
      const navRect = link.parentElement.getBoundingClientRect();
      const width = rect.width;
      const offset = rect.left - navRect.left;
      navBar.style.transform = `translateX(${offset}px)`;
      navBar.style.width = `${width}px`;
    }
  });
}

window.addEventListener("scroll", setActiveSection);
window.addEventListener("resize", setActiveSection);
setActiveSection();
