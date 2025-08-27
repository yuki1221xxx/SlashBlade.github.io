// TGS展示サイト スクリプト
class TGSShowcaseApp {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.init();
    }

    init() {
        this.initializeGallery();
        this.setupIntersectionObserver();
    }

    // ギャラリーアイテムの初期化
    initializeGalleryItems() {
        this.galleryItems.forEach((item, index) => {
            const delay = parseFloat(item.dataset.delay || 0);
            item.style.animationDelay = `${delay}s`;
        });
    }

    // ギャラリー初期化
    initializeGallery() {
        this.initializeGalleryItems();
        
        // 1秒後にアニメーション開始
        setTimeout(() => {
            this.galleryItems.forEach(item => {
                item.classList.add('visible');
            });
        }, 1000);
    }

    // Intersection Observerの設定
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.galleryItems.forEach(item => {
            observer.observe(item);
        });
    }
}

// パフォーマンス最適化クラス
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Intersection Observer による遅延読み込み
        this.setupLazyLoading();
        
        // リサイズイベントの最適化
        this.throttleResize();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        if (images.length === 0) return;
        
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

    throttleResize() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // リサイズ処理
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // モバイル判定の更新
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-view', isMobile);
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    window.tgsApp = new TGSShowcaseApp();
    new PerformanceOptimizer();
    
    // 開発者モード
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🎮 TGS Showcase Site - Development Mode');
        console.log('📱 Device:', window.innerWidth <= 768 ? 'Mobile' : 
                   (window.innerWidth <= 1199 ? 'Tablet' : 'Desktop'));
    }
});