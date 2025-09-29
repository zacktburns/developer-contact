// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeContactForm();
    initializeAnimations();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class for styling
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};

            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Validate form
            if (validateForm(formObject)) {
                handleFormSubmission(formObject);
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });

            input.addEventListener('input', function() {
                clearFieldError(input);
            });
        });
    }
}

// Form validation
function validateForm(formData) {
    let isValid = true;

    // Required fields
    const requiredFields = ['name', 'email', 'category', 'message'];

    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!formData[field] || formData[field].trim() === '') {
            showFieldError(input, `${capitalizeFirst(field)} is required`);
            isValid = false;
        }
    });

    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
        showFieldError(document.getElementById('email'), 'Please enter a valid email address');
        isValid = false;
    }

    // Message length validation
    if (formData.message && formData.message.trim().length < 10) {
        showFieldError(document.getElementById('message'), 'Message must be at least 10 characters long');
        isValid = false;
    }

    return isValid;
}

function validateField(input) {
    const value = input.value.trim();

    if (input.hasAttribute('required') && !value) {
        showFieldError(input, `${capitalizeFirst(input.name)} is required`);
        return false;
    }

    if (input.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(input, 'Please enter a valid email address');
        return false;
    }

    if (input.name === 'message' && value.length > 0 && value.length < 10) {
        showFieldError(input, 'Message must be at least 10 characters long');
        return false;
    }

    clearFieldError(input);
    return true;
}

function showFieldError(input, message) {
    clearFieldError(input);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';

    input.style.borderColor = '#ef4444';
    input.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Handle form submission
function handleFormSubmission(formData) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Create mailto link (since this is a static site)
    const subject = `Contact Form: ${formData.category}`;
    const body = createEmailBody(formData);
    const mailtoLink = `mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Show success message
    showFormMessage('Thank you for your message! Your default email client should open with a pre-filled email. If it doesn\'t, please copy the information below and send it manually.', 'success');

    // Create a copyable version of the email
    createCopyableEmail(formData);

    // Reset form after a short delay
    setTimeout(() => {
        document.getElementById('contactForm').reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Open mailto link
        window.location.href = mailtoLink;
    }, 2000);
}

function createEmailBody(formData) {
    let body = `Name: ${formData.name}\n`;
    body += `Email: ${formData.email}\n`;
    body += `Category: ${formData.category}\n`;
    if (formData.app) {
        body += `Related App: ${formData.app}\n`;
    }
    body += `\nMessage:\n${formData.message}\n`;
    body += `\n---\nSent from developer contact page`;

    return body;
}

function createCopyableEmail(formData) {
    const emailContent = createEmailBody(formData);
    const copyContainer = document.createElement('div');
    copyContainer.className = 'copy-email-container';
    copyContainer.style.cssText = `
        margin-top: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    `;

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Email Content';
    copyButton.className = 'btn btn-secondary';
    copyButton.style.cssText = `
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    `;

    const emailPreview = document.createElement('pre');
    emailPreview.textContent = emailContent;
    emailPreview.style.cssText = `
        background: white;
        padding: 1rem;
        border-radius: 4px;
        font-size: 0.875rem;
        white-space: pre-wrap;
        margin: 0;
        border: 1px solid #e2e8f0;
    `;

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(emailContent).then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy Email Content';
            }, 2000);
        });
    });

    copyContainer.appendChild(copyButton);
    copyContainer.appendChild(emailPreview);

    const formContainer = document.querySelector('.contact-form-container');
    formContainer.appendChild(copyContainer);

    // Remove after 30 seconds
    setTimeout(() => {
        if (copyContainer.parentNode) {
            copyContainer.remove();
        }
    }, 30000);
}

function showFormMessage(message, type = 'success') {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;

    const baseStyles = `
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        font-weight: 500;
    `;

    if (type === 'success') {
        messageDiv.style.cssText = baseStyles + `
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        `;
    } else if (type === 'error') {
        messageDiv.style.cssText = baseStyles + `
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        `;
    }

    const form = document.getElementById('contactForm');
    form.appendChild(messageDiv);

    // Remove message after 10 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 10000);
}

// Scroll animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth scrolling and other scroll effects
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add scroll-to-top button
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    `;

    document.body.appendChild(scrollToTopButton);

    // Show/hide scroll-to-top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    });

    // Scroll to top functionality
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility functions
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

// Add loading state to external links
document.addEventListener('click', function(event) {
    const link = event.target.closest('a');
    if (link && link.target === '_blank') {
        const originalText = link.textContent;
        link.textContent = 'Opening...';
        setTimeout(() => {
            link.textContent = originalText;
        }, 1000);
    }
});

// Add copy functionality to email links
document.querySelectorAll('a[href^="mailto:"]').forEach(emailLink => {
    emailLink.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const email = this.href.replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
            const originalText = this.textContent;
            this.textContent = 'Email copied!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    });
});

// Console message for developers
console.log(`
🚀 Developer Contact Page
Built with vanilla HTML, CSS, and JavaScript
Feel free to customize this template for your needs!

For questions or feedback about this template:
- Check the GitHub repository
- Submit an issue or pull request
`);

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}