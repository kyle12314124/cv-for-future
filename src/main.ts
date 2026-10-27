// Portfolio entry point
import './styles/main.css';
import './scripts/navigation';
import './scripts/profile-video';
import './scripts/scroll-reveal';
import './scripts/cv-download';
import './scripts/contact-form';
import './scripts/config';

// Initialize year in footer
const yearElement = document.querySelector('#year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear().toString();
}

// Signal that reveal setup is complete
declare global {
  interface Window {
    __portfolioRevealReady: boolean;
  }
}
window.__portfolioRevealReady = true;