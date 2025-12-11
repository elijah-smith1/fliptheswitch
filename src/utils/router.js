/**
 * Simple SPA Router
 * Handles client-side navigation without page reloads
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = '';
    this.onNavigate = null;
    
    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });
    
    // Intercept link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.origin === window.location.origin) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          this.navigate(href);
        }
      }
    });
  }

  /**
   * Register a route handler
   * @param {string} path - URL path (e.g., '/about')
   * @param {Function} handler - Function to call when route matches
   */
  register(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  /**
   * Navigate to a path
   * @param {string} path - URL path to navigate to
   * @param {boolean} pushState - Whether to push to browser history
   */
  async navigate(path, pushState = true) {
    // Normalize path
    path = path === '' ? '/' : path;
    
    // Don't navigate if already on this path
    if (path === this.currentPath) return;
    
    this.currentPath = path;
    
    if (pushState) {
      window.history.pushState({}, '', path);
    }
    
    // Find matching route
    let handler = this.routes.get(path);
    
    // If no exact match, try without trailing slash
    if (!handler && path.endsWith('/') && path !== '/') {
      handler = this.routes.get(path.slice(0, -1));
    }
    
    // If still no match, use 404 handler or home
    if (!handler) {
      handler = this.routes.get('/404') || this.routes.get('/');
    }
    
    if (handler) {
      await handler(path);
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Call navigate callback if set
    if (this.onNavigate) {
      this.onNavigate(path);
    }
  }

  /**
   * Get the page ID from a path
   * @param {string} path - URL path
   * @returns {string} Page ID for Firestore
   */
  static getPageId(path) {
    const cleanPath = path.replace(/^\/|\/$/g, '');
    return cleanPath === '' ? 'home' : cleanPath;
  }

  /**
   * Initialize router with current URL
   */
  init() {
    this.navigate(window.location.pathname, false);
    return this;
  }
}

// Export singleton instance
export const router = new Router();
export default router;

