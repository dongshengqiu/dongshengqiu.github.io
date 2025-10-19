// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate form submission (replace with actual form handling)
    showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
    this.reset();
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        default:
            notification.style.backgroundColor = '#007bff';
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    const animateElements = document.querySelectorAll('.project-card, .stat, .about-text, .contact-info, .contact-form');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Initialize Instagram-powered Projects section
    initInstagramProjects();
});

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #007bff !important;
        position: relative;
    }

    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #007bff;
    }

    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }

    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;
document.head.appendChild(style);

// =============================
// Instagram Integration (Projects)
// =============================

function getInstagramAccessTokenFromUrlOrStorage() {
    try {
        const url = new URL(window.location.href);
        const tokenFromUrl = url.searchParams.get('ig_token');
        if (tokenFromUrl) {
            localStorage.setItem('ig_access_token', tokenFromUrl);
            // Optional: clean URL to avoid leaving token in history
            try {
                url.searchParams.delete('ig_token');
                window.history.replaceState({}, document.title, url.toString());
            } catch (_) { /* no-op */ }
            return tokenFromUrl;
        }
        const tokenFromStorage = localStorage.getItem('ig_access_token');
        return tokenFromStorage || '';
    } catch (_) {
        return '';
    }
}

async function fetchInstagramMedia(accessToken, limit = 50) {
    const params = new URLSearchParams({
        fields: 'id,caption,media_url,permalink,thumbnail_url,media_type,timestamp',
        access_token: accessToken,
        limit: String(limit)
    });
    const endpoint = `https://graph.instagram.com/me/media?${params.toString()}`;
    const response = await fetch(endpoint, { mode: 'cors' });
    if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`);
    }
    return await response.json();
}

function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function truncate(text, maxLen) {
    if (!text) return '';
    return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}

async function initInstagramProjects() {
    const grid = document.querySelector('.projects .projects-grid');
    if (!grid) return;

    const existingHTML = grid.innerHTML; // fallback
    const accessToken = getInstagramAccessTokenFromUrlOrStorage();
    if (!accessToken) {
        // No token provided; keep existing static projects
        return;
    }

    // Decide how many items to show based on viewport
    const desiredCount = window.matchMedia('(max-width: 768px)').matches ? 3 : 6;

    try {
        const data = await fetchInstagramMedia(accessToken, 50);
        const items = Array.isArray(data?.data) ? data.data : [];
        if (items.length === 0) return; // keep fallback

        const randomized = shuffleArray(items)
            .filter(item => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM' || item.media_type === 'VIDEO')
            .slice(0, desiredCount);

        if (randomized.length === 0) return; // keep fallback

        const cardsHTML = randomized.map(item => {
            const imageUrl = item.media_type === 'VIDEO' ? (item.thumbnail_url || item.media_url) : item.media_url;
            const caption = truncate(item.caption || '', 120);
            const permalink = item.permalink;
            return `
                <div class="project-card">
                    <div class="project-image">
                        <a href="${permalink}" target="_blank" rel="noopener" aria-label="View on Instagram">
                            <img src="${imageUrl}" alt="Instagram post" loading="lazy">
                        </a>
                    </div>
                    <div class="project-content">
                        <h3>Instagram</h3>
                        ${caption ? `<p>${caption}</p>` : ''}
                        <div class="project-links">
                            <a href="${permalink}" class="project-link" target="_blank" rel="noopener">View on Instagram</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        grid.innerHTML = cardsHTML;
    } catch (err) {
        // On any error, keep original static content
        console.error('Failed to load Instagram media:', err);
        grid.innerHTML = existingHTML;
    }
}
