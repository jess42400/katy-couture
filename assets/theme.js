/**
 * KATY COUTURE - Theme JavaScript
 * Vanilla JS - No dependencies
 */

(function() {
  'use strict';

  /* ============================================
     UTILS
     ============================================ */
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const debounce = (fn, delay = 100) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  /* ============================================
     HEADER
     ============================================ */
  const initHeader = () => {
    const header = $('[data-header]');
    if (!header) return;

    // Scroll behavior
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      header.classList.toggle('header--scrolled', currentScroll > 50);
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  };

  /* ============================================
     MOBILE MENU
     ============================================ */
  const initMobileMenu = () => {
    const menuToggle = $('[data-menu-toggle]');
    const menuClose = $('[data-menu-close]');
    const mobileMenu = $('[data-mobile-menu]');

    if (!menuToggle || !mobileMenu) return;

    const openMenu = () => {
      mobileMenu.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileMenu.setAttribute('data-open', 'false');
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', openMenu);
    menuClose?.addEventListener('click', closeMenu);

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.getAttribute('data-open') === 'true') {
        closeMenu();
      }
    });

    // Close on overlay click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });
  };

  /* ============================================
     SEARCH OVERLAY
     ============================================ */
  const initSearch = () => {
    const searchToggle = $('[data-search-toggle]');
    const searchClose = $('[data-search-close]');
    const searchOverlay = $('[data-search-overlay]');
    const searchInput = $('[data-search-input]');

    if (!searchToggle || !searchOverlay) return;

    const openSearch = () => {
      searchOverlay.setAttribute('data-open', 'true');
      setTimeout(() => searchInput?.focus(), 300);
    };

    const closeSearch = () => {
      searchOverlay.setAttribute('data-open', 'false');
    };

    searchToggle.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', closeSearch);

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.getAttribute('data-open') === 'true') {
        closeSearch();
      }
    });
  };

  /* ============================================
     SCROLL REVEAL ANIMATIONS
     ============================================ */
  const initScrollReveal = () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const reveals = $$('.reveal, .reveal-stagger, .reveal-fade, .reveal-scale');

    if (!reveals.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  };

  /* ============================================
     PARALLAX EFFECT - Desktop only
     ============================================ */
  const initParallax = () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check if device has fine pointer (mouse) and is desktop size
    const hasMousePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    // Disable parallax on touch devices and mobile/tablet
    if (!hasMousePointer || !isDesktop) return;

    const parallaxElements = $$('.parallax, .image-fullscreen__media img');
    if (!parallaxElements.length) return;

    const parallaxSpeed = 0.3; // Subtle effect

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;

      parallaxElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;

        // Only apply parallax when element is in or near viewport
        if (scrollY + viewportHeight > elementTop && scrollY < elementTop + elementHeight) {
          const scrollProgress = (scrollY + viewportHeight - elementTop) / (viewportHeight + elementHeight);
          const translateY = (scrollProgress - 0.5) * elementHeight * parallaxSpeed;
          el.style.transform = `translateY(${translateY}px) scale(1.1)`;
        }
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax(); // Initial call
  };

  /* ============================================
     PRODUCT GALLERY WITH ZOOM
     ============================================ */
  const initProductGallery = () => {
    const mainImage = $('[data-main-image]');
    const zoomContainer = $('[data-zoom-container]');
    const thumbnails = $$('[data-thumbnail]');

    if (!mainImage) return;

    // Check if device has fine pointer (mouse)
    const hasMousePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Thumbnail click - switch main image with srcset
    if (thumbnails.length) {
      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
          const newSrc = thumb.dataset.src;
          const newSrcset = thumb.dataset.srcset || '';
          const newAlt = thumb.dataset.alt || '';

          // Smooth transition
          mainImage.style.opacity = '0';

          setTimeout(() => {
            mainImage.src = newSrc;
            if (newSrcset) {
              mainImage.srcset = newSrcset;
            }
            mainImage.alt = newAlt;
            mainImage.style.opacity = '1';
          }, 150);

          thumbnails.forEach(t => t.classList.remove('product__thumbnail--active'));
          thumb.classList.add('product__thumbnail--active');
        });
      });
    }

    // Zoom on hover - only on devices with mouse
    if (zoomContainer && hasMousePointer) {
      // Track mouse position for zoom origin
      zoomContainer.addEventListener('mousemove', (e) => {
        const rect = zoomContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        zoomContainer.style.setProperty('--zoom-x', `${x}%`);
        zoomContainer.style.setProperty('--zoom-y', `${y}%`);
        zoomContainer.setAttribute('data-zoomed', '');
      });

      zoomContainer.addEventListener('mouseleave', () => {
        zoomContainer.removeAttribute('data-zoomed');
        zoomContainer.style.removeProperty('--zoom-x');
        zoomContainer.style.removeProperty('--zoom-y');
      });

      // Add smooth transition to image
      mainImage.style.transition = 'opacity 150ms ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  };

  /* ============================================
     MOBILE SWIPE GALLERY
     ============================================ */
  const initMobileSwipeGallery = () => {
    const gallery = $('[data-swipe-gallery]');
    if (!gallery) return;

    let startX = 0;
    let currentIndex = 0;
    const items = $$('[data-swipe-item]', gallery);
    const totalItems = items.length;

    if (totalItems <= 1) return;

    gallery.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < totalItems - 1) {
          currentIndex++;
        } else if (diff < 0 && currentIndex > 0) {
          currentIndex--;
        }

        gallery.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update thumbnails if they exist
        const thumbnails = $$('[data-thumbnail]');
        if (thumbnails.length) {
          thumbnails.forEach((t, i) => {
            t.classList.toggle('product__thumbnail--active', i === currentIndex);
          });
        }
      }
    }, { passive: true });
  };

  /* ============================================
     QUANTITY SELECTOR
     ============================================ */
  const initQuantitySelectors = () => {
    const selectors = $$('[data-quantity-selector]');

    selectors.forEach(selector => {
      const minusBtn = $('[data-quantity-minus]', selector);
      const plusBtn = $('[data-quantity-plus]', selector);
      const input = $('[data-quantity-input]', selector);

      if (!minusBtn || !plusBtn || !input) return;

      const updateQuantity = (delta) => {
        const currentValue = parseInt(input.value) || 1;
        const min = parseInt(input.min) || 1;
        const max = parseInt(input.max) || 99;
        const newValue = Math.min(Math.max(currentValue + delta, min), max);

        input.value = newValue;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };

      minusBtn.addEventListener('click', () => updateQuantity(-1));
      plusBtn.addEventListener('click', () => updateQuantity(1));

      input.addEventListener('change', () => {
        const value = parseInt(input.value) || 1;
        const min = parseInt(input.min) || 1;
        const max = parseInt(input.max) || 99;
        input.value = Math.min(Math.max(value, min), max);
      });
    });
  };

  /* ============================================
     ACCORDION
     ============================================ */
  const initAccordions = () => {
    const accordions = $$('[data-accordion]');

    accordions.forEach(accordion => {
      const btn = $('[data-accordion-btn]', accordion);
      const content = $('[data-accordion-content]', accordion);

      if (!btn || !content) return;

      btn.addEventListener('click', () => {
        const isOpen = accordion.hasAttribute('open');

        if (isOpen) {
          accordion.removeAttribute('open');
        } else {
          accordion.setAttribute('open', '');
        }
      });
    });
  };

  /* ============================================
     ADD TO CART
     ============================================ */
  const initAddToCart = () => {
    const forms = $$('[data-add-to-cart-form]');

    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Find all add-to-cart buttons (desktop and mobile)
        const desktopBtn = $('[data-add-to-cart-btn]', form);
        const mobileBtn = $('[data-add-to-cart-btn-mobile]');
        const buttons = [desktopBtn, mobileBtn].filter(Boolean);

        // Store original text for each button
        const originalTexts = buttons.map(btn => btn.textContent);

        // Disable all buttons and show loading
        buttons.forEach(btn => {
          btn.disabled = true;
          btn.textContent = 'Ajout en cours...';
        });

        try {
          const formData = new FormData(form);
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            buttons.forEach(btn => {
              btn.textContent = 'Ajouté !';
            });
            updateCartCount();

            setTimeout(() => {
              buttons.forEach((btn, i) => {
                btn.textContent = originalTexts[i];
                btn.disabled = false;
              });
            }, 2000);
          } else {
            throw new Error('Failed to add to cart');
          }
        } catch (error) {
          console.error('Add to cart error:', error);
          buttons.forEach(btn => {
            btn.textContent = 'Erreur';
          });

          setTimeout(() => {
            buttons.forEach((btn, i) => {
              btn.textContent = originalTexts[i];
              btn.disabled = false;
            });
          }, 2000);
        }
      });
    });
  };

  /* ============================================
     CART UPDATE
     ============================================ */
  const updateCartCount = async () => {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      const countElements = $$('[data-cart-count]');

      countElements.forEach(el => {
        el.textContent = cart.item_count;
        el.style.display = cart.item_count > 0 ? 'flex' : 'none';
      });
    } catch (error) {
      console.error('Cart count update error:', error);
    }
  };

  const initCartUpdate = () => {
    const quantityForms = $$('[data-cart-quantity-form]');

    quantityForms.forEach(form => {
      const input = $('[data-quantity-input]', form);

      if (!input) return;

      input.addEventListener('change', debounce(async () => {
        const line = form.dataset.line;
        const quantity = input.value;

        try {
          const response = await fetch('/cart/change.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ line, quantity })
          });

          if (response.ok) {
            window.location.reload();
          }
        } catch (error) {
          console.error('Cart update error:', error);
        }
      }, 500));
    });
  };

  const initCartRemove = () => {
    const removeButtons = $$('[data-cart-remove]');

    removeButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();

        const line = btn.dataset.line;

        try {
          const response = await fetch('/cart/change.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ line, quantity: 0 })
          });

          if (response.ok) {
            window.location.reload();
          }
        } catch (error) {
          console.error('Cart remove error:', error);
        }
      });
    });
  };

  /* ============================================
     NEWSLETTER FORM
     ============================================ */
  const initNewsletterForm = () => {
    const forms = $$('[data-newsletter-form]');

    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = $('[data-newsletter-email]', form);
        const submitBtn = $('[data-newsletter-submit]', form);
        const message = $('[data-newsletter-message]', form);

        if (!email || !email.value) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi...';

        // Note: Actual newsletter signup would require backend integration
        // This is a placeholder that simulates the submission

        setTimeout(() => {
          if (message) {
            message.textContent = 'Merci pour votre inscription !';
            message.style.display = 'block';
          }

          email.value = '';
          submitBtn.textContent = 'Inscrit !';

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "S'inscrire";
            if (message) message.style.display = 'none';
          }, 3000);
        }, 1000);
      });
    });
  };

  /* ============================================
     COLLECTION FILTERS
     ============================================ */
  const initCollectionFilters = () => {
    const filterBtns = $$('[data-filter-btn]');
    const filterDropdowns = $$('[data-filter-dropdown]');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const parent = btn.closest('.collection__filter');
        const isOpen = parent.classList.contains('open');

        // Close all filters
        $$('.collection__filter').forEach(f => f.classList.remove('open'));

        // Toggle current
        if (!isOpen) {
          parent.classList.add('open');
        }
      });
    });

    // Close filters when clicking outside
    document.addEventListener('click', () => {
      $$('.collection__filter').forEach(f => f.classList.remove('open'));
    });

    // Filter options click
    const filterOptions = $$('[data-filter-option]');
    filterOptions.forEach(option => {
      option.addEventListener('click', () => {
        const filter = option.dataset.filter;
        const value = option.dataset.value;

        // Update URL and reload
        const url = new URL(window.location);
        if (value) {
          url.searchParams.set(filter, value);
        } else {
          url.searchParams.delete(filter);
        }
        window.location = url;
      });
    });
  };

  /* ============================================
     LAZY LOADING
     ============================================ */
  const initLazyLoading = () => {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const lazyImages = $$('img[loading="lazy"]');
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback for older browsers
      const lazyImages = $$('img[data-src]');

      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  };

  /* ============================================
     SMOOTH PAGE TRANSITIONS
     ============================================ */
  const initPageTransitions = () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Add fade-out class before navigation
    const internalLinks = $$('a[href^="/"], a[href^="' + window.location.origin + '"]');

    internalLinks.forEach(link => {
      // Skip links that open in new tab or have special behaviors
      if (link.target === '_blank' || link.hasAttribute('data-no-transition')) return;

      link.addEventListener('click', (e) => {
        const href = link.href;

        // Don't animate same-page anchors
        if (href.includes('#') && href.split('#')[0] === window.location.href.split('#')[0]) return;

        e.preventDefault();
        document.body.classList.add('page-transition-out');

        setTimeout(() => {
          window.location = href;
        }, 300);
      });
    });
  };

  /* ============================================
     LOADING SCREEN (Optional)
     ============================================ */
  const initLoadingScreen = () => {
    const loadingScreen = $('.loading-screen');
    if (!loadingScreen) return;

    // Hide loading screen when page is ready
    const hideLoader = () => {
      loadingScreen.classList.add('loaded');
    };

    // Wait for all content to be loaded
    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 300);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hideLoader, 300);
      });
    }
  };

  /* ============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  const initSmoothScroll = () => {
    // Scroll indicator click
    const scrollTrigger = $('[data-scroll-trigger]');
    if (scrollTrigger) {
      scrollTrigger.addEventListener('click', () => {
        const heroSection = scrollTrigger.closest('section');
        if (heroSection) {
          const nextSection = heroSection.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }

    // Anchor links
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = $(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  };

  /* ============================================
     THEME SWITCHER
     ============================================ */
  const initThemeSwitcher = () => {
    const themeSwitcher = $('[data-theme-switcher]');
    const themeToggle = $('[data-theme-toggle]');
    const themeMenu = $('[data-theme-menu]');
    const themeOptions = $$('[data-theme]', themeMenu);

    if (!themeSwitcher || !themeToggle || !themeMenu) return;

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('katy-theme') || 'light';
    applyTheme(savedTheme);
    updateActiveOption(savedTheme);

    // Toggle menu
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = themeSwitcher.getAttribute('data-open') === 'true';
      themeSwitcher.setAttribute('data-open', isOpen ? 'false' : 'true');
    });

    // Theme option clicks
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        applyTheme(theme);
        updateActiveOption(theme);
        localStorage.setItem('katy-theme', theme);
        themeSwitcher.setAttribute('data-open', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!themeSwitcher.contains(e.target)) {
        themeSwitcher.setAttribute('data-open', 'false');
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        themeSwitcher.setAttribute('data-open', 'false');
      }
    });

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }

    function updateActiveOption(theme) {
      themeOptions.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === theme);
      });
    }
  };

  /* ============================================
     INIT
     ============================================ */
  const init = () => {
    // Loading screen (must be first)
    initLoadingScreen();

    // Core functionality
    initHeader();
    initMobileMenu();
    initSearch();
    initThemeSwitcher();

    // Animations
    initScrollReveal();
    initParallax();
    initSmoothScroll();
    initPageTransitions();

    // Product & Cart
    initProductGallery();
    initMobileSwipeGallery();
    initQuantitySelectors();
    initAccordions();
    initAddToCart();
    initCartUpdate();
    initCartRemove();

    // Forms & Filters
    initNewsletterForm();
    initCollectionFilters();

    // Performance
    initLazyLoading();
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
