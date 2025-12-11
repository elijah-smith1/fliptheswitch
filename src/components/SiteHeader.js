/**
 * SiteHeader Component
 * Renders the sticky navigation header
 */

import { h } from '@/utils/dom.js';

/**
 * Create the site header
 * @param {Object} navigation - Navigation data from Firestore
 * @param {string} currentPage - Current page ID for active state
 * @returns {HTMLElement}
 */
export function SiteHeader({ navigation, currentPage = 'home' }) {
  const { brand, items } = navigation;
  
  const navItems = items.map(item => {
    const isCurrent = item.id === currentPage;
    return h('li', {},
      h('a', {
        href: item.href,
        'aria-current': isCurrent ? 'page' : null
      }, item.text)
    );
  });
  
  return h('header', { className: 'site-header' },
    h('div', { className: 'container header-inner' },
      h('a', { className: 'brand', href: brand.href || '/' }, brand.text),
      h('nav', { className: 'site-nav', 'aria-label': 'Primary' },
        h('ul', {}, ...navItems)
      )
    )
  );
}

export default SiteHeader;

