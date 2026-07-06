const body = document.body;
const root = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navLinks = [...document.querySelectorAll('.nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const statusText = document.querySelector('.section-status strong');
const revealItems = [...document.querySelectorAll('.reveal')];
const progressBar = document.querySelector('.scroll-progress span');
const heroArt = document.querySelector('.hero-art');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  body.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.classList.remove('open');
    body.classList.remove('menu-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', '메뉴 열기');
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(item);
});

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!current) return;
    const id = current.target.id;
    const sectionName = current.target.dataset.sectionName || id.toUpperCase();
    statusText && (statusText.textContent = sectionName);
    body.dataset.section = sectionName.toLowerCase();

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  },
  { rootMargin: '-24% 0px -58% 0px', threshold: [0, 0.12, 0.35] }
);
sections.forEach((section) => activeSectionObserver.observe(section));

let ticking = false;
function updateScrollEffects() {
  const y = window.scrollY;
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max(y / max, 0), 1);
  root.style.setProperty('--progress', progress.toFixed(4));
  root.style.setProperty('--scroll-shift', `${Math.min(y, 900)}px`);

  if (heroArt) {
    heroArt.style.setProperty('--hero-parallax', `${Math.min(y * 0.16, 130)}px`);
  }

  document.querySelector('.topbar')?.classList.toggle('scrolled', y > 30);
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });
updateScrollEffects();

if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  body.classList.add('cursor-ready');

  window.addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    root.style.setProperty('--mouse-x', `${(mouseX / window.innerWidth) * 100}%`);
    root.style.setProperty('--mouse-y', `${(mouseY / window.innerHeight) * 100}%`);
  });

  const animateCursor = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  document.querySelectorAll('a, button, .tilt-card').forEach((target) => {
    target.addEventListener('pointerenter', () => body.classList.add('cursor-hover'));
    target.addEventListener('pointerleave', () => body.classList.remove('cursor-hover'));
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 6;
      const rotateX = (0.5 - py) * 5;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.magnetic').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.translate = `${x * 0.09}px ${y * 0.09}px`;
    });
    item.addEventListener('pointerleave', () => {
      item.style.translate = '';
    });
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
