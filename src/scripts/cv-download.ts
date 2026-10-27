// CV download module - verifies and enables CV PDF download
import { portfolioConfig } from './config';

const cvButton = document.querySelector<HTMLButtonElement>('#cv-download');
const cvNote = document.querySelector<HTMLElement>('#cv-note');

let verifiedCv: Blob | null = null;

if (cvButton && cvNote && portfolioConfig.cvPath.trim()) {
  fetch(portfolioConfig.cvPath)
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
      cvNote.textContent = 'The configured CV could not be verified. Check the PDF path in config.ts.';
    });
}

cvButton?.addEventListener('click', () => {
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