/**
 * Garcia Trader — Script Principal
 * Design replicado do Genesis Group
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==================================================================
    // 1. LUCIDE ICONS
    // ==================================================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==================================================================
    // 2. SCROLL FADE-UP (IntersectionObserver — Genesis Group pattern)
    // ==================================================================
    const fadeElements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.05 });

    fadeElements.forEach(el => observer.observe(el));

    // ==================================================================
    // 3. NAVBAR — Scroll effect + Mobile drawer
    // ==================================================================
    const navbar  = document.getElementById('navbar');
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    // Scroll: adiciona classe scrolled
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Mobile menu toggle
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // Fechar ao clicar no botão X
        const menuClose = document.getElementById('menuClose');
        if (menuClose) {
            menuClose.addEventListener('click', () => {
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        }

        // Fechar ao clicar em link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ==================================================================
    // 4. PEEK CAROUSEL — função unificada para todos os carrosséis
    // ==================================================================

    /**
     * initPeekCarousel({ trackEl, prevEl, nextEl, dots, mobileOnly })
     * - trackEl:    o elemento flex/grid que contém os itens
     * - prevEl/nextEl: botões de seta
     * - dots:       NodeList dos dots
     * - mobileOnly: se true, só ativa abaixo de 768px
     */
    function initPeekCarousel({ trackEl, prevEl, nextEl, dots, mobileOnly = false }) {
        if (!trackEl) return;

        const total  = trackEl.children.length;
        const middle = Math.floor(total / 2);
        let cur      = middle;
        const PEEK   = 0.80; // 80% de largura por item

        function isMob() { return window.innerWidth < 768; }

        function getOffset(index) {
            const w     = trackEl.parentElement.clientWidth;
            const itemW = trackEl.children[0]?.offsetWidth || w * PEEK;
            const startX = (w - itemW) / 2;
            return startX - index * itemW;
        }

        const items = Array.from(trackEl.children);

        function goTo(index, force = false) {
            if (mobileOnly && !isMob() && !force) return;
            cur = (index + total) % total;
            trackEl.style.transform = `translateX(${getOffset(cur)}px)`;
            items.forEach((el, i) => {
                el.classList.toggle('peek-active', i === cur);
                el.classList.toggle('peek-left',   i < cur);
                el.classList.toggle('peek-right',  i > cur);
            });
            dots?.forEach((d, i) => d.classList.toggle('active', i === cur));
        }

        function reset() {
            if (mobileOnly && !isMob()) {
                trackEl.style.transform = '';
                items.forEach(el => {
                    el.classList.remove('peek-active', 'peek-left', 'peek-right');
                });
                cur = middle;
                dots?.forEach((d, i) => d.classList.toggle('active', i === middle));
            }
        }

        prevEl?.addEventListener('click', () => goTo(cur - 1));
        nextEl?.addEventListener('click', () => goTo(cur + 1));
        dots?.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.index)));

        // Swipe touch
        let tx = 0;
        trackEl.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
        trackEl.addEventListener('touchend', e => {
            const diff = tx - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(cur + (diff > 0 ? 1 : -1));
        }, { passive: true });

        window.addEventListener('resize', () => {
            reset();
            if (!mobileOnly || isMob()) goTo(cur, true);
        }, { passive: true });

        // Posição inicial — aguarda o layout renderizar para ter o clientWidth correto
        requestAnimationFrame(() => {
            if (!mobileOnly || isMob()) goTo(middle, true);
        });
    }

    // ---- Carrossel: fotos de resultados (mobile only) ----
    initPeekCarousel({
        trackEl:    document.getElementById('rcTrack'),
        prevEl:     document.getElementById('rcPrev'),
        nextEl:     document.getElementById('rcNext'),
        dots:       document.querySelectorAll('#rcDots .peek-dot'),
        mobileOnly: false,
    });

    // ---- Carrossel: galeria lifestyle (mobile only) ----
    initPeekCarousel({
        trackEl:    document.getElementById('galeriaTrack'),
        prevEl:     document.getElementById('galeriaPrev'),
        nextEl:     document.getElementById('galeriaNext'),
        dots:       document.querySelectorAll('#galeriaDots .peek-dot'),
        mobileOnly: true,
    });

    // ---- Carrossel: vídeos (mobile only) ----
    initPeekCarousel({
        trackEl:    document.getElementById('videoTrack'),
        prevEl:     document.getElementById('videoPrev'),
        nextEl:     document.getElementById('videoNext'),
        dots:       document.querySelectorAll('#videoDots .peek-dot'),
        mobileOnly: true,
    });

    // ==================================================================
    // 5. FAQ ACCORDION
    // ==================================================================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            // Fechar todos
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-answer').classList.remove('open');
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Abrir este se estava fechado
            if (!isOpen) {
                item.classList.add('open');
                answer.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ==================================================================
    // 6. SMOOTH SCROLL para links de âncora
    // ==================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80; // altura da navbar
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ==================================================================
    // 7. DEMO CANDLES — animação de altura aleatória
    // ==================================================================
    const demoCandles = document.querySelectorAll('.demo-candle');

    function animateCandles() {
        demoCandles.forEach(c => {
            if (!c.classList.contains('red')) {
                const s = (Math.random() * 0.7 + 0.3).toFixed(2);
                c.style.transform = `scaleY(${s})`;
            }
        });
    }

    if (demoCandles.length > 0) {
        setInterval(animateCandles, 1200);
    }

    // ==================================================================
    // 8. ACTIVE NAV LINK ao scrollar (Intersection Observer por section)
    // ==================================================================
    const sections   = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(a => {
                    a.classList.toggle('active-nav', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

    // ==================================================================
    // 9. Prevent touch zoom (mobile)
    // ==================================================================
    document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false });
    document.addEventListener('gesturechange', e => e.preventDefault(), { passive: false });


});

