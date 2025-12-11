/**
 * CTASection Component
 * Call-to-action section with title, description, and buttons
 */

import { h } from '@/utils/dom.js';

/**
 * Create a CTA section
 * @param {Object} props - CTASection properties
 * @param {string} props.title - Section title
 * @param {string} props.description - Description text
 * @param {Array} props.buttons - Array of button objects { text, href, variant }
 * @param {boolean} props.altBackground - Use alternate background
 * @returns {HTMLElement}
 */
export function CTASection({ 
  title = '', 
  description = '', 
  buttons = [],
  altBackground = true 
}) {
  const buttonElements = buttons.map(btn => 
    h('a', { 
      className: `btn btn--${btn.variant || 'yellow'}`, 
      href: btn.href 
    }, h('span', {}, btn.text))
  );
  
  const sectionClass = altBackground ? 'section section--alt' : 'section';
  
  return h('section', { className: sectionClass, style: { textAlign: 'center' } },
    h('div', { className: 'container narrow' },
      h('h2', { 
        className: 'section-title', 
        style: { display: 'block', textAlign: 'center' } 
      }, title),
      description ? h('p', { 
        style: { 
          margin: '1.5rem 0 2rem', 
          color: 'var(--color-text-muted)',
          maxWidth: '50ch',
          marginLeft: 'auto',
          marginRight: 'auto'
        } 
      }, description) : null,
      buttons.length > 0 ? h('div', { 
        style: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' } 
      }, ...buttonElements) : null
    )
  );
}

export default CTASection;

