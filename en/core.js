// Cute CopyMoji — shared core (language + theme + small UX helpers)
// Safe for SEO: does NOT inject hreflang/canonical/content. Only UX.

(function(){
  const LS = window.localStorage;
  const THEME_KEY = 'ccm:theme';
  const LANG_KEY  = 'ccm:lang';

  // --- Theme bootstrap ---
  const theme = LS.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', theme);

  // --- Helpers ---
  function setTheme(v){
    LS.setItem(THEME_KEY, v);
    document.documentElement.setAttribute('data-theme', v);
  }

  // lang codes we support (for validation)
  const SUPPORTED = ['en','ko','ja','es','pt','fr','de','sv','zh-hans','zh-hant','hi','id','th','vi','ru','ar'];

  // Route to same page in another language folder, preserving filename
  function goToLang(lang){
    if(!SUPPORTED.includes(lang)) return;
    try{
      const path = location.pathname.replace(/\\+/g,'/');
      // current file name
      const file = path.split('/').pop() || 'index.html';
      // current first segment (might be lang)
      const segs = path.split('/').filter(Boolean);
      const first = segs[0] || '';
      let target;
      if(SUPPORTED.includes(first.toLowerCase())){
        // already /{lang}/... → swap
        target = `/${lang}/${file}`;
      } else {
        // root or unknown → add lang folder
        target = `/${lang}/${file}`;
      }
      LS.setItem(LANG_KEY, lang);
      location.href = target;
    }catch(e){ console.error(e); }
  }

  window.CCM = Object.assign(window.CCM || {}, { setTheme, goToLang });

  // Wire up Settings UI if present
  document.addEventListener('DOMContentLoaded', () => {
    const $lang = document.querySelector('[data-ccm-lang]');
    if($lang){
      $lang.value = (LS.getItem(LANG_KEY) || inferCurrentLang());
      $lang.addEventListener('change', () => goToLang($lang.value));
    }

    document.querySelectorAll('[data-ccm-theme]').forEach(el => {
      if(el.value === theme) el.checked = true;
      el.addEventListener('change', () => setTheme(el.value));
    });

    // Hamburger close helpers (non-SEO, pure UX)
    const mobileMenu = document.getElementById('mobileMenu');
    if(mobileMenu){
      document.addEventListener('keydown', e=>{
        if(e.key==='Escape'){ document.body.classList.remove('menu-open');
          document.querySelector('.hamburger')?.setAttribute('aria-expanded','false'); }
      });
      mobileMenu.addEventListener('click', e=>{
        if(e.target.tagName==='A'){ document.body.classList.remove('menu-open');
          document.querySelector('.hamburger')?.setAttribute('aria-expanded','false'); }
      });
    }
  });

  function inferCurrentLang(){
    const seg = location.pathname.split('/').filter(Boolean)[0]||'en';
    return SUPPORTED.includes(seg.toLowerCase()) ? seg.toLowerCase() : 'en';
  }


// --- Mobile menu SVG icon injection (auto) ---
(function(){
  function injectIcons(){
    const ICONS = {
      'index.html': `
        <svg class="mi" viewBox="0 0 24 24" aria-hidden="true">
          <path class="stroke" d="M3 11l9-7 9 7"/>
          <path class="stroke" d="M5 10v9h5v-5h4v5h5v-9"/>
        </svg>`,
      'kaomoji.html': `
        <svg class="mi" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="stroke" cx="12" cy="12" r="8.5"/>
          <circle class="stroke" cx="9"  cy="11" r="1"/>
          <path class="stroke" d="M14.5 11.2h1.6"/>
          <path class="stroke" d="M8.8 15c1.6 1.2 4.8 1.2 6.4 0"/>
        </svg>`,
      'line.html': `
        <svg class="mi" viewBox="0 0 24 24" aria-hidden="true">
          <path class="stroke" d="M4.5 6.5h15v8.2a3 3 0 0 1-3 3H11l-3.8 3v-3H7.5a3 3 0 0 1-3-3z"/>
        </svg>`,
      'replace.html': `
        <svg class="mi" viewBox="0 0 24 24" aria-hidden="true">
          <rect class="stroke" x="3" y="5" width="8" height="14" rx="2"/>
          <path class="stroke" d="M5.5 15h4M7.5 9l1.5 4"/>
          <path class="stroke" d="M13 12h8"/>
          <path class="stroke" d="M18 7l3 3-3 3"/>
        </svg>`,
      'emoji.html': `
        <svg class="mi" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="stroke" cx="12" cy="12" r="8.5"/>
          <circle class="stroke" cx="9"  cy="10" r="1"/>
          <circle class="stroke" cx="15" cy="10" r="1"/>
          <path class="stroke" d="M8.5 14.5c2 1.8 5 1.8 7 0"/>
        </svg>`,
      'dotart.html': `
        <svg class="mi" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="stroke" cx="7" cy="7" r="1.2"/><circle class="stroke" cx="12" cy="7" r="1.2"/><circle class="stroke" cx="17" cy="7" r="1.2"/>
          <circle class="stroke" cx="7" cy="12" r="1.2"/><circle class="stroke" cx="12" cy="12" r="1.2"/><circle class="stroke" cx="17" cy="12" r="1.2"/>
          <circle class="stroke" cx="7" cy="17" r="1.2"/><circle class="stroke" cx="12" cy="17" r="1.2"/><circle class="stroke" cx="17" cy="17" r="1.2"/>
        </svg>`,
      'fonts.html': `
        <svg class="mi" viewBox="0 0 24 24" aria-hidden="true">
          <path class="stroke" d="M4 18h4l2-5h4l2 5h4"/>
          <path class="stroke" d="M10 13l2-7 2 7"/>
        </svg>`,
      'username.html': `
        <svg class="mi" viewBox="0 0 24 24" aria-hidden="true">
          <rect class="stroke" x="3" y="6" width="18" height="12" rx="2"/>
          <circle class="stroke" cx="8.5" cy="12" r="2"/>
          <path class="stroke" d="M12.5 10h6M12.5 13h6M12.5 16h4"/>
        </svg>`,
      'favorites.html': `
        <svg class="mi" viewBox="0 0 24 24" aria-hidden="true">
          <path class="stroke" d="M12 3.5l2.4 4.9 5.4.8-3.9 3.9.9 5.5L12 16.9 7.2 18.6l.9-5.5L4.2 9.2l5.4-.8z"/>
        </svg>`,
      'settings.html': `
        <svg class="mi" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="stroke" cx="12" cy="12" r="7.5"/>
          <circle class="stroke" cx="12" cy="12" r="2.5"/>
          <path class="stroke" d="M12 3.5v3M20.5 12h-3M12 20.5v-3M3.5 12h3M17.4 6.6l-2.1 2.1M17.4 17.4l-2.1-2.1M6.6 17.4l2.1-2.1M6.6 6.6l2.1 2.1"/>
        </svg>`
    };
    document.querySelectorAll('.mobile-menu a').forEach(a=>{
      if(a.querySelector('svg.mi')) return;
      const href = a.getAttribute('href') || '';
      const key  = Object.keys(ICONS).find(k => href.endsWith(k));
      if(!key) return;
      a.insertAdjacentHTML('afterbegin', ICONS[key]);
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', injectIcons, {once:true});
  } else {
    injectIcons();
  }
})();


// iOS: apple-touch-icon을 모든 페이지에 자동 주입
(function(){
  const href = new URL('./apple-touch-icon.png', location.href).href; // 현재 페이지 기준 상대경로
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const link = document.createElement('link');
    link.rel = 'apple-touch-icon';
    link.sizes = '180x180';
    link.href = href;                                // en/에 있는 아이콘 사용
    document.head.appendChild(link);
  }
})();


// iOS Safari에서만 '홈 화면에 추가' 안내 배너 노출 (이미 설치된 경우 미노출)
(function(){
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isStandalone = window.navigator.standalone === true
    || window.matchMedia('(display-mode: standalone)').matches;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  if (!(isIOS && isSafari) || isStandalone) return;
  if (localStorage.getItem('a2hsHintClosed') === '1') return;

  const bar = document.createElement('div');
  bar.id = 'a2hsHint';
  bar.innerHTML = `
    <span>iOS: <strong>공유</strong> ▶︎ <strong>홈 화면에 추가</strong>를 눌러 설치해 보세요.</span>
    <button class="close" aria-label="닫기">✕</button>
  `;
  document.body.appendChild(bar);
  bar.style.display = 'flex';
  bar.querySelector('.close')?.addEventListener('click', ()=>{
    localStorage.setItem('a2hsHintClosed','1');
    bar.remove();
  });
})();


// === A2HS: apple-touch-icon 다중 후보 주입(./, ../, /) ===
(function(){
  if (document.querySelector('link[rel="apple-touch-icon"]')) return;
  const candidates = [
    new URL('./apple-touch-icon.png', location.href).href,
    new URL('../apple-touch-icon.png', location.href).href,
    location.origin + '/apple-touch-icon.png'
  ];
  candidates.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'apple-touch-icon';
    link.sizes = '180x180';
    link.href = href;
    document.head.appendChild(link);
  });
})();



})();

