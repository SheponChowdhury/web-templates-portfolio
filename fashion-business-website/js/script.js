document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Sticky Navigation & Transparent Header Logic --- */
    const header = document.getElementById('main-header');
    const isTransparentNav = header.classList.contains('transparent-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if (isTransparentNav) {
                header.classList.remove('transparent-nav');
                header.classList.add('solid-nav');
            }
        } else {
            header.classList.remove('scrolled');
            if (isTransparentNav) {
                header.classList.remove('solid-nav');
                header.classList.add('transparent-nav');
            }
        }
    });

    /* --- 2. Mobile Menu Toggle --- */
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            if (navMenu.classList.contains('active') && isTransparentNav && window.scrollY <= 50) {
                header.style.backgroundColor = 'var(--secondary-color)';
            } else if (!navMenu.classList.contains('active') && isTransparentNav && window.scrollY <= 50) {
                header.style.backgroundColor = 'transparent';
            }
        });
    }

    /* --- 3. Fade-In Animations on Scroll --- */
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.1, rootMargin: "0px" });
    
    fadeElements.forEach(el => fadeObserver.observe(el));

    /* --- 4. Testimonial Slider (Home Page) --- */
    const track = document.getElementById('testimonial-track');
    if (track) {
        const slides = Array.from(track.children);
        let currentIndex = 0;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            const displacement = -currentIndex * 100;
            track.style.transform = `translateX(${displacement}%)`;
        }, 5000);
    }

    /* --- 5. Portfolio Filtering --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    item.style.transition = "all 0.4s ease";
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => { item.style.display = 'none'; }, 400);
                    }
                });
            });
        });
    }

    /* --- 6. FAQ Accordion --- */
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                accordionItems.forEach(acc => {
                    acc.classList.remove('active');
                    acc.querySelector('.accordion-content').style.maxHeight = null;
                });
                if (!isActive) {
                    item.classList.add('active');
                    const content = item.querySelector('.accordion-content');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });
    }

    /* --- 7. Contact Form Validation --- */
    const contactForm = document.getElementById('contact-form-main');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            const inputs = [
                { id: 'name', type: 'text' },
                { id: 'email', type: 'email' },
                { id: 'subject', type: 'text' },
                { id: 'message', type: 'textarea' }
            ];

            inputs.forEach(input => {
                const el = document.getElementById(input.id);
                const err = document.getElementById(`${input.id}-error`);
                
                if (input.type === 'email') {
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!regex.test(el.value.trim())) {
                        err.style.display = 'block';
                        isValid = false;
                    } else err.style.display = 'none';
                } else {
                    if (el.value.trim() === '') {
                        err.style.display = 'block';
                        isValid = false;
                    } else err.style.display = 'none';
                }
            });

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = "Sending...";
                submitBtn.disabled = true;

                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    const success = document.getElementById('form-success');
                    success.style.display = 'block';
                    setTimeout(() => success.style.display = 'none', 5000);
                }, 1500);
            }
        });
    }

    /* --- 8. Shop Page Filtering & Sorting --- */
    const shopProducts = document.querySelectorAll('.shop-main .product-card');
    if (shopProducts.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = urlParams.get('category');
        const urlMin = urlParams.get('min');
        const urlMax = urlParams.get('max');
        const urlSort = urlParams.get('sort');

        let productsArray = Array.from(shopProducts);

        // Apply filters
        productsArray.forEach(product => {
            const category = product.getAttribute('data-category');
            const price = parseFloat(product.getAttribute('data-price'));
            
            let show = true;
            if (urlCategory && urlCategory !== 'all' && category !== urlCategory) {
                show = false;
            }
            if (urlMin && price < parseFloat(urlMin)) {
                show = false;
            }
            if (urlMax && price > parseFloat(urlMax)) {
                show = false;
            }
            
            if (!show) {
                product.style.display = 'none';
            }
        });

        // Apply sorting
        if (urlSort) {
            const productsGrid = document.querySelector('.shop-main .grid-3');
            // Hide the non-visible products to sorting array, but actually flex/grid handles DOM order.
            // But we must move the elements within `.grid-3`
            let sortedProducts = Array.from(document.querySelectorAll('.shop-main .product-card'));
            
            if (urlSort === 'popularity') {
                sortedProducts.sort((a, b) => parseFloat(b.getAttribute('data-popularity')) - parseFloat(a.getAttribute('data-popularity')));
            } else if (urlSort === 'newness') {
                sortedProducts.sort((a, b) => parseFloat(b.getAttribute('data-newness')) - parseFloat(a.getAttribute('data-newness')));
            } else if (urlSort === 'price_low') {
                sortedProducts.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
            } else if (urlSort === 'price_high') {
                sortedProducts.sort((a, b) => parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price')));
            }
            
            // Re-append sorted elements mapping to end, but their display:none property is still preserved
            sortedProducts.forEach(p => productsGrid.appendChild(p));

            // Select the dropdown
            const sortSelect = document.getElementById('sort-select');
            if (sortSelect) {
                Array.from(sortSelect.options).forEach(opt => {
                    if (opt.value.includes('sort=' + urlSort)) {
                        opt.selected = true;
                    }
                });
            }
        }

        // Highlight active filter in sidebar
        if (urlCategory) {
            document.querySelectorAll('.shop-sidebar .filter-group:nth-child(1) a').forEach(a => {
                if (a.href.includes('category=' + urlCategory)) {
                    a.style.fontWeight = 'bold';
                    a.style.color = '#333'; // Make it pop visually
                    a.classList.add('active'); // General standard active class
                }
            });
        }
        if (urlMin || urlMax) {
            document.querySelectorAll('.shop-sidebar .filter-group:nth-child(2) a').forEach(a => {
                let checkStr = '';
                if (urlMin) checkStr += 'min=' + urlMin;
                if (urlMax) checkStr += (checkStr ? '&' : '') + 'max=' + urlMax;
                if (a.href.includes(checkStr)) {
                    a.style.fontWeight = 'bold';
                    a.style.color = '#333';
                    a.classList.add('active');
                }
            });
        }

        // Update counts
        const visibleCount = Array.from(shopProducts).filter(p => p.style.display !== 'none').length;
        const countDisplay = document.getElementById('shop-result-count');
        if (countDisplay) {
            countDisplay.innerText = `Showing ${visibleCount} results`;
        }
    }

    /* --- 9. Blog Page Filtering --- */
    const blogPosts = document.querySelectorAll('.blog-main .blog-card');
    if (blogPosts.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = urlParams.get('category');
        const urlSearch = urlParams.get('search');
        const urlPost = urlParams.get('post');

        if (urlPost) {
            // For a Single Post view demonstration, we can hide all other posts
            blogPosts.forEach(post => {
                const readMore = post.querySelector('a.btn');
                if (readMore && !readMore.href.includes('post=' + urlPost)) {
                    post.style.display = 'none';
                } else {
                    // Hide the read more button as we're "on" the page
                    if(readMore) readMore.style.display = 'none';
                }
            });
            // Update the title to read "Viewing Post"
            const pageTitle = document.querySelector('.page-header h1');
            if (pageTitle) pageTitle.innerText = "Editorial Feature";
        } else {
            // Category or Search filter
            blogPosts.forEach(post => {
                const category = post.getAttribute('data-category');
                const titleElement = post.querySelector('.blog-title');
                const title = titleElement ? titleElement.innerText.toLowerCase() : '';
                const contentElement = post.querySelector('p');
                const contentText = contentElement ? contentElement.innerText.toLowerCase() : '';
                
                let show = true;
                if (urlCategory && category !== urlCategory) {
                    show = false;
                }
                if (urlSearch && !title.includes(urlSearch.toLowerCase()) && !contentText.includes(urlSearch.toLowerCase())) {
                    show = false;
                }
                if (!show) {
                    post.style.display = 'none';
                }
            });

            // Update title 
            const pageTitle = document.querySelector('.page-header h1');
            if (urlSearch && pageTitle) {
                pageTitle.innerText = `Search: "${urlSearch}"`;
            } else if (urlCategory && pageTitle) {
                pageTitle.innerText = `Category: ${urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)}`;
            }

            // Highlight category
            if (urlCategory) {
                document.querySelectorAll('.blog-sidebar .filter-group a').forEach(a => {
                    if (a.href.includes('category=' + urlCategory)) {
                        a.style.fontWeight = 'bold';
                        a.style.color = '#333';
                    }
                });
            }
        }
    }

    /* --- 10. Theme Customizer --- */
    const customizerHTML = `
        <div class="theme-customizer" id="theme-customizer">
            <div class="customizer-toggle" id="customizer-toggle">
                <i class="fa-solid fa-gear"></i>
            </div>
            <h3>Theme Settings</h3>
            
            <div class="customizer-section">
                <h4>Accent Color</h4>
                <div class="color-options" id="color-options">
                    <div class="color-btn" style="background-color: #C9A227;" data-color="#C9A227"></div>
                    <div class="color-btn" style="background-color: #e74c3c;" data-color="#e74c3c"></div>
                    <div class="color-btn" style="background-color: #27ae60;" data-color="#27ae60"></div>
                    <div class="color-btn" style="background-color: #2980b9;" data-color="#2980b9"></div>
                    <div class="color-btn" style="background-color: #8e44ad;" data-color="#8e44ad"></div>
                </div>
            </div>

            <div class="customizer-section">
                <h4>Typography</h4>
                <div class="font-options">
                    <select id="font-select">
                        <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                        <option value="'Montserrat', sans-serif">Montserrat (Sans-Serif)</option>
                        <option value="'Outfit', sans-serif">Outfit (Modern)</option>
                        <option value="'Courier New', monospace">Courier (Typewriter)</option>
                    </select>
                </div>
            </div>

            <div class="customizer-section">
                <h4>Dark Mode</h4>
                <div class="mode-options">
                    <select id="mode-select">
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                    </select>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', customizerHTML);

    const customizer = document.getElementById('theme-customizer');
    const toggleBtn = document.getElementById('customizer-toggle');
    const colorBtns = document.querySelectorAll('.color-btn');
    const fontSelect = document.getElementById('font-select');
    const modeSelect = document.getElementById('mode-select');

    if(toggleBtn){
        toggleBtn.addEventListener('click', () => {
            customizer.classList.toggle('open');
        });
    }

    // Apply saved settings globally on every load without touching HTML manually
    const savedColor = localStorage.getItem('theme-accent');
    const savedFont = localStorage.getItem('theme-font');
    const savedMode = localStorage.getItem('theme-mode');

    // First execute any logic to apply immediately before drawing finishes securely
    if (savedColor) {
        document.documentElement.style.setProperty('--accent-color', savedColor);
    }
    if (savedFont) {
        document.documentElement.style.setProperty('--font-heading', savedFont);
        if(fontSelect) fontSelect.value = savedFont;
    }
    if (savedMode === 'dark') {
        document.documentElement.style.setProperty('--bg-color', '#1a1a1a');
        document.documentElement.style.setProperty('--secondary-color', '#0a0a0a');
        document.documentElement.style.setProperty('--primary-color', '#ffffff');
        document.documentElement.style.setProperty('--text-color', '#eaeaea');
        if(modeSelect) modeSelect.value = 'dark';
    }

    if(colorBtns){
        colorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.getAttribute('data-color');
                document.documentElement.style.setProperty('--accent-color', color);
                localStorage.setItem('theme-accent', color);
            });
        });
    }

    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--font-heading', e.target.value);
            localStorage.setItem('theme-font', e.target.value);
        });
    }

    if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'dark') {
                document.documentElement.style.setProperty('--bg-color', '#1a1a1a');
                document.documentElement.style.setProperty('--secondary-color', '#0a0a0a');
                document.documentElement.style.setProperty('--primary-color', '#ffffff');
                document.documentElement.style.setProperty('--text-color', '#eaeaea');
                localStorage.setItem('theme-mode', 'dark');
            } else {
                document.documentElement.style.setProperty('--bg-color', '#F5F5F5');
                document.documentElement.style.setProperty('--secondary-color', '#FFFFFF');
                document.documentElement.style.setProperty('--primary-color', '#000000');
                document.documentElement.style.setProperty('--text-color', '#333333');
                localStorage.setItem('theme-mode', 'light');
            }
        });
    }

});
