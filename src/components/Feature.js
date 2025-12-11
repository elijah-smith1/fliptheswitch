/**
 * Feature Component
 * Feature block with icon, title, and description
 */

import { h } from '@/utils/dom.js';

/**
 * Create a feature block
 * @param {Object} props - Feature properties
 * @param {string} props.icon - Icon emoji or text
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @returns {HTMLElement}
 */
export function Feature({ icon = '', title = '', description = '' }) {
  return h('div', { className: 'feature' },
    icon ? h('span', { className: 'icon' }, icon) : null,
    h('h3', {}, title),
    h('p', {}, description)
  );
}

/**
 * Create a features grid section
 * @param {Object} props - Features properties
 * @param {string} props.title - Section title
 * @param {Array} props.items - Array of feature objects
 * @param {number} props.columns - Number of columns (2 or 3)
 * @returns {HTMLElement}
 */
export function FeaturesSection({ title = '', items = [], columns = 3 }) {
  const featureElements = items.map(item => Feature(item));
  
  const gridStyle = columns !== 3 ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : {};
  
  return h('section', { className: 'section' },
    h('div', { className: 'container' },
      title ? h('h2', { className: 'section-title' }, title) : null,
      h('div', { className: 'features', style: gridStyle }, ...featureElements)
    )
  );
}

export { Feature as default };

