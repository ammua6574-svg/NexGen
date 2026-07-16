/* ===== Scroll Animation (AOS-like) ===== */
class ScrollAnimator {
  constructor() {
    this.animatedElements = document.querySelectorAll('[data-aos]');
    this.intersectionObserver = null;
    this.init();
  }

  init() {
    if (this.animatedElements.length === 0) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.getAttribute('data-aos-delay')) || 0;

            setTimeout(() => {
              el.classList.add('aos-animate');
            }, delay);

            this.intersectionObserver.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.animatedElements.forEach((el) => {
      this.intersectionObserver.observe(el);
    });
  }

  refresh() {
    this.animatedElements = document.querySelectorAll('[data-aos]');
    this.animatedElements.forEach((el) => {
      if (!el.classList.contains('aos-animate')) {
        this.intersectionObserver.observe(el);
      }
    });
  }
}

/* ===== Typewriter Effect ===== */
class Typewriter {
  constructor(elementId, words, options = {}) {
    this.element = document.getElementById(elementId);
    if (!this.element) return;

    this.words = words;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.typeSpeed = options.typeSpeed || 80;
    this.deleteSpeed = options.deleteSpeed || 40;
    this.pauseSpeed = options.pauseSpeed || 2000;
    this.loop = true;

    this.type();
  }

  type() {
    const currentWord = this.words[this.wordIndex];

    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.element.textContent = currentWord.substring(0, this.charIndex);

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      this.isDeleting = true;
      setTimeout(() => this.type(), this.pauseSpeed);
      return;
    }

    if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      setTimeout(() => this.type(), 500);
      return;
    }

    const speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
    setTimeout(() => this.type(), speed);
  }
}

/* ===== Parallax Effect ===== */
class Parallax {
  constructor() {
    this.shapes = document.querySelectorAll('.shape');
    this.hero = document.querySelector('.hero');
    if (this.shapes.length === 0) return;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      this.shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.05;
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }
}

/* ===== Animated Counter ===== */
class Counter {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.observer = null;
    this.animated = new Set();
    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animated.has(entry.target)) {
            this.animated.add(entry.target);
            this.animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.counters.forEach((counter) => this.observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    let current = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    let startTime = null;

    const easeOutQuad = (t) => t * (2 - t);

    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);

      current = Math.floor(easedProgress * target);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
        element.classList.add('counted');
      }
    };

    requestAnimationFrame(update);
  }
}

/* ===== 3D Tilt Effect ===== */
class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll('[data-tilt]');
    if (this.cards.length === 0) return;
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }
}

/* ===== Initialize All Animations ===== */
document.addEventListener('DOMContentLoaded', () => {
  window.scrollAnimator = new ScrollAnimator();
  window.typewriter = new Typewriter('typingText', [
    'Digital Experiences',
    'Cloud Solutions',
    'AI Platforms',
    'Smart Applications',
    'Future Technology'
  ]);
  window.parallax = new Parallax();
  window.counter = new Counter();
  window.tiltEffect = new TiltEffect();
});
