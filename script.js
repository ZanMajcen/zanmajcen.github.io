document.addEventListener('DOMContentLoaded', () => {
    console.log('Žan Majcen Gallery — ready');

    // ── Switch sound ───────────────────────────────────────
    const switchSound = new Audio('shuttersound.wav');

    // ── Mute toggle ────────────────────────────────────────
    const muteBtn = document.getElementById('mute-btn');
    let isMuted = false;

    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        muteBtn.classList.toggle('muted', isMuted);
        muteBtn.setAttribute('aria-label', isMuted ? 'Unmute sound' : 'Mute sound');
    });

    // ── Slideshow ──────────────────────────────────────────
    const slideshow = document.getElementById('hero-slideshow');
    const slides = document.querySelectorAll('#hero-slideshow .slide');
    const ambientSlides = document.querySelectorAll('.ambient-slide');
    let current = 0;
    let ambientCurrent = 0;
    let isExpanded = false;
    let autoTimer = null;

    function goToSlide(index) {
        slides[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');

        // Cross-fade ambient background
        const nextAmbient = 1 - ambientCurrent;
        ambientSlides[nextAmbient].src = slides[current].src;
        ambientSlides[nextAmbient].classList.add('active');
        ambientSlides[ambientCurrent].classList.remove('active');
        ambientCurrent = nextAmbient;

        // Play shutter sound (unless muted)
        if (!isMuted) {
            switchSound.currentTime = 0;
            switchSound.play();
        }
    }

    function startAuto() {
        if (slides.length > 1) {
            autoTimer = setInterval(() => goToSlide(current + 1), 4000);
        }
    }

    function stopAuto() {
        clearInterval(autoTimer);
        autoTimer = null;
    }

    function expand() {
        isExpanded = true;
        stopAuto();
        slideshow.classList.add('expanded');
        slideshow.closest('.hero').classList.add('expanded');
    }

    function collapse() {
        isExpanded = false;
        slideshow.classList.remove('expanded');
        slideshow.closest('.hero').classList.remove('expanded');
        startAuto();
    }

    // Left / right nav zones (injected into the slideshow)
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slide-nav slide-nav--prev';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.innerHTML = '&#10094;';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slide-nav slide-nav--next';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.innerHTML = '&#10095;';

    slideshow.appendChild(prevBtn);
    slideshow.appendChild(nextBtn);

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(current - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(current + 1);
    });

    slideshow.addEventListener('click', () => {
        if (isExpanded) {
            collapse();
        } else {
            expand();
        }
    });

    startAuto();

    // ── Smooth-scroll nav links ────────────────────────────
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
