/**
 * Footer Component
 * Site footer with brand, contact, and social links
 */

import { h } from '@/utils/dom.js';

/**
 * Create the site footer
 * @param {Object} props - Footer properties
 * @param {string} props.brand - Brand name
 * @param {string} props.email - Contact email
 * @param {string} props.copyright - Copyright text
 * @param {Array} props.social - Array of social link objects { platform, label, href }
 * @returns {HTMLElement}
 */
export function Footer({ 
  brand = 'Flip The Switch Performance',
  email = 'train@fliptheswitch.co',
  copyright = '© 2025 Flip The Switch. All rights reserved.',
  social = []
}) {
  const socialLinks = social.map(link => 
    h('a', { href: link.href, 'aria-label': link.platform }, link.label)
  );
  
  return h('footer', { className: 'site-footer' },
    h('div', { className: 'container' },
      h('p', { style: { marginBottom: '0.75rem' } },
        h('strong', { style: { color: '#fff' } }, brand)
      ),
      h('p', {},
        h('a', { href: `mailto:${email}` }, email)
      ),
      social.length > 0 ? h('div', { 
        className: 'social-links', 
        style: { justifyContent: 'center' } 
      }, ...socialLinks) : null,
      h('p', { style: { marginTop: '1.5rem', fontSize: '0.8rem' } }, copyright)
    )
  );
}

export default Footer;

