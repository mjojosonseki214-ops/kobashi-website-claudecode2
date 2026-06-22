/**
  手料理 こ橋 (Te-ryouri Kobashi) - Official Script Logic
  Features: Scroll animations, active headers, mobile menu toggling, and parallax hints.
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('#nav-menu a');
  const hero = document.getElementById('hero');
  const heroBg = document.querySelector('.hero-bg');
  const reveals = document.querySelectorAll('.reveal');

  // Activate Hero animation trigger on load
  if (hero) {
    setTimeout(() => {
      hero.classList.add('active');
    }, 100);
  }

  // 2. Header Scroll Effect & Parallax
  let lastScrollY = window.scrollY;
  let ticking = false;

  const handleScroll = () => {
    // Header background change
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Parallax effect on Hero Background (PC only for performance)
    if (window.innerWidth > 768 && hero && heroBg) {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const speed = 0.4;
        const yPos = -(window.scrollY * speed);
        heroBg.style.transform = `translate3d(0, ${yPos}px, 0) scale(1.05)`;
      }
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
      });
      ticking = true;
    }
  });

  // Run once initially to check scroll position
  handleScroll();

  // 3. Mobile Navigation Menu Toggle
  const toggleMobileMenu = () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    
    // Toggle aria-expanded for screen readers
    const isExpanded = navMenu.classList.contains('active');
    mobileToggle.setAttribute('aria-expanded', isExpanded);

    // Animate hamburger to X
    const spans = mobileToggle.querySelectorAll('span');
    if (isExpanded) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  };

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // 4. Reveal Animations (Intersection Observer)
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Unobserve if we only want animation to run once
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15, // Trigger when 15% of section is visible
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    const revealOnScrollFallback = () => {
      reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', revealOnScrollFallback);
    revealOnScrollFallback(); // Trigger once on load
  }

  // 5. Smooth Anchor Scrolling with offset adjustment
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offset = 70; // Matches standard scrolled header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
