/* Portfolio interactions for Kavya Bellamkonda
   - Loader
   - AOS init
   - Typing effect
   - Particles canvas
   - Mobile nav + scrollspy
   - Scroll-to-top
   - Contact form (mailto)
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Loader: hide after first paint + short delay for polish
  const loader = $("#loader");
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add("is-hidden");
    loader.setAttribute("aria-busy", "false");
  };
  window.addEventListener("load", () => setTimeout(hideLoader, 450), { once: true });

  // AOS
  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 90,
      disable: prefersReducedMotion,
    });
  }

  // Footer year
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Typing effect
  const typingEl = $("#typing");
  const roles = [
    "Computer Science Undergraduate | Web Developer",
    "Building responsive, interactive web experiences",
    "Modern UI • Glassmorphism • Smooth UX",
  ];

  function typingLoop(el, words, opts = {}) {
    const typeSpeed = opts.typeSpeed ?? 44;
    const deleteSpeed = opts.deleteSpeed ?? 26;
    const pause = opts.pause ?? 900;
    const between = opts.between ?? 420;

    let w = 0;
    let i = 0;
    let deleting = false;
    let raf = 0;

    const step = () => {
      if (!el) return;

      const word = words[w] ?? "";
      const targetLen = deleting ? Math.max(0, i - 1) : Math.min(word.length, i + 1);
      i = targetLen;
      el.textContent = word.slice(0, i);

      let nextDelay = deleting ? deleteSpeed : typeSpeed;

      if (!deleting && i === word.length) {
        nextDelay = pause;
        deleting = true;
      } else if (deleting && i === 0) {
        deleting = false;
        w = (w + 1) % words.length;
        nextDelay = between;
      }

      raf = window.setTimeout(step, nextDelay);
    };

    step();
    return () => window.clearTimeout(raf);
  }

  if (typingEl) {
    if (prefersReducedMotion) {
      typingEl.textContent = roles[0];
    } else {
      typingLoop(typingEl, roles);
    }
  }

  // Mobile nav toggle
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  const navLinks = $$(".nav__link", navMenu || document);

  const setNavOpen = (open) => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navMenu.classList.toggle("is-open", open);
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("is-open");
      setNavOpen(!isOpen);
    });

    navLinks.forEach((a) => {
      a.addEventListener("click", () => setNavOpen(false));
    });

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const clickedInside = navMenu.contains(t) || navToggle.contains(t);
      if (!clickedInside) setNavOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  // Smooth scroll (offset for sticky nav)
  const navHeight = () => {
    const header = $(".header");
    return header ? header.getBoundingClientRect().height : 72;
  };

  // Scrollspy: document order (includes sections without nav links)
  const SECTION_ORDER = [
    "home",
    "about",
    "skills",
    "education",
    "projects",
    "experience",
    "certifications",
    "resume",
    "contact",
  ];

  const linkById = new Map(
    SECTION_ORDER.map((id) => [id, navLinks.find((l) => l.getAttribute("href") === `#${id}`)]),
  );

  /** Sections with no navbar item map to the nearest logical tab */
  const sectionToNavId = (sectionId) => {
    if (sectionId === "education") return "skills";
    if (sectionId === "experience") return "projects";
    return sectionId;
  };

  const setActive = (navId) => {
    navLinks.forEach((l) => l.classList.remove("is-active"));
    const link = linkById.get(navId);
    if (link) link.classList.add("is-active");
  };

  const sectionDocumentTop = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY;
  };

  const computeActiveNavId = () => {
    const navH = navHeight();
    const marker = window.scrollY + navH + 20;
    let activeSection = "home";
    for (const id of SECTION_ORDER) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (sectionDocumentTop(el) <= marker) activeSection = id;
      else break;
    }
    return sectionToNavId(activeSection);
  };

  let spyRaf = 0;
  const syncNavFromScroll = () => {
    spyRaf = 0;
    setActive(computeActiveNavId());
  };

  const scheduleSpy = () => {
    if (spyRaf) return;
    spyRaf = window.requestAnimationFrame(syncNavFromScroll);
  };

  window.addEventListener("scroll", scheduleSpy, { passive: true });
  window.addEventListener("resize", scheduleSpy, { passive: true });

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const y = window.scrollY + target.getBoundingClientRect().top - (navHeight() - 2);
      window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });
      history.replaceState(null, "", href);

      const navId = sectionToNavId(target.id);
      setActive(navId);

      const afterScroll = () => setActive(computeActiveNavId());
      if (prefersReducedMotion) {
        afterScroll();
      } else {
        window.setTimeout(afterScroll, 450);
        window.setTimeout(afterScroll, 900);
      }
    });
  });

  syncNavFromScroll();

  // Scroll-to-top
  const toTop = $("#toTop");
  const toggleToTop = () => {
    if (!toTop) return;
    const show = window.scrollY > 520;
    toTop.classList.toggle("is-visible", show);
  };
  window.addEventListener("scroll", toggleToTop, { passive: true });
  toggleToTop();
  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  // Contact form: mailto (no backend required)
  const form = $("#contactForm");
  const note = $("#formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") ?? "").trim();
      const email = String(fd.get("email") ?? "").trim();
      const message = String(fd.get("message") ?? "").trim();

      if (!name || !email || !message) {
        if (note) note.textContent = "Please fill in all fields.";
        return;
      }

      const subject = encodeURIComponent(`Portfolio Contact — ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}\n`);
      const href = `mailto:bellamkondakavya51@gmail.com?subject=${subject}&body=${body}`;

      if (note) note.textContent = "Opening your email client…";
      window.location.href = href;
      form.reset();
      window.setTimeout(() => {
        if (note) note.textContent = "Message drafted. If your email client didn’t open, copy the details and email me.";
      }, 900);
    });
  }

  // Resume download: fetch PDF then trigger save — shows success toast (works on http(s); file:// falls back)
  const RESUME_PATH = "assets/resume/Bellamkonda_Kavya_Resume.pdf";
  const RESUME_FILENAME = "Bellamkonda_Kavya_Resume.pdf";
  const downloadToast = $("#downloadToast");
  let toastTimer = 0;

  const showDownloadToast = (message, isError = false) => {
    if (!downloadToast) return;
    downloadToast.textContent = message;
    downloadToast.hidden = false;
    downloadToast.classList.toggle("toast--error", isError);
    downloadToast.classList.add("toast--visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      downloadToast.classList.remove("toast--visible");
      downloadToast.hidden = true;
    }, 4200);
  };

  $$("a.resume-download").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;
      e.preventDefault();

      (async () => {
        try {
          const res = await fetch(RESUME_PATH, { cache: "force-cache" });
          if (!res.ok) throw new Error("bad response");
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = RESUME_FILENAME;
          a.rel = "noopener";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          showDownloadToast("Resume downloaded successfully.");
        } catch {
          const a = document.createElement("a");
          a.href = RESUME_PATH;
          a.download = RESUME_FILENAME;
          document.body.appendChild(a);
          a.click();
          a.remove();
          showDownloadToast("Download started — check your Downloads folder.");
        }
      })();
    });
  });

  // Particles background (subtle, performant)
  const canvas = $("#particles");
  const ctx = canvas?.getContext?.("2d");
  if (!canvas || !ctx || prefersReducedMotion) return;

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const particles = [];

  const palette = [
    [124, 58, 237], // violet
    [34, 211, 238], // cyan
    [244, 63, 94], // rose
  ];

  function resize() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawn(count) {
    particles.length = 0;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < count; i++) {
      const [r, g, b] = palette[Math.floor(rand(0, palette.length))];
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.2, 0.2),
        rad: rand(1.2, 2.7),
        a: rand(0.16, 0.40),
        rgb: [r, g, b],
      });
    }
  }

  function step() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    // Draw lines + points
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      const [r, g, b] = p.rgb;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`;
      ctx.arc(p.x, p.y, p.rad, 0, Math.PI * 2);
      ctx.fill();

      // connect to near neighbors (simple O(n^2) but capped small)
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          const a = 0.12 * (1 - d2 / (140 * 140));
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  resize();
  const count = Math.round(Math.min(70, Math.max(34, window.innerWidth / 22)));
  spawn(count);
  window.addEventListener("resize", () => {
    resize();
    const c = Math.round(Math.min(70, Math.max(34, window.innerWidth / 22)));
    spawn(c);
  });

  requestAnimationFrame(step);
})();

