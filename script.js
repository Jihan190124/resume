// JavaScript for Jihan Bhagat Portfolio

// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const heroParticles = document.querySelector('.hero-particles');
const contactForm = document.getElementById('contactForm');
const modal = document.getElementById('successModal');
const categoryButtons = document.querySelectorAll('.category-btn');
const projectCategories = document.querySelectorAll('.project-category');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeAnimations();
    initializeProjectFilter();
    initializeNavigation();
    initializeFormSubmission();
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 255, 136, 0.2)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active navigation link
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add click listeners for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Particles Animation
function initializeParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const color = getRandomNeonColor();
    const duration = Math.random() * 20 + 10;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        box-shadow: 0 0 10px ${color};
        animation: float ${duration}s ease-in-out infinite;
    `;
    
    heroParticles.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, duration * 1000);
}

function getRandomNeonColor() {
    const colors = [
        '#00ff88',  // neon green
        '#00ffff',  // neon cyan
        '#ff00ff',  // neon purple
        '#ff6600',  // neon orange
        '#ff0066',  // neon red
        '#0066ff',  // neon blue
        '#ffff00'   // neon yellow
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
        }
        10%, 90% {
            opacity: 1;
        }
        50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(particleStyle);

// Continuously create new particles
setInterval(() => {
    if (heroParticles && heroParticles.children.length < 30) {
        createParticle();
    }
}, 500);

// Scroll Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .project-card, .cert-category, .about-image, .terminal-window'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Project Filter
function initializeProjectFilter() {
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            filterProjects(category);
        });
    });
}

function filterProjects(category) {
    projectCategories.forEach(categoryDiv => {
        const categoryName = categoryDiv.dataset.category;
        
        if (category === 'all' || category === categoryName) {
            categoryDiv.style.display = 'block';
            categoryDiv.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            categoryDiv.style.display = 'none';
        }
    });
}

// Form Submission
function initializeFormSubmission() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simulate form submission (replace with actual backend call)
    simulateFormSubmission(name, email, message);
}

function simulateFormSubmission(name, email, message) {
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Clear form
        contactForm.reset();
        
        // Show success modal
        showModal();
        
        // Log form data (replace with actual submission)
        console.log('Form submitted:', { name, email, message });
    }, 2000);
}

// Modal Functions
function showModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Typing Effect Enhancement
function enhanceTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    const colors = ['#00ff88', '#00ffff', '#ff00ff', '#ff6600'];
    
    setInterval(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        typingElement.style.borderRightColor = randomColor;
    }, 500);
}

// Initialize typing effect enhancement
setTimeout(enhanceTypingEffect, 1000);

// Glitch Effect Enhancement
function enhanceGlitchEffect() {
    const glitchElement = document.querySelector('.glitch');
    if (!glitchElement) return;
    
    setInterval(() => {
        glitchElement.style.animation = 'none';
        setTimeout(() => {
            glitchElement.style.animation = 'glitch 2s infinite';
        }, 100);
    }, 8000);
}

// Initialize glitch effect enhancement
setTimeout(enhanceGlitchEffect, 2000);

// Dynamic Background Colors
function initializeDynamicBackground() {
    const hero = document.querySelector('.hero');
    const colors = [
        'radial-gradient(circle at 20% 80%, #ff00ff 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, #00ffff 0%, transparent 50%)',
        'radial-gradient(circle at 40% 40%, #00ff88 0%, transparent 50%)',
        'radial-gradient(circle at 60% 80%, #ff6600 0%, transparent 50%)',
        'radial-gradient(circle at 20% 20%, #ff0066 0%, transparent 50%)'
    ];
    
    let colorIndex = 0;
    setInterval(() => {
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            colorIndex = (colorIndex + 1) % colors.length;
            heroBackground.style.background = colors[colorIndex];
        }
    }, 5000);
}

// Initialize dynamic background
setTimeout(initializeDynamicBackground, 1000);

// Scroll Progress Indicator
function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00ff88, #00ffff, #ff00ff);
        z-index: 2000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
initializeScrollProgress();

// Add hover effects to project cards
function initializeProjectHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const techTags = card.querySelectorAll('.tech-tag');
            techTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.1)';
                    tag.style.boxShadow = '0 0 10px currentColor';
                }, index * 100);
            });
        });
        
        card.addEventListener('mouseleave', () => {
            const techTags = card.querySelectorAll('.tech-tag');
            techTags.forEach(tag => {
                tag.style.transform = 'scale(1)';
                tag.style.boxShadow = 'none';
            });
        });
    });
}

// Initialize project hover effects
setTimeout(initializeProjectHoverEffects, 1000);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'Escape':
            if (modal.style.display === 'block') {
                closeModal();
            }
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
            break;
        case 'Enter':
            if (e.target.classList.contains('category-btn')) {
                e.target.click();
            }
            break;
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);
// Console Easter Egg 2.0 🚀
const styles = [
  'color: #ff006e; font-size: 14px; font-weight: bold; font-family: monospace;',
  'color: #8338ec; font-size: 14px; font-weight: bold; font-family: monospace;',
  'color: #3a86ff; font-size: 14px; font-weight: bold; font-family: monospace;',
  'color: #00f5d4; font-size: 14px; font-weight: bold; font-family: monospace;',
  'color: #ffbe0b; font-size: 14px; font-weight: bold; font-family: monospace;'
];


// Paste this directly into the browser DevTools console (Cmd+Option+J on Mac)
(() => {
  const styles = [
    'color: #ff006e; font-size: 14px; font-weight: bold;',
    'color: #ffbe0b; font-size: 14px; font-weight: bold;',
    'color: #3a86ff; font-size: 14px; font-weight: bold;',
    'color: #8338ec; font-size: 14px; font-weight: bold;',
    'color: #06d6a0; font-size: 14px; font-weight: bold;',
    'color: #ef476f; font-size: 14px; font-weight: bold;',
  ];

  const banner = `%c


                                                         
🌌 Welcome to Jihan's Playground of Madness! 🌌       
👨‍💻 Full Stack Developer • IoT Wizard • AI Tamer 🤖   
⚡ Automation Maniac • Hardware Hacker • Coffee Junkie ☕
🚨 WHY THE F*** ARE YOU HERE STALKING?? 🚨       
💀 Go touch some grass OR hire me instead 💼         
`;

  console.log(banner, styles[0]);
  console.log(
    '%c👉 Psst... If you\'re still here, DM me & let\'s collab 🔥',
    'color: #ff006e; font-size: 16px; font-weight: bold; text-shadow: 1px 1px #000;'
  );
})();
