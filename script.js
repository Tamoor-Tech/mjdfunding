/**
 * MJD Funding - Premium Fintech Interactive Behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }

  // 2. Sticky Navbar scroll behavior
  const navbar = document.getElementById('mainNav');
  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check

  // 3. ScrollSpy & Active Link Management
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-navbar .nav-link, .offcanvas-body .nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // Close offcanvas menu when clicking navigation links on mobile
  const offcanvasElement = document.getElementById('mobileNav');
  if (offcanvasElement && typeof bootstrap !== 'undefined') {
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
    const mobileLinks = offcanvasElement.querySelectorAll('.nav-link, .btn');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        const openedCanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (openedCanvas) {
          openedCanvas.hide();
        }
      });
    });
  }

  // 4. Trust Strip Animated Counters
  const counterElements = document.querySelectorAll('.counter-animate');
  let countersTriggered = false;

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1800; // milliseconds
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      // Easing function (easeOutQuad)
      const progress = frame / totalFrames;
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentVal = (target * easedProgress);

      el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

      if (frame >= totalFrames) {
        clearInterval(counterInterval);
        el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    }, frameRate);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersTriggered) {
          countersTriggered = true;
          counterElements.forEach(el => animateCounter(el));
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const trustSection = document.getElementById('trustStrip');
    if (trustSection) {
      counterObserver.observe(trustSection);
    }
  } else {
    // Fallback for older browsers
    counterElements.forEach(el => animateCounter(el));
  }

  // 5. Toast Notification System
  const showToast = (title, message) => {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'form-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="form-toast-icon"><i class="bi bi-check-circle-fill"></i></div>
      <div>
        <h6 class="mb-1 fw-bold text-white" style="font-size: 0.95rem;">${title}</h6>
        <p class="mb-0 text-light opacity-75" style="font-size: 0.85rem;">${message}</p>
      </div>
      <button type="button" class="btn-close btn-close-white ms-auto" aria-label="Close" onclick="this.parentElement.classList.remove('show')"></button>
    `;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5500);
  };

  // Helper function to validate email regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 6. Hero Quick Inquiry Form Handling
  const heroForm = document.getElementById('heroQuickForm');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('heroName');
      const email = document.getElementById('heroEmail');
      const phone = document.getElementById('heroPhone');
      const program = document.getElementById('heroProgram');
      const amount = document.getElementById('heroAmount');

      if (!name.value.trim() || !email.value.trim() || !phone.value.trim() || !program.value || !amount.value) {
        alert('Please fill out all required fields to check your funding options.');
        return;
      }

      if (!isValidEmail(email.value.trim())) {
        alert('Please enter a valid business email address.');
        email.focus();
        return;
      }

      // Simulate successful submission
      const submitBtn = heroForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Processing...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        heroForm.reset();
        showToast('Request Received!', 'Our senior funding specialist will contact you within 24–48 hours.');
      }, 1000);
    });
  }

  // 7. Full Contact Form Handling
  const contactForm = document.getElementById('contactFullForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const phone = document.getElementById('contactPhone');
      const program = document.getElementById('contactProgram');
      const amount = document.getElementById('contactAmount');
      const message = document.getElementById('contactMessage');

      if (!name.value.trim() || !email.value.trim() || !phone.value.trim() || !program.value || !amount.value) {
        alert('Please complete all required fields.');
        return;
      }

      if (!isValidEmail(email.value.trim())) {
        alert('Please enter a valid email address.');
        email.focus();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Submitting...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('Consultation Scheduled!', 'Thank you! Your inquiry has been routed to MJD Funding underwriting.');
      }, 1200);
    });
  }

  // 8. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 9. Pre-fill inquiry program when clicking "Learn More" on program cards
  const programLinks = document.querySelectorAll('.program-link');
  programLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const card = link.closest('.program-card');
      const title = card ? card.querySelector('.program-title')?.textContent.trim() : null;
      if (title) {
        const contactSelect = document.getElementById('contactProgram');
        if (contactSelect) {
          for (let option of contactSelect.options) {
            if (option.text.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(option.text.toLowerCase())) {
              contactSelect.value = option.value;
              break;
            }
          }
        }
      }
    });
  });
});

