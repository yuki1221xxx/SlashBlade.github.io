// デバイス判定クラス
class DeviceDetector {
    constructor() {
        this.isMobile = this.detectMobile();
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
               || window.innerWidth <= 768;
    }

    init() {
        const body = document.body;
        if (this.isMobile) {
            body.classList.add('mobile-device');
        } else {
            body.classList.add('desktop-device');
        }

        // ウィンドウリサイズ対応
        window.addEventListener('resize', () => {
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== this.isMobile) {
                this.isMobile = newIsMobile;
                body.classList.toggle('mobile-device', this.isMobile);
                body.classList.toggle('desktop-device', !this.isMobile);
            }
        });
    }
}

// 自動スライドショークラス
class AutoSlideshow {
   constructor() {
       this.currentSlide = 0;
       this.slides = document.querySelectorAll('.slide');
       this.totalSlides = this.slides.length;
       this.slideInterval = 5000; // 5秒
       this.progressBar = document.querySelector('.progress-fill');
       this.currentSlideElement = document.querySelector('.current-slide');
       this.totalSlidesElement = document.querySelector('.total-slides');
       this.isTransitioning = false;
       
       this.init();
   }

   init() {
       if (this.totalSlides === 0) return;
       
       // 初期設定
       this.totalSlidesElement.textContent = this.totalSlides;
       this.updateSlideCounter();
       
       // 自動スライド開始
       this.startAutoSlide();
       
       // プログレスバーアニメーション開始
       this.startProgressAnimation();
   }

   startAutoSlide() {
       setInterval(() => {
           this.nextSlide();
       }, this.slideInterval);
   }

   nextSlide() {
       if (this.isTransitioning) return;
       this.isTransitioning = true;

       // 現在のスライドを非アクティブに
       this.slides[this.currentSlide].classList.remove('active');
       this.slides[this.currentSlide].classList.add('prev');

       // 次のスライドインデックスを計算
       this.currentSlide = (this.currentSlide + 1) % this.totalSlides;

       // 次のスライドをアクティブに
       setTimeout(() => {
           // 前のスライドのクラスをリセット
           document.querySelectorAll('.slide.prev').forEach(slide => {
               slide.classList.remove('prev');
           });

           this.slides[this.currentSlide].classList.add('active');
           this.updateSlideCounter();
           this.restartProgressAnimation();
           
           this.isTransitioning = false;
       }, 100);
   }

   updateSlideCounter() {
       this.currentSlideElement.textContent = this.currentSlide + 1;
   }

   startProgressAnimation() {
       this.progressBar.style.animationDuration = `${this.slideInterval}ms`;
   }

   restartProgressAnimation() {
       this.progressBar.style.animation = 'none';
       setTimeout(() => {
           this.progressBar.style.animation = `progressAnimation ${this.slideInterval}ms linear infinite`;
       }, 50);
   }
}

// ライブ統計カウンタークラス
class LiveStatsCounter {
   constructor() {
       this.stats = document.querySelectorAll('.stat-number[data-count]');
       this.init();
   }

   init() {
       this.animateCounters();
       // 統計を定期的に更新（リアルな感じを演出）
       setInterval(() => {
           this.updateRandomStats();
       }, 30000); // 30秒ごと
   }

   animateCounters() {
       this.stats.forEach(stat => {
           const target = parseInt(stat.dataset.count);
           const duration = 2000;
           const increment = target / (duration / 16);
           let current = 0;

           const timer = setInterval(() => {
               current += increment;
               if (current >= target) {
                   current = target;
                   clearInterval(timer);
               }
               stat.textContent = Math.floor(current);
           }, 16);
       });
   }

   updateRandomStats() {
       this.stats.forEach((stat, index) => {
           const baseValue = parseInt(stat.dataset.count);
           let newValue;
           
           switch(index) {
               case 0: // 参加者数 (増加傾向)
                   newValue = baseValue + Math.floor(Math.random() * 10);
                   break;
               case 1: // 展示ブース (固定)
                   newValue = baseValue;
                   break;
               case 2: // 時間経過 (増加)
                   const currentHours = parseInt(stat.textContent);
                   newValue = currentHours + 1;
                   break;
               default:
                   newValue = baseValue;
           }
           
           this.animateToValue(stat, newValue);
           stat.dataset.count = newValue;
       });
   }

   animateToValue(element, targetValue) {
       const startValue = parseInt(element.textContent);
       const difference = targetValue - startValue;
       const duration = 1000;
       const increment = difference / (duration / 16);
       let current = startValue;

       const timer = setInterval(() => {
           current += increment;
           if ((increment > 0 && current >= targetValue) || 
               (increment < 0 && current <= targetValue)) {
               current = targetValue;
               clearInterval(timer);
           }
           element.textContent = Math.floor(current);
       }, 16);
   }
}

// リアルタイム時計クラス
class LiveClock {
   constructor() {
       this.clockElement = document.querySelector('.live-time');
       this.init();
   }

   init() {
       if (!this.clockElement) return;
       
       this.updateTime();
       setInterval(() => {
           this.updateTime();
       }, 1000);
   }

   updateTime() {
       const now = new Date();
       const timeString = now.toLocaleTimeString('ja-JP', {
           hour12: false,
           hour: '2-digit',
           minute: '2-digit',
           second: '2-digit'
       });
       this.clockElement.textContent = timeString;
   }
}

