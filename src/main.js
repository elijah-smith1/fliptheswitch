/**
 * Main Entry Point
 * Initializes the Flip The Switch SPA
 */

import './styles/main.css';
import { PageRenderer } from '@/pages/PageRenderer.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const appElement = document.getElementById('app');
  
  if (!appElement) {
    console.error('App element not found');
    return;
  }
  
  // Create and initialize page renderer
  const renderer = new PageRenderer(appElement);
  
  try {
    await renderer.init();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    appElement.innerHTML = `
      <div style="padding: 4rem; text-align: center; color: #fff;">
        <h1>Loading Error</h1>
        <p>Unable to connect to the database. Please check your configuration.</p>
        <p style="color: #999; font-size: 0.9rem; margin-top: 1rem;">${error.message}</p>
      </div>
    `;
  }
});

// Export for potential external use
export { PageRenderer };

