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
    let href = element.attr("href");
    
    // Check if this is a cross-page navigation (contains .html)
    if (href.includes('.html')) {
      // For cross-page navigation, handle it properly
      if (href.includes('#')) {
        // This is a link to another page with a hash fragment
        // Let the browser handle the navigation but ensure it works
        window.location.href = href;
        event.preventDefault();
        return false;
      }
      // Allow normal navigation for cross-page links without hash
      return true;
    }
    
    // Handle same-page navigation
    event.preventDefault();
    
    let targetId = href;
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
    let windowHeight = $(window).height();
    let documentHeight = $(document).height();
    
    // Check if user is near the bottom of the page (within 100px)
    if (scrollTop + windowHeight >= documentHeight - 100) {
      // User is at bottom, activate contact tab
      $(".nav-tab[href='#contact']").each(function () {
        newCurrentId = "#contact";
        newCurrentTab = $(this);
      });
    } else {
      // Check each navigation tab to see which section is currently in view
      $(".nav-tab").each(function () {
        let id = $(this).attr("href");
        let $section = $(id);
        
        // Skip contact tab in this loop since we handle it separately
        if (id === "#contact") {
          return;
        }
        
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
  
  // Initialize blog system only if we're on the blogs page
  if (window.location.pathname.includes('blogs') || $('#blogGrid').length > 0) {
    const blogSystem = new BlogSystem();
    
    // Handle URL fragment navigation for blog topics
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        blogSystem.highlightTopicArticle(hash);
      }, 500);
    }
  }
});

// Blog System Functionality
class BlogSystem {
  constructor() {
    this.blogGrid = $('#blogGrid');
    this.filterBtns = $('.filter-btn');
    this.loadMoreBtn = $('#loadMoreBtn');
    this.allArticles = $('.blog-card');
    this.articlesPerPage = 6;
    this.currentlyShown = 6;
    this.currentFilter = 'all';
    
    this.init();
  }
  
