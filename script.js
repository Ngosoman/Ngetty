/* ===== SPLASHSCREEN ===== */

(function() {
	const splash = document.getElementById('splashscreen');
	const bar = document.getElementById('splashBar');
	const typewriterEl = document.getElementById('typewriterText');
	const cursorEl = document.getElementById('typewriterCursor');
	if (!splash || !bar || !typewriterEl || !cursorEl) return;

	const SPLASH_DURATION = 5000; // 5 seconds total
	const TYPE_DURATION = 4000;   // 4 seconds to type the full text
	const UPDATE_INTERVAL = 50;   // ms between bar updates
	const steps = SPLASH_DURATION / UPDATE_INTERVAL;
	let currentStep = 0;

	// ——— Typewriter effect ———
	const FULL_TEXT = 'Welcome to my Portfolio';
	const charInterval = TYPE_DURATION / FULL_TEXT.length; // ~160ms per character
	let charIndex = 0;

	// Prevent body scroll while splash is visible
	document.body.style.overflow = 'hidden';

	const typeChar = () => {
		if (charIndex < FULL_TEXT.length) {
			typewriterEl.textContent += FULL_TEXT[charIndex];
			charIndex++;
			setTimeout(typeChar, charInterval);
		} else {
			// Typing complete: hide cursor after a moment
			setTimeout(() => {
				cursorEl.style.display = 'none';
			}, 600);
		}
	};
	typeChar();

	// ——— Progress bar ———
	const barInterval = setInterval(() => {
		currentStep++;
		const pct = Math.min((currentStep / steps) * 100, 100);
		bar.style.width = pct + '%';

		if (currentStep >= steps) {
			clearInterval(barInterval);
		}
	}, UPDATE_INTERVAL);

	// ——— After full duration, fade out ———
	setTimeout(() => {
		clearInterval(barInterval);
		bar.style.width = '100%';
		cursorEl.style.display = 'none'; // ensure cursor gone

		splash.classList.add('is-hidden');

		// Restore body scroll after transition
		setTimeout(() => {
			document.body.style.overflow = '';
			splash.setAttribute('aria-hidden', 'true');
		}, 900);
	}, SPLASH_DURATION);
})();

/* ===== END SPLASHSCREEN ===== */

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const year = document.getElementById('year');
const revealElements = document.querySelectorAll('.reveal');

if (year) {
	year.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
	menuToggle.addEventListener('click', () => {
		const isOpen = navLinks.classList.toggle('open');
		menuToggle.setAttribute('aria-expanded', isOpen);
	});

	navAnchors.forEach((anchor) => {
		anchor.addEventListener('click', () => {
			navLinks.classList.remove('open');
			menuToggle.setAttribute('aria-expanded', 'false');
		});
	});
}

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('in-view');
				observer.unobserve(entry.target);
			}
		});
	},
	{
		threshold: 0.16,
		rootMargin: '0px 0px -40px 0px'
	}
);

revealElements.forEach((element) => observer.observe(element));

const slideshow = document.querySelector('.slideshow');

if (slideshow) {
	const slides = Array.from(slideshow.querySelectorAll('.slide'));
	const dots = Array.from(slideshow.querySelectorAll('.dot'));
	const prevButton = slideshow.querySelector('.slide-btn.prev');
	const nextButton = slideshow.querySelector('.slide-btn.next');
	let activeIndex = 0;
	let autoplayTimer;

	const setActiveSlide = (index) => {
		activeIndex = (index + slides.length) % slides.length;

		slides.forEach((slide, slideIndex) => {
			slide.classList.toggle('is-active', slideIndex === activeIndex);
		});

		dots.forEach((dot, dotIndex) => {
			dot.classList.toggle('is-active', dotIndex === activeIndex);
			dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false');
		});
	};

	const startAutoplay = () => {
		if (slides.length < 2) {
			return;
		}

		clearInterval(autoplayTimer);
		autoplayTimer = setInterval(() => {
			setActiveSlide(activeIndex + 1);
		}, 5200);
	};

	const stopAutoplay = () => {
		clearInterval(autoplayTimer);
	};

	if (slides.length > 0) {
		setActiveSlide(0);
	}

	if (prevButton) {
		prevButton.addEventListener('click', () => {
			setActiveSlide(activeIndex - 1);
			startAutoplay();
		});
	}

	if (nextButton) {
		nextButton.addEventListener('click', () => {
			setActiveSlide(activeIndex + 1);
			startAutoplay();
		});
	}

	dots.forEach((dot, index) => {
		dot.addEventListener('click', () => {
			setActiveSlide(index);
			startAutoplay();
		});
	});

	slideshow.addEventListener('mouseenter', stopAutoplay);
	slideshow.addEventListener('mouseleave', startAutoplay);
	slideshow.addEventListener('focusin', stopAutoplay);
	slideshow.addEventListener('focusout', startAutoplay);

	slideshow.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			setActiveSlide(activeIndex - 1);
			startAutoplay();
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			setActiveSlide(activeIndex + 1);
			startAutoplay();
		}
	});

	document.addEventListener('visibilitychange', () => {
		if (document.hidden) {
			stopAutoplay();
		} else {
			startAutoplay();
		}
	});

	startAutoplay();
}
