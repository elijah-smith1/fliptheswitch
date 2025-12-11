/**
 * PageRenderer
 * Dynamically renders pages based on Firestore content
 */

import { clearElement, h } from '@/utils/dom.js';
import { getPageContent, getNavigation, getFooter } from '@/firebase/firestore.js';
import { router } from '@/utils/router.js';
import { SITE_ID } from '@/firebase/config.js';

import {
  SiteHeader,
  Hero,
  ContentBlock,
  MediaRow,
  ImageDivider,
  CTASection,
  FeaturesSection,
  ProgramsSection,
  ScheduleSection,
  Footer,
  ContactForm,
  CredentialsList
} from '@/components/index.js';

/**
 * Block type renderers
 * Maps block types to their rendering functions
 */
const blockRenderers = {
  hero: (block) => Hero(block),
  
  'content-block': (block) => ContentBlock(block),
  
  'media-row': (block) => MediaRow({ items: block.items }),
  
  'image-divider': (block) => ImageDivider(block),
  
  cta: (block) => CTASection(block),
  
  features: (block) => FeaturesSection(block),
  
  programs: (block) => ProgramsSection(block),
  
  schedule: (block) => ScheduleSection(block),
  
  credentials: (block) => {
    return h('section', { className: 'section' },
      h('div', { className: 'container narrow' },
        block.title ? h('h2', { className: 'section-title' }, block.title) : null,
        CredentialsList({ items: block.items })
      )
    );
  },
  
  'contact-form': (block) => {
    return h('section', { className: 'section' },
      h('div', { className: 'container' },
        ContactForm(block)
      )
    );
  },
  
  'contact-split': (block) => {
    // Two-column contact layout (info + form)
    const infoSection = h('div', { className: 'content-block__text', style: { padding: '5rem 4rem' } },
      block.label ? h('span', { className: 'content-block__label' }, block.label) : null,
      h('h1', { className: 'content-block__title' }, block.title),
      h('p', { className: 'content-block__description' }, block.description),
      
      // Contact info
      h('div', { style: { marginTop: '2.5rem' } },
        block.email ? h('p', { style: { marginBottom: '1.25rem' } },
          h('strong', { style: { color: '#fff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' } }, 'Email'),
          h('br'),
          h('a', { href: `mailto:${block.email}`, style: { color: 'var(--color-yellow)', textDecoration: 'none', fontSize: '1.1rem' } }, block.email)
        ) : null,
        block.location ? h('p', { style: { marginBottom: '1.25rem' } },
          h('strong', { style: { color: '#fff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' } }, 'Location'),
          h('br'),
          h('span', { style: { color: 'var(--color-text-muted)' } }, block.location)
        ) : null,
        block.hours ? h('p', { style: { marginBottom: '1.25rem' } },
          h('strong', { style: { color: '#fff', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' } }, 'Hours'),
          h('br'),
          h('span', { style: { color: 'var(--color-text-muted)' } }, block.hours)
        ) : null
      ),
      
      // Social links
      block.social ? h('div', { className: 'social-links', style: { marginTop: '2rem' } },
        ...block.social.map(s => h('a', { href: s.href, 'aria-label': s.platform }, s.label))
      ) : null
    );
    
    const formSection = h('div', { className: 'content-block__text content-block__text--dark', style: { padding: '5rem 4rem' } },
      ContactForm(block.form || {})
    );
    
    return h('div', { className: 'content-block', style: { minHeight: 'auto' } },
      infoSection,
      formSection
    );
  },
  
  section: (block) => {
    // Generic section with title and content
    const sectionClass = block.variant === 'alt' ? 'section section--alt' : 'section';
    return h('section', { className: sectionClass },
      h('div', { className: block.narrow ? 'container narrow' : 'container' },
        block.title ? h('h2', { className: 'section-title' }, block.title) : null,
        block.content ? h('p', { style: { marginTop: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.8' } }, block.content) : null
      )
    );
  },
  
  'intro-section': (block) => {
    return h('section', { className: 'section section--intro' },
      h('div', { className: 'container' },
        h('h1', { className: 'page-title' }, block.title),
        block.subtitle ? h('p', { className: 'lede' }, block.subtitle) : null
      )
    );
  }
};

/**
 * Render a single block
 * @param {Object} block - Block data from Firestore
 * @returns {HTMLElement|null}
 */
function renderBlock(block) {
  const renderer = blockRenderers[block.type];
  
  if (renderer) {
    return renderer(block);
  }
  
  console.warn(`Unknown block type: ${block.type}`);
  return null;
}

/**
 * PageRenderer Class
 * Manages page rendering and navigation
 */
class PageRenderer {
  constructor(appElement) {
    this.appElement = appElement;
    this.navigation = null;
    this.footerData = null;
    this.currentPage = null;
  }

  /**
   * Initialize the renderer
   */
  async init() {
    // Load navigation and footer data
    this.navigation = await getNavigation(SITE_ID);
    this.footerData = await getFooter(SITE_ID);
    
    // Set up router
    this.setupRouter();
    
    // Initial render
    router.init();
  }

  /**
   * Set up router with page handlers
   */
  setupRouter() {
    const pages = ['/', '/about', '/programs', '/schedule', '/gallery', '/contact'];
    
    pages.forEach(path => {
      router.register(path, async () => {
        const pageId = router.constructor.getPageId(path);
        await this.renderPage(pageId);
      });
    });
    
    // 404 handler
    router.register('/404', async () => {
      await this.render404();
    });
    
    // Update navigation on route change
    router.onNavigate = (path) => {
      this.updateActiveNavItem(router.constructor.getPageId(path));
    };
  }

  /**
   * Render a page by ID
   * @param {string} pageId - Page identifier
   */
  async renderPage(pageId) {
    this.currentPage = pageId;
    
    // Show loading state
    this.showLoading();
    
    try {
      // Fetch page content
      const pageData = await getPageContent(SITE_ID, pageId);
      
      if (!pageData) {
        await this.render404();
        return;
      }
      
      // Clear app container
      clearElement(this.appElement);
      
      // Render skip link
      this.appElement.appendChild(
        h('a', { className: 'skip-link', href: '#main' }, 'Skip to content')
      );
      
      // Render header
      this.appElement.appendChild(
        SiteHeader({ navigation: this.navigation, currentPage: pageId })
      );
      
      // Render main content
      const main = h('main', { id: 'main' });
      
      // Render blocks
      if (pageData.blocks && Array.isArray(pageData.blocks)) {
        pageData.blocks.forEach(block => {
          const element = renderBlock(block);
          if (element) {
            main.appendChild(element);
          }
        });
      }
      
      this.appElement.appendChild(main);
      
      // Render footer
      this.appElement.appendChild(Footer(this.footerData));
      
      // Update document title
      document.title = pageData.title 
        ? `${pageData.title} — Flip The Switch Performance`
        : 'Flip The Switch Performance';
      
    } catch (error) {
      console.error('Error rendering page:', error);
      this.showError(error);
    }
  }

  /**
   * Render 404 page
   */
  async render404() {
    clearElement(this.appElement);
    
    this.appElement.appendChild(
      h('a', { className: 'skip-link', href: '#main' }, 'Skip to content')
    );
    
    this.appElement.appendChild(
      SiteHeader({ navigation: this.navigation, currentPage: null })
    );
    
    this.appElement.appendChild(
      h('main', { id: 'main' },
        h('section', { className: 'hero hero--dark', style: { minHeight: '80vh' } },
          h('div', { className: 'hero-inner' },
            h('h1', { className: 'hero-title' }, '404'),
            h('p', { className: 'hero-subtitle' }, 'Page not found. Let\'s get you back on track.'),
            h('div', { className: 'hero-ctas' },
              h('a', { className: 'btn btn--yellow', href: '/' },
                h('span', {}, 'Go Home')
              )
            )
          )
        )
      )
    );
    
    this.appElement.appendChild(Footer(this.footerData));
  }

  /**
   * Show loading state
   */
  showLoading() {
    // Could add a loading spinner here
  }

  /**
   * Show error state
   * @param {Error} error
   */
  showError(error) {
    clearElement(this.appElement);
    
    this.appElement.appendChild(
      h('div', { style: { padding: '4rem', textAlign: 'center' } },
        h('h1', {}, 'Something went wrong'),
        h('p', {}, error.message),
        h('a', { href: '/', className: 'btn btn--primary', style: { marginTop: '2rem' } },
          h('span', {}, 'Go Home')
        )
      )
    );
  }

  /**
   * Update active navigation item
   * @param {string} pageId
   */
  updateActiveNavItem(pageId) {
    const navLinks = this.appElement.querySelectorAll('.site-nav a');
    navLinks.forEach(link => {
      const linkPageId = router.constructor.getPageId(link.getAttribute('href'));
      if (linkPageId === pageId) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
}

export { PageRenderer, renderBlock, blockRenderers };
export default PageRenderer;

