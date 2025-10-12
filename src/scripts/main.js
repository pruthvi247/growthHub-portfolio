/**
 * Main Application Entry Point
 * Initializes all modules and handles application lifecycle
 */

import Navigation from './navigation.js';
import ParticleBackground from './particles.js';

class App {
  constructor() {
    this.navigation = null;
    this.particles = null;
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeModules());
    } else {
      this.initializeModules();
    }
  }

  initializeModules() {
    try {
      // Initialize navigation system
      this.navigation = new Navigation();
      
      // Initialize particle background
      this.particles = new ParticleBackground();
      
      console.log('GrowthHub Portfolio initialized successfully');
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }

  destroy() {
    // Cleanup when needed
    if (this.particles) {
      this.particles.destroy();
    }
  }
}

// Initialize the application
const app = new App();

// Make app globally available for debugging
window.GrowthHubApp = app;

export default App;