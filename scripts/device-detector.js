class DeviceDetector {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
               || window.innerWidth <= 768;
    }

    detectTablet() {
        return /iPad|Android/i.test(navigator.userAgent) 
               && window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    init() {
        const body = document.body;
        
        if (this.isMobile) {
            body.classList.add('mobile-device');
        } else if (this.isTablet) {
            body.classList.add('tablet-device');
        } else {
            body.classList.add('desktop-device');
        }

        // ウィンドウリサイズ時の再判定
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                body.className = body.className.replace(/desktop-device|tablet-device/g, '');
                body.classList.add('mobile-device');
            } else if (window.innerWidth <= 1024) {
                body.className = body.className.replace(/desktop-device|mobile-device/g, '');
                body.classList.add('tablet-device');
            } else {
                body.className = body.className.replace(/mobile-device|tablet-device/g, '');
                body.classList.add('desktop-device');
            }
        });
    }
}

// 初期化
new DeviceDetector();