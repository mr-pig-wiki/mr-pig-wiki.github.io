document.addEventListener("DOMContentLoaded", () => {
  const group = document.documentElement.dataset.wikiGroup;
  const sidebar = document.querySelector(".sidebar-container");
  const main = document.querySelector("main");

  if (!group || !sidebar || !main) return;

  const groupConfig = {
    phantoms: { label: "Anthropomorphic Phantoms", path: "/phantoms" },
    "rf-lab": { label: "RF Lab", path: "/rf-lab" },
    "tabletop-mri": { label: "Tabletop MRI", path: "/tabletop-mri" },
  }[group];

  if (!groupConfig) return;

  const normalizePath = (path) => path.replace(/\/$/, "") || "/";
  const currentPath = normalizePath(window.location.pathname);
  const seen = new Set();
  const pages = [];

  sidebar.querySelectorAll("a[href]").forEach((link) => {
    const rawHref = link.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#")) return;

    const url = new URL(link.href, window.location.origin);
    const path = normalizePath(url.pathname);
    const belongsToGroup =
      path === groupConfig.path || path.startsWith(`${groupConfig.path}/`);

    if (!belongsToGroup || seen.has(path)) return;

    const label = link.textContent.trim();
    if (!label) return;

    seen.add(path);
    pages.push({ label, path: url.pathname });
  });

  if (!pages.length) return;

  const browser = document.createElement("details");
  browser.className = "wiki-page-browser";

  const summary = document.createElement("summary");
  const summaryText = document.createElement("span");
  summaryText.className = "wiki-page-browser-title";
  summaryText.textContent = `Browse ${groupConfig.label}`;

  const count = document.createElement("span");
  count.className = "wiki-page-browser-count";
  count.textContent = `${pages.length} pages`;

  summary.append(summaryText, count);

  const navigation = document.createElement("nav");
  navigation.setAttribute("aria-label", `${groupConfig.label} pages`);

  pages.forEach((page) => {
    const link = document.createElement("a");
    link.href = page.path;
    link.textContent = page.label;

    if (normalizePath(page.path) === currentPath) {
      link.className = "is-current";
      link.setAttribute("aria-current", "page");
    }

    navigation.append(link);
  });

  browser.append(summary, navigation);

  const contentTitle = main.querySelector(".content > h1:first-child");
  const articleTitle = main.querySelector(":scope > h1:first-of-type");

  if (contentTitle) {
    contentTitle.after(browser);
  } else if (articleTitle) {
    const spacer = articleTitle.nextElementSibling;
    (spacer || articleTitle).after(browser);
  } else {
    main.prepend(browser);
  }

  document.documentElement.classList.add("wiki-browser-ready");
});
