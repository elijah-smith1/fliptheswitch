/**
 * ContentBlock Component
 * Alternating two-column content block (zigzag pattern)
 */

import { h, unsplashImages } from '@/utils/dom.js';
import { Stats } from './Stats.js';

/**
 * Create a content block section
 * @param {Object} props - Content block properties
 * @param {string} props.label - Small label text above title
 * @param {string} props.title - Block title
 * @param {string|Array} props.description - Description text or array of paragraphs
 * @param {Object} props.image - Image object { src, alt, placeholder }
 * @param {Object} props.cta - CTA button { text, href, variant }
 * @param {Array} props.stats - Stats array for Stats component
 * @param {boolean} props.reverse - Whether to reverse the layout
 * @param {boolean} props.darkText - Whether text section has dark background
 * @returns {HTMLElement}
 */
export function ContentBlock({
  label = '',
  title = '',
  description = '',
  image = null,
  cta = null,
  stats = null,
  reverse = false,
  darkText = false
}) {
  // Create media section
  let mediaElement;
  
  if (image?.src) {
    mediaElement = h('div', { className: 'content-block__media' },
      h('img', { src: image.src, alt: image.alt || title })
    );
  } else {
    const placeholderLabel = image?.placeholder || 'Image Placeholder';
    mediaElement = h('div', { 
      className: 'content-block__media content-block__media--placeholder',
      'data-label': placeholderLabel
    });
  }
  
  // Create description elements
  const descElements = [];
  if (Array.isArray(description)) {
    description.forEach(text => {
      descElements.push(h('p', { className: 'content-block__description' }, text));
    });
  } else if (description) {
    descElements.push(h('p', { className: 'content-block__description' }, description));
  }
  
  // Create text section children
  const textChildren = [];
  
  if (label) {
    textChildren.push(h('span', { className: 'content-block__label' }, label));
  }
  
  textChildren.push(h('h2', { className: 'content-block__title' }, title));
  textChildren.push(...descElements);
  
  if (stats) {
    textChildren.push(Stats({ stats }));
  }
  
  if (cta) {
    textChildren.push(
      h('a', { 
        className: `btn btn--${cta.variant || 'primary'}`, 
        href: cta.href 
      }, h('span', {}, cta.text))
    );
  }
  
  const textClass = darkText 
    ? 'content-block__text content-block__text--dark' 
    : 'content-block__text';
  
  const textElement = h('div', { className: textClass }, ...textChildren);
  
  // Create block with proper order
  const blockClass = reverse ? 'content-block content-block--reverse' : 'content-block';
  
  return h('div', { className: blockClass },
    mediaElement,
    textElement
  );
}

export default ContentBlock;

