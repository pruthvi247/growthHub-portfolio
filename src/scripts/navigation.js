/**
 * Navigation Controller
 * Handles navigation interactions, scrolling effects, and tab switching
 */

class Navigation {
  constructor() {
    this.currentId = null;
    this.currentTab = null;
    this.tabContainerHeight = 70;
    this.lastScroll = 0;
    
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Navigation tab clicks
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.onTabClick(e, tab));
    });

    // Scroll events
    window.addEventListener('scroll', () => this.onScroll());
    
    // Resize events
    window.addEventListener('resize', () => this.onResize());
  }

  onTabClick(event, element) {
    event.preventDefault();
    
    const targetId = element.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const scrollTop = targetElement.offsetTop - this.tabContainerHeight + 1;
      
      // Smooth scroll to target
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }

  onScroll() {
    this.checkHeaderPosition();
    this.findCurrentTabSelector();
    this.lastScroll = window.pageYOffset;
  }

  onResize() {
    if (this.currentId) {
      this.setSliderCss();
    }
  }

  checkHeaderPosition() {
    const headerHeight = 75;
    const navContainer = document.querySelector('.nav-container');
    const navSection = document.querySelector('.nav');
    
    if (!navContainer || !navSection) return;

    if (window.pageYOffset > headerHeight) {
      navContainer.classList.add('nav-container--scrolled');
    } else {
      navContainer.classList.remove('nav-container--scrolled');
    }

    const offset = navSection.offsetTop + navSection.offsetHeight - this.tabContainerHeight - headerHeight;
    
    if (window.pageYOffset > this.lastScroll && window.pageYOffset > offset) {
      navContainer.classList.add('nav-container--move-up');
      navContainer.classList.remove('nav-container--top-first');
      navContainer.classList.add('nav-container--top-second');
    } else if (window.pageYOffset < this.lastScroll && window.pageYOffset > offset) {
      navContainer.classList.remove('nav-container--move-up');
      navContainer.classList.remove('nav-container--top-second');
      navContainer.classList.add('nav-container--top-first');
    } else {
      navContainer.classList.remove('nav-container--move-up');
      navContainer.classList.remove('nav-container--top-first');
      navContainer.classList.remove('nav-container--top-second');
    }
  }

  findCurrentTabSelector() {
    let newCurrentId = null;
    let newCurrentTab = null;
    
    const navTabs = document.querySelectorAll('.nav-tab');
    
    navTabs.forEach(tab => {
      const id = tab.getAttribute('href');
      const targetElement = document.querySelector(id);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - this.tabContainerHeight;
        const offsetBottom = targetElement.offsetTop + targetElement.offsetHeight - this.tabContainerHeight;
        
        if (window.pageYOffset > offsetTop && window.pageYOffset < offsetBottom) {
          newCurrentId = id;
          newCurrentTab = tab;
        }
      }
    });

    if (this.currentId !== newCurrentId || this.currentId === null) {
      this.currentId = newCurrentId;
      this.currentTab = newCurrentTab;
      this.setSliderCss();
    }
  }

  setSliderCss() {
    const slider = document.querySelector('.nav-tab-slider');
    if (!slider) return;

    let width = 0;
    let left = 0;
    
    if (this.currentTab) {
      width = this.currentTab.offsetWidth;
      left = this.currentTab.offsetLeft;
    }
    
    slider.style.width = `${width}px`;
    slider.style.left = `${left}px`;
  }
}

export default Navigation;