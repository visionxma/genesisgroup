document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // SVG Icons
    const iconMuted = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
    const iconUnmuted = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
    const iconPlay = '<svg viewBox="0 0 24 24" width="32" height="32" fill="white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    const iconPause = '<svg viewBox="0 0 24 24" width="32" height="32" fill="white"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';

    // Helpers
    const pauseVideo = (video, btn) => {
        if (!video.paused) {
            video.pause();
            if (btn) {
                btn.innerHTML = iconPlay;
                btn.classList.add('show-paused');
            }
        }
    };

    const playVideo = (video, btn) => {
        if (video.paused) {
            video.play();
            if (btn) {
                btn.innerHTML = iconPause;
                btn.classList.remove('show-paused');
            }
        }
    };

    // Initialize Swiper 3D Carousel
    if(typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.videoSwiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: false, 
            initialSlide: 1, 
            coverflowEffect: {
                rotate: 25,
                stretch: 0,
                depth: 150,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                slideChangeTransitionStart: function () {
                    // Pausa todos os vídeos
                    this.slides.forEach((slide) => {
                        const video = slide.querySelector('.carousel-video');
                        const playBtn = slide.querySelector('.toggle-play-btn');
                        if (video) pauseVideo(video, playBtn);
                    });
                    
                    // Dá play no vídeo que ficou ativo no centro
                    const activeSlide = this.slides[this.activeIndex];
                    const activeVideo = activeSlide.querySelector('.carousel-video');
                    const activeBtn = activeSlide.querySelector('.toggle-play-btn');
                    if (activeVideo) playVideo(activeVideo, activeBtn);
                }
            }
        });
    }

    // Mute/Unmute Video Logic
    const muteBtns = document.querySelectorAll('.toggle-mute-btn');
    muteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Avoid triggering play/pause
            const video = this.parentElement.querySelector('.carousel-video');
            if(video) {
                video.muted = !video.muted;
                if(video.muted) {
                    this.innerHTML = iconMuted;
                } else {
                    this.innerHTML = iconUnmuted;
                }
            }
        });
    });

    // Play/Pause Click Logic
    const playBtns = document.querySelectorAll('.toggle-play-btn');
    playBtns.forEach(btn => {
        btn.innerHTML = iconPause; // Starts assuming autoplay
        const video = btn.parentElement.querySelector('.carousel-video');
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                playVideo(video, btn);
            } else {
                pauseVideo(video, btn);
            }
        });
        
        // Also allow clicking the video to pause/play
        if(video) {
            video.addEventListener('click', () => {
                if (video.paused) {
                    playVideo(video, btn);
                } else {
                    pauseVideo(video, btn);
                }
            });
        }
    });

});
