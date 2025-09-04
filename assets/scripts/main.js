/**
 * Main JavaScript file for Alan Joga+ Website
 * Handles navigation, animations, YouTube integration, and interactive effects
 * 
 * Desenvolvido por André "Tutankhamal" Borba
 */

// Global variables
let isNavOpen = false;
let metricsAnimated = false;
let observerInitialized = false;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeGlitchEffects();
    initializeMetricsAnimation();
    initializeYouTubeIntegration();
    initializeSmoothScrolling();
    initializeIntersectionObserver();
    displayChannelAge();
});

/**
 * Navigation Functions
 */
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu) return;
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        toggleMobileMenu();
    });
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isNavOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isNavOpen) {
            closeMobileMenu();
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        }
    });
}

function toggleMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    isNavOpen = !isNavOpen;
    
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Update ARIA attributes for accessibility
    navToggle.setAttribute('aria-expanded', isNavOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isNavOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    isNavOpen = false;
    
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    
    document.body.style.overflow = '';
}

/**
 * Glitch Effects
 */
function initializeGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        // Set data-text attribute for pseudo-elements
        element.setAttribute('data-text', element.textContent);
        
        // Add random glitch intervals
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                triggerGlitch(element);
            }
        }, 3000);
    });
    
    // Logo glitch effect on hover
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo) {
        heroLogo.addEventListener('mouseenter', function() {
            this.style.filter = 'hue-rotate(180deg) saturate(2)';
            setTimeout(() => {
                this.style.filter = 'drop-shadow(0 0 50px rgba(118, 231, 255, 0.8))';
            }, 150);
        });
        
        heroLogo.addEventListener('mouseleave', function() {
            this.style.filter = 'drop-shadow(0 0 30px rgba(118, 231, 255, 0.3))';
        });
    }
}

function triggerGlitch(element) {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'glitch-text 0.3s ease-in-out';
}

/**
 * Metrics Animation
 */
function initializeMetricsAnimation() {
    // Selecionar apenas elementos com data-target (excluindo o elemento de idade do canal)
    const metricNumbers = document.querySelectorAll('.metric-number[data-target]');
    
    function animateMetrics() {
        if (metricsAnimated) return;
        
        metricNumbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format number based on size
                if (target >= 1000) {
                    if (target >= 1000000) {
                        number.textContent = (current / 1000000).toFixed(1) + 'M';
                    } else {
                        number.textContent = (current / 1000).toFixed(1) + 'k';
                    }
                } else {
                    number.textContent = Math.floor(current) + (target >= 210 ? '+' : '');
                }
            }, 16);
        });
        
        metricsAnimated = true;
    }
    
    // Trigger animation when metrics section is visible
    const metricsSection = document.querySelector('.metrics-section');
    if (metricsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateMetrics();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(metricsSection);
    }
}

/**
 * Calculate Channel Age
 */
function displayChannelAge() {
    // Buscar os elementos
    const ageElement = document.getElementById('channel-age-display');
    const labelElement = ageElement ? ageElement.parentElement.querySelector('.metric-label') : null;
    
    if (!ageElement || !labelElement) {
        // Only log error if we're on the index page
        if (document.getElementById('indexvideo-feed')) {
            console.error('Elementos de idade do canal não encontrados');
        }
        return;
    }
    
    // Data de criação: 31 de agosto de 2021
    const creationYear = 2021;
    const creationMonth = 8; // Agosto
    const creationDay = 31;
    
    // Data atual
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() retorna 0-11
    const currentDay = now.getDate();
    
    // Calcular diferença simples
    let yearsDiff = currentYear - creationYear;
    let monthsDiff = currentMonth - creationMonth;
    let daysDiff = currentDay - creationDay;
    
    // Ajustar se o dia atual é menor que o dia de criação
    if (daysDiff < 0) {
        monthsDiff = monthsDiff - 1;
        // Pegar o último dia do mês anterior
        const lastMonth = new Date(currentYear, currentMonth - 1, 0);
        daysDiff = daysDiff + lastMonth.getDate();
    }
    
    // Ajustar se o mês atual é menor que o mês de criação
    if (monthsDiff < 0) {
        yearsDiff = yearsDiff - 1;
        monthsDiff = monthsDiff + 12;
    }
    
    // Garantir valores não negativos
    const finalYears = Math.max(0, yearsDiff);
    const finalMonths = Math.max(0, monthsDiff);
    const finalDays = Math.max(0, daysDiff);
    
    // Valor principal: apenas anos
    const mainText = finalYears + (finalYears === 1 ? ' ano' : ' anos');
    
    // Detalhes completos na descrição
    const detailText = finalYears + 'A ' + finalMonths + 'M ' + finalDays + 'D';
    
    // Definir os textos nos elementos
    ageElement.textContent = mainText;
    labelElement.textContent = detailText;
    
    console.log('Idade do canal calculada:', mainText, '(' + detailText + ')');
}

/**
 * YouTube Integration
 */
