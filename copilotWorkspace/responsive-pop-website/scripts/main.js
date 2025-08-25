class SpecialSite {
    constructor() {
        this.currentSlide = 0;
        this.galleryItems = [];
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSlider();
        this.setupGallery();
        this.setupContactForm();
        this.setupSmoothScroll();
        this.setupCursorEffect();
    }

    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
            });
        });

        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    setupSlider() {
        const slides = document.querySelectorAll('.feature-slide');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const dotsContainer = document.getElementById('slider-dots');

        if (!slides.length) return;

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        prevBtn?.addEventListener('click', () => this.previousSlide());
        nextBtn?.addEventListener('click', () => this.nextSlide());

        if (document.body.classList.contains('desktop-device')) {
            setInterval(() => this.nextSlide(), 5000);
        }

        if (document.body.classList.contains('mobile-device')) {
            this.setupSwipeGestures();
        }
    }

    goToSlide(index) {
        const slides = document.querySelectorAll('.feature-slide');
        const dots = document.querySelectorAll('.slider-dot');

        slides[this.currentSlide].classList.remove('active');
        dots[this.currentSlide].classList.remove('active');

        this.currentSlide = index;

        slides[this.currentSlide].classList.add('active');
        dots[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        const slides = document.querySelectorAll('.feature-slide');
        const nextIndex = (this.currentSlide + 1) % slides.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const slides = document.querySelectorAll('.feature-slide');
        const prevIndex = this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    setupSwipeGestures() {
        const slider = document.getElementById('features-slider');
        let startX, startY, distX, distY;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        slider.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            distX = e.touches[0].clientX - startX;
            distY = e.touches[0].clientY - startY;

            if (Math.abs(distX) > Math.abs(distY)) {
                e.preventDefault();
            }
        });

        slider.addEventListener('touchend', () => {
            if (Math.abs(distX) > 50) {
                if (distX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
            startX = startY = distX = distY = 0;
        });
    }

    setupGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        const loadMoreBtn = document.getElementById('load-more');
        
        this.loadGalleryItems(8);

        loadMoreBtn?.addEventListener('click', () => {
            this.loadGalleryItems(4);
        });
    }

    loadGalleryItems(count) {
        const galleryGrid = document.getElementById('gallery-grid');
        const startIndex = this.galleryItems.length;

        for (let i = 0; i < count; i++) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `アイテム ${startIndex + i + 1}`;
            item.style.animationDelay = `${i * 100}ms`;
            
            item.addEventListener('click', () => {
                this.openModal(startIndex + i);
            });

            galleryGrid.appendChild(item);
            this.galleryItems.push(item);

            setTimeout(() => {
                item.classList.add('scale-in');
            }, i * 100);
        }
    }

    openModal(index) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div class="modal-body">
                    <h3>ギャラリーアイテム ${index + 1}</h3>
                    <div class="modal-image">画像 ${index + 1}</div>
                    <p>詳細な説明がここに入ります。</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                position: relative;
                transform: scale(0.8);
                animation: scaleUp 0.3s ease forwards;
            }
            .modal-close {
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 2rem;
                cursor: pointer;
                color: #999;
            }
            .modal-image {
                background: linear-gradient(45deg, var(--primary), var(--secondary));
                height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                border-radius: 10px;
                margin: 1rem 0;
            }
            @keyframes scaleUp {
                to { transform: scale(1); }
            }
        `;
        document.head.appendChild(modalStyle);

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(modalStyle);
            }, 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '送信中...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = '送信完了！';
                submitBtn.style.background = '#4ECDC4';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }

    setupSmoothScroll() {
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
    }

    setupCursorEffect() {
        if (!document.body.classList.contains('desktop-device')) return;

        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('button, a, .gallery-item').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SpecialSite();
});

window.addEventListener('load', () => {
    const lazyImages = document.querySelectorAll('[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});