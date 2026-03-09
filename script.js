/**
 * Script Principal para animações e lógicas front-end 
 * Genesis Group / Allan Costa
 */

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Observer - Fade Up na rolagem da página
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05 // Gatilha muito mais rápido (com 5% de visibilidade em vez de 15%)
    };

    const fadeElements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Após tornar vísivel, parar de observar (só anima a 1a vez)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Logo click trigger (para recarregar ao topo)
    const logo = document.querySelector('.brand-logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        logo.style.cursor = 'pointer';
    }

});
