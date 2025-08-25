// スクロール時のアニメーション
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('slide-up');
        }
    });
}, observerOptions);

// カード要素を監視
document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

// マウス追従エフェクト
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'cursor';
        document.body.appendChild(newCursor);
    }
    
    document.querySelector('.cursor').style.left = e.clientX + 'px';
    document.querySelector('.cursor').style.top = e.clientY + 'px';
});