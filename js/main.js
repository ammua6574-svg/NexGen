/* ===== Main Application Logic ===== */

class App {
  constructor() {
    this.initPreloader();
    this.initCustomCursor();
    this.initNavigation();
    this.initThemeToggle();
    this.initPortfolioFilter();
    this.initTestimonialCarousel();
    this.initContactForm();
    this.initBackToTop();
    this.initSmoothScroll();
    this.initActiveNavLink();
    this.initNewsletterForm();
  }

  /* ===== Preloader ===== */
  initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 800);
    });

    setTimeout(() => {
      if (!preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }, 3000);
  }

  
  initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    const hoverElements = document.querySelectorAll('a, button, input, textarea, .service-card, .team-card, .portfolio-item, .tech-item');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
        ring.style.borderColor = 'var(--primary-light)';
        ring.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        ring.style.transform = 'translate(-50%, -50%) scale(1)';
        ring.style.borderColor = 'var(--primary)';
        ring.style.opacity = '0.5';
      });
    });
  }

  
  initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (!navbar || !hamburger || !navMenu) return;

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') &&
          !navMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  
  initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);

      if (window.particleNetwork) {
        window.particleNetwork.createParticles();
      }
    });
  }

  
  initPortfolioFilter() {
    const filters = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');

    if (filters.length === 0) return;

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        items.forEach((item) => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  
  initTestimonialCarousel() {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const slides = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoSlideInterval;

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('span');

    const goToSlide = (index) => {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    };

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(currentIndex);
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      goToSlide(currentIndex);
      resetAutoSlide();
    });

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
      }, 5000);
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    goToSlide(0);
    startAutoSlide();
  }

  
  initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const subject = form.querySelector('#subject');
      const message = form.querySelector('#message');
      const submitBtn = form.querySelector('.btn-submit');

      let isValid = true;

      [name, email, subject, message].forEach((field) => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        }
      });

      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        isValid = false;
      }

      if (!isValid) {
        status.className = 'form-status error';
        status.textContent = 'Please fill in all fields correctly.';
        return;
      }

      submitBtn.classList.add('loading');
      status.className = 'form-status';
      status.textContent = '';
      status.style.display = 'none';

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        status.className = 'form-status success';
        status.textContent = 'Thank you! We will get back to you within 24 hours.';
        form.reset();
      }, 2000);
    });

    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('error'));
      field.addEventListener('focus', () => {
        field.parentElement.querySelector('.form-focus').style.width = '100%';
      });
      field.addEventListener('blur', () => {
        if (!field.value) {
          field.parentElement.querySelector('.form-focus').style.width = '0';
        }
      });
    });
  }

  
  initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          const offset = 80;
          const position = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: position, behavior: 'smooth' });
        }
      });
    });
  }

  
  initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${entry.target.id}`
              );
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  
  initNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        if (input && input.value.trim()) {
          const btn = form.querySelector('button');
          const originalText = btn.textContent;
          btn.textContent = '\u2713';
          input.value = '';
          setTimeout(() => { btn.textContent = originalText; }, 2000);
        }
      });
    });
  }
}


const initParticles = () => {
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    window.particleNetwork = new ParticleNetwork('particleCanvas');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticles);
} else {
  initParticles();
}


document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});


window.addEventListener('resize', () => {
  if (window.particleNetwork) {
    window.particleNetwork.resize();
  }
});
