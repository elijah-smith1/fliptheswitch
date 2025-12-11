/**
 * Stats Component
 * Displays a row of statistics with numbers and labels
 */

import { h } from '@/utils/dom.js';

/**
 * Create a stats row
 * @param {Object} props - Stats properties
 * @param {Array} props.stats - Array of stat objects { number, label }
 * @returns {HTMLElement}
 */
export function Stats({ stats = [] }) {
  if (!stats || stats.length === 0) return null;
  
  const statElements = stats.map(stat => 
    h('div', { className: 'stat' },
      h('div', { className: 'stat__number' }, stat.number),
      h('div', { className: 'stat__label' }, stat.label)
    )
  );
  
  return h('div', { className: 'content-block__stats' }, ...statElements);
}

export default Stats;

