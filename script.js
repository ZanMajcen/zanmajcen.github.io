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
    const slides = document.querySelectorAll('#hero-slideshow .slide');
    const ambientSlides = document.querySelectorAll('.ambient-slide');
    let current = 0;
    let ambientCurrent = 0;

    if (slides.length > 1) {
        setInterval(() => {
            // Advance main slideshow
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
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
        }, 4000);
    }

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

