document.addEventListener("DOMContentLoaded", function () {
  const tocLinks = Array.from(
    document.querySelectorAll('.hextra-toc a[href^="#"]')
  );

  const sections = tocLinks
    .map(function (link) {
      const id = decodeURIComponent(link.hash.slice(1));
      return { link: link, heading: document.getElementById(id) };
    })
    .filter(function (section) {
      return section.heading;
    });

  if (!sections.length) return;

  const navbar = document.querySelector(".nav-container");
  let frameRequested = false;

  function updateActiveSection() {
    frameRequested = false;
    const readingLine = (navbar ? navbar.offsetHeight : 64) + 24;
    let activeSection = sections[0];

    sections.forEach(function (section) {
      if (section.heading.getBoundingClientRect().top <= readingLine) {
        activeSection = section;
      }
    });

    sections.forEach(function (section) {
      const isActive = section === activeSection;
      section.link.classList.toggle("toc-active", isActive);
      if (isActive) {
        section.link.setAttribute("aria-current", "location");
      } else {
        section.link.removeAttribute("aria-current");
      }
    });
  }

  function scheduleUpdate() {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateActiveSection);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  updateActiveSection();
});
