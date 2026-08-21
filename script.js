// Elegant Gypsum Plastering - Interactive scripts

// 1. Preloader and GSAP Entrance Animations
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.visibility = 'hidden';
            
            // GSAP Animations
            if (typeof gsap !== 'undefined') {
                gsap.from(".hero-reveal", {
                    y: 40,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power4.out"
                });
                
                gsap.from(".hero-card-reveal", {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "back.out(1.7)",
                    delay: 0.2
                });
            }
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 2. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 850,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // 3. Theme Switcher System
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        updateThemeIcon(true);
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        updateThemeIcon(false);
    }

    window.toggleTheme = () => {
        const isDark = document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme', !isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    };

    function updateThemeIcon(isDark) {
        const icons = document.querySelectorAll('.theme-icon');
        icons.forEach(icon => {
            if (isDark) {
                icon.classList.remove('bi-moon-stars');
                icon.classList.add('bi-sun');
            } else {
                icon.classList.remove('bi-sun');
                icon.classList.add('bi-moon-stars');
            }
        });
    }

    // 4. Page Scroll Progress Indicator
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // 5. Sticky Navbar Scroll Effect
    const navbar = document.querySelector('.sticky-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // 6. Before/After Image Comparison Slider
    const beforeAfterContainer = document.querySelector('.before-after-container');
    if (beforeAfterContainer) {
        const afterImg = beforeAfterContainer.querySelector('.after-image');
        const handle = beforeAfterContainer.querySelector('.slider-handle');

        const moveSlider = (e) => {
            const rect = beforeAfterContainer.getBoundingClientRect();
            let x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
            
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;

            const percent = (x / rect.width) * 100;
            afterImg.style.width = percent + '%';
            handle.style.left = percent + '%';
        };

        let isDragging = false;
        const startDragging = () => isDragging = true;
        const stopDragging = () => isDragging = false;

        handle.addEventListener('mousedown', startDragging);
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e);
        });

        // Touch event bindings for mobile compatibility
        handle.addEventListener('touchstart', startDragging);
        window.addEventListener('touchend', stopDragging);
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveSlider(e);
        });
    }

    // 7. Statistics Counters (Trigger on Enter Viewport)
    const counters = document.querySelectorAll('.counter-val');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.getAttribute('data-target'));
                    let count = 0;
                    const duration = 1000;
                    const increment = countTo / (duration / 16);
                    
                    const updateCount = () => {
                        count += increment;
                        if (count < countTo) {
                            target.innerText = Math.floor(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            target.innerText = countTo + '+';
                        }
                    };
                    updateCount();
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // 8. Testimonials Swiper Slider
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonials-swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    // 9. Pricing Calculator logic
    window.calculateQuote = () => {
        const areaInput = document.getElementById('calcAreaInput');
        const serviceSelect = document.getElementById('calcServiceSelect');
        const totalDisplay = document.getElementById('calcTotalEstimate');
        const rateDisplay = document.getElementById('calcRateDisplay');
        const savingsDisplay = document.getElementById('calcSavingsDisplay');
        const areaDisplay = document.getElementById('calcAreaDisplay');

        if (!areaInput || !serviceSelect || !totalDisplay) return;

        const area = parseFloat(areaInput.value) || 0;
        const rate = parseFloat(serviceSelect.value) || 42;
        const total = Math.round(area * rate);
        
        // Traditional Sand Cement Plaster + Putty (~ ₹60 / sq.ft)
        const traditionalTotal = Math.round(area * 60);
        const savings = Math.max(0, traditionalTotal - total);

        if(areaDisplay) areaDisplay.innerText = 'for ' + area.toLocaleString('en-IN') + ' sq.ft surface area';
        if(rateDisplay) rateDisplay.innerText = '₹' + rate + ' / sq.ft';
        if(totalDisplay) totalDisplay.innerText = '₹' + total.toLocaleString('en-IN');
        if(savingsDisplay) savingsDisplay.innerText = '₹' + savings.toLocaleString('en-IN');
    };

    window.setArea = (val) => {
        const areaInput = document.getElementById('calcAreaInput');
        if (areaInput) {
            areaInput.value = val;
            window.calculateQuote();
        }
    };

    window.lockQuote = () => {
        const areaInput = document.getElementById('calcAreaInput');
        const serviceSelect = document.getElementById('calcServiceSelect');
        const totalDisplay = document.getElementById('calcTotalEstimate');
        const messageBox = document.getElementById('message');
        const contactSection = document.getElementById('contact');

        if (messageBox && areaInput && serviceSelect && totalDisplay) {
            const selectedText = serviceSelect.options[serviceSelect.selectedIndex].text;
            const quoteSummary = `Hi Elegant Gypsum Plastering,\nI generated an estimated quote on your website:\n- Package: ${selectedText}\n- Surface Area: ${areaInput.value} sq.ft\n- Estimated Amount: ${totalDisplay.innerText}\nPlease arrange a free site inspection.`;
            messageBox.value = quoteSummary;
        }

        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 10. Form Submission Interceptor
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedback = document.getElementById('formFeedback');
            if (feedback) {
                feedback.textContent = 'Thank you! Your inquiry has been submitted successfully. We will call you shortly to arrange a free site inspection. For urgent inquiries, call Owner Fasith M directly at +91 95007 50672 or +91 93857 20672.';
                feedback.classList.remove('d-none');
                feedback.classList.add('alert-success');
            }
            this.reset();
        });
    }

    // Initialize calculations
    window.calculateQuote();

    // 11. Dynamic Floating Widgets (Primary WhatsApp and Phone dials)
    const floatingPhone = document.createElement('a');
    floatingPhone.href = "tel:+919500750672";
    floatingPhone.className = "floating-phone";
    floatingPhone.innerHTML = '<i class="bi bi-telephone-fill"></i>';
    document.body.appendChild(floatingPhone);

    const floatingWA = document.createElement('a');
    floatingWA.href = "https://wa.me/919500750672";
    floatingWA.target = "_blank";
    floatingWA.className = "floating-whatsapp";
    floatingWA.innerHTML = '<i class="bi bi-whatsapp"></i>';
    document.body.appendChild(floatingWA);
});