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
            // iOS Safari対応
            video.setAttribute('webkit-playsinline', '');
            video.setAttribute('playsinline', '');
            
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
                    if (this.readyState === 0 || this.networkState === this.NETWORK_NO_SOURCE) {
                        console.warn('Video failed to load, showing fallback');
                        handleVideoError(this);
                    }
                }, 5000); // 5秒待機に延長
            });

            // 動画読み込み完了時の処理
            video.addEventListener('canplaythrough', function() {
                console.log('Video can play through:', this.id);
                // フォールバック画像を非表示
                if (this.id === 'background-video') {
                    const fallbackImg = document.getElementById('video-fallback-img');
                    if (fallbackImg) {
                        fallbackImg.style.display = 'none';
                    }
                }
            });

            // モバイルデバイスでの自動再生対応
            video.addEventListener('loadedmetadata', function() {
                const playPromise = this.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Video autoplay started successfully:', this.id);
                    }).catch(error => {
                        console.warn('Autoplay failed:', error);
                        // 自動再生に失敗した場合でも動画要素は表示を続ける
                        // ユーザーインタラクション後の再生を期待
                        this.addEventListener('click', function() {
                            this.play().catch(e => console.warn('Manual play failed:', e));
                        });
                    });
                }
            });
        });
    }

    function handleVideoError(video) {
        const parent = video.parentElement;
        
        // 背景動画の場合、既存のフォールバック画像を使用
        if (video.id === 'background-video') {
            const existingFallback = document.getElementById('video-fallback-img');
            if (existingFallback) {
                existingFallback.style.display = 'block';
                video.style.display = 'none';
                console.log('Showing video fallback image');
                return;
            }
        }
        
        // 他の動画またはフォールバック画像が見つからない場合
        const fallback = parent.querySelector('img[id$="fallback-img"], img');
        
        if (fallback) {
            // 既存のフォールバック要素がある場合は表示
            fallback.style.display = 'block';
            video.style.display = 'none';
        } else {
            // フォールバック画像を動的に作成
            const img = document.createElement('img');
            if (video.id === 'background-video') {
                img.src = 'assets/img/Title.png';
                img.alt = 'ゲーム背景画像';
                img.id = 'dynamic-video-fallback';
            } else {
                img.src = 'assets/img/image-2.png';
                img.alt = 'ゲーム説明画像';
                img.id = 'dynamic-manual-fallback';
            }
            img.style.cssText = 'display:block;width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;z-index:1;';
            
            parent.appendChild(img);
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