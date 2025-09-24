window.addEventListener('DOMContentLoaded', event => {

    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    navbarShrink();

    document.addEventListener('scroll', navbarShrink);

    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // 動画互換性とエラーハンドリング
    function initVideoCompatibility() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // 動画読み込みエラー時のフォールバック
            video.addEventListener('error', function(e) {
                console.warn('Video playback failed, attempting fallback:', e);
                handleVideoError(this);
            });

            // 各sourceの読み込みエラーをハンドル
            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                source.addEventListener('error', function(e) {
                    console.warn('Video source failed:', this.src, e);
                });
            });

            // 動画が読み込めない場合の最終フォールバック
            video.addEventListener('loadstart', function() {
                setTimeout(() => {
                    if (this.readyState === 0) {
                        console.warn('Video failed to load, showing fallback');
                        handleVideoError(this);
                    }
                }, 3000); // 3秒待機
            });

            // モバイルデバイスでの自動再生対応
            if (isMobileDevice()) {
                video.addEventListener('canplay', function() {
                    const playPromise = this.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.warn('Autoplay failed on mobile:', error);
                            // モバイルでは静止画像を表示
                            handleVideoError(this);
                        });
                    }
                });
            }
        });
    }

    function handleVideoError(video) {
        const parent = video.parentElement;
        const fallback = video.querySelector('.video-fallback, img');
        
        if (fallback) {
            // フォールバック要素がある場合は表示
            fallback.style.display = 'block';
            video.style.display = 'none';
        } else {
            // フォールバック画像を動的に作成
            const img = document.createElement('img');
            if (video.id === 'background-video') {
                img.src = 'assets/img/video-fallback.jpg';
                img.alt = 'ゲーム背景画像';
            } else {
                img.src = 'assets/img/manual-fallback.jpg';
                img.alt = 'ゲーム説明画像';
            }
            img.className = video.className;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            
            parent.insertBefore(img, video);
            video.style.display = 'none';
        }
    }

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function checkVideoSupport() {
        const video = document.createElement('video');
        const formats = {
            mp4: 'video/mp4; codecs="avc1.42E01E"',
            webm: 'video/webm; codecs="vp8, vorbis"',
            ogv: 'video/ogg; codecs="theora"'
        };

        const supportedFormats = [];
        for (const [format, codec] of Object.entries(formats)) {
            if (video.canPlayType(codec)) {
                supportedFormats.push(format);
            }
        }

        console.log('Supported video formats:', supportedFormats);
        return supportedFormats;
    }

    // 動画互換性の初期化
    initVideoCompatibility();
    checkVideoSupport();

});