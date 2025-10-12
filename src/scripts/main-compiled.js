/* Credit and Thanks:
Matrix - Particles.js;
SliderJS - Ettrics;
Design - Sara Mazal Web;
Fonts - Google Fonts
*/

window.onload = function () {
  // Check if Particles library is loaded
  if (typeof Particles === 'undefined') {
    console.error('Particles.js library not found. Make sure the CDN link is working.');
    return;
  }
  
  // Check if hero particles element exists
  const heroParticlesElement = document.querySelector('.hero-particles');
  if (!heroParticlesElement) {
    console.error('Hero particles canvas element not found.');
    return;
  }
  
  console.log('Initializing hero particles...');
  
  // Initialize particles confined to hero section only
  Particles.init({
    selector: ".hero-particles",
    color: ["#03dac6", "#ff0266", "#000000"],
    connectParticles: true,
    speed: 0.1, // Slower movement speed for desktop
    maxParticles: 80, // More particles for hero section
    responsive: [
      {
        breakpoint: 768,
        options: {
          color: ["#faebd7", "#03dac6", "#ff0266"],
          maxParticles: 40,
          connectParticles: false,
          speed: 0.08 // Even slower on mobile for better performance
        }
      }
    ]
  });
  
  console.log('Hero particles initialized successfully');
};

class NavigationPage {
  constructor() {
    this.currentId = null;
    this.currentTab = null;
    this.tabContainerHeight = 70;
    this.lastScroll = 0;
    let self = this;
    
    // Set up event listeners
    $(".nav-tab").click(function () {
      self.onTabClick(event, $(this));
    });
    $(window).scroll(() => {
      this.onScroll();
    });
    $(window).resize(() => {
      this.onResize();
    });
    
    // Initialize the slider position
    this.findCurrentTabSelector();
  }

  onTabClick(event, element) {
    event.preventDefault();
    
    let targetId = element.attr("href");
    let $targetSection = $(targetId);
    
    if ($targetSection.length > 0) {
      let scrollTop = $targetSection.offset().top - this.tabContainerHeight + 1;
      
      // Remove active class from all tabs and add to clicked tab
      $(".nav-tab").removeClass("active");
      element.addClass("active");
      
      // Update current tab reference
      this.currentId = targetId;
      this.currentTab = element;
      this.setSliderCss();
      
      // Animate scroll
      $("html, body").animate({ scrollTop: scrollTop }, 600);
    }
  }

  onScroll() {
    this.checkHeaderPosition();
    this.findCurrentTabSelector();
    this.lastScroll = $(window).scrollTop();
  }

  onResize() {
    if (this.currentId) {
      this.setSliderCss();
    }
  }

  checkHeaderPosition() {
    // Add scroll effect to top navigation
    const scrollTop = $(window).scrollTop();
    
    if (scrollTop > 50) {
      $(".top-nav").addClass("scrolled");
    } else {
      $(".top-nav").removeClass("scrolled");
    }
  }

  findCurrentTabSelector(element) {
    let newCurrentId;
    let newCurrentTab;
    let self = this;
    let scrollTop = $(window).scrollTop();
    
    // Check each navigation tab to see which section is currently in view
    $(".nav-tab").each(function () {
      let id = $(this).attr("href");
      let $section = $(id);
      
      if ($section.length > 0) {
        let sectionTop = $section.offset().top - self.tabContainerHeight - 50; // Smaller buffer
        let sectionBottom = sectionTop + $section.outerHeight();
        
        // Check if the current scroll position is within this section
        if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
          newCurrentId = id;
          newCurrentTab = $(this);
        }
      }
    });
    
    // If no section is found, default to home section when at top
    if (!newCurrentId && scrollTop < 300) {
      $(".nav-tab[href='#home']").each(function () {
        newCurrentId = "#home";
        newCurrentTab = $(this);
      });
    }
    
    // Update active states
    if (this.currentId != newCurrentId) {
      // Remove active class from all tabs
      $(".nav-tab").removeClass("active");
      
      // Add active class to current tab
      if (newCurrentTab && newCurrentTab.length > 0) {
        newCurrentTab.addClass("active");
      }
      
      this.currentId = newCurrentId;
      this.currentTab = newCurrentTab;
      this.setSliderCss();
    }
  }

  setSliderCss() {
    let width = 0;
    let left = 0;
    if (this.currentTab && this.currentTab.length > 0) {
      width = this.currentTab.outerWidth();
      left = this.currentTab.offset().left - this.currentTab.closest('.nav-links').offset().left;
    }
    $(".nav-tab-slider").css({
      "width": width + "px",
      "left": left + "px",
      "transition": "all 0.3s ease"
    });
  }
}

new NavigationPage();

// Mobile Navigation Toggle
$(document).ready(function() {
  const mobileToggle = $('.mobile-menu-toggle');
  const navLinks = $('.nav-links');
  
  mobileToggle.on('click', function() {
    navLinks.toggleClass('mobile-open');
    $(this).toggleClass('active');
  });
  
  // Close mobile menu when clicking on a nav link
  $('.nav-tab').on('click', function() {
    navLinks.removeClass('mobile-open');
    mobileToggle.removeClass('active');
  });
  
  // Close mobile menu when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.top-nav').length) {
      navLinks.removeClass('mobile-open');
      mobileToggle.removeClass('active');
    }
  });
});