function initializeYouTubeIntegration() {
    const container = document.getElementById('indexvideo-feed');
    
    // Only run if we're on the index page and the container exists
    if (!container) {
        return;
    }
    
    const feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCrejM1xjPRDHwusX6ILS4Wg';
    
    fetch(feedUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.items || !Array.isArray(data.items)) {
                showVideoError(container, 'Não foi possível carregar os vídeos.');
                return;
            }
            
            // Filter horizontal videos (without #shorts in title)
            const horizontalVideos = data.items.filter(item => 
                !item.title.toLowerCase().includes('#shorts') &&
                !item.title.toLowerCase().includes('short')
            ).slice(0, 3);
            
            if (horizontalVideos.length === 0) {
                showVideoError(container, 'Nenhum vídeo disponível no formato horizontal.');
                return;
            }
            
            // Clear loading spinner
            container.innerHTML = '';
            
            horizontalVideos.forEach((item, index) => {
                const match = item.link.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
                const videoId = match ? match[1] : null;
                
                if (!videoId) return;
                
                const videoEl = document.createElement('div');
                videoEl.className = 'indexvideo-item';
                videoEl.style.animationDelay = `${index * 0.2}s`;
                
                // Create lite-youtube element
                videoEl.innerHTML = `
                    <lite-youtube 
                        videoid="${videoId}" 
                        playlabel="${item.title.replace(/"/g, "'")}">
                    </lite-youtube>
                    <div class="indexvideo-title-text">${item.title}</div>
                `;
                
                container.appendChild(videoEl);
                
                // Add entrance animation
                setTimeout(() => {
                    videoEl.style.opacity = '1';
                    videoEl.style.transform = 'translateY(0)';
                }, index * 200);
            });
            
        })
        .catch(error => {
            console.error('Erro ao carregar o feed:', error);
            const container = document.getElementById('indexvideo-feed');
            showVideoError(container, 'Erro ao carregar os vídeos. Tente novamente mais tarde.');
        });
}

function showVideoError(container, message) {
    if (!container) {
        console.error('Container não encontrado para exibir erro:', message);
        return;
    }
    
    container.innerHTML = `
        <div class="video-error">
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <p>${message}</p>
            <button onclick="initializeYouTubeIntegration()" class="retry-button">
                <i class="fas fa-redo" aria-hidden="true"></i>
                Tentar novamente
            </button>
        </div>
    `;
}

/**
 * Smooth Scrolling
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(href);
            }
        });
    });
}

function updateActiveNavLink(href) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

/**
 * Intersection Observer for animations
 */
function initializeIntersectionObserver() {
    if (observerInitialized) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.metric-card, .indexvideo-item, .cta-button');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    observerInitialized = true;
}

/**
 * Performance optimizations
 */

// Debounce function for resize events
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

// Optimized resize handler
const optimizedResize = debounce(() => {
    if (window.innerWidth > 768 && isNavOpen) {
        closeMobileMenu();
    }
}, 250);

window.addEventListener('resize', optimizedResize);

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
if (document.querySelectorAll('img[data-src]').length > 0) {
    initializeLazyLoading();
}

/**
 * Error handling and fallbacks
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Fallback for critical functionality
    if (e.error && e.error.message.includes('IntersectionObserver')) {
        // Fallback for browsers without IntersectionObserver
        metricsAnimated = false;
        setTimeout(() => {
            const metricsSection = document.querySelector('.metrics-section');
            if (metricsSection && isElementInViewport(metricsSection)) {
                initializeMetricsAnimation();
            }
        }, 1000);
    }
});

// Utility function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Accessibility enhancements
 */

// Keyboard navigation for custom elements
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && isNavOpen) {
        closeMobileMenu();
    }
    
    // Enter key on developer name
    if (e.key === 'Enter' && e.target.classList.contains('developer-name')) {
        e.target.click();
    }
});

// Focus management for mobile menu
function manageFocus() {
    const navMenu = document.querySelector('.nav-menu');
    const firstLink = navMenu.querySelector('.nav-link');
    const lastLink = navMenu.querySelector('.nav-link:last-child');
    
    if (isNavOpen && firstLink) {
        firstLink.focus();
    }
}

// Add CSS for entrance animations
const style = document.createElement('style');
style.textContent = `
    .indexvideo-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .video-error {
        text-align: center;
        padding: 2rem;
        color: #cccccc;
    }
    
    .video-error i {
        font-size: 2rem;
        color: #ff6b6b;
        margin-bottom: 1rem;
    }
    
    .retry-button {
        background: rgba(118, 231, 255, 0.1);
        border: 2px solid #00ffff;
        color: #00ffff;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        margin-top: 1rem;
        transition: all 0.3s ease;
    }
    
    .retry-button:hover {
        background: rgba(118, 231, 255, 0.2);
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);

/**
 * Initialize Back to Top Button
 */
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    const footer = document.querySelector('.footer');
    
    if (!backToTopButton) return;
    
    // Calculate and set button position above footer
    function updateButtonPosition() {
        if (footer) {
            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const footerTop = footerRect.top + window.pageYOffset;
            const currentScrollY = window.pageYOffset;
            const viewportBottom = currentScrollY + windowHeight;
            
            // If footer is visible in viewport, position button above it
            if (footerTop < viewportBottom) {
                const distanceFromBottom = Math.max(30, windowHeight - footerRect.top + 30);
                backToTopButton.style.bottom = distanceFromBottom + 'px';
            } else {
                // Default position when footer is not visible
                backToTopButton.style.bottom = '120px';
            }
        }
    }
    
    // Show/hide button based on scroll position
    function toggleBackToTopButton() {
        updateButtonPosition();
        
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
    
    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', debounce(toggleBackToTopButton, 100));
    backToTopButton.addEventListener('click', scrollToTop);
    
    // Keyboard accessibility
    backToTopButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    });
}

// Initialize back to top button
initializeBackToTop();

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeGlitchEffects,
        initializeMetricsAnimation,
        initializeYouTubeIntegration,
        toggleMobileMenu,
        closeMobileMenu
    };
}