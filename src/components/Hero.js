/**
 * Hero Component
 * Full-screen hero section with title, subtitle, and CTAs
 */

import { h, unsplashImages } from '@/utils/dom.js';

/**
 * Create a hero section
 * @param {Object} props - Hero properties
 * @param {string} props.title - Main headline (can include {highlight} markers)
 * @param {string} props.subtitle - Subheadline text
 * @param {Array} props.ctas - Array of CTA button objects
 * @param {string} props.backgroundImage - Background image URL
 * @param {string} props.variant - Hero variant (dark, light)
 * @returns {HTMLElement}
 */
export function Hero({ 
  title = '', 
  subtitle = '', 
  ctas = [], 
  backgroundImage = unsplashImages.hero,
  variant = 'dark' 
}) {
  // Parse title for highlight markers
  const titleParts = title.split(/\{highlight\}|\{\/highlight\}/);
  const titleElements = [];
  
  titleParts.forEach((part, index) => {
    if (index % 2 === 1) {
      // This is highlighted text
      titleElements.push(h('span', { className: 'highlight' }, part));
    } else if (part.includes('<br>') || part.includes('\n')) {
      // Handle line breaks
      const lines = part.split(/<br>|\n/);
      lines.forEach((line, lineIndex) => {
        if (lineIndex > 0) {
          titleElements.push(h('br', {}));
        }
        titleElements.push(document.createTextNode(line));
      });
    } else {
      titleElements.push(document.createTextNode(part));
    }
  });
  
  // Create CTA buttons
  const ctaElements = ctas.map(cta => {
    const buttonClass = `btn btn--${cta.variant || 'primary'}`;
    return h('a', { className: buttonClass, href: cta.href },
      h('span', {}, cta.text)
    );
  });
  
  const heroClass = `hero hero--${variant}`;
  const heroStyle = backgroundImage ? {
    backgroundImage: `url("${backgroundImage}")`
  } : {};
  
  return h('section', { className: heroClass, style: heroStyle },
    h('div', { className: 'hero-inner' },
      h('h1', { className: 'hero-title' }, ...titleElements),
      subtitle ? h('p', { className: 'hero-subtitle' }, subtitle) : null,
      ctas.length > 0 ? h('div', { className: 'hero-ctas' }, ...ctaElements) : null
    )
  );
}

export default Hero;

