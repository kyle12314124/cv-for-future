// Portfolio configuration
// Update contact details here. Keep phone blank until you confirm a number for publication.

export interface PortfolioConfig {
  name: string;
  email: string;
  phone: string;
  location: string;
  cvPath: string; // Add a real CV PDF to public/cv/ and set its relative path here.
  formspreeEndpoint: string; // Formspree endpoint for contact form
}

export const portfolioConfig: PortfolioConfig = Object.freeze({
  name: 'Kyle Joshua C. Acosta',
  email: 'acostakyle24@gmail.com',
  phone: '09836801589',
  location: 'Quezon City, Philippines',
  cvPath: '/cv/Kyle-Joshua-Acosta-CV.pdf',
  formspreeEndpoint: 'https://formspree.io/f/xvkzjqpb',
});

// Make config available globally for inline scripts compatibility
declare global {
  interface Window {
    PORTFOLIO_CONFIG: PortfolioConfig;
  }
}

window.PORTFOLIO_CONFIG = portfolioConfig;