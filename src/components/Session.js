/**
 * Session Component
 * Schedule session card with title, time, and tag
 */

import { h } from '@/utils/dom.js';

/**
 * Create a session card
 * @param {Object} props - Session properties
 * @param {string} props.title - Session title
 * @param {string} props.time - Session time/schedule
 * @param {string} props.tag - Session tag (Athletes, Adults, Youth, All)
 * @param {boolean} props.selected - Whether session is selected/highlighted
 * @returns {HTMLElement}
 */
export function Session({ title = '', time = '', tag = '', selected = false }) {
  const sessionClass = selected ? 'session session--selected' : 'session';
  
  return h('div', { className: sessionClass },
    h('h4', {},
      title,
      tag ? h('span', { className: 'tag' }, tag) : null
    ),
    h('p', { className: 'meta' }, time)
  );
}

/**
 * Create a schedule section with filters and sessions
 * @param {Object} props - Schedule section properties
 * @param {string} props.title - Section title
 * @param {Array} props.filters - Array of filter options
 * @param {Array} props.sessions - Array of session objects
 * @returns {HTMLElement}
 */
export function ScheduleSection({ title = '', filters = [], sessions = [] }) {
  const filterButtons = filters.map((filter, index) => 
    h('button', { 
      className: index === 0 ? 'filter-btn filter-btn--active' : 'filter-btn',
      type: 'button'
    }, filter)
  );
  
  const sessionCards = sessions.map(session => Session(session));
  
  return h('section', { className: 'section' },
    h('div', { className: 'container' },
      title ? h('h2', { className: 'section-title' }, title) : null,
      filters.length > 0 ? h('div', { className: 'filters' }, ...filterButtons) : null,
      h('div', { className: 'schedule-grid' }, ...sessionCards)
    )
  );
}

export { Session as default };

