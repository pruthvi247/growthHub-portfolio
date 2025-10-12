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
      // Allow normal navigation for cross-page links
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
  
  // Initialize blog system only if we're on the blogs page
  if (window.location.pathname.includes('blogs.html') || $('#blogGrid').length > 0) {
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
  title: 'The Future of Ethical Political Campaigns in India',
  description: 'Exploring how modern digital strategies can transform political communication while maintaining ethical standards and authentic community connections.',
  category: 'Strategy',
  readTime: '8 min read',
  publishDate: 'Dec 10, 2025'
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
  
  // Blog card handlers (only for blogs page)
  if (window.location.pathname.includes('blogs.html') || $('#blogGrid').length > 0) {
    $(document).off('click', '.blog-card').on('click', '.blog-card', function() {
      const topic = $(this).data('topic');
      openArticleModal(topic);
    });
  }
}

// Initialize Featured Articles on Page Load
function initializePage() {
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

// Article Reading Functionality
$(document).ready(function() {
  // Initialize the page content and functionality
  initializePage();
});

// Full-Page Article Overlay System
function openArticleModal(topic) {
  console.log(`Opening full article for topic: ${topic}`);
  
  // Show loading state first
  showArticleLoadingOverlay();
  
  // Load article content
  loadArticleContent(topic).then(article => {
    if (article) {
      showFullArticleOverlay(article);
    } else {
      showArticleNotFoundOverlay(topic);
    }
  }).catch(error => {
    console.error('Error loading article:', error);
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
    // Simulate loading time for better UX
    setTimeout(() => {
      fetch(`./articles/${topic}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Article not found: ${response.status}`);
          }
          return response.json();
        })
        .then(article => resolve(article))
        .catch(error => {
          console.error('Failed to load article:', error);
          resolve(null);
        });
    }, 800); // Simulate loading time
  });
}

function showFullArticleOverlay(article) {
  // Remove loading overlay
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
  // Close handlers
  overlay.find('.article-close, .article-back, .floating-close-btn').on('click', function() {
    closeFullArticleOverlay(overlay);
  });
  
  // Minimize handler
  overlay.find('.article-minimize').on('click', function() {
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
  
  const errorOverlay = $(`
    <div class="full-article-overlay error">
      <div class="article-error">
        <h3>Loading Error</h3>
        <p>There was an error loading the article. Please try again.</p>
        <div class="error-actions">
          <button class="btn-secondary error-close">Cancel</button>
          <button class="btn-primary error-retry" data-topic="${topic}">Retry</button>
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
  overlay.removeClass('active');
  $('body').removeClass('no-scroll');
  $(document).off('keydown.articleOverlay');
  
  setTimeout(() => {
    overlay.remove();
  }, 300);
}