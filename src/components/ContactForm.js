/**
 * ContactForm Component
 * Contact form with name, email, phone, and message fields
 */

import { h } from '@/utils/dom.js';

/**
 * Create a form field
 * @param {Object} props - Field properties
 */
function FormField({ label, name, type = 'text', placeholder = '', required = true, optional = false }) {
  const labelContent = optional 
    ? [label, h('span', { className: 'optional' }, ' (optional)')]
    : label;
  
  const inputAttrs = {
    id: name,
    name,
    type,
    placeholder,
    autocomplete: name
  };
  
  if (required && !optional) {
    inputAttrs.required = true;
    inputAttrs['aria-required'] = 'true';
  }
  
  let inputElement;
  if (type === 'textarea') {
    inputElement = h('textarea', { 
      ...inputAttrs, 
      type: undefined,
      placeholder 
    });
  } else {
    inputElement = h('input', inputAttrs);
  }
  
  return h('div', { className: 'form-field' },
    h('label', { for: name }, ...([labelContent].flat())),
    inputElement
  );
}

/**
 * Create a contact form
 * @param {Object} props - ContactForm properties
 * @param {Array} props.fields - Array of field configurations
 * @param {string} props.submitText - Submit button text
 * @param {string} props.action - Form action URL
 * @returns {HTMLElement}
 */
export function ContactForm({ 
  fields = null,
  submitText = 'Send Message',
  action = '#'
}) {
  // Default fields if not provided
  const defaultFields = [
    { label: 'Name', name: 'name', type: 'text', placeholder: 'Your name' },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
    { label: 'Phone', name: 'phone', type: 'tel', placeholder: '(555) 123-4567', optional: true },
    { label: 'Message', name: 'message', type: 'textarea', placeholder: 'Tell me about your goals...' }
  ];
  
  const formFields = fields || defaultFields;
  const fieldElements = formFields.map(field => FormField(field));
  
  return h('form', { 
    className: 'contact-form', 
    action, 
    method: 'post',
    'aria-labelledby': 'contact-heading'
  },
    h('h2', { id: 'contact-heading', className: 'sr-only' }, 'Contact form'),
    ...fieldElements,
    h('button', { className: 'btn btn--yellow', type: 'submit' },
      h('span', {}, submitText)
    )
  );
}

export default ContactForm;

