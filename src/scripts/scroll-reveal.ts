// Scroll reveal module - handles fade-in animations on scroll

const revealSelector = [
  '.section-heading',
  '.about-copy',
  '.education-card',
  '.skill-card',
  '.interest-card',
  '.projects-panel',
  '.contact-heading',
  '.contact-form',
].join(', ');

const revealTargets = [...document.querySelectorAll<HTMLElement>(revealSelector)];

const revealElement = (element: HTMLElement): void => {
  element.classList.add('is-visible');
};

if (revealTargets.length) {
  // Stagger sibling items so related cards cascade in gently
  const revealGroups = new Map<Element, HTMLElement[]>();
  revealTargets.forEach((element) => {
    const parent = element.parentElement;
    if (!parent) return;
    if (!revealGroups.has(parent)) revealGroups.set(parent, []);
    revealGroups.get(parent)!.push(element);
  });

  revealGroups.forEach((siblings) => {
    siblings.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index, 6) * 70}ms`;
    });
  });

  try {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealElement(entry.target as HTMLElement);
            observer.unobserve(entry.target); // reveal once, never replay on scroll
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      revealTargets.forEach((element) => revealObserver.observe(element));

      // Keep content visible for keyboard users who tab into a hidden group
      document.addEventListener('focusin', (event) => {
        const target = (event.target as Element).closest?.(revealSelector);
        if (target) revealElement(target as HTMLElement);
      });
    } else {
      revealTargets.forEach(revealElement);
    }
  } catch {
    revealTargets.forEach(revealElement);
  }
}