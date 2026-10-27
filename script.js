const config = window.PORTFOLIO_CONFIG;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = [...navLinks.querySelectorAll('a[href^="#"]')];

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
  navLinks.classList.remove('is-open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  navLinks.classList.toggle('is-open', !isOpen);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});

document.addEventListener('pointerdown', (event) => {
  if (menuToggle.getAttribute('aria-expanded') === 'true'
      && !navLinks.contains(event.target)
      && !menuToggle.contains(event.target)) closeMenu();
});

navLinks.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  closeMenu();

  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
});

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 901px)').matches) closeMenu();
});

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#email-text').textContent = config.email;
document.querySelector('#email-link').href = `mailto:${config.email}`;
document.querySelector('#location-text').textContent = config.location;

if (config.phone.trim()) {
  const phoneLink = document.querySelector('#phone-contact');
  document.querySelector('#phone-text').textContent = config.phone;
  phoneLink.href = `tel:${config.phone.replace(/[^\d+]/g, '')}`;
  phoneLink.hidden = false;
}

const navSections = navItems
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const updateActiveNavigation = () => {
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
window.addEventListener('scroll', () => {
  if (navigationUpdateQueued) return;
  navigationUpdateQueued = true;
  window.requestAnimationFrame(() => {
    updateActiveNavigation();
    navigationUpdateQueued = false;
  });
}, { passive: true });
window.addEventListener('resize', updateActiveNavigation);
updateActiveNavigation();

const profileVideo = document.querySelector('.portrait-video');
if (profileVideo) {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const portraitFrame = profileVideo.closest('.portrait-frame');
  let videoVisible = !('IntersectionObserver' in window);

  const syncProfileVideo = () => {
    if (motionPreference.matches || !videoVisible) {
      profileVideo.pause();
      portraitFrame.classList.remove('is-playing');
      return;
    }
    try {
      profileVideo.play()?.catch(() => portraitFrame.classList.remove('is-playing'));
    } catch {
      portraitFrame.classList.remove('is-playing');
    }
  };

  profileVideo.addEventListener('playing', () => portraitFrame.classList.add('is-playing'));
  profileVideo.addEventListener('pause', () => portraitFrame.classList.remove('is-playing'));

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      videoVisible = entry.isIntersecting && entry.intersectionRatio >= 0.05;
      syncProfileVideo();
    }, { threshold: 0.05 });
    videoObserver.observe(profileVideo);
  } else {
    syncProfileVideo();
  }
  motionPreference.addEventListener('change', syncProfileVideo);
}

/* Scroll reveal ----------------------------------------------------------- */
/* Elements are only hidden while scripting is active (the `has-js` class set
   in <head>), so content stays visible when JavaScript is unavailable. */
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
const revealTargets = [...document.querySelectorAll(revealSelector)];
const revealElement = (element) => element.classList.add('is-visible');

if (revealTargets.length) {
  // Stagger sibling items so related cards cascade in gently.
  const revealGroups = new Map();
  revealTargets.forEach((element) => {
    const parent = element.parentElement;
    if (!revealGroups.has(parent)) revealGroups.set(parent, []);
    revealGroups.get(parent).push(element);
  });
  revealGroups.forEach((siblings) => {
    siblings.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index, 6) * 70}ms`;
    });
  });

  try {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealElement(entry.target);
          observer.unobserve(entry.target); // reveal once, never replay on scroll
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      revealTargets.forEach((element) => revealObserver.observe(element));

      // Keep content visible for keyboard users who tab into a hidden group.
      document.addEventListener('focusin', (event) => {
        const target = event.target.closest?.(revealSelector);
        if (target) revealElement(target);
      });
    } else {
      revealTargets.forEach(revealElement);
    }
  } catch {
    revealTargets.forEach(revealElement);
  }
}

window.__portfolioRevealReady = true;

const cvButton = document.querySelector('#cv-download');
const cvNote = document.querySelector('#cv-note');
let verifiedCv = null;

if (config.cvPath.trim()) {
  fetch(config.cvPath)
    .then(async (response) => {
      if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf')) {
        throw new Error('CV PDF is unavailable');
      }
      const pdf = await response.blob();
      const signature = new Uint8Array(await pdf.slice(0, 5).arrayBuffer());
      if (String.fromCharCode(...signature) !== '%PDF-') throw new Error('CV file is not a valid PDF');
      verifiedCv = pdf;
      cvButton.disabled = false;
      cvButton.innerHTML = 'Download CV <span aria-hidden="true">↓</span>';
      cvNote.textContent = 'Your CV PDF is ready.';
    })
    .catch(() => {
      cvNote.textContent = 'The configured CV could not be verified. Check the PDF path in content.js.';
    });
}

cvButton.addEventListener('click', () => {
  if (!verifiedCv) return;
  const downloadUrl = URL.createObjectURL(verifiedCv);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'Kyle-Joshua-C-Acosta-CV.pdf';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
});

const contactForm = document.querySelector('#contact-form');
const formFeedback = document.querySelector('#form-feedback');
const formFields = [...contactForm.querySelectorAll('input, textarea')];

formFields.forEach((field) => {
  field.addEventListener('input', () => field.setCustomValidity(''));
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formFields.forEach((field) => {
    field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
  });

  if (!contactForm.reportValidity()) {
    formFeedback.textContent = 'Please complete every field with a valid email address.';
    return;
  }

  const formData = new FormData(contactForm);
  const subject = `Portfolio message from ${formData.get('name').trim()}`;
  const body = `From: ${formData.get('name').trim()} (${formData.get('email').trim()})\n\n${formData.get('message').trim()}`;
  formFeedback.textContent = 'Your email application should open with a draft. This website does not send the message; review and send it from your email app.';
  window.location.href = `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
