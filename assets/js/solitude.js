/* ====================================================================
   SOLITUDE INK · आत्म-मिलन – आत्म-विरह
   Shared UI + Cart + the rising-price Edition engine
   ==================================================================== */

(function(){
  'use strict';

  /* ---- THE EDITION (single source of truth) --------------------- */
  /* A finite pressing of 2,000 hand-numbered sets. The price opens
     low and climbs, in published steps, as numbers are claimed.      */
  const EDITION = {
    total: 2000,
    claimed: 340,            // sets already reserved
    signaturePremium: 300,   // Signature adds signature + note + finer binding
    ladder: [
      { upTo: 500,  price: 300 },
      { upTo: 1000, price: 370 },
      { upTo: 1500, price: 440 },
      { upTo: 1900, price: 510 },
      { upTo: 2000, price: 580 }
    ]
  };

  function tierForNumber(n){
    for (const t of EDITION.ladder){ if (n <= t.upTo) return t; }
    return EDITION.ladder[EDITION.ladder.length - 1];
  }
  function editionState(){
    const reserveNo = Math.min(EDITION.claimed + 1, EDITION.total);
    const tier = tierForNumber(reserveNo);
    const idx = EDITION.ladder.indexOf(tier);
    const isFinal = idx === EDITION.ladder.length - 1;
    return {
      claimed: EDITION.claimed,
      total: EDITION.total,
      reserveNo,
      hardcover: tier.price,
      signature: tier.price + EDITION.signaturePremium,
      final: EDITION.ladder[EDITION.ladder.length - 1].price,
      nextStepNo: isFinal ? null : tier.upTo + 1,
      remainingInTier: Math.max(0, tier.upTo - EDITION.claimed),
      tierIndex: idx,
      pct: EDITION.claimed / EDITION.total
    };
  }
  window.EditionState = editionState;

  /* ---- Catalog (prices resolved live from the ladder) ----------- */
  const CATALOG = {
    'hardcover': {
      id: 'hardcover',
      title: 'The Hardcover Universe',
      subtitle: 'Edition I · Ten clothbound books',
      img: 'assets/img/si-slipcase-dark.jpg',
      kind: 'Hardcover Universe',
      get price(){ return editionState().hardcover; },
      max: 2
    },
    'signature': {
      id: 'signature',
      title: 'The Signature Numbered Universe',
      subtitle: 'Edition II · Numbered & signed by hand',
      img: 'assets/img/si-slipcase-ivory.jpg',
      kind: 'Signature Numbered Universe',
      get price(){ return editionState().signature; },
      max: 2
    }
  };
  window.SI_CATALOG = CATALOG;

  /* ---- Cart store ----------------------------------------------- */
  const KEY = 'solitude-ink-cart-v2';
  function read(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; } }
  function write(items){ localStorage.setItem(KEY, JSON.stringify(items)); notify(); }
  function notify(){
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: { items: read(), count: count(), subtotal: subtotal() }}));
  }
  function count(){ return read().reduce((n, it) => n + it.qty, 0); }
  function subtotal(){ return read().reduce((n, it) => n + (it.price || CATALOG[it.id].price) * it.qty, 0); }

  function add(id, qty){
    qty = qty || 1;
    if (!CATALOG[id]) return;
    const items = read();
    const ex = items.find(i => i.id === id);
    if (ex){
      ex.qty = Math.min(ex.qty + qty, CATALOG[id].max);
    } else {
      // lock today's price + reserve the next number(s)
      const reservedSoFar = items.reduce((n, it) => n + it.qty, 0);
      items.push({ id, qty: Math.min(qty, CATALOG[id].max), price: CATALOG[id].price, no: editionState().reserveNo + reservedSoFar });
    }
    write(items);
    showToast(CATALOG[id]);
    openCart();
  }
  function update(id, qty){
    const items = read().map(i => i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, CATALOG[id].max)) } : i);
    write(items);
  }
  function remove(id){ write(read().filter(i => i.id !== id)); }
  function clear(){ write([]); }

  window.SolitudeCart = { read, write, count, subtotal, add, update, remove, clear, CATALOG };

  /* ---- Formatting ----------------------------------------------- */
  function usd(n){ return '$' + Number(n).toLocaleString('en-US'); }
  function num4(n){ return String(n).padStart(4, '0'); }
  window.usd = usd; window.num4 = num4;

  /* ---- Populate edition UI -------------------------------------- */
  function populateEdition(){
    const s = editionState();
    const set = (sel, val) => document.querySelectorAll(sel).forEach(el => el.textContent = val);
    set('[data-ed-claimed]', s.claimed.toLocaleString('en-US'));
    set('[data-ed-total]', s.total.toLocaleString('en-US'));
    set('[data-ed-current]', usd(s.hardcover));
    set('[data-ed-hardcover]', usd(s.hardcover));
    set('[data-ed-signature]', usd(s.signature));
    set('[data-ed-final]', usd(s.final));
    set('[data-ed-reserve-no]', 'No. ' + num4(s.reserveNo));
    set('[data-ed-reserve-num]', num4(s.reserveNo));
    set('[data-ed-next-no]', s.nextStepNo ? ('No. ' + num4(s.nextStepNo)) : '—');
    set('[data-ed-remaining-tier]', s.remainingInTier.toLocaleString('en-US'));
    // progress fills
    document.querySelectorAll('[data-ed-fill]').forEach(el => el.style.width = (s.pct * 100).toFixed(1) + '%');
    // active ladder row
    document.querySelectorAll('[data-tier]').forEach((row, i) => row.classList.toggle('is-current', i === s.tierIndex));
    // dynamic reserve buttons (price baked into label)
    document.querySelectorAll('[data-reserve-label]').forEach(el => {
      const id = el.dataset.reserveLabel;
      el.textContent = usd(CATALOG[id] ? CATALOG[id].price : s.hardcover);
    });
  }
  window.populateEdition = populateEdition;

  /* ---- Toast ----------------------------------------------------- */
  let toastTimer;
  function showToast(product){
    let t = document.querySelector('.toast');
    if (!t){ t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    const no = num4(editionState().reserveNo);
    t.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6L9 17l-5-5"/></svg>' +
      '<span><em>' + product.title + '</em> — number reserved.</span>';
    requestAnimationFrame(() => t.classList.add('is-shown'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-shown'), 2600);
  }

  /* ---- Cart drawer rendering ------------------------------------ */
  function renderCart(){
    const drawer = document.querySelector('[data-cart]');
    if (!drawer) return;
    const body = drawer.querySelector('[data-cart-body]');
    const items = read();
    if (!items.length){
      body.innerHTML =
        '<div class="cart__empty">' +
          '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color:var(--gold-soft); margin:0 auto;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' +
          '<p>No number reserved yet.<br/>The edition is open at its lowest price.</p>' +
          '<a href="index.html#price" class="link-arrow">See the price ladder →</a>' +
        '</div>';
    } else {
      body.innerHTML = items.map(it => {
        const p = CATALOG[it.id];
        const line = (it.price || p.price) * it.qty;
        return '<div class="cart-item">' +
          '<div class="cart-item__img"><img src="' + p.img + '" alt=""></div>' +
          '<div class="cart-item__body">' +
            '<div>' +
              '<h4 class="cart-item__title">' + p.title + '<em>Reserved No. ' + num4(it.no || editionState().reserveNo) + '</em></h4>' +
              '<p class="cart-item__sub">' + p.kind + '</p>' +
            '</div>' +
            '<div class="cart-item__qty">' +
              '<button data-cart-dec="' + p.id + '" aria-label="Fewer">−</button>' +
              '<span>' + it.qty + '</span>' +
              '<button data-cart-inc="' + p.id + '" aria-label="More">+</button>' +
            '</div>' +
          '</div>' +
          '<div style="text-align:right; display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div class="cart-item__price">' + usd(line) + '</div>' +
            '<button class="cart-item__remove" data-cart-rm="' + p.id + '">Release</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }
    const sub = subtotal();
    drawer.querySelector('[data-cart-subtotal]').textContent = sub > 0 ? usd(sub) : '—';
    const shipEl = drawer.querySelector('[data-cart-ship]');
    if (shipEl) shipEl.textContent = sub > 0 ? 'Complimentary' : '—';
    drawer.querySelector('[data-cart-total]').textContent = sub > 0 ? usd(sub) : '—';
    const checkout = drawer.querySelector('[data-cart-checkout]');
    if (checkout){ checkout.style.opacity = items.length ? '1' : '.4'; checkout.style.pointerEvents = items.length ? 'auto' : 'none'; }

    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = count();
      el.style.display = count() > 0 ? 'inline-flex' : 'none';
    });
  }

  function openCart(){
    const overlay = document.querySelector('[data-cart-overlay]');
    const drawer = document.querySelector('[data-cart]');
    if (!drawer) return;
    drawer.classList.add('is-open');
    overlay && overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart(){
    const d = document.querySelector('[data-cart]'); d && d.classList.remove('is-open');
    const o = document.querySelector('[data-cart-overlay]'); o && o.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  window.openCart = openCart; window.closeCart = closeCart;

  /* ---- Init ------------------------------------------------------ */
  function init(){
    populateEdition();

    // Measure topbar height → set CSS var so nav sits directly below it
    const topbarEl = document.querySelector('.topbar');
    function setTopbarHeight(){
      const h = topbarEl ? topbarEl.offsetHeight : 42;
      document.documentElement.style.setProperty('--topbar-h', h + 'px');
    }
    setTopbarHeight();
    window.addEventListener('resize', setTopbarHeight, { passive: true });

    // Nav scroll state
    const nav = document.querySelector('.nav');
    if (nav){
      const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 30);
      onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Reveal on scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Floating dust particles
    document.querySelectorAll('[data-particles]').forEach(host => {
      const n = parseInt(host.dataset.particles || '24', 10);
      for (let i = 0; i < n; i++){
        const p = document.createElement('span');
        p.className = 'particle';
        p.style.left = (Math.random() * 100) + '%';
        p.style.animationDelay = (Math.random() * 12) + 's';
        p.style.animationDuration = (8 + Math.random() * 10) + 's';
        p.style.opacity = (0.3 + Math.random() * 0.5).toString();
        p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
        host.appendChild(p);
      }
    });

    // Delegated clicks
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn){
        e.preventDefault();
        const id = addBtn.dataset.add;
        const qtyEl = document.querySelector('[data-qty-for="' + id + '"]');
        const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
        add(id, qty);
        return;
      }
      if (e.target.closest('[data-cart-open]')){ e.preventDefault(); renderCart(); openCart(); return; }
      if (e.target.closest('[data-cart-close]')){ closeCart(); return; }
      if (e.target.closest('[data-cart-overlay]')){ closeCart(); return; }

      const inc = e.target.closest('[data-cart-inc]'); if (inc){
        const id = inc.dataset.cartInc; const it = read().find(i => i.id === id);
        if (it) update(id, it.qty + 1); return;
      }
      const dec = e.target.closest('[data-cart-dec]'); if (dec){
        const id = dec.dataset.cartDec; const it = read().find(i => i.id === id);
        if (it && it.qty > 1) update(id, it.qty - 1); else if (it) remove(id);
        return;
      }
      const rm = e.target.closest('[data-cart-rm]'); if (rm){ remove(rm.dataset.cartRm); return; }

      const qPlus = e.target.closest('[data-qty-plus]'); if (qPlus){
        const t = document.querySelector('[data-qty-for="' + qPlus.dataset.qtyPlus + '"]');
        if (t){ const v = parseInt(t.textContent, 10); const max = CATALOG[qPlus.dataset.qtyPlus].max; t.textContent = Math.min(v + 1, max); }
        return;
      }
      const qMinus = e.target.closest('[data-qty-minus]'); if (qMinus){
        const t = document.querySelector('[data-qty-for="' + qMinus.dataset.qtyMinus + '"]');
        if (t){ const v = parseInt(t.textContent, 10); t.textContent = Math.max(1, v - 1); }
        return;
      }
    });

    document.addEventListener('cart:changed', renderCart);
    renderCart();

    // Countdown — pre-launch / current-price window
    document.querySelectorAll('[data-countdown]').forEach(el => {
      let target = parseInt(localStorage.getItem('si-countdown') || '0', 10);
      if (!target || target < Date.now()){
        target = Date.now() + 9 * 24 * 3600 * 1000 + 7 * 3600 * 1000;
        localStorage.setItem('si-countdown', target.toString());
      }
      const tick = () => {
        const ms = Math.max(0, target - Date.now());
        const d = Math.floor(ms / 86400000);
        const h = Math.floor((ms % 86400000) / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        el.innerHTML =
          '<span>' + String(d).padStart(2,'0') + '</span><em>days</em>' +
          '<span>' + String(h).padStart(2,'0') + '</span><em>hrs</em>' +
          '<span>' + String(m).padStart(2,'0') + '</span><em>min</em>' +
          '<span>' + String(s).padStart(2,'0') + '</span><em>sec</em>';
      };
      tick(); setInterval(tick, 1000);
    });

    // Poem reader
    document.querySelectorAll('[data-poem-reader]').forEach(reader => {
      const poems = reader.querySelectorAll('.poem');
      const dots = reader.querySelectorAll('.poem-nav__dot');
      let i = 0;
      const go = (n) => {
        i = (n + poems.length) % poems.length;
        poems.forEach((p, idx) => p.classList.toggle('is-active', idx === i));
        dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
      };
      const prev = reader.querySelector('[data-poem-prev]');
      const next = reader.querySelector('[data-poem-next]');
      prev && prev.addEventListener('click', () => go(i - 1));
      next && next.addEventListener('click', () => go(i + 1));
      dots.forEach((d, idx) => d.addEventListener('click', () => go(idx)));
      let auto = setInterval(() => go(i + 1), 9000);
      reader.addEventListener('mouseenter', () => clearInterval(auto));
      reader.addEventListener('mouseleave', () => auto = setInterval(() => go(i + 1), 9000));
    });

    // Sticky buy bar
    const sticky = document.querySelector('[data-sticky-buy]');
    if (sticky){
      const trigger = document.querySelector(sticky.dataset.stickyTrigger || '.hero');
      const onSc = () => { if (!trigger) return; sticky.classList.toggle('is-shown', trigger.getBoundingClientRect().bottom < 0); };
      onSc(); window.addEventListener('scroll', onSc, { passive: true });
    }

    // Mobile burger menu
    const burger = document.querySelector('[data-burger]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const burgerClose = document.querySelector('[data-burger-close]');

    function openMobileMenu() {
      if (!burger || !mobileMenu) return;
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
      if (!burger || !mobileMenu) return;
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    burger && burger.addEventListener('click', () => {
      burger.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
    });
    burgerClose && burgerClose.addEventListener('click', closeMobileMenu);
    // Close on mobile link click
    document.querySelectorAll('[data-mobile-link]').forEach(l => l.addEventListener('click', closeMobileMenu));
    // Close on Escape
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

    // Active nav link
    const links = document.querySelectorAll('.nav__links a[href^="#"]');
    if (links.length){
      const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
      const onSc2 = () => {
        let curr = null;
        sections.forEach(s => { if (s.getBoundingClientRect().top < window.innerHeight * 0.4) curr = s; });
        links.forEach(l => l.classList.toggle('is-active', curr && '#' + curr.id === l.getAttribute('href')));
      };
      onSc2(); window.addEventListener('scroll', onSc2, { passive: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
