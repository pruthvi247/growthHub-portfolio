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

// Services Carousel Functionality
class ServicesCarousel {
  constructor() {
    this.carousel = $('#servicesCarousel');
    this.verticals = $('.vertical-section');
    this.navDots = $('.nav-dot');
    this.prevBtn = $('#prevBtn');
    this.nextBtn = $('#nextBtn');
    this.currentIndex = 0;
    this.totalVerticals = this.verticals.length;
    
    this.init();
  }
  
  init() {
    // Set up event listeners
    this.navDots.on('click', (e) => this.goToVertical($(e.target).data('vertical')));
    this.prevBtn.on('click', () => this.goToPrevious());
    this.nextBtn.on('click', () => this.goToNext());
    
    // Auto-advance carousel every 8 seconds
    this.startAutoPlay();
    
    // Pause auto-play on hover
    $('.services-carousel-container').hover(
      () => this.stopAutoPlay(),
      () => this.startAutoPlay()
    );
    
    // Initialize first vertical
    this.updateCarousel();
  }
  
  goToVertical(index) {
    if (index >= 0 && index < this.totalVerticals) {
      this.currentIndex = index;
      this.updateCarousel();
    }
  }
  
  goToNext() {
    this.currentIndex = (this.currentIndex + 1) % this.totalVerticals;
    this.updateCarousel();
  }
  
  goToPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.totalVerticals) % this.totalVerticals;
    this.updateCarousel();
  }
  
  updateCarousel() {
    // Move carousel
    const translateX = -this.currentIndex * 100;
    this.carousel.css('transform', `translateX(${translateX}%)`);
    
    // Update active states
    this.verticals.removeClass('active');
    this.verticals.eq(this.currentIndex).addClass('active');
    
    this.navDots.removeClass('active');
    this.navDots.eq(this.currentIndex).addClass('active');
    
    // Add entrance animations to cards
    setTimeout(() => {
      const activeCards = this.verticals.eq(this.currentIndex).find('.services-card');
      activeCards.each((index, card) => {
        setTimeout(() => {
          $(card).addClass('animate-in');
        }, index * 200);
      });
    }, 100);
  }
  
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.goToNext();
    }, 8000);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}

// Initialize Services Carousel
$(document).ready(function() {
  new ServicesCarousel();
});

// Blog System Functionality
class BlogSystem {
  constructor() {
    this.blogGrid = $('#blogGrid');
    this.filterBtns = $('.filter-btn');
    this.searchInput = $('#blogSearch');
    this.loadMoreBtn = $('#loadMoreBtn');
    this.allArticles = $('.blog-card');
    this.articlesPerPage = 6;
    this.currentlyShown = 6;
    this.currentFilter = 'all';
    this.searchTerm = '';
    
    this.init();
  }
  
  init() {
    // Filter functionality
    this.filterBtns.on('click', (e) => {
      const category = $(e.target).data('category');
      this.filterArticles(category);
      this.updateActiveFilter($(e.target));
    });
    
    // Search functionality
    this.searchInput.on('input', (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this.filterArticles(this.currentFilter);
    });
    
    // Load more functionality
    this.loadMoreBtn.on('click', () => this.loadMoreArticles());
    
    // Service feature links
    $('.service-features a').on('click', (e) => {
      e.preventDefault();
      const blogTopic = $(e.target).data('blog-topic');
      this.navigateToTopic(blogTopic);
    });
    
    this.updateStats();
  }
  
  filterArticles(category) {
    this.currentFilter = category;
    this.currentlyShown = this.articlesPerPage;
    
    let visibleArticles = this.allArticles.filter((index, article) => {
      const $article = $(article);
      const articleCategory = $article.data('category');
      const articleTopic = $article.data('topic');
      const articleText = $article.text().toLowerCase();
      
      // Category filter
      const categoryMatch = category === 'all' || articleCategory === category;
      
      // Search filter
      const searchMatch = this.searchTerm === '' || articleText.includes(this.searchTerm);
      
      return categoryMatch && searchMatch;
    });
    
    // Hide all articles first
    this.allArticles.hide();
    
    // Show filtered articles up to current limit
    visibleArticles.slice(0, this.currentlyShown).show();
    
    // Update load more button
    this.updateLoadMoreButton(visibleArticles.length);
    this.updateStats(visibleArticles.length);
  }
  
  updateActiveFilter($activeBtn) {
    this.filterBtns.removeClass('active');
    $activeBtn.addClass('active');
  }
  
  loadMoreArticles() {
    this.currentlyShown += this.articlesPerPage;
    this.filterArticles(this.currentFilter);
  }
  
  updateLoadMoreButton(totalVisible) {
    if (this.currentlyShown >= totalVisible) {
      this.loadMoreBtn.hide();
    } else {
      this.loadMoreBtn.show();
    }
  }
  
  updateStats(totalVisible = null) {
    if (totalVisible === null) {
      totalVisible = this.allArticles.length;
    }
    
    const shown = Math.min(this.currentlyShown, totalVisible);
    $('#articlesCount').text(shown);
    $('#totalArticles').text(totalVisible);
  }
  
  navigateToTopic(topic) {
    // Navigate to blog section
    const blogSection = $('#tab-vite');
    const scrollTop = blogSection.offset().top - 70;
    
    $('html, body').animate({ scrollTop: scrollTop }, 600, () => {
      // After navigation, highlight the related article
      this.highlightTopicArticle(topic);
    });
    
    // Update navigation active state
    $('.nav-tab').removeClass('active');
    $('.nav-tab[href="#tab-vite"]').addClass('active');
  }
  
  highlightTopicArticle(topic) {
    // Remove existing highlights
    $('.blog-card').removeClass('highlighted');
    
    // Find and highlight the matching article
    const targetArticle = $(`.blog-card[data-topic="${topic}"]`);
    if (targetArticle.length > 0) {
      targetArticle.addClass('highlighted');
      
      // Scroll to the specific article
      setTimeout(() => {
        const articleOffset = targetArticle.offset().top - 150;
        $('html, body').animate({ scrollTop: articleOffset }, 400);
      }, 100);
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        targetArticle.removeClass('highlighted');
      }, 3000);
    }
  }
}

// Article Reading Functionality
$(document).ready(function() {
  // Initialize blog system
  new BlogSystem();
  
  // Article click handlers
  $('.blog-card, .featured-article').on('click', function() {
    const topic = $(this).data('topic');
    openArticleModal(topic);
  });
  
  $('.read-article-btn').on('click', function(e) {
    e.stopPropagation();
    const topic = $(this).closest('.featured-article').data('topic');
    openArticleModal(topic);
  });
});

// Article Modal System (for future implementation)
function openArticleModal(topic) {
  // This would open a modal or navigate to a detailed article view
  console.log(`Opening article for topic: ${topic}`);
  
  // For now, we'll just show an alert
  // In a real implementation, this would open a detailed view
  alert(`Opening detailed article about: ${topic.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`);
}