// パーティクルエフェクトクラス
class ParticleSystem {
   constructor() {
       this.container = document.getElementById('particles');
       this.particles = [];
       this.maxParticles = document.body.classList.contains('mobile-device') ? 15 : 30;
       this.init();
   }

   init() {
       if (!this.container) return;
       
       // 定期的にパーティクルを生成
       setInterval(() => {
           if (this.particles.length < this.maxParticles) {
               this.createParticle();
           }
       }, 2000);
   }

   createParticle() {
       const particle = document.createElement('div');
       particle.className = 'particle';
       
       // ランダムな位置とサイズ
       const size = Math.random() * 6 + 2;
       const startX = Math.random() * window.innerWidth;
       const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A8E6CF', '#FFD93D'];
       const color = colors[Math.floor(Math.random() * colors.length)];
       
       particle.style.cssText = `
           width: ${size}px;
           height: ${size}px;
           left: ${startX}px;
           background: ${color};
           animation-duration: ${Math.random() * 5 + 8}s;
           animation-delay: ${Math.random() * 2}s;
       `;
       
       this.container.appendChild(particle);
       this.particles.push(particle);
       
       // アニメーション終了後に削除
       particle.addEventListener('animationend', () => {
           if (particle.parentNode) {
               particle.parentNode.removeChild(particle);
               this.particles = this.particles.filter(p => p !== particle);
           }
       });
   }
}

// タグアニメーション
class TagAnimator {
   constructor() {
       this.init();
   }

   init() {
       // スライドが変わるたびにタグアニメーションを更新
       const observer = new MutationObserver((mutations) => {
           mutations.forEach((mutation) => {
               if (mutation.type === 'attributes' && 
                   mutation.attributeName === 'class' && 
                   mutation.target.classList.contains('slide')) {
                   
                   if (mutation.target.classList.contains('active')) {
                       this.animateTags(mutation.target);
                   }
               }
           });
       });

       document.querySelectorAll('.slide').forEach(slide => {
           observer.observe(slide, { attributes: true });
       });
   }

   animateTags(slideElement) {
       const tags = slideElement.querySelectorAll('.tag');
       tags.forEach((tag, index) => {
           tag.style.setProperty('--tag-index', index);
           tag.style.animation = 'none';
           setTimeout(() => {
               tag.style.animation = `tagPulse 2s ease infinite`;
               tag.style.animationDelay = `${index * 0.2}s`;
           }, 100);
       });
   }
}

// バッテリー最適化クラス
class PerformanceOptimizer {
   constructor() {
       this.isVisible = true;
       this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
       this.init();
   }

   init() {
       // ページが非表示になったらアニメーションを停止
       document.addEventListener('visibilitychange', () => {
           this.isVisible = !document.hidden;
           this.toggleAnimations();
       });

       // バッテリー低下時のアニメーション制御
       if ('getBattery' in navigator) {
           navigator.getBattery().then(battery => {
               battery.addEventListener('levelchange', () => {
                   if (battery.level < 0.2) {
                       this.enablePowerSaveMode();
                   }
               });
           });
       }
   }

   toggleAnimations() {
       const body = document.body;
       if (this.isVisible && !this.reducedMotion) {
           body.style.animationPlayState = 'running';
           body.style.transitionDuration = '';
       } else {
           body.style.animationPlayState = 'paused';
       }
   }

   enablePowerSaveMode() {
       const style = document.createElement('style');
       style.textContent = `
           * {
               animation-duration: 0.1s !important;
               transition-duration: 0.1s !important;
           }
       `;
       document.head.appendChild(style);
   }
}

// メインアプリケーション初期化
class EventDisplayApp {
   constructor() {
       this.init();
   }

   init() {
       // デバイス判定
       new DeviceDetector();
       
       // DOM読み込み完了を待つ
       if (document.readyState === 'loading') {
           document.addEventListener('DOMContentLoaded', () => {
               this.initializeComponents();
           });
       } else {
           this.initializeComponents();
       }
   }

   initializeComponents() {
       // 各コンポーネントを初期化
       new AutoSlideshow();
       new LiveStatsCounter();
       new LiveClock();
       new ParticleSystem();
       new TagAnimator();
       new PerformanceOptimizer();

       // エラーハンドリング
       window.addEventListener('error', (e) => {
           console.warn('Non-critical error:', e.message);
       });

       // スムーズな初期表示
       document.body.style.opacity = '0';
       setTimeout(() => {
           document.body.style.transition = 'opacity 1s ease';
           document.body.style.opacity = '1';
       }, 100);
   }
}

// アプリケーション開始
new EventDisplayApp();

// 開発者向けデバッグ情報
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
   console.log('🎉 Event Display Site - Debug Mode');
   console.log('📱 Device:', document.body.classList.contains('mobile-device') ? 'Mobile' : 'Desktop');
   console.log('🎬 Slide Duration:', 5000, 'ms');
   
   // パフォーマンス監視
   if ('performance' in window) {
       window.addEventListener('load', () => {
           setTimeout(() => {
               const perfData = performance.getEntriesByType('navigation')[0];
               console.log('⚡ Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
           }, 0);
       });
   }
}