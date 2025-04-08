// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Create and add the theme transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    document.body.appendChild(overlay);
    
    // Add the theme change class to the body
    document.body.classList.add('theme-changing');
    
    // Change the theme after a short delay
    setTimeout(() => {
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Remove the overlay and theme-changing class after animation completes
        setTimeout(() => {
            overlay.remove();
            document.body.classList.remove('theme-changing');
        }, 800);
    }, 400);
});

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Header scroll behavior
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Sprawdzamy, czy jesteśmy na samej górze strony
    if (currentScroll <= 0) {
        header.classList.remove('scrolled');
    } else {
        header.classList.add('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scroll for navigation links
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

// Scroll indicator functionality
const scrollIndicator = document.querySelector('.hero-scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
    
    // Hide scroll indicator when user scrolls down
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.7';
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // If the element is the hero-stats, trigger the counter animation
            if (entry.target.classList.contains('hero-stats')) {
                animateCounters();
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature, .solution-item, .hero-text, .hero-stats, .contact-item, .footer-section').forEach(element => {
    observer.observe(element);
});

// Function to animate the statistics counters
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(statNumber => {
        // Get the target value from the text content (remove the '+' if present)
        const targetValue = parseInt(statNumber.textContent.replace('+', ''));
        const hasPlus = statNumber.textContent.includes('+');
        let currentValue = 0;
        const duration = 1000; // Animation duration in milliseconds (reduced from 2000)
        const steps = 30; // Number of steps in the animation (reduced from 60)
        const stepDuration = duration / steps;
        const increment = targetValue / steps;
        
        // Clear the text content to start with 0
        statNumber.textContent = '0';
        
        // Animate the counter
        const counterInterval = setInterval(() => {
            currentValue += increment;
            
            // If we've reached or exceeded the target, set to the target and clear the interval
            if (currentValue >= targetValue) {
                // First set the number without the plus
                statNumber.textContent = targetValue;
                
                // Then add the plus symbol after a short delay
                if (hasPlus) {
                    setTimeout(() => {
                        statNumber.textContent = targetValue + '+';
                    }, 100);
                }
                
                clearInterval(counterInterval);
            } else {
                // Otherwise, update with the current value (rounded to avoid decimals)
                statNumber.textContent = Math.floor(currentValue);
            }
        }, stepDuration);
    });
}

// Form validation and submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic form validation
        const formData = new FormData(contactForm);
        let isValid = true;
        
        for (let [key, value] of formData.entries()) {
            if (!value && key !== 'phone') {
                isValid = false;
                const input = contactForm.querySelector(`[name="${key}"]`);
                if (input) {
                    input.classList.add('error');
                }
            }
        }
        
        if (isValid) {
            // Get form values
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Create email subject and body
            const subject = `Wiadomość od ${name} - RumTrans`;
            const body = `Imię i nazwisko: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AWiadomość:%0D%0A${message}`;
            
            // Open default email client
            window.location.href = `mailto:cichy229@gmail.com?subject=${subject}&body=${body}`;
            
            // Reset form
            contactForm.reset();
            
            // Show toast notification
            showToast('Otwieranie klienta poczty...', 'fas fa-envelope');
        }
    });
    
    // Remove error class on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });
}

// Toast notification function
function showToast(message, icon = 'fas fa-info-circle') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Create toast content
    const toastContent = document.createElement('div');
    toastContent.className = 'toast-content';
    
    // Add icon
    const toastIcon = document.createElement('i');
    toastIcon.className = `toast-icon ${icon}`;
    toastContent.appendChild(toastIcon);
    
    // Add message
    const toastMessage = document.createElement('div');
    toastMessage.className = 'toast-message';
    toastMessage.textContent = message;
    toastContent.appendChild(toastMessage);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        toast.remove();
    });
    
    // Assemble toast
    toast.appendChild(toastContent);
    toast.appendChild(closeButton);
    toastContainer.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add hover effects to elements
document.querySelectorAll('.feature, .solution-item, .contact-item, .footer-links a, .social-links a').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-5px)';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
    });
}); 