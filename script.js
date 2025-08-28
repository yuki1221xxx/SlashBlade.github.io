// 画像読み込み失敗時の最小フォールバックのみ保持（他ロジック削除）
document.addEventListener('error', e => {
  const el = e.target;
  if (el && el.tagName === 'IMG') {
    el.style.opacity = '.35';
    el.style.filter = 'grayscale(1) contrast(.6)';
  }
}, true);

// ===============================
// 個別画像サイズ適用処理
// data-w / data-h に数値 or 単位付き値を指定
// 例: data-w="400" / data-w="50%" / data-h="300"
// ===============================
(function applyPerImageSize(){
  const imgs = document.querySelectorAll('.floating-stage img');
  imgs.forEach(img => {
    const { w, h } = img.dataset; // data-w / data-h
    if (!w && !h) return;
    const norm = v => {
      if (!v) return null;
      return /^\d+$/.test(v) ? v + 'px' : v; // 数字のみなら px 付与
    };
    const wv = norm(w);
    const hv = norm(h);
    if (wv) img.style.width = wv;
    if (hv) img.style.height = hv;
    // 片方だけ指定ならもう一方は自動で比率維持
    if (wv && !hv) img.style.height = 'auto';
    if (hv && !wv) img.style.width = 'auto';
  });
})();