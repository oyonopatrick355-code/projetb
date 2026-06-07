document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Dark/Light Theme Selector Logic
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Load saved theme or default to system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlElement.setAttribute('data-theme', userPrefersDark ? 'dark' : 'light');
    }

    // Toggle theme button listener
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add a temporary transition class to prevent layout flashes
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Clean up transition inline style after some time
        setTimeout(() => {
            document.body.style.transition = '';
        }, 550);
    });

    // 3. Mobile Navigation Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Set active nav-link styling
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 4. Sticky Header on Scroll
    const header = document.querySelector('.navbar-container');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger immediately in case page loads scrolled

    // 5. Scroll Appearance Animations (Intersection Observer)
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Once it appeared, we can stop observing it
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in-up').forEach(element => {
        animateOnScroll.observe(element);
    });

    // 6. Statistics Counter Animation
    const statsSection = document.querySelector('.hero-stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 1500; // ms
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;
            
            const timer = setInterval(() => {
                current += 1;
                counter.textContent = current;
                if (current >= target) {
                    counter.textContent = target + (counter.parentElement.textContent.includes('Satisfaction') ? '%' : '+');
                    if (counter.parentElement.textContent.includes('Attente')) {
                        counter.textContent = target; // keep raw number for waiting minutes
                    }
                    clearInterval(timer);
                }
            }, stepTime);
        });
    };

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // 7. Services Categories Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state of filter button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add appearance effect when switching tabs
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });

    // 8. Interactive Step-by-Step Booking Form
    const appointmentForm = document.getElementById('appointmentForm');
    const formSteps = document.querySelectorAll('.form-step');
    const stepNavItems = document.querySelectorAll('.step-nav-item');
    const progressBar = document.getElementById('progressBar');
    const bookingSuccess = document.getElementById('bookingSuccess');
    
    let currentStep = 1;

    // Validate a specific step's input fields
    const validateStep = (step) => {
        let isValid = true;
        const activeStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = activeStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group') || input.parentElement;
            
            if (!input.value.trim()) {
                isValid = false;
                formGroup.classList.add('has-error');
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                formGroup.classList.add('has-error');
            } else if (input.type === 'tel' && !validatePhone(input.value)) {
                isValid = false;
                formGroup.classList.add('has-error');
            } else {
                formGroup.classList.remove('has-error');
            }

            // Remove error formatting on typing/input modification
            input.addEventListener('input', () => {
                formGroup.classList.remove('has-error');
            });
        });

        return isValid;
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone) => {
        // Basic digits check
        const cleaned = phone.replace(/[\s\-\+\.]/g, '');
        return cleaned.length >= 8;
    };

    // Go to next step logic
    const navigateToStep = (step) => {
        formSteps.forEach(s => s.classList.remove('step-active'));
        stepNavItems.forEach(item => item.classList.remove('active'));

        const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (targetStep) {
            targetStep.classList.add('step-active');
        }

        // Highlight step numbers in sidebar up to current step
        stepNavItems.forEach(item => {
            const itemStep = parseInt(item.getAttribute('data-step'), 10);
            if (itemStep <= step) {
                item.classList.add('active');
            }
        });

        // Update progress bar width
        const totalSteps = formSteps.length;
        const progressPercentage = ((step) / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        currentStep = step;
    };

    // Next step CTA listener
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                navigateToStep(currentStep + 1);
            }
        });
    });

    // Prev step CTA listener
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateToStep(currentStep - 1);
        });
    });

    // Form Submit handling (Mock backend call)
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateStep(3)) {
            // Gather all details for receipt summary screen
            const specialty = appointmentForm.querySelector('input[name="specialty"]:checked').value;
            const doctor = document.getElementById('doctorSelect').value;
            const dateVal = document.getElementById('bookingDate').value;
            const timeVal = document.getElementById('bookingTime').value;
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;

            // Formatted date string
            const formattedDate = new Date(dateVal).toLocaleDateString('fr-FR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            // Write receipts
            document.getElementById('receiptSpecialty').textContent = specialty;
            document.getElementById('receiptDoctor').textContent = doctor;
            document.getElementById('receiptDateTime').textContent = `${formattedDate} à ${timeVal}`;
            document.getElementById('receiptPatientName').textContent = `${firstName} ${lastName.toUpperCase()}`;

            // Add sending indicator transition
            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="online-indicator" style="position:static;display:inline-block;margin-right:8px;"></span> Traitement...';

            setTimeout(() => {
                // Transition views
                appointmentForm.style.display = 'none';
                progressBar.style.width = '100%';
                bookingSuccess.classList.add('active');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1200);
        }
    });

    // Reset appointment booking loop
    document.getElementById('btnResetBooking').addEventListener('click', () => {
        appointmentForm.reset();
        appointmentForm.style.display = 'block';
        bookingSuccess.classList.remove('active');
        navigateToStep(1);
    });

    // 9. Testimonials Carousel / Slider
    const testimonialSlider = document.getElementById('testimonialSlider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    let autoRotateInterval;

    const updateSlider = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Compute circular bounds index safely
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');

        // Dots update
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        updateSlider(currentSlide + 1);
    };

    const prevSlide = () => {
        updateSlider(currentSlide - 1);
    };

    // Events listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoRotation();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoRotation();
    });

    // Dot navigation listeners
    dotsContainer.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'), 10);
            updateSlider(index);
            resetAutoRotation();
        });
    });

    // Auto rotate loops setup
    const startAutoRotation = () => {
        autoRotateInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoRotation = () => {
        clearInterval(autoRotateInterval);
        startAutoRotation();
    };

    // Start auto rotations on load
    startAutoRotation();

    // Pause auto-rotation when user mouse hover the slider area
    testimonialSlider.addEventListener('mouseenter', () => clearInterval(autoRotateInterval));
    testimonialSlider.addEventListener('mouseleave', startAutoRotation);


    // 10. FAQ Accordion Panels with dynamic height transition
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all active faq items first (accordion single mode)
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-content').style.maxHeight = null;
                otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            });

            // If it wasn't active, expand it
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 11. Mock Form Submissions (Contact & Newsletter)
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const requiredInputs = contactForm.querySelectorAll('input[required], textarea[required]');
        
        requiredInputs.forEach(input => {
            const group = input.parentElement;
            if (!input.value.trim()) {
                isValid = false;
                group.classList.add('has-error');
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                group.classList.add('has-error');
            } else {
                group.classList.remove('has-error');
            }

            input.addEventListener('input', () => group.classList.remove('has-error'));
        });

        if (isValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Envoi en cours...';

            setTimeout(() => {
                contactForm.reset();
                contactSuccess.classList.add('active');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    contactSuccess.classList.remove('active');
                }, 5000);
            }, 1000);
        }
    });

    // Newsletter footer form mock
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        
        if (input.value && validateEmail(input.value)) {
            newsletterSuccess.classList.add('active');
            input.value = '';
            
            setTimeout(() => {
                newsletterSuccess.classList.remove('active');
            }, 4000);
        }
    });
});
