/* ============================================
   Equipamientos Tauro - GSAP Animations & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ============================================
    // Dark / Light Mode Toggle
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('tauro-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('tauro-theme', isDark ? 'dark' : 'light');

        // Animate knob
        gsap.to('#theme-knob', {
            x: isDark ? 24 : 0,
            duration: 0.3,
            ease: 'power2.out'
        });

        // Animate icon opacity
        gsap.to('.theme-icon-sun', { opacity: isDark ? 0.3 : 1, duration: 0.3 });
        gsap.to('.theme-icon-moon', { opacity: isDark ? 1 : 0.3, duration: 0.3 });
    });

    // Set initial knob position if dark
    if (body.classList.contains('dark-mode')) {
        gsap.set('#theme-knob', { x: 24 });
        gsap.set('.theme-icon-sun', { opacity: 0.3 });
        gsap.set('.theme-icon-moon', { opacity: 1 });
    }

    // ============================================
    // Preloader
    // ============================================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.6,
            delay: 1.2,
            ease: 'power2.inOut',
            onComplete: () => {
                preloader.classList.add('loaded');
                initHeroAnimations();
            }
        });
    });

    // Fallback: hide preloader after 3s even if load event doesn't fire
    setTimeout(() => {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            initHeroAnimations();
        }
    }, 3000);

    // ============================================
    // Hero Entrance Animations
    // ============================================
    function initHeroAnimations() {
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTl
            .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8 })
            .from('.hero-title span', { y: 60, opacity: 0, duration: 0.8, stagger: 0.15 }, '-=0.4')
            .from('.hero-desc', { y: 30, opacity: 0, duration: 0.7 }, '-=0.3')
            .from('.hero-cta', { y: 30, opacity: 0, duration: 0.7 }, '-=0.3')
            .from('.hero-stats > div', { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.3')
            .from('.hero-visual', { x: 60, opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
            .from('.scroll-indicator', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');

        // Floating shapes parallax
        gsap.to('.hero-shape', {
            y: -30,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            stagger: 0.5
        });

        // Counter animation
        animateCounters();
    }

    // ============================================
    // Counter Animation
    // ============================================
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = target >= 1000 ? '+' : '+';
            gsap.to(counter, {
                textContent: target,
                duration: 2,
                delay: 1.5,
                ease: 'power2.out',
                snap: { textContent: 1 },
                onUpdate: function() {
                    counter.textContent = Math.floor(parseFloat(counter.textContent)) + suffix;
                }
            });
        });
    }

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    ScrollTrigger.create({
        start: 80,
        onUpdate: (self) => {
            if (self.scroll() > 80) {
                navbar.classList.add('scrolled');
                backToTop.style.opacity = '1';
                backToTop.style.transform = 'translateY(0)';
            } else {
                navbar.classList.remove('scrolled');
                backToTop.style.opacity = '0';
                backToTop.style.transform = 'translateY(16px)';
            }
        }
    });

    // Back to top
    backToTop.addEventListener('click', () => {
        gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'power3.inOut' });
    });

    // ============================================
    // Smooth Scroll Navigation
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 80 },
                    duration: 1,
                    ease: 'power3.inOut'
                });
                // Close mobile menu
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // ============================================
    // Mobile Menu
    // ============================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if (!mobileMenu.classList.contains('hidden')) {
            gsap.from('.mobile-nav-link', {
                x: -30,
                opacity: 0,
                duration: 0.4,
                stagger: 0.08,
                ease: 'power2.out'
            });
        }
    });

    // ============================================
    // About Section Animations
    // ============================================
    gsap.set(['.about-image', '.about-content', '#about .flex.items-start'], { opacity: 1, x: 0, y: 0 });

    ScrollTrigger.create({
        trigger: '#about',
        start: 'top 95%',
        once: true,
        onEnter: () => {
            gsap.fromTo('.about-image', { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' });
            gsap.fromTo('.about-content', { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 });
            gsap.fromTo('#about .flex.items-start', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.4 });
        }
    });

    // ============================================
    // Services Section Animations
    // ============================================
    // Services: visible by default, animate on scroll
    gsap.set('#services .section-title', { opacity: 1, y: 0 });
    gsap.set('.service-card', { opacity: 1, y: 0 });

    ScrollTrigger.create({
        trigger: '#services',
        start: 'top 95%',
        once: true,
        onEnter: () => {
            gsap.fromTo('#services .section-title',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
            gsap.fromTo('.service-card',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
            );
        }
    });

    // ============================================
    // CTA Banner Parallax
    // ============================================
    gsap.set(['.cta-title', '#products .section-title'], { opacity: 1, y: 0 });

    ScrollTrigger.create({
        trigger: '.cta-title', start: 'top 95%', once: true,
        onEnter: () => gsap.fromTo('.cta-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    });

    // ============================================
    // Products Section Animations
    // ============================================
    ScrollTrigger.create({
        trigger: '#products', start: 'top 95%', once: true,
        onEnter: () => gsap.fromTo('#products .section-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    });

    // Product cards: set visible immediately, animate on scroll
    gsap.set('.product-card', { opacity: 1, y: 0, scale: 1 });

    ScrollTrigger.create({
        trigger: '#products-grid',
        start: 'top 95%',
        once: true,
        onEnter: () => {
            gsap.fromTo('.product-card',
                { y: 40, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power3.out'
                }
            );
        }
    });

    // ============================================
    // Product Filter
    // ============================================
    const filterBtns = document.querySelectorAll('.product-filter');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        onStart: () => {
                            card.style.display = '';
                            card.style.position = 'relative';
                            card.style.pointerEvents = 'auto';
                        }
                    });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });

    // ============================================
    // Contact Section Animations
    // ============================================
    // Contact fill cards animation
    gsap.set('.contact-fill-card', { opacity: 1, y: 0 });
    ScrollTrigger.create({
        trigger: '.contact-fill-card',
        start: 'top 92%',
        once: true,
        onEnter: () => {
            gsap.fromTo('.contact-fill-card',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' }
            );
        }
    });

    gsap.set('#contact form', { opacity: 1, x: 0 });
    ScrollTrigger.create({
        trigger: '#contact form', start: 'top 95%', once: true,
        onEnter: () => gsap.fromTo('#contact form', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    });

    // ============================================
    // Contact Form Submit
    // ============================================
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="30 70" /></svg> Enviando...</span>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg> Mensaje Enviado</span>';
            btn.classList.remove('bg-gold');
            btn.classList.add('bg-emerald-500', 'text-white');

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.classList.remove('bg-emerald-500', 'text-white');
                btn.classList.add('bg-gold');
                contactForm.reset();
            }, 3000);
        }, 1500);
    });

    // ============================================
    // Footer Reveal
    // ============================================
    gsap.set('footer > div > div > div', { opacity: 1, y: 0 });
    ScrollTrigger.create({
        trigger: 'footer', start: 'top 95%', once: true,
        onEnter: () => gsap.fromTo('footer > div > div > div', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' })
    });

    // ============================================
    // Section badges & titles shared animation
    // ============================================
    document.querySelectorAll('section').forEach(section => {
        const badge = section.querySelector('.inline-flex.items-center');
        if (badge && !section.id.includes('hero')) {
            gsap.set(badge, { opacity: 1, y: 0 });
            ScrollTrigger.create({
                trigger: section, start: 'top 95%', once: true,
                onEnter: () => gsap.fromTo(badge, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
            });
        }
    });

    // ============================================
    // Parallax Sections
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!prefersReducedMotion.matches) {
        // Subtle parallax on hero background shapes
        gsap.to('.hero-shape:nth-child(1)', {
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -100,
            ease: 'none'
        });

        gsap.to('.hero-shape:nth-child(2)', {
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -60,
            ease: 'none'
        });
    }

    // ============================================
    // Testimonials Slider
    // ============================================
    const track = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        let slidesPerView = 3;
        let autoplayInterval;

        function updateSlidesPerView() {
            if (window.innerWidth < 768) {
                slidesPerView = 1;
            } else if (window.innerWidth < 1024) {
                slidesPerView = 2;
            } else {
                slidesPerView = 3;
            }
        }

        function getTotalPages() {
            return Math.max(1, slides.length - slidesPerView + 1);
        }

        function buildDots() {
            dotsContainer.innerHTML = '';
            const totalPages = getTotalPages();
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('button');
                dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ' +
                    (i === currentIndex ? 'bg-gold w-8' : 'bg-white/20 hover:bg-white/40');
                dot.setAttribute('aria-label', 'Ir a testimonio ' + (i + 1));
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function goToSlide(index) {
            const totalPages = getTotalPages();
            currentIndex = Math.max(0, Math.min(index, totalPages - 1));
            const slideWidth = 100 / slidesPerView;
            gsap.to(track, {
                x: -(currentIndex * slideWidth) + '%',
                duration: 0.7,
                ease: 'power3.out'
            });
            buildDots();
        }

        function nextSlide() {
            const totalPages = getTotalPages();
            goToSlide(currentIndex >= totalPages - 1 ? 0 : currentIndex + 1);
        }

        function prevSlide() {
            const totalPages = getTotalPages();
            goToSlide(currentIndex <= 0 ? totalPages - 1 : currentIndex - 1);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            if (autoplayInterval) clearInterval(autoplayInterval);
        }

        prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
        nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });

        // Pause on hover
        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);

        // Init
        updateSlidesPerView();
        buildDots();
        startAutoplay();

        // Responsive
        window.addEventListener('resize', () => {
            updateSlidesPerView();
            goToSlide(Math.min(currentIndex, getTotalPages() - 1));
        });

        // Animate in
        gsap.set('.testimonial-slide', { opacity: 1, y: 0 });
        ScrollTrigger.create({
            trigger: '#testimonials', start: 'top 95%', once: true,
            onEnter: () => gsap.fromTo('.testimonial-slide', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
        });
    }

    // ============================================
    // Trust Items Animation
    // ============================================
    gsap.set('.trust-item', { opacity: 1, y: 0 });
    ScrollTrigger.create({
        trigger: '.trust-item',
        start: 'top 95%',
        once: true,
        onEnter: () => {
            gsap.fromTo('.trust-item',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        }
    });
});
