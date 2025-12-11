/**
 * ProgramCard Component
 * Training program card with title, description, and CTA
 */

import { h } from '@/utils/dom.js';

/**
 * Create a program card
 * @param {Object} props - ProgramCard properties
 * @param {string} props.title - Program title
 * @param {string} props.description - Program description
 * @param {Object} props.cta - CTA button { text, href, variant }
 * @returns {HTMLElement}
 */
export function ProgramCard({ title = '', description = '', cta = null }) {
  return h('div', { className: 'program-card' },
    h('h3', {}, title),
    h('p', {}, description),
    cta ? h('div', { className: 'card-actions' },
      h('a', { 
        className: `btn btn--${cta.variant || 'primary'}`, 
        href: cta.href 
      }, h('span', {}, cta.text))
    ) : null
  );
}

/**
 * Create a programs grid section
 * @param {Object} props - Programs section properties
 * @param {string} props.title - Section title
 * @param {Array} props.programs - Array of program objects
 * @returns {HTMLElement}
 */
export function ProgramsSection({ title = '', programs = [] }) {
  const programCards = programs.map(program => ProgramCard(program));
  
  return h('section', { className: 'section' },
    h('div', { className: 'container' },
      title ? h('h2', { className: 'section-title' }, title) : null,
      h('div', { className: 'programs-grid', style: { marginTop: '2rem' } }, ...programCards)
    )
  );
}

export { ProgramCard as default };

