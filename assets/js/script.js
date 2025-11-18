const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let width,
  height,
  dpr = Math.max(1, window.devicePixelRatio || 1);

function resize() {
  width = canvas.width = Math.floor(canvas.clientWidth * dpr);
  height = canvas.height = Math.floor(canvas.clientHeight * dpr);
  ctx.resetTransform();
  ctx.scale(dpr, dpr);
}

function rnd(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticles(count = 80) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: rnd(0, canvas.clientWidth),
      y: rnd(0, canvas.clientHeight),
      vx: rnd(-0.3, 0.3),
      vy: rnd(-0.2, 0.1),
      size: rnd(1.5, 4),
      life: 1,
      maxLife: 1,
      type: Math.random() > 0.7 ? "accent" : "primary",
    });
  }
}

let mouse = { x: -9999, y: -9999, down: false };
canvas.addEventListener("mousemove", (e) => {
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});
canvas.addEventListener("mouseleave", () => {
  mouse.x = -9999;
  mouse.y = -9999;
});
canvas.addEventListener("mousedown", () => (mouse.down = true));
canvas.addEventListener("mouseup", () => (mouse.down = false));

function step() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight / dpr);
  gradient.addColorStop(0, "rgba(15, 20, 25, 0.15)");
  gradient.addColorStop(0.5, "rgba(34, 197, 94, 0.03)");
  gradient.addColorStop(1, "rgba(14, 165, 233, 0.02)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  for (let p of particles) {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

    if (dist < 200) {
      const force = (1 - dist / 200) * (mouse.down ? 1.2 : 0.35);
      p.vx += (dx / dist) * 0.08 * force;
      p.vy += (dy / dist) * 0.08 * force;
    }

    p.x += p.vx;
    p.y += p.vy;

    p.vx *= 0.96;
    p.vy *= 0.96;
    if (p.x < -10) p.x = canvas.clientWidth + 10;
    if (p.x > canvas.clientWidth + 10) p.x = -10;
    if (p.y < -10) p.y = canvas.clientHeight + 10;
    if (p.y > canvas.clientHeight + 10) p.y = -10;

    const alpha = 0.8;
    const colors =
      p.type === "primary"
        ? { glow: "rgba(34, 197, 94, ", core: "rgba(220, 255, 220, " }
        : { glow: "rgba(14, 165, 233, ", core: "rgba(200, 240, 255, " };

    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
    g.addColorStop(0, colors.glow + 0.6 * alpha + ")");
    g.addColorStop(0.4, colors.glow + 0.2 * alpha + ")");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.core + alpha * 0.95 + ")";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(step);
}

function init() {
  resize();
  createParticles(Math.max(60, Math.floor(canvas.clientWidth / 10)));
  step();
}

