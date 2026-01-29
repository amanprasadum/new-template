/* ========================================
   PROFESSIONAL HEADER JAVASCRIPT
   Smart scroll behavior & interactions
======================================== */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        scrollThreshold: 100,
        scrolledClass: 'scrolled',
        hiddenClass: 'hidden',
        debounceDelay: 10
    };

    // Elements
    const header = document.getElementById('mainHeader');
    const mobileMenu = document.getElementById('mobileMenu');
    const logoDesktop = document.querySelector('.logo-desktop');
    const logoMobile = document.querySelector('.logo-mobile');

    // State
    let lastScrollTop = 0;
    let ticking = false;

    // ========================================
    // SCROLL BEHAVIOR
    // ========================================
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add 'scrolled' class when past threshold
        if (scrollTop > CONFIG.scrollThreshold) {
            header.classList.add(CONFIG.scrolledClass);
        } else {
            header.classList.remove(CONFIG.scrolledClass);
        }

        // Desktop: Hide/show header based on scroll direction
        if (window.innerWidth >= 992) {
            if (scrollTop > lastScrollTop && scrollTop > CONFIG.scrollThreshold) {
                // Scrolling down - hide header
                header.classList.add(CONFIG.hiddenClass);
            } else {
                // Scrolling up - show header
                header.classList.remove(CONFIG.hiddenClass);
            }
        } else {
            // Mobile: Always visible when scrolling
            header.classList.remove(CONFIG.hiddenClass);
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    // Debounced scroll handler
    function requestScrollUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }

    // Listen to scroll
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });

    // ========================================
    // MOBILE MENU INTERACTIONS
    // ========================================

    // Close mobile menu when clicking nav links
    if (mobileMenu) {
        const mobileNavLinks = mobileMenu.querySelectorAll('[data-bs-dismiss="offcanvas"]');
        
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            });
        });

        // Prevent body scroll when mobile menu is open
        mobileMenu.addEventListener('show.bs.offcanvas', () => {
            document.body.style.overflow = 'hidden';
        });

        mobileMenu.addEventListener('hide.bs.offcanvas', () => {
            document.body.style.overflow = '';
        });
    }

    // ========================================
    // DROPDOWN INTERACTIONS (Desktop)
    // ========================================

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        const dropdowns = document.querySelectorAll('.has-dropdown');
        const clickedInsideDropdown = e.target.closest('.has-dropdown');
        
        if (!clickedInsideDropdown) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Optional: Click to toggle on mobile-sized desktop devices
    const dropdownToggles = document.querySelectorAll('.has-dropdown > .nav-link');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth < 992) {
                e.preventDefault();
                const parent = toggle.closest('.has-dropdown');
                parent.classList.toggle('active');
            }
        });
    });

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (mobileMenu) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                }

                // Smooth scroll to target
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // RESIZE HANDLER
    // ========================================

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reset header state on resize
            if (window.innerWidth >= 992) {
                header.classList.remove(CONFIG.hiddenClass);
                
                // Close mobile menu if open
                if (mobileMenu) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                }
            }
        }, 250);
    });

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================

    // ESC key closes mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
            if (bsOffcanvas) {
                bsOffcanvas.hide();
            }
        }
    });

    // ========================================
    // ACCESSIBILITY IMPROVEMENTS
    // ========================================

    // Add aria-labels to dropdown toggles
    dropdownToggles.forEach((toggle, index) => {
        if (!toggle.hasAttribute('aria-label')) {
            const text = toggle.textContent.trim();
            toggle.setAttribute('aria-label', `Toggle ${text} menu`);
        }
    });

    // ========================================
    // INITIALIZATION
    // ========================================

    // Run once on load
    handleScroll();

    // Add loaded class for CSS animations
    setTimeout(() => {
        header.classList.add('loaded');
    }, 100);

    // Console log for debugging (remove in production)
    console.log('✓ Professional Header initialized');

})();

/* ========================================
   OPTIONAL: CUSTOM EVENT EMITTERS
   Use these to hook into header events
======================================== */

// Example: Listen for header state changes
// document.addEventListener('headerScrolled', (e) => {
//     console.log('Header scrolled:', e.detail);
// });

// Example: Emit custom event on scroll
window.addEventListener('scroll', () => {
    const event = new CustomEvent('headerScrolled', {
        detail: {
            scrollY: window.scrollY,
            isScrolled: window.scrollY > 100
        }
    });
    document.dispatchEvent(event);
});