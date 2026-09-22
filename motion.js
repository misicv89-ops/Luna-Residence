/* Luna Residence — motion system (GSAP + ScrollTrigger). Adds motion only; never changes layout or content. */
(function () {
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!gsap || !ST || reduce) return;
  gsap.registerPlugin(ST);

  var root = document.documentElement;
  root.classList.add('lr-motion');
  var failsafe = setTimeout(function () { root.classList.remove('lr-motion'); }, 6000);

  var T = { micro: 0.2, fast: 0.35, normal: 0.6, medium: 0.8, cinematic: 1.2, hero: 1.3 };
  var S = { sm: 0.05, md: 0.1, lg: 0.15 };
  var EASE = 'power3.out';
  var DESKTOP = '(min-width: 1060px)';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Wait until the page has rendered AND stopped re-rendering (quiet period), capped at 3.5s. */
  var started = Date.now(), lastChange = Date.now(), done = false;
  var mo = new MutationObserver(function () { lastChange = Date.now(); });
  mo.observe(document.documentElement, { childList: true, subtree: true });
  (function wait() {
    if (done) return;
    var present = $('#top h1') && $('#lr-nav') && $('#faq h2') && $('footer');
    var quiet = Date.now() - lastChange > 350;
    if (present && (quiet || Date.now() - started > 3500)) { done = true; mo.disconnect(); return safeInit(); }
    setTimeout(wait, 60);
  })();

  function safeInit() {
    try { init(); } catch (err) { if (window.console) console.warn('[motion]', err); }
    /* Start states now live as GSAP inline styles; drop the CSS pre-hide so nothing can stay stuck. */
    clearTimeout(failsafe);
    root.classList.remove('lr-motion');
    /* Guard: if the runtime swapped nodes after init, make sure they're visible. */
    setTimeout(function () {
      $$('#lr-nav, #top h1, #top form, [data-reveal]').forEach(function (el) {
        if (!el._gsap && getComputedStyle(el).opacity === '0') el.style.opacity = '1';
      });
    }, 2500);
  }

  function init() {
    heroIntro();
    heroAmbient();
    reveals();
    navBehavior();
    submitFx();
    gsap.matchMedia().add(DESKTOP, function () { heroScroll(); imageParallax(); });
    var refresh = function () { ST.refresh(); };
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    setTimeout(refresh, 1500);
  }

  /* LEVEL 1 — page load */
  function heroIntro() {
    var nav = $('#lr-nav');
    var logo = $('a[href="#top"]', nav);
    var right = logo && logo.nextElementSibling;
    var navItems = right ? Array.prototype.slice.call(right.children) : [];
    var wrap = $('#top > div:last-child');
    var text = wrap && wrap.firstElementChild;
    if (text) text.style.animation = 'none';
    var p = text ? Array.prototype.slice.call(text.children) : [];
    var form = wrap && $('form', wrap);
    var video = $('#top > div:first-child > img');

    var tl = gsap.timeline({ defaults: { ease: EASE } });
    if (video) tl.fromTo(video, { opacity: 0 }, { opacity: 1, duration: T.cinematic, ease: 'power2.out' }, 0);
    tl.fromTo(nav, { opacity: 0 }, { opacity: 1, duration: T.medium }, 0.15);
    if (logo) tl.fromTo(logo, { opacity: 0, scale: 0.9, transformOrigin: 'left center' }, { opacity: 1, scale: 1, duration: T.medium }, 0.2);
    if (navItems.length) tl.fromTo(navItems, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: T.normal, stagger: 0.06, clearProps: 'transform' }, 0.35);
    if (p[0]) tl.fromTo(p[0], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: T.medium, clearProps: 'transform' }, 0.45);
    if (p[1]) tl.fromTo(p[1], { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: T.hero, ease: 'expo.out', clearProps: 'transform' }, 0.55);
    var mid = p.slice(2, 4);
    if (mid.length) tl.fromTo(mid, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: T.medium, stagger: S.md, clearProps: 'transform' }, 0.85);
    if (p[4]) tl.fromTo(p[4], { opacity: 0, y: 25, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: T.medium, clearProps: 'transform' }, 1.05);
    if (form) tl.fromTo(form, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out', clearProps: 'transform' }, 1.2);
  }

  /* LEVEL 7 — continuous hero background drift */
  function heroAmbient() {
    var video = $('#top > div:first-child > img');
    if (!video) return;
    var mobile = !matchMedia(DESKTOP).matches;
    gsap.fromTo(video, { scale: 1, xPercent: 0 }, {
      scale: mobile ? 1.04 : 1.06, xPercent: mobile ? 0 : -2,
      duration: 18, ease: 'none', repeat: -1, yoyo: true
    });
  }

  /* LEVEL 2 — hero parallax on scroll (desktop only) */
  function heroScroll() {
    var bg = $('#top > div:first-child');
    var wrap = $('#top > div:last-child');
    var st = { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true };
    if (bg) gsap.to(bg, { yPercent: 20, ease: 'none', scrollTrigger: st });
    if (wrap) gsap.to(wrap, { y: -80, opacity: 0.2, ease: 'none', scrollTrigger: Object.assign({}, st) });
  }

  function imageParallax() {
    var img = $('img[data-parallax]');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -12 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* LEVEL 3/4 — scroll reveals */
  function heading(tl, el, at) {
    tl.fromTo(el, { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.out', clearProps: 'transform,clipPath' }, at);
  }

  function counter(tl, el, at) {
    var raw = el.textContent.trim();
    var m = raw.match(/^(\d+)(?:([.,])(\d+))?$/);
    if (!m) return;
    var dec = m[3] ? m[3].length : 0, sep = m[2] || '.';
    var target = parseFloat(m[1] + (m[3] ? '.' + m[3] : ''));
    var o = { v: 0 };
    var fmt = function (v) { return v.toFixed(dec).replace('.', sep); };
    el.textContent = fmt(0);
    tl.to(o, { v: target, duration: 1.8, ease: 'power2.out', onUpdate: function () { el.textContent = fmt(o.v); }, onComplete: function () { el.textContent = raw; } }, at);
  }

  function textBlock(el) {
    gsap.set(el, { opacity: 1 });
    var atoms = [];
    Array.prototype.forEach.call(el.children, function (c) {
      if (c.tagName === 'DIV' && $(':scope > h2', c)) atoms.push.apply(atoms, c.children);
      else atoms.push(c);
    });
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
    atoms.forEach(function (a, i) {
      var at = i * S.md;
      if (a.tagName === 'H2') heading(tl, a, at);
      else tl.fromTo(a, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: T.medium, ease: EASE, clearProps: 'transform' }, at);
      $$('div[style*="font-size: 34px"]', a).forEach(function (n) { counter(tl, n, at + 0.1); });
    });
  }

  function staggerGroup(trigger, items, from, stagger) {
    if (!items.length) return;
    var to = { opacity: 1, y: 0, scale: 1, duration: T.medium, ease: EASE, stagger: stagger, clearProps: 'transform' };
    gsap.timeline({ scrollTrigger: { trigger: trigger, start: 'top 80%', once: true } }).fromTo(items, from, to);
  }

  function batch(items, from, stagger, dur) {
    if (!items.length) return;
    gsap.set(items, from);
    ST.batch(items, {
      start: 'top 85%', once: true,
      onEnter: function (b) {
        gsap.to(b, { opacity: 1, y: 0, scale: 1, duration: dur || T.medium, ease: EASE, stagger: stagger, clearProps: 'transform', overwrite: true });
      }
    });
  }

  function imageReveal(el) {
    var img = $('img', el);
    gsap.set(el, { opacity: 1 });
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
    tl.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: T.cinematic, ease: 'power4.inOut', clearProps: 'clipPath' }, 0);
    if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: EASE, clearProps: 'transform' }, 0);
  }

  function reveals() {
    var cards = [], tiles = [], numbered = [];
    var desktop = matchMedia(DESKTOP).matches;

    $$('[data-reveal]').forEach(function (el) {
      if (el.tagName === 'H2') {
        gsap.set(el, { opacity: 1 });
        heading(gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } }), el, 0);
        return;
      }
      if (el.closest('#galerija') && $('[data-i]', el)) {
        gsap.set(el, { opacity: 1 });
        tiles.push.apply(tiles, $$('[data-i]', el));
        return;
      }
      if (el.closest('#apartman') && $('img', el) && !$('h2', el)) { imageReveal(el); return; }
      var first = el.firstElementChild;
      if (first && /^0\d$/.test(first.textContent.trim())) { numbered.push(el); return; }
      if ($('h2', el)) { textBlock(el); return; }
      if ($('h3', el) && $('div[style*="display: grid"]', el)) {
        gsap.set(el, { opacity: 1 });
        var items = [$('h3', el)].concat($$('div[style*="display: grid"] > div', el));
        staggerGroup(el, items, { opacity: 0, y: 30, scale: 0.97 }, S.sm);
        return;
      }
      if (el.children.length >= 4 && !$('img', el)) {
        gsap.set(el, { opacity: 1 });
        staggerGroup(el, Array.prototype.slice.call(el.children), { opacity: 0, y: 30, scale: 0.97 }, S.sm);
        return;
      }
      cards.push(el);
    });

    batch(cards, { opacity: 0, y: 50, scale: 0.97 }, S.md);
    batch(tiles, { opacity: 0, y: 30, scale: 0.95 }, 0.08, 0.9);

    numbered.forEach(function (el, i) {
      gsap.set(el, { opacity: 1 });
      var kids = Array.prototype.slice.call(el.children);
      var tl = gsap.timeline({
        delay: desktop ? (i % 4) * S.lg : 0,
        scrollTrigger: { trigger: desktop ? el.parentElement : el, start: 'top 80%', once: true }
      });
      tl.fromTo(el, { y: 50, scale: 0.97 }, { y: 0, scale: 1, duration: T.medium, ease: EASE, clearProps: 'transform' }, 0)
        .fromTo(kids[0], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: T.medium, ease: EASE, clearProps: 'transform' }, 0)
        .fromTo(kids.slice(1), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: T.normal, ease: EASE, stagger: S.sm, clearProps: 'transform' }, 0.2);
    });

    var form = $('#rezervacija form');
    if (form) staggerGroup(form, Array.prototype.slice.call(form.children), { opacity: 0, y: 24, scale: 1 }, S.sm);
  }

  /* Navigation — compact logo after scroll (padding/background already handled by the site) */
  function navBehavior() {
    var logo = $('#lr-nav a[href="#top"]');
    if (!logo) return;
    ST.create({
      start: 24, end: 'max',
      onToggle: function (s) {
        gsap.to(logo, { scale: s.isActive ? 0.9 : 1, transformOrigin: 'left center', duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
      }
    });
  }

  /* Form — loading label + success entrance */
  function submitFx() {
    document.addEventListener('submit', function (e) {
      var f = e.target;
      if (!f || !f.closest || !f.closest('#rezervacija')) return;
      var b = $('button[type="submit"]', f);
      if (b) {
        b.textContent = root.lang === 'en' ? 'Sending…' : 'Šaljem…';
        gsap.to(b, { opacity: 0.75, duration: T.micro });
      }
      setTimeout(function () {
        var h = $('#rezervacija h3');
        if (h && h.parentElement) gsap.fromTo(h.parentElement, { opacity: 0, y: 20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: T.medium, ease: EASE, clearProps: 'transform' });
      }, 950);
    }, true);
  }
})();
