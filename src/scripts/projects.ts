// Projects module - category tabs and accessible project detail modal.

const projectTabs = [...document.querySelectorAll<HTMLButtonElement>('.project-tab')];
const projectPanels = [...document.querySelectorAll<HTMLElement>('.project-panel')];
const projectCount = document.querySelector<HTMLElement>('#project-count');

const activateProjectTab = (tab: HTMLButtonElement, moveFocus = false): void => {
  const panelId = tab.getAttribute('aria-controls');
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!panel) return;

  projectTabs.forEach((item) => {
    const isSelected = item === tab;
    item.classList.toggle('is-active', isSelected);
    item.setAttribute('aria-selected', String(isSelected));
    item.tabIndex = isSelected ? 0 : -1;
  });

  projectPanels.forEach((item) => {
    item.hidden = item !== panel;
  });

  if (projectCount) {
    const count = panel.querySelectorAll('.project-card').length;
    projectCount.textContent = `${count} PROJECT${count === 1 ? '' : 'S'}`;
  }

  if (moveFocus) tab.focus();
};

projectTabs.forEach((tab) => {
  tab.addEventListener('click', () => activateProjectTab(tab));

  tab.addEventListener('keydown', (event: KeyboardEvent) => {
    const currentIndex = projectTabs.indexOf(tab);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % projectTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + projectTabs.length) % projectTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = projectTabs.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    const nextTab = projectTabs[nextIndex];
    if (nextTab) activateProjectTab(nextTab, true);
  });
});

const projectModal = document.getElementById('project-modal');
const modalDialog = projectModal?.querySelector<HTMLElement>('.project-modal-dialog');
const modalTitle = document.getElementById('project-modal-title');
const modalDescription = document.getElementById('project-modal-description');
const modalTech = document.getElementById('project-modal-tech');
const modalImage = document.getElementById('project-modal-image') as HTMLImageElement | null;
const modalRepo = document.getElementById('project-modal-repo') as HTMLAnchorElement | null;
const modalClose = projectModal?.querySelector<HTMLButtonElement>('.project-modal-close');
const detailButtons = [...document.querySelectorAll<HTMLButtonElement>('.project-details')];

let lastFocusedElement: HTMLElement | null = null;

const getModalFocusable = (): HTMLElement[] => {
  if (!projectModal) return [];
  return [...projectModal.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(
    (element) => element.offsetParent !== null
  );
};

const openProjectModal = (button: HTMLButtonElement): void => {
  if (!projectModal) return;

  lastFocusedElement = document.activeElement as HTMLElement | null;

  const title = button.dataset.title ?? 'Project details';
  const description = button.dataset.description ?? '';
  const technologies = (button.dataset.tech ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (modalTitle) modalTitle.textContent = title;
  if (modalDescription) modalDescription.textContent = description;

  if (modalTech) {
    modalTech.replaceChildren(
      ...technologies.map((technology) => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = technology;
        return tag;
      })
    );
  }

  if (modalImage) {
    modalImage.src = button.dataset.image ?? '';
    modalImage.alt = button.dataset.imageAlt ?? `${title} preview`;
  }

  if (modalRepo) {
    modalRepo.href = button.dataset.repo ?? '#';
    modalRepo.setAttribute('aria-label', `View the ${title} repository on GitHub in a new tab`);
  }

  projectModal.hidden = false;
  document.body.classList.add('modal-open');
  window.requestAnimationFrame(() => modalClose?.focus());
};

const closeProjectModal = (): void => {
  if (!projectModal || projectModal.hidden) return;

  projectModal.hidden = true;
  document.body.classList.remove('modal-open');
  lastFocusedElement?.focus();
  lastFocusedElement = null;
};

detailButtons.forEach((button) => {
  button.addEventListener('click', () => openProjectModal(button));
});

projectModal?.querySelectorAll<HTMLElement>('[data-close-modal]').forEach((element) => {
  element.addEventListener('click', closeProjectModal);
});

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (!projectModal || projectModal.hidden) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeProjectModal();
    return;
  }

  if (event.key !== 'Tab' || !modalDialog) return;

  const focusable = getModalFocusable();
  if (!focusable.length) {
    event.preventDefault();
    modalDialog.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (!modalDialog.contains(active)) {
    event.preventDefault();
    first.focus();
  } else if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
});
