// Contact form module - handles form validation and Formspree submission
import { portfolioConfig } from './config';

const contactForm = document.querySelector<HTMLFormElement>('#contact-form');
const formFeedback = document.querySelector<HTMLElement>('#form-feedback');
const submitButton = contactForm?.querySelector<HTMLButtonElement>('.form-submit');

if (!contactForm || !formFeedback || !submitButton) {
  // Elements not found, exit early
} else {
  const formFields = [...contactForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')];

  formFields.forEach((field) => {
    field.addEventListener('input', () => field.setCustomValidity(''));
  });

  let isSubmitting = false;

  const setSubmittingState = (submitting: boolean): void => {
    isSubmitting = submitting;
    submitButton.disabled = submitting;
    if (submitting) {
      submitButton.innerHTML = 'Sending <span aria-hidden="true">⟳</span>';
      submitButton.setAttribute('aria-busy', 'true');
    } else {
      submitButton.innerHTML = 'Send message <span aria-hidden="true">↗</span>';
      submitButton.removeAttribute('aria-busy');
    }
  };

  const showFeedback = (message: string, type: 'success' | 'error' | 'info'): void => {
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.setAttribute('role', type === 'error' ? 'alert' : 'status');
  };

  const submitToFormspree = async (formData: FormData): Promise<{ ok: boolean; message: string }> => {
    const endpoint = portfolioConfig.formspreeEndpoint;

    if (!endpoint) {
      return {
        ok: false,
        message: 'Form submission is not configured. Please contact directly via email.',
      };
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        return { ok: true, message: 'Message sent successfully! I\'ll get back to you soon.' };
      }

      const data = await response.json().catch(() => ({}));
      const errorMessage = data.errors?.[0]?.message || 'Failed to send message. Please try again.';
      return { ok: false, message: errorMessage };
    } catch {
      return { ok: false, message: 'Network error. Please check your connection and try again.' };
    }
  };

  contactForm.addEventListener('submit', async (event: SubmitEvent) => {
    event.preventDefault();

    if (isSubmitting) return;

    formFields.forEach((field) => {
      field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
    });

    if (!contactForm.reportValidity()) {
      showFeedback('Please complete every field with a valid email address.', 'error');
      return;
    }

    setSubmittingState(true);
    showFeedback('Sending message...', 'info');

    const formData = new FormData(contactForm);

    // Add hidden fields for Formspree
    formData.append('_subject', `Portfolio message from ${formData.get('name')?.toString().trim() ?? 'Unknown'}`);
    formData.append('_replyto', formData.get('email')?.toString().trim() ?? '');
    formData.append('_next', window.location.href); // Redirect after submission (optional)

    const result = await submitToFormspree(formData);

    if (result.ok) {
      showFeedback(result.message, 'success');
      contactForm.reset();
    } else {
      showFeedback(result.message, 'error');
    }

    setSubmittingState(false);
  });
}