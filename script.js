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

// 中央浮遊レイアウト初期化
class FloatingShowcase {
  constructor() {
    this.items = [...document.querySelectorAll('.floating-item')];
    this.init();
  }
  init() {
    this.unlockAnimations();
    this.setupHoverOptimization();
    this.powerSaveCheck();
    this.randomizeFloatAnimations(); // 追加：浮遊バラバラ化
  }
  unlockAnimations() {
    // body.preload → 解除で全シーケンス開始
    requestAnimationFrame(() => {
      document.body.classList.remove('preload');
    });
  }
  setupHoverOptimization() {
    // モバイルでホバー不要: pointer coarse の場合シャドウ負荷軽減
    if (window.matchMedia('(pointer: coarse)').matches) {
      this.items.forEach(el => el.classList.add('no-hover'));
    }
  }
  powerSaveCheck() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(b => {
        if (b.level < 0.2) this.reduceMotion();
      });
    }
  }
  reduceMotion() {
    document.documentElement.classList.add('reduce-motion');
    const style = document.createElement('style');
    style.textContent = `
      .reduce-motion * {
        animation-duration:.4s !important;
        animation-iteration-count:1 !important;
      }
      .qr-card { animation:none !important; }
    `;
    document.head.appendChild(style);
  }
  /* 追加: 浮遊アニメをバラバラにランダム化 */
  randomizeFloatAnimations() {
    this.items.forEach(item => {
      const animEl = item.querySelector('.float-anim');
      if (!animEl) return;
      // 既存パターンを維持しつつ時間・遅延をランダム設定
      const baseDur = animEl.classList.contains('float-pattern-2') ? 12 :
                      animEl.classList.contains('float-pattern-3') ? 10 : 8;
      const duration = (baseDur * (0.75 + Math.random() * 0.9)).toFixed(2); // 0.75〜1.65倍
      const negPhase = (-Math.random() * duration).toFixed(2); // 中途位相開始
      animEl.style.animationDuration = duration + 's';
      animEl.style.animationDelay = negPhase + 's';
      animEl.classList.add('float-randomized');

      // 微小なスケール差で奥行き感（transform競合回避：内側要素へ）
      const scale = (0.94 + Math.random() * 0.18).toFixed(3);
      animEl.style.transform = `scale(${scale})`;
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
    new FloatingShowcase();
    
    // 画像読み込み失敗フォールバック
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            img.style.opacity = '.35';
            img.style.filter = 'grayscale(1) contrast(.6)';
        }, { once:true });
    });

    // 開発者モード
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🎮 TGS Showcase Site - Development Mode');
        console.log('📱 Device:', window.innerWidth <= 768 ? 'Mobile' : 
                   (window.innerWidth <= 1199 ? 'Tablet' : 'Desktop'));
    }
});