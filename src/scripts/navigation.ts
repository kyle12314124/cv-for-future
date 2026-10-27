// Navigation module - mobile menu, active link highlighting

const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navLinks = document.querySelector<HTMLDivElement>('.nav-links');
const navItems = [...document.querySelectorAll<HTMLAnchorElement>('.nav-links a[href^="#"]')];

if (!menuToggle || !navLinks) {
  console.warn('Navigation elements not found');
}

function closeMenu(): void {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation menu');
  navLinks?.classList.remove('is-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  navLinks?.classList.toggle('is-open', !isOpen);
});

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle?.focus();
  }
});

document.addEventListener('pointerdown', (event: PointerEvent) => {
  if (
    menuToggle?.getAttribute('aria-expanded') === 'true' &&
    navLinks &&
    !navLinks.contains(event.target as Node) &&
    !menuToggle.contains(event.target as Node)
  ) {
    closeMenu();
  }
});

navLinks?.addEventListener('click', (event: MouseEvent) => {
  const clickTarget = event.target as Element | null;
  const link = clickTarget?.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link) return;
  closeMenu();

  const targetElement = document.querySelector(link.getAttribute('href') ?? '');
  if (targetElement) {
    targetElement.setAttribute('tabindex', '-1');
    (targetElement as HTMLElement).focus({ preventScroll: true });
  }
});

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 901px)').matches) closeMenu();
});

// Active navigation highlighting
const navSections = navItems
  .map((link) => document.querySelector(link.getAttribute('href') ?? ''))
  .filter((el): el is Element => el !== null);

const updateActiveNavigation = (): void => {
  const activationLine = window.innerHeight * 0.36;
  let activeSection = navSections[0];
  navSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= activationLine) activeSection = section;
  });
  navItems.forEach((link) => {
    if (link.hash === `#${activeSection.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};

let navigationUpdateQueued = false;
window.addEventListener(
  'scroll',
  () => {
    if (navigationUpdateQueued) return;
    navigationUpdateQueued = true;
    window.requestAnimationFrame(() => {
      updateActiveNavigation();
      navigationUpdateQueued = false;
    });
  },
  { passive: true }
);
window.addEventListener('resize', updateActiveNavigation);
updateActiveNavigation();