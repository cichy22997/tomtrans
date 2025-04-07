// Theme switcher functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.setAttribute('data-theme', 'dark');
            updateIcon('dark');
        } else {
            html.setAttribute('data-theme', 'light');
            updateIcon('light');
        }
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });
    
    // Update icon based on theme
    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            updateIcon(newTheme);
        }
    });
    
    // Header scroll behavior
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');
    
    // Open mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
    
    // Close mobile menu
    mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close mobile menu when clicking on a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            e.target !== mobileMenuBtn) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - header.offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 