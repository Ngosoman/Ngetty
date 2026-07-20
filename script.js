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
