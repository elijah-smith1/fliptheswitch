/**
 * CredentialsList Component
 * List of credentials with yellow dash markers
 */

import { h } from '@/utils/dom.js';

/**
 * Create a credentials list
 * @param {Object} props - CredentialsList properties
 * @param {Array} props.items - Array of credential strings
 * @returns {HTMLElement}
 */
export function CredentialsList({ items = [] }) {
  const listItems = items.map(item => h('li', {}, item));
  
  return h('ul', { className: 'credentials-list' }, ...listItems);
}

export default CredentialsList;

