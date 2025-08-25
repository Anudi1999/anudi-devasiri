// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Navbar background change on scroll
    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (window.pageYOffset > 50) {
            navbar.classList.add('bg-dark');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-dark');
            navbar.classList.add('bg-transparent');
        }
    }

    // Portfolio filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Animate progress bars when in view
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                    bar.classList.add('animated');
                }, 100);
            }
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';

            // Send form data to PHP script
            fetch('debug-contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                if (data.success) {
                    showNotification(data.message, 'success');
                    contactForm.reset();
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Sorry, there was an error sending your message. Please try again later.', 'error');
            })
            .finally(() => {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
            });
        });
    }

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} notification`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Dynamic title and description cycling
    const titles = [
        'Front-End Developer',
        'UI Designer',
        'SEO Content Developer',
        'Digital Marketing Assistant',
        'Freelancing'
    ];
    
    const descriptions = [
        'Passionate about creating beautiful, responsive, and user-friendly web experiences with modern front-end technologies.',
        'Dedicated to crafting intuitive and visually appealing user interfaces that enhance user experience and engagement.',
        'Focused on creating SEO-optimized content and web experiences that drive traffic and improve search rankings.',
        'Experienced in digital marketing strategies and campaigns that boost online presence and engagement.',
        'Skilled in providing freelance services with flexible solutions and personalized client experiences.'
    ];
    
    let currentIndex = 0;
    const dynamicTitle = document.getElementById('dynamic-title');
    const dynamicDescription = document.getElementById('dynamic-description');
    
    function cycleContent() {
        if (dynamicTitle && dynamicDescription) {
            // Fade out both elements
            dynamicTitle.style.opacity = '0';
            dynamicTitle.style.transform = 'translateY(-10px)';
            dynamicDescription.style.opacity = '0';
            dynamicDescription.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                // Change text
                dynamicTitle.textContent = titles[currentIndex];
                dynamicDescription.textContent = descriptions[currentIndex];
                
                // Fade in both elements
                dynamicTitle.style.opacity = '1';
                dynamicTitle.style.transform = 'translateY(0)';
                dynamicDescription.style.opacity = '1';
                dynamicDescription.style.transform = 'translateY(0)';
                
                // Move to next content
                currentIndex = (currentIndex + 1) % titles.length;
            }, 300);
        }
    }
    
    // Start cycling content after initial delay
    setTimeout(() => {
        cycleContent();
        // Cycle every 3 seconds
        setInterval(cycleContent, 3000);
    }, 2000);
    
    // Add CSS for smooth transitions
    const titleTransitionStyle = document.createElement('style');
    titleTransitionStyle.textContent = `
        #dynamic-title, #dynamic-description {
            transition: all 0.3s ease;
            min-height: 2rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        
        #dynamic-description {
            min-height: 3rem;
        }
    `;
    document.head.appendChild(titleTransitionStyle);

    // Typing effect for hero section
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Initialize typing effect when page loads
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }

    // Parallax effect for hero section
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.timeline-content, .portfolio-card, .skill-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Add animation CSS
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .timeline-content, .portfolio-card, .skill-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .timeline-content.animate-in, .portfolio-card.animate-in, .skill-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(animationStyle);

    // Event listeners
    window.addEventListener('scroll', function() {
        updateActiveNavLink();
        updateNavbar();
        animateProgressBars();
        parallaxEffect();
    });

    // Initialize functions
    updateActiveNavLink();
    updateNavbar();
    animateProgressBars();

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Add loading CSS
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadingStyle);

    // Portfolio item click handlers
    const portfolioLinks = document.querySelectorAll('.portfolio-links a');
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('i').classList.contains('fa-eye') ? 'view' : 'visit';
            const projectName = this.closest('.portfolio-card').querySelector('h5').textContent;
            
            if (action === 'view') {
                showNotification(`Opening ${projectName} preview...`, 'info');
            } else {
                showNotification(`Redirecting to ${projectName}...`, 'info');
            }
        });
    });

    // Social media links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').classList[1].split('-')[1];
            showNotification(`Opening ${platform} profile...`, 'info');
        });
    });

    // Download resume button
    const downloadBtn = document.querySelector('a[href="#"]');
    if (downloadBtn && downloadBtn.textContent.includes('Download')) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Resume download started...', 'success');
        });
    }

    console.log('Portfolio website loaded successfully! 🚀');
}); 