window.addEventListener("resize", () => {
  dpr = Math.max(1, window.devicePixelRatio || 1);
  resize();
  createParticles(Math.max(60, Math.floor(canvas.clientWidth / 10)));
});

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  init();

  const header = document.querySelector(".site-header");
  const heroSection = document.getElementById("hero");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("primary-navigation");
  const navLinks = Array.from(document.querySelectorAll(".main-nav .nav-link"));
  const backToTop = document.getElementById("back-to-top");
  const gamesGrid = document.getElementById("games-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const modal = document.getElementById("game-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalTags = document.getElementById("modal-tags");
  const modalPlatform = modal ? modal.querySelector(".modal-platform") : null;
  const modalLink = document.getElementById("modal-link");
  const gameCards = gamesGrid
    ? Array.from(gamesGrid.querySelectorAll(".game-card"))
    : [];
  const emptyStateMessage = document.createElement("p");
  emptyStateMessage.className = "muted";
  emptyStateMessage.textContent =
    "Nenhum projeto nesse estágio ainda. Fique de olho!";
  emptyStateMessage.dataset.state = "empty";

  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  const applyRipple = (btn) => {
    btn.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.style.position = "absolute";
      ripple.style.borderRadius = "50%";
      ripple.style.transform = "scale(0)";
      ripple.style.animation = "ripple 0.6s ease-out";
      ripple.style.pointerEvents = "none";

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.background = "rgba(255, 255, 255, 0.5)";

      btn.style.position = "relative";
      btn.style.overflow = "hidden";
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  };

  document.querySelectorAll(".btn").forEach(applyRipple);

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeInUp 0.8s ease forwards";
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }
  );

  const observeElements = (elements) => {
    elements.forEach((el) => {
      if (!el.dataset.revealBound) {
        revealObserver.observe(el);
        el.dataset.revealBound = "true";
      }
    });
  };

  observeElements(document.querySelectorAll(".card"));
  observeElements(
    document.querySelectorAll(".feature-card, .hero-card, .highlight")
  );
  observeElements(gameCards);

  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
  };

  const toggleMenu = () => {
    if (!menuToggle || !mainNav) return;
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mainNav.classList.toggle("open", !expanded);
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMenu();
    });

    document.addEventListener("click", (event) => {
      if (!mainNav.classList.contains("open")) return;
      if (event.target instanceof Element) {
        if (
          mainNav.contains(event.target) ||
          menuToggle.contains(event.target)
        ) {
          return;
        }
      }
      closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  const activateNavLink = (id) => {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const isActive = href === `#${id}`;
      link.classList.toggle("active", isActive);
    });
  };

  const sectionIds = navLinks
    .map((link) => link.getAttribute("href") || "")
    .filter((href) => href.startsWith("#"))
    .map((href) => href.slice(1));

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section) => section !== null);

  const updateActiveNav = () => {
    if (!sections.length) {
      activateNavLink(null);
      return;
    }

    const probe = window.scrollY + window.innerHeight * 0.3;
    let activeId = null;

    for (const section of sections) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (probe >= top && probe < bottom) {
        activeId = section.id;
        break;
      }
    }

    activateNavLink(activeId);
  };

  updateActiveNav();

  const openModal = (game) => {
    if (
      !modal ||
      !modalTitle ||
      !modalDescription ||
      !modalTags ||
      !modalLink
    ) {
      return;
    }
    modalTitle.textContent = game.title;
    modalDescription.textContent = game.description;

    modalTags.innerHTML = "";
    const tags = Array.isArray(game.tags) ? game.tags : [];
    modalTags.hidden = tags.length === 0;
    tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      modalTags.appendChild(li);
    });

    if (modalPlatform) {
      modalPlatform.textContent = game.platform;
      modalPlatform.hidden = !game.platform;
    }

    modalLink.href = game.link || "#";

    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (
        event.target instanceof Element &&
        event.target.hasAttribute("data-modal-close")
      ) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closeMenu();
    }
  });

  const getGameFromCard = (card) => {
    const title = card.querySelector("h3")?.textContent.trim() || "";
    const description =
      card.dataset.description ||
      card.querySelector("p")?.textContent.trim() ||
      "";
    const platform =
      card.dataset.platform ||
      card.querySelector(".platform")?.textContent.trim() ||
      "";
    const link = card.dataset.link || "#";
    const tags = (card.dataset.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    return {
      id: card.dataset.id || title,
      title,
      description,
      status: card.dataset.status || "",
      platform,
      link,
      tags,
    };
  };

  const ensureEmptyState = (visibleCount) => {
    if (!gamesGrid) return;
    const hasEmptyState = gamesGrid.contains(emptyStateMessage);
    if (visibleCount === 0 && !hasEmptyState) {
      gamesGrid.appendChild(emptyStateMessage);
    } else if (visibleCount > 0 && hasEmptyState) {
      gamesGrid.removeChild(emptyStateMessage);
    }
  };

  const updateGameVisibility = (filter = "all") => {
    if (!gamesGrid) return;
    let visibleCount = 0;
    gameCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.status === filter;
      card.hidden = !matches;
      card.setAttribute("aria-hidden", matches ? "false" : "true");
      if (matches) {
        visibleCount++;
      }
    });
    ensureEmptyState(visibleCount);
  };

  const attachCardInteractions = (card) => {
    const activate = () => openModal(getGameFromCard(card));
    card.addEventListener("click", activate);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  };

  gameCards.forEach((card) => {
    card.setAttribute("aria-hidden", "false");
    attachCardInteractions(card);
  });

  updateGameVisibility();

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";
      filterButtons.forEach((button) => {
        const isActive = button === btn;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      updateGameVisibility(filter);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const targetSelector = this.getAttribute("href");
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMenu();
      }
    });
  });

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    if (header) {
      if (currentScroll > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    if (heroSection && canvas && currentScroll < window.innerHeight) {
      canvas.style.transform = `translateY(${currentScroll * 0.5}px)`;
    }

    if (backToTop) {
      if (currentScroll > window.innerHeight * 0.8) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    updateActiveNav();
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", updateActiveNav);
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const ctaForm = document.querySelector(".cta-form");
  if (ctaForm) {
    const emailInput = ctaForm.querySelector("input[name='email']");
    const feedback = ctaForm.querySelector(".form-feedback");

    ctaForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!emailInput || !feedback) return;

      const email = emailInput.value.trim();
      const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;

      if (!emailRegex.test(email)) {
        feedback.textContent = "Ops! Digite um e-mail válido.";
        feedback.classList.remove("success");
        feedback.classList.add("error");
        emailInput.focus();
        return;
      }

      feedback.textContent =
        "Convite enviado! Confira seu e-mail para confirmar.";
      feedback.classList.remove("error");
      feedback.classList.add("success");
      ctaForm.reset();
    });
  }
});
