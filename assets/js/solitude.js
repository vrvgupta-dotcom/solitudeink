/* ====================================================================
   SOLITUDE INK — Shared UI + Cart
   ==================================================================== */

(function(){
  'use strict';

  // ---- Catalog (single source of truth) -------------------------
  const CATALOG = {
    'collector': {
      id: 'collector',
      title: 'The First Movement',
      subtitle: 'Collector Edition · Books 1–3',
      img: 'assets/img/collector-dark.jpg',
      price: 4800,
      compareAt: 5600,
      kind: 'Collector Edition Box Set',
      max: 4
    },
    'book-1': {
      id: 'book-1',
      title: 'पहली बारिश',
      subtitle: 'Pehli Baarish · First Rain',
      img: 'assets/img/book1-mockup.jpg',
      price: 1280,
      compareAt: null,
      kind: 'Hardcover · Book One',
      max: 8
    }
  };

  // ---- Cart store ------------------------------------------------
  const KEY = 'solitude-ink-cart';
  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch(e) { return []; }
  }
  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    notify();
  }
  function notify() {
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: { items: read(), count: count(), subtotal: subtotal() }}));
  }
  function count() { return read().reduce((n, it) => n + it.qty, 0); }
  function subtotal() {
    return read().reduce((n, it) => {
      const p = CATALOG[it.id]; return p ? n + p.price * it.qty : n;
    }, 0);
  }
  function add(id, qty=1) {
    if (!CATALOG[id]) return;
    const items = read();
    const ex = items.find(i => i.id === id);
    if (ex) ex.qty = Math.min(ex.qty + qty, CATALOG[id].max);
    else items.push({ id, qty });
    write(items);
    showToast(CATALOG[id]);
    openCart();
  }
  function update(id, qty) {
    const items = read().map(i => i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, CATALOG[id].max)) } : i);
    write(items);
  }
  function remove(id) {
    write(read().filter(i => i.id !== id));
  }
  function clear() { write([]); }

  window.SolitudeCart = { read, write, count, subtotal, add, update, remove, clear, CATALOG };

  // ---- Formatting ------------------------------------------------
  function inr(n) { return '₹' + n.toLocaleString('en-IN'); }
  window.inr = inr;

  // ---- Toast -----------------------------------------------------
  let toastTimer;
  function showToast(product) {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6L9 17l-5-5"/></svg>' +
      '<span><em>' + product.title + '</em> placed in your reading list.</span>';
    requestAnimationFrame(() => t.classList.add('is-shown'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-shown'), 2400);
  }

  // ---- Cart drawer rendering -------------------------------------
  function renderCart() {
    const drawer = document.querySelector('[data-cart]');
    if (!drawer) return;
    const body = drawer.querySelector('[data-cart-body]');
    const items = read();
    if (!items.length) {
      body.innerHTML =
        '<div class="cart__empty">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color:var(--gold-soft); margin:0 auto;"><path d="M4 6h16l-1.5 12a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 6z"/><path d="M9 10V5a3 3 0 0 1 6 0v5"/></svg>' +
          '<p>Your reading list is empty.<br/>Choose a book to begin.</p>' +
          '<a href="index.html#books" class="link-arrow">Browse the collection →</a>' +
        '</div>';
    } else {
      body.innerHTML = items.map(it => {
        const p = CATALOG[it.id];
        return '<div class="cart-item">' +
          '<div class="cart-item__img"><img src="' + p.img + '" alt=""></div>' +
          '<div class="cart-item__body">' +
            '<div>' +
              '<h4 class="cart-item__title">' + p.title + '<em>' + p.subtitle + '</em></h4>' +
              '<p class="cart-item__sub">' + p.kind + '</p>' +
            '</div>' +
            '<div class="cart-item__qty">' +
              '<button data-cart-dec="' + p.id + '">−</button>' +
              '<span>' + it.qty + '</span>' +
              '<button data-cart-inc="' + p.id + '">+</button>' +
            '</div>' +
          '</div>' +
          '<div style="text-align:right; display:flex; flex-direction:column; justify-content:space-between;">' +
            '<div class="cart-item__price">' + inr(p.price * it.qty) + '</div>' +
            '<button class="cart-item__remove" data-cart-rm="' + p.id + '">Remove</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }
    const sub = subtotal();
    const ship = sub > 0 ? (sub >= 3000 ? 0 : 180) : 0;
    drawer.querySelector('[data-cart-subtotal]').textContent = inr(sub);
    drawer.querySelector('[data-cart-ship]').textContent = sub >= 3000 ? 'Complimentary' : (sub > 0 ? inr(ship) : '—');
    drawer.querySelector('[data-cart-total]').textContent = inr(sub + ship);
    const checkout = drawer.querySelector('[data-cart-checkout]');
    if (checkout) checkout.style.opacity = items.length ? '1' : '.4';
    if (checkout) checkout.style.pointerEvents = items.length ? 'auto' : 'none';

    // counts in nav
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = count();
      el.style.display = count() > 0 ? 'inline-flex' : 'none';
    });
  }

  function openCart() {
    const overlay = document.querySelector('[data-cart-overlay]');
    const drawer = document.querySelector('[data-cart]');
    if (!drawer) return;
    drawer.classList.add('is-open');
    overlay && overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    document.querySelector('[data-cart]') && document.querySelector('[data-cart]').classList.remove('is-open');
    document.querySelector('[data-cart-overlay]') && document.querySelector('[data-cart-overlay]').classList.remove('is-open');
    document.body.style.overflow = '';
  }
  window.openCart = openCart;
  window.closeCart = closeCart;

  // ---- Init ------------------------------------------------------
  function init() {
    // 1. Nav scroll
    const nav = document.querySelector('.nav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 30);
      onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    }

    // 2. Reveal on scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // 3. Particles
    document.querySelectorAll('[data-particles]').forEach(host => {
      const n = parseInt(host.dataset.particles || '24', 10);
      for (let i = 0; i < n; i++) {
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

    // 4. Add-to-cart buttons
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn) {
        e.preventDefault();
        const id = addBtn.dataset.add;
        const qtyEl = document.querySelector('[data-qty-for="' + id + '"]');
        const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
        add(id, qty);
        return;
      }
      if (e.target.closest('[data-cart-open]')) { e.preventDefault(); renderCart(); openCart(); return; }
      if (e.target.closest('[data-cart-close]')) { closeCart(); return; }
      if (e.target.closest('[data-cart-overlay]')) { closeCart(); return; }

      const inc = e.target.closest('[data-cart-inc]'); if (inc) {
        const id = inc.dataset.cartInc; const items = read(); const it = items.find(i => i.id === id);
        if (it) update(id, it.qty + 1); return;
      }
      const dec = e.target.closest('[data-cart-dec]'); if (dec) {
        const id = dec.dataset.cartDec; const items = read(); const it = items.find(i => i.id === id);
        if (it && it.qty > 1) update(id, it.qty - 1);
        else if (it) remove(id);
        return;
      }
      const rm = e.target.closest('[data-cart-rm]'); if (rm) { remove(rm.dataset.cartRm); return; }

      // qty pickers
      const qPlus = e.target.closest('[data-qty-plus]'); if (qPlus) {
        const t = document.querySelector('[data-qty-for="' + qPlus.dataset.qtyPlus + '"]');
        if (t) { const v = parseInt(t.textContent, 10); const max = CATALOG[qPlus.dataset.qtyPlus].max; t.textContent = Math.min(v + 1, max); }
        return;
      }
      const qMinus = e.target.closest('[data-qty-minus]'); if (qMinus) {
        const t = document.querySelector('[data-qty-for="' + qMinus.dataset.qtyMinus + '"]');
        if (t) { const v = parseInt(t.textContent, 10); t.textContent = Math.max(1, v - 1); }
        return;
      }
    });

    document.addEventListener('cart:changed', renderCart);
    renderCart();

    // 5. Countdown timer
    document.querySelectorAll('[data-countdown]').forEach(el => {
      // target: 14 days from now, but stable per browser
      let target = parseInt(localStorage.getItem('si-countdown') || '0', 10);
      if (!target || target < Date.now()) {
        target = Date.now() + 14 * 24 * 3600 * 1000 - 3 * 3600 * 1000;
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

    // 6. Poem reader
    document.querySelectorAll('[data-poem-reader]').forEach(reader => {
      const poems = reader.querySelectorAll('.poem');
      const dots = reader.querySelectorAll('.poem-nav__dot');
      let i = 0;
      const go = (n) => {
        i = (n + poems.length) % poems.length;
        poems.forEach((p, idx) => p.classList.toggle('is-active', idx === i));
        dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
      };
      reader.querySelector('[data-poem-prev]').addEventListener('click', () => go(i - 1));
      reader.querySelector('[data-poem-next]').addEventListener('click', () => go(i + 1));
      dots.forEach((d, idx) => d.addEventListener('click', () => go(idx)));
      // Auto advance
      let auto = setInterval(() => go(i + 1), 9000);
      reader.addEventListener('mouseenter', () => clearInterval(auto));
      reader.addEventListener('mouseleave', () => auto = setInterval(() => go(i + 1), 9000));
    });

    // 7. Sticky buy bar
    const sticky = document.querySelector('[data-sticky-buy]');
    if (sticky) {
      const trigger = document.querySelector(sticky.dataset.stickyTrigger || '.hero');
      const onSc = () => {
        if (!trigger) return;
        const r = trigger.getBoundingClientRect();
        sticky.classList.toggle('is-shown', r.bottom < 0);
      };
      onSc(); window.addEventListener('scroll', onSc, { passive: true });
    }

    // 8. Active nav link by section
    const links = document.querySelectorAll('.nav__links a[href^="#"]');
    if (links.length) {
      const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
      const onSc2 = () => {
        let curr = null;
        sections.forEach(s => {
          if (s.getBoundingClientRect().top < window.innerHeight * 0.4) curr = s;
        });
        links.forEach(l => l.classList.toggle('is-active', curr && '#' + curr.id === l.getAttribute('href')));
      };
      onSc2(); window.addEventListener('scroll', onSc2, { passive: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
