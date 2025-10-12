/**
 * Particles Background Animation
 * Handles the animated background particles effect
 */

class ParticleBackground {
  constructor() {
    this.particles = null;
    this.init();
  }

  init() {
    // Initialize particles when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupParticles());
    } else {
      this.setupParticles();
    }
  }

  setupParticles() {
    // Check if Particles library is available
    if (typeof Particles !== 'undefined') {
      this.particles = Particles.init({
        selector: ".background",
        color: ["#03dac6", "#ff0266", "#000000"],
        connectParticles: true,
        // Slower movement speed
        speed: 0.1, // Reduced from default (~0.5) to make particles move slower
        responsive: [
          {
            breakpoint: 768,
            options: {
              color: ["#faebd7", "#03dac6", "#ff0266"],
              maxParticles: 43,
              connectParticles: false,
              speed: 0.025 // Even slower on mobile for better performance
            }
          }
        ]
      });
    } else {
      console.warn('Particles.js library not found');
    }
  }

  destroy() {
    if (this.particles) {
      // Add cleanup logic if needed
      this.particles = null;
    }
  }
}

export default ParticleBackground;