  init() {
    // Filter functionality
    this.filterBtns.on('click', (e) => {
      const category = $(e.target).data('category');
      this.filterArticles(category);
      this.updateActiveFilter($(e.target));
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
      
      // Category filter
      const categoryMatch = category === 'all' || articleCategory === category;
      
      return categoryMatch;
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
    const blogSection = $('#blog');
    const scrollTop = blogSection.offset().top - 70;
    
    $('html, body').animate({ scrollTop: scrollTop }, 600, () => {
      // After navigation, highlight the related article
      this.highlightTopicArticle(topic);
    });
    
    // Update navigation active state
    $('.nav-tab').removeClass('active');
    $('.nav-tab[href="#blog"]').addClass('active');
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

// Featured Article Data (shared across pages)
const FEATURED_ARTICLE_DATA = {
  topic: 'strategic-planning',
  title: 'Strategic Planning for Modern Campaigns',
  description: 'Comprehensive guide to developing campaign strategies that resonate with diverse Indian communities while maintaining ethical standards and authentic community connections.',
  category: 'Strategy',
  readTime: '5 min read',
  publishDate: 'Dec 8, 2025'
};

// Function to update featured article across all pages
function updateFeaturedArticle(newData) {
  Object.assign(FEATURED_ARTICLE_DATA, newData);
  
  // Regenerate featured articles on current page
  if ($('#home-featured-article').length > 0) {
    $('#home-featured-article').html(createFeaturedArticle());
  }
  if ($('#blogs-featured-article').length > 0) {
    $('#blogs-featured-article').html(createFeaturedArticle());
  }
  
  // Rebind event handlers
  initializeFeaturedArticle();
}

// Featured Article Component
function createFeaturedArticle(data = FEATURED_ARTICLE_DATA) {
  return `
    <div class="featured-article" data-topic="${data.topic}">
      <div class="featured-content">
        <span class="featured-badge">Featured Article</span>
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <div class="article-meta">
          <span class="category">${data.category}</span>
          <span class="read-time">${data.readTime}</span>
          <span class="publish-date">${data.publishDate}</span>
        </div>
        <button class="read-article-btn">Read Full Article</button>
      </div>
      <div class="featured-image">
        <div class="placeholder-image">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
            <path d="M2 17L12 22L22 17"/>
            <path d="M2 12L12 17L22 12"/>
          </svg>
        </div>
      </div>
    </div>
  `;
}

// Initialize Featured Article Functionality
function initializeFeaturedArticle() {
  // Bind event handlers for featured articles on any page
  $(document).off('click', '.featured-article').on('click', '.featured-article', function() {
    const topic = $(this).data('topic');
    openArticleModal(topic);
  });
  
  $(document).off('click', '.read-article-btn').on('click', '.read-article-btn', function(e) {
    e.stopPropagation();
    const topic = $(this).closest('.featured-article').data('topic');
    openArticleModal(topic);
  });
}

// Initialize Featured Articles on Page Load
function initializePage() {
  console.log('Initializing page...');
  
  // Generate featured article for home page
  if ($('#home-featured-article').length > 0) {
    $('#home-featured-article').html(createFeaturedArticle());
  }
  
  // Generate featured article for blogs page
  if ($('#blogs-featured-article').length > 0) {
    $('#blogs-featured-article').html(createFeaturedArticle());
  }
  
  // Initialize featured article functionality on all pages
  initializeFeaturedArticle();
}



// Simple Blog Card Click Handler
$(document).ready(function() {
  console.log('Document ready - initializing page functionality');
  console.log('Current pathname:', window.location.pathname);
  console.log('Blog grid element exists:', $('#blogGrid').length > 0);
  
  // Initialize the page content and functionality
  initializePage();
  
  // Simple, direct blog card click handling
  setTimeout(() => {
    console.log('Setting up SIMPLE blog card handlers...');
    
    // Remove ALL existing click handlers first
    $('.blog-card').off('click');
    
    // Add ONE simple handler
    $('.blog-card').on('click', function(e) {
      console.log('🎯 SIMPLE CLICK HANDLER ACTIVATED!');
      e.preventDefault();
      e.stopPropagation();
      
      const topic = $(this).data('topic');
      console.log('Topic clicked:', topic);
      
      if (topic && window.openArticleModal) {
        console.log('Opening article modal for:', topic);
        window.openArticleModal(topic);
      } else {
        console.error('Missing topic or openArticleModal function');
        console.log('Available:', {
          topic: topic,
          openArticleModal: typeof window.openArticleModal
        });
      }
    });
    
    console.log('Simple blog card handlers setup complete. Cards found:', $('.blog-card').length);
  }, 200);
});

// Full-Page Article Overlay System
function openArticleModal(topic) {
  console.log(`=== OPENING ARTICLE: ${topic} ===`);
  console.log('Current working directory context:', window.location.href);
  
  // Prevent multiple overlays from opening (but don't remove loading overlays)
  const existingOverlays = $('.full-article-overlay:not(.loading)');
  if (existingOverlays.length > 0) {
    console.log('Removing existing overlays:', existingOverlays.length);
    existingOverlays.remove();
  }
  
  // Show loading state first
  showArticleLoadingOverlay();
  
  // Load article content ONLY from articles/ folder JSON files
  loadArticleContent(topic).then(article => {
    console.log('✅ Article loaded successfully from JSON file');
    console.log('Article data:', article);
    if (article && article.source === 'json') {
      showFullArticleOverlay(article);
    } else {
      console.error('Article not loaded from JSON file as expected');
      showArticleNotFoundOverlay(topic);
    }
  }).catch(error => {
    console.error('❌ Failed to load article from articles/ folder:', error);
    console.error('Make sure the file exists: articles/' + topic + '.json');
    showArticleErrorOverlay(topic);
  });
}

function showArticleLoadingOverlay() {
  const loadingOverlay = $(`
    <div class="full-article-overlay loading">
      <div class="article-loading">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
        </div>
        <h3>Loading Article...</h3>
        <p>Please wait while we fetch the content</p>
      </div>
    </div>
  `);
  
  $('body').append(loadingOverlay);
  setTimeout(() => loadingOverlay.addClass('active'), 10);
}

function loadArticleContent(topic) {
  return new Promise((resolve, reject) => {
    console.log(`Loading article: ${topic}`);
    console.log(`Current location: ${window.location.href}`);
    console.log(`Current pathname: ${window.location.pathname}`);
    
    // Try multiple path variations optimized for Netlify static site deployment
    // ONLY load from articles/ folder - no embedded fallback
    const possiblePaths = [
      `./articles/${topic}.json`,        // Relative path with ./ (recommended for static sites)
      `articles/${topic}.json`,          // Relative path without ./
      `/articles/${topic}.json`,         // Absolute path from domain root (Netlify)
      `${window.location.origin}/articles/${topic}.json`, // Full URL for Netlify CDN
      `${window.location.pathname.replace(/[^/]*$/, '')}articles/${topic}.json` // Path relative to current page
    ];
    
    console.log(`Will try these paths in order:`, possiblePaths);
    
    // Store topic in the function for fallback access
    tryFetchArticle.topic = topic;
    tryFetchArticle(possiblePaths, 0, resolve, reject);
  });
}

function tryFetchArticle(paths, index, resolve, reject) {
  if (index >= paths.length) {
    console.error('🚨 CRITICAL: Failed to load article from ALL attempted paths:', paths);
    console.error('All articles should be available in the articles/ folder as JSON files');
    console.error('Current protocol:', window.location.protocol);
    console.error('Current host:', window.location.host);
    
    // Check if we're running on file:// protocol
    if (window.location.protocol === 'file:') {
      console.error('🔍 FILE PROTOCOL DETECTED: Articles cannot be loaded via fetch() from file:// URLs');
      console.error('💡 LOCAL DEVELOPMENT: Serve via web server (python -m http.server 8000)');
      console.error('📝 NETLIFY DEPLOYMENT: This should work automatically when deployed');
      reject(new Error(`File protocol detected - use web server locally or deploy to Netlify`));
    } else {
      console.error('🌐 NETLIFY/WEB SERVER: All paths failed to load article');
      console.error('📁 Verify articles/ folder exists and contains:', `${arguments.callee.topic}.json`);
      reject(new Error(`Article not found: ${arguments.callee.topic}. Check Netlify deployment and file paths.`));
    }
    return;
  }
  
  const currentPath = paths[index];
  console.log(`[Attempt ${index + 1}/${paths.length}] Fetching from: ${currentPath}`);
  
  fetch(currentPath)
    .then(response => {
      console.log(`Response for ${currentPath}:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        type: response.type
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(article => {
      console.log(`✅ SUCCESS: Article loaded from ${currentPath}`);
      console.log('Article data:', article);
      // Mark the source so we know it came from JSON file
      article.source = 'json';
      resolve(article);
    })
    .catch(error => {
      console.warn(`❌ FAILED: ${currentPath} - ${error.message}`);
      console.warn('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 200)
      });
      
      // Add more specific error logging
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🚫 Network/CORS error - file may not exist or is not accessible via fetch');
        console.error('This often happens with file:// protocol or incorrect paths');
      }
      
      // Try next path
      tryFetchArticle(paths, index + 1, resolve, reject);
    });
}

// Embedded Article Data - DISABLED (articles loaded from articles/ folder only)
function getEmbeddedArticleData(topic) {
  console.warn('getEmbeddedArticleData called - this should not happen as articles should load from JSON files');
  return null; // Force using JSON files only
  
  /* DISABLED EMBEDDED DATA - using articles/ folder instead
  const articles = {
    'strategic-planning': {
      "id": "strategic-planning",
      "title": "Strategic Planning for Modern Political Campaigns",
      "subtitle": "Comprehensive guide to developing campaign strategies that resonate with diverse Indian communities",
      "category": "Strategy",
      "author": "Dr. Rajesh Kumar",
      "publishDate": "December 8, 2025",
      "readTime": "12 min read",
      "tags": ["Strategy", "Campaign Management", "Political Planning", "Community Engagement"],
      "summary": "Learn how to develop comprehensive campaign strategies that connect with voters across India's diverse demographic landscape while maintaining ethical standards and authentic messaging.",
      "content": [
        {
          "type": "intro",
          "text": "Strategic political campaign planning in India requires deep understanding of diverse communities, cultural nuances, and ethical considerations that build trust while advancing democratic participation across the nation's complex social fabric."
        },
        {
          "type": "heading",
          "text": "Understanding India's Political Landscape"
        },
        {
          "type": "paragraph",
          "text": "India's democracy operates within a unique context of linguistic diversity, regional variations, and complex social dynamics that require sophisticated strategic approaches to campaign planning."
        }
      ],
      "relatedArticles": ["content-creation", "community-events", "crisis-management"]
    },
    'content-creation': {
      "id": "content-creation",
      "title": "Content Creation for Political Impact",
      "subtitle": "Best practices for creating authentic content that builds trust and drives meaningful engagement",
      "category": "Media",
      "author": "Anita Sharma",
      "publishDate": "December 6, 2025",
      "readTime": "7 min read",
      "tags": ["Content Strategy", "Digital Media", "Political Communication", "Authentic Messaging"],
      "summary": "Master the art of political content creation with strategies that prioritize authenticity, community engagement, and ethical communication practices.",
      "content": [
        {
          "type": "intro",
          "text": "Effective political content creation balances authentic storytelling with strategic messaging, ensuring that every piece of content serves both campaign objectives and community interests while maintaining the highest ethical standards."
        },
        {
          "type": "heading",
          "text": "Foundations of Authentic Political Content"
        },
        {
          "type": "paragraph",
          "text": "Authentic political content begins with genuine understanding of community needs, transparent communication, and consistent demonstration of values through both content and actions."
        }
      ],
      "relatedArticles": ["strategic-planning", "social-media-content", "video-production"]
    },
    'crisis-management': {
      "id": "crisis-management",
      "title": "Crisis Management in Political Communications",
      "subtitle": "Strategic approaches to handling controversies and maintaining public trust during challenging times",
      "category": "Strategy", 
      "author": "Vikram Patel",
      "publishDate": "November 28, 2025",
      "readTime": "9 min read",
      "tags": ["Crisis Communication", "Public Relations", "Reputation Management", "Strategic Response"],
      "summary": "Learn proven strategies for navigating political crises with transparency, accountability, and ethical leadership that strengthens rather than undermines public trust.",
      "content": [
        {
          "type": "intro",
          "text": "Political crises are inevitable in democratic discourse, but how leaders respond to these challenges can either strengthen or undermine public trust, making strategic crisis management an essential skill for ethical political leadership."
        },
        {
          "type": "heading", 
          "text": "Principles of Ethical Crisis Response"
        },
        {
          "type": "paragraph",
          "text": "Effective crisis management in politics prioritizes transparency, accountability, and genuine concern for community welfare over short-term damage control or political advantage."
        }
      ],
      "relatedArticles": ["strategic-planning", "content-creation", "social-media-content"]
    },
    'performance-analytics': {
      "id": "performance-analytics",
      "title": "Performance Analytics in Political Campaigns",
      "subtitle": "Leveraging data analytics to measure campaign effectiveness while maintaining ethical standards and privacy protection",
      "category": "Technology",
      "author": "Dr. Meera Singh",
      "publishDate": "December 4, 2025",
      "readTime": "6 min read",
      "tags": ["Data Analytics", "Campaign Metrics", "Performance Tracking", "Digital Strategy"],
      "summary": "Master ethical data analytics techniques to measure campaign effectiveness, understand voter engagement, and optimize outreach strategies while respecting privacy and democratic values.",
      "content": [
        {
          "type": "intro",
          "text": "Performance analytics in political campaigns can provide valuable insights into voter engagement and campaign effectiveness, but ethical implementation requires careful consideration of privacy, accuracy, and democratic values."
        },
        {
          "type": "heading",
          "text": "Ethical Framework for Campaign Analytics"
        },
        {
          "type": "paragraph",
          "text": "Successful campaign analytics balance data-driven insights with respect for individual privacy, ensuring that measurement enhances rather than manipulates democratic participation."
        }
      ],
      "relatedArticles": ["voter-analysis", "strategic-planning", "content-creation"]
    },
    'door-to-door-campaigns': {
      "id": "door-to-door-campaigns", 
      "title": "Effective Door-to-Door Campaign Strategies",
      "subtitle": "Building genuine connections through grassroots campaigning and authentic community engagement",
      "category": "Outreach",
      "author": "Rajesh Gupta",
      "publishDate": "December 2, 2025",
      "readTime": "4 min read",
      "tags": ["Grassroots Campaigning", "Community Outreach", "Voter Contact", "Political Engagement"],
      "summary": "Learn time-tested strategies for effective door-to-door campaigning that builds authentic relationships, gathers valuable community input, and strengthens democratic participation at the grassroots level.",
      "content": [
        {
          "type": "intro",
          "text": "Door-to-door campaigning remains one of the most powerful tools for political engagement, offering opportunities for authentic dialogue, community listening, and relationship building that digital platforms cannot replicate."
        },
        {
          "type": "heading",
          "text": "Preparing for Effective Door-to-Door Outreach"
        },
        {
          "type": "paragraph",
          "text": "Successful door-to-door campaigns require thorough preparation, genuine community interest, and respect for residents' time and perspectives, focusing on listening as much as sharing information."
        }
      ],
      "relatedArticles": ["community-events", "strategic-planning", "voter-analysis"]
    },
    'video-production': {
      "id": "video-production",
      "title": "Political Video Production Best Practices",
      "subtitle": "Creating compelling video content that tells authentic stories and connects with voters emotionally",
      "category": "Media",
      "author": "Arjun Mehta", 
      "publishDate": "November 30, 2025",
      "readTime": "8 min read",
      "tags": ["Video Production", "Storytelling", "Visual Media", "Digital Content"],
      "summary": "Master the art of political video production with techniques for authentic storytelling, technical excellence, and emotional connection that respects audience intelligence and community values.",
      "content": [
        {
          "type": "intro",
          "text": "Video content has become the dominant medium for political communication, offering unparalleled opportunities to tell authentic stories, demonstrate leadership qualities, and connect emotionally with diverse audiences."
        },
        {
          "type": "heading",
          "text": "Planning Your Political Video Content"
        },
        {
          "type": "paragraph",
          "text": "Successful political videos start with clear objectives, authentic stories, and deep understanding of audience needs and preferences."
        }
      ],
      "relatedArticles": ["content-creation", "social-media-content", "strategic-planning"]
    },
    'social-media-content': {
      "id": "social-media-content",
      "title": "Authentic Social Media Content for Political Engagement", 
      "subtitle": "Building genuine online communities through transparent communication and meaningful digital interactions",
      "category": "Media",
      "author": "Priya Sharma",
      "publishDate": "December 2, 2025",
      "readTime": "6 min read",
      "tags": ["Social Media", "Digital Engagement", "Content Strategy", "Community Building"],
      "summary": "Learn to create authentic social media content that builds trust, facilitates meaningful dialogue, and strengthens democratic engagement through transparent and respectful online communication.",
      "content": [
        {
          "type": "intro", 
          "text": "Social media offers unprecedented opportunities for democratic participation and community dialogue, but its effectiveness depends on authentic engagement that respects audience intelligence and promotes genuine conversation."
        },
        {
          "type": "heading",
          "text": "Foundations of Authentic Social Media Engagement"
        },
        {
          "type": "paragraph",
          "text": "Successful political social media presence is built on transparency, consistency, and genuine commitment to community dialogue and service."
        }
      ],
      "relatedArticles": ["content-creation", "video-production", "crisis-management"]
    },
    'voter-analysis': {
      "id": "voter-analysis",
      "title": "Ethical Voter Behavior Analysis and Data Privacy",
      "subtitle": "Understanding community needs through responsible data analysis while protecting individual privacy and democratic integrity",
      "category": "Technology",
      "author": "Dr. Sarah Chen",
      "publishDate": "December 5, 2025", 
      "readTime": "7 min read",
      "tags": ["Data Analytics", "Voter Privacy", "Ethics", "Campaign Technology"],
      "summary": "Learn how to conduct ethical voter analysis that respects privacy, promotes democratic participation, and uses data responsibly to better understand and serve community needs.",
      "content": [
        {
          "type": "intro",
          "text": "Data analytics can provide valuable insights into community needs and voting patterns, but ethical political campaigns must balance analytical effectiveness with strict privacy protection and democratic values."
        },
        {
          "type": "heading",
          "text": "Ethical Foundations of Voter Data Analysis"
        },
        {
          "type": "paragraph",
          "text": "Responsible voter analysis begins with clear ethical principles that prioritize individual privacy, democratic participation, and community service over tactical advantage."
        }
      ],
      "relatedArticles": ["performance-analytics", "strategic-planning", "crisis-management"]
    },
    'community-events': {
      "id": "community-events",
      "title": "Organizing Impactful Community Events and Public Engagement",
      "subtitle": "Creating inclusive, accessible events that strengthen democratic participation and build lasting community connections", 
      "category": "Outreach",
      "author": "Maria Rodriguez",
      "publishDate": "December 8, 2025",
      "readTime": "5 min read", 
      "tags": ["Community Organizing", "Public Events", "Civic Engagement", "Accessibility"],
      "summary": "Master the art of organizing community events that bring people together, facilitate meaningful dialogue, and strengthen democratic participation through inclusive, accessible, and well-planned public gatherings.",
      "content": [
        {
          "type": "intro",
          "text": "Well-organized community events serve as the cornerstone of democratic engagement, creating spaces where diverse voices can be heard, relationships can be built, and collective action can emerge from genuine dialogue."
        },
        {
          "type": "heading",
          "text": "Planning Inclusive and Accessible Events"
        },
        {
          "type": "paragraph",
          "text": "Successful community events begin with careful planning that prioritizes accessibility, inclusion, and meaningful participation for all community members regardless of background or circumstances."
        }
      ],
      "relatedArticles": ["door-to-door-campaigns", "strategic-planning", "crisis-management"]
    }
  }; 
  END DISABLED EMBEDDED DATA */
  
  return null; // Always return null to force JSON loading
}

function showFullArticleOverlay(article) {
  // Remove loading overlay specifically
  $('.full-article-overlay.loading').remove();
  
  // Create full article overlay
  const articleOverlay = $(`
    <div class="full-article-overlay">
      <!-- Floating Close Button -->
      <button class="floating-close-btn" aria-label="Close article" title="Close Article">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      
      <div class="article-container">
        <!-- Article Header -->
        <header class="article-header">
          <div class="article-nav">
            <button class="article-back">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Articles
            </button>
          </div>
          <div class="article-close-buttons">
            <button class="article-minimize" aria-label="Minimize article" title="Minimize">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h12v2H6z"/>
              </svg>
            </button>
            <button class="article-close" aria-label="Close article" title="Close Article">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </header>
        
        <!-- Article Content -->
        <article class="article-content">
          <div class="article-meta-header">
            <span class="article-category">${article.category}</span>
            <div class="article-info">
              <span class="article-date">${article.publishDate}</span>
              <span class="article-read-time">${article.readTime}</span>
            </div>
          </div>
          
          <h1 class="article-title">${article.title}</h1>
          <p class="article-subtitle">${article.subtitle}</p>
          
          <div class="article-author-info">
            <div class="author-details">
              <span class="author-name">By ${article.author}</span>
            </div>
          </div>
          
          <div class="article-tags">
            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          
          <div class="article-body">
            ${renderArticleContent(article.content)}
          </div>
          
          ${article.relatedArticles ? `
            <div class="article-footer">
              <div class="related-articles">
                <h4>Related Articles</h4>
                <div class="related-grid">
                  ${article.relatedArticles.map(id => `
                    <div class="related-card" data-article="${id}">
                      <h5>${id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
                      <p>Click to read more</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}
        </article>
      </div>
    </div>
  `);
  
  $('body').append(articleOverlay);
  
  // Animate in
  setTimeout(() => articleOverlay.addClass('active'), 10);
  
  // Add event handlers
  setupArticleOverlayEvents(articleOverlay);
}

function renderArticleContent(content) {
  return content.map(section => {
    switch(section.type) {
      case 'intro':
      case 'paragraph':
        return `<p class="article-paragraph">${section.text}</p>`;
      
      case 'heading':
        return `<h2 class="article-heading">${section.text}</h2>`;
      
      case 'subheading':
        return `<h3 class="article-subheading">${section.text}</h3>`;
      
      case 'quote':
        return `<blockquote class="article-quote">
          <p>"${section.text}"</p>
          ${section.author ? `<cite>— ${section.author}</cite>` : ''}
        </blockquote>`;
      
      case 'list':
        return `<ul class="article-list">
          ${section.items.map(item => `<li>${item}</li>`).join('')}
        </ul>`;
      
      case 'callout':
        return `<div class="article-callout">
          <p>${section.text}</p>
        </div>`;
      
      case 'conclusion':
        return `<div class="article-conclusion">
          <p>${section.text}</p>
        </div>`;
      
      default:
        return `<p class="article-paragraph">${section.text}</p>`;
    }
  }).join('');
}

function setupArticleOverlayEvents(overlay) {
  // Close handlers with proper event prevention
  overlay.find('.article-close, .article-back, .floating-close-btn').off('click').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeFullArticleOverlay(overlay);
  });
  
  // Minimize handler with proper event prevention
  overlay.find('.article-minimize').off('click').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    overlay.toggleClass('minimized');
  });
  
  // ESC key to close
  $(document).on('keydown.articleOverlay', function(e) {
    if (e.key === 'Escape') {
      closeFullArticleOverlay(overlay);
    }
  });
  
  // Related articles
  overlay.find('.related-card').on('click', function() {
    const articleId = $(this).data('article');
    closeFullArticleOverlay(overlay);
    setTimeout(() => openArticleModal(articleId), 300);
  });
  
  // Prevent body scroll
  $('body').addClass('no-scroll');
}

function showArticleNotFoundOverlay(topic) {
  $('.full-article-overlay.loading').remove();
  
  const notFoundOverlay = $(`
    <div class="full-article-overlay error">
      <div class="article-error">
        <h3>Article Not Found</h3>
        <p>The article "${topic.replace('-', ' ')}" could not be found.</p>
        <button class="btn-primary error-close">Go Back</button>
      </div>
    </div>
  `);
  
  $('body').append(notFoundOverlay);
  setTimeout(() => notFoundOverlay.addClass('active'), 10);
  
  notFoundOverlay.find('.error-close').on('click', function() {
    closeFullArticleOverlay(notFoundOverlay);
  });
}

function showArticleErrorOverlay(topic) {
  $('.full-article-overlay.loading').remove();
  
  // Determine if this is a file protocol issue
  const isFileProtocol = window.location.protocol === 'file:';
  const errorTitle = isFileProtocol ? 'File Protocol Issue' : 'Loading Error';
  const errorMessage = isFileProtocol 
    ? `Cannot load articles from file:// URLs. Please serve the site via a web server:<br><br><code>python3 -m http.server 8000</code><br><br>Then visit: <code>http://localhost:8000/blogs.html</code>`
    : `Could not load article "${topic}". Check that the file exists at: <code>articles/${topic}.json</code>`;
  
  const errorOverlay = $(`
    <div class="full-article-overlay error">
      <div class="article-error">
        <h3>${errorTitle}</h3>
        <p>${errorMessage}</p>
        <div class="error-details">
          <p><strong>Current URL:</strong> ${window.location.href}</p>
          <p><strong>Looking for:</strong> articles/${topic}.json</p>
        </div>
        <div class="error-actions">
          <button class="btn-secondary error-close">Cancel</button>
          ${!isFileProtocol ? `<button class="btn-primary error-retry" data-topic="${topic}">Retry</button>` : ''}
        </div>
      </div>
    </div>
  `);
  
  $('body').append(errorOverlay);
  setTimeout(() => errorOverlay.addClass('active'), 10);
  
  errorOverlay.find('.error-close').on('click', function() {
    closeFullArticleOverlay(errorOverlay);
  });
  
  errorOverlay.find('.error-retry').on('click', function() {
    const topic = $(this).data('topic');
    closeFullArticleOverlay(errorOverlay);
    setTimeout(() => openArticleModal(topic), 300);
  });
}

function closeFullArticleOverlay(overlay) {
  // Prevent multiple calls by checking if already closing
  if (overlay.hasClass('closing')) {
    return;
  }
  
  overlay.addClass('closing');
  overlay.removeClass('active');
  $('body').removeClass('no-scroll');
  $(document).off('keydown.articleOverlay');
  
  // Remove all event handlers from the overlay to prevent conflicts
  overlay.find('*').off();
  overlay.off();
  
  setTimeout(() => {
    overlay.remove();
  }, 300);
}

// Make functions globally accessible for debugging and fallback
window.openArticleModal = openArticleModal;
console.log('Global functions assigned - openArticleModal:', typeof window.openArticleModal);