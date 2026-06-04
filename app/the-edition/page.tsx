'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { showToast } from '@/components/Toast';
import { deriveEditionState } from '@/lib/edition';
import Reveal from '@/components/Reveal';

// ⚠️ In production, fetch claimed count server-side. Hardcoded 340 for now.
const edition = deriveEditionState(340);

const GALLERY = [
  { src: '/si-slipcase-dark.jpg',  alt: 'Slipcase — dark' },
  { src: '/si-slipcase-ivory.jpg', alt: 'Slipcase — natural light' },
  { src: '/book1-mockup.jpg',      alt: 'Book One · पहली बारिश' },
  { src: '/book2-mockup.jpg',      alt: 'Book Two · मानसी' },
  { src: '/book3-mockup.jpg',      alt: 'Book Three · नारी की आवाज़' },
];

const SPEC = [
  ['Books',          '10 volumes'],
  ['Binding',        'Cloth-bound hardcover, Smyth sewn'],
  ['Paper',          '100gsm natural laid paper'],
  ['Typography',     'Tiro Devanagari Hindi / Cormorant Garamond'],
  ['Numbering',      'Embossed gold on slipcase; hand-written in each volume'],
  ['Edition size',   '2,000 numbered sets · closes at 2,000'],
  ['Editions',       'Edition I (Hardcover) · Edition II (Signature Numbered)'],
  ['Signing',        'Edition II: all ten volumes signed by Yatendra Chandra'],
  ['Slipcase',       'Rigid black bookcloth, silk-lined'],
  ['Delivery',       'White-glove · worldwide · Monsoon 2026'],
  ['Shipping',       'Included in price — no additional charge, anywhere'],
  ['Returns',        'Not accepted — all sales are final once a number is assigned'],
];

export default function TheEditionPage() {
  const [activeImg, setActiveImg]   = useState(0);
  const [selected, setSelected]     = useState<'hardcover' | 'signature'>('hardcover');
  const [qty, setQty]               = useState(1);
  const [stickyShown, setStickyShown] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  const reserveNo   = String(edition.reserveNo).padStart(4, '0');
  const currentPrice = selected === 'hardcover' ? edition.hardcover : edition.signature;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setStickyShown(!e.isIntersecting),
      { threshold: 0 }
    );
    if (detailRef.current) obs.observe(detailRef.current);
    return () => obs.disconnect();
  }, []);

  const handleAdd = () => {
    const title = selected === 'hardcover' ? 'The Hardcover Universe' : 'The Signature Numbered Universe';
    add(selected, title, currentPrice, edition.reserveNo, qty);
    showToast(title);
  };

  const handleReserve = () => {
    handleAdd();
    window.location.href = '/reserve';
  };

  const pct = Math.round(edition.pct * 100);

  return (
    <>
      {/* ── Detail section ─────────────────────────────────── */}
      <section className="collector section" id="detail" ref={detailRef} style={{ paddingTop: 'calc(var(--topbar-h, 42px) + 80px + clamp(80px,11vw,160px))' }}>
        <div className="wrap">
          <div className="collector__stage">
            {/* Gallery */}
            <div>
              <div className="collector__hero-img">
                <Image
                  src={GALLERY[activeImg].src}
                  alt={GALLERY[activeImg].alt}
                  fill
                  priority
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px', marginTop: '10px' }} id="gallery-thumbs">
                {GALLERY.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      position: 'relative', aspectRatio: '4/3', overflow: 'hidden',
                      border: `1px solid ${i === activeImg ? 'var(--gold)' : 'var(--ink-line)'}`,
                      cursor: 'pointer', background: 'none', padding: 0,
                    }}
                    aria-label={img.alt}
                  >
                    <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Buy panel */}
            <div className="collector__detail">
              {/* ⚠️ DEVANAGARI COPY-EDIT NEEDED */}
              <h1 className="hero__deva" style={{ fontSize: 'clamp(28px,3.4vw,52px)', marginBottom: '12px' }}>
                आत्म-मिलन – आत्म-विरह
              </h1>
              <p className="lede" style={{ marginBottom: '22px' }}>
                A complete 10-book Hindi poetry universe by Yatendra Chandra.
                2,000 numbered sets. Pressed once. Never again.
              </p>

              {/* Live price */}
              <div className="collector__price">
                <span className="collector__price-now">${currentPrice}</span>
                <div>
                  <p className="collector__price-note">Current price → rises to ${selected === 'hardcover' ? edition.final : edition.final + 300}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(243,232,210,0.55)', marginTop: '4px', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
                    Your number would be {reserveNo} · {edition.remainingInTier} sets remain at this price
                  </p>
                </div>
              </div>

              {/* Edition selector */}
              <div className="radio-group" style={{ marginBottom: '22px' }}>
                {(['hardcover', 'signature'] as const).map((id) => {
                  const price = id === 'hardcover' ? edition.hardcover : edition.signature;
                  const label = id === 'hardcover' ? 'The Hardcover Universe' : 'The Signature Numbered Universe';
                  const sub   = id === 'hardcover' ? 'Edition I · Ten clothbound books' : 'Edition II · Numbered & signed by hand';
                  return (
                    <label key={id} className="radio-card">
                      <input type="radio" name="edition" value={id} checked={selected === id} onChange={() => setSelected(id)} />
                      <span className="dot" />
                      <div>
                        <div className="label-main">{label}</div>
                        <div className="label-sub">{sub}</div>
                      </div>
                      <span className="label-price">${price}</span>
                    </label>
                  );
                })}
              </div>

              {/* Includes */}
              <div className="collector__includes">
                <h4>What's included</h4>
                <ul>
                  {(
                    [
                      ['Ten clothbound volumes',      'All ten movements'],
                      ['Rigid black slipcase',         'Handmade'],
                      ['Hand-numbered in gold',        `No. ${reserveNo}`],
                      ...(selected === 'signature' ? [
                        ["Author's signature",        'All ten volumes'],
                        ['Personal handwritten note', 'By Yatendra Chandra'],
                      ] : []),
                      ['White-glove delivery',         'Worldwide · included'],
                    ] as [string, string][]
                  ).map(([label, note]) => (
                    <li key={label}>{label} <span>{note}</span></li>
                  ))}
                </ul>
              </div>

              {/* Stock bar */}
              <div className="stock-bar">
                <div className="stock-bar__track">
                  <div className="stock-bar__fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="stock-bar__meta">
                  <span><span className="stock-bar__count">{edition.claimed}</span> of {edition.total.toLocaleString()} reserved</span>
                  <span>{edition.remainingInTier} remain at ${currentPrice}</span>
                </div>
              </div>

              {/* Qty + Reserve */}
              <div className="buy-row" style={{ marginTop: '28px', alignItems: 'center' }}>
                <div className="qty">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(2, q + 1))} aria-label="Increase">+</button>
                </div>
                <button className="btn btn--gold btn--lg" style={{ flex: 1 }} onClick={handleAdd}>
                  Add to Reserve — ${currentPrice * qty}
                </button>
              </div>
              <button className="btn btn--ghost" style={{ width: '100%', marginTop: '10px' }} onClick={handleReserve}>
                Reserve &amp; check out now →
              </button>

              {/* Delivery note */}
              <p style={{ marginTop: '18px', fontSize: '11px', letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(243,232,210,0.5)', textAlign: 'center' }}>
                Monsoon 2026 · White-glove · worldwide
              </p>

              {/* Feature badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '22px' }}>
                {[
                  ['Numbered by hand', 'In gold on the slipcase'],
                  ['Signed',           'Edition II · all ten volumes'],
                  ['White-glove worldwide', 'No shipping charge'],
                  ["Today's price locked", 'At time of reservation'],
                ].map(([t, s]) => (
                  <div key={t} style={{ padding: '14px 16px', border: '1px solid var(--ink-line)', background: 'rgba(201,169,106,0.03)' }}>
                    <div style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>{t}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(243,232,210,0.55)' }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Price rung callout ─────────────────────────────── */}
      <section className="ladder section--tight" style={{ background: 'linear-gradient(180deg,#14110d,#0b0907)' }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow" style={{ textAlign: 'center', marginBottom: '32px' }}>The Rising Price</p>
            <div className="ladder__live">
              <div>
                <p className="k">Reserved so far</p>
                <p className="v">{edition.claimed}</p>
                <p className="sub">of {edition.total.toLocaleString()}</p>
              </div>
              <div>
                <p className="k">Current price</p>
                <p className="v">${edition.hardcover}</p>
                <p className="sub">{edition.remainingInTier} sets remain</p>
              </div>
              <div>
                <p className="k">Your number</p>
                <p className="v sm">{reserveNo}</p>
                <p className="sub">the next available</p>
              </div>
            </div>
            <div className="ladder__progress"><span style={{ width: `${pct}%` }} /></div>
          </Reveal>
        </div>
      </section>

      {/* ── Inside the Set ─────────────────────────────────── */}
      <section className="section" style={{ background: 'linear-gradient(180deg,#050402,#0b0907)' }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow" style={{ textAlign: 'center', marginBottom: '14px' }}>Inside the Set</p>
            <h2 className="section-head__title section-head--center" style={{ marginTop: 0, marginBottom: 'clamp(40px,5vw,64px)', maxWidth: '500px', margin: '0 auto clamp(40px,5vw,64px)' }}>
              Craft you can <em>hold.</em>
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(16px,2vw,28px)' }}>
              {[
                { src: '/si-slipcase-dark.jpg',  cap: 'The Slipcase', note: 'Black bookcloth, silk-lined' },
                { src: '/book1-mockup.jpg',       cap: 'पहली बारिश',  note: 'Book One of Ten' },
                { src: '/si-slipcase-ivory.jpg',  cap: 'Natural light', note: 'Spines in sequence' },
              ].map((c) => (
                <div key={c.src} style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', border: '1px solid var(--ink-line)' }}>
                  <Image src={c.src} alt={c.cap} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(5,4,2,0.8))' }} />
                  <div style={{ position: 'absolute', bottom: '18px', left: '18px', right: '18px' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '18px', marginBottom: '4px' }}>{c.cap}</div>
                    <div style={{ fontSize: '11px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(243,232,210,0.55)' }}>{c.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Spec Table ─────────────────────────────────────── */}
      <section className="section--tight" style={{ background: '#0b0907' }}>
        <div className="wrap" style={{ maxWidth: '860px' }}>
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: '32px' }}>Full Specification</p>
            {SPEC.map(([label, value]) => (
              <div key={label} className="spec-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px', padding: '16px 0', borderBottom: '1px solid var(--ink-line)', alignItems: 'baseline' }}>
                <span style={{ fontSize: '10.5px', letterSpacing: '.26em', textTransform: 'uppercase', color: 'rgba(243,232,210,0.45)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '17px', color: 'rgba(243,232,210,0.82)' }}>{value}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="final" style={{ padding: 'clamp(80px,10vw,160px) var(--gutter)' }}>
        <Reveal>
          <p className="eyebrow rule--center" style={{ position: 'relative', zIndex: 2 }}>Your number is waiting</p>
          <h2 className="final__title">Reserve No. {reserveNo} — <em>${edition.hardcover}</em></h2>
          <p className="final__sub">The price only rises. White-glove worldwide delivery included.</p>
        </Reveal>
        <Reveal delay={1}>
          <div className="final__ctas">
            <button className="btn btn--gold btn--lg" onClick={handleAdd}>
              Add to Reserve — ${currentPrice} <span className="arrow">→</span>
            </button>
            <button className="btn btn--ghost btn--lg" onClick={handleReserve}>
              Reserve &amp; check out now
            </button>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer__grid">
          <div className="footer__brand">
            {/* ⚠️ DEVANAGARI COPY-EDIT NEEDED */}
            <h3>आत्म-मिलन – आत्म-विरह</h3>
            <p>A finite 10-book Hindi poetry universe by Yatendra Chandra.</p>
            <p className="small">© 2026 Solitude Ink. All rights reserved.</p>
          </div>
          <div className="footer__col"><h5>The Edition</h5><ul><li><Link href="/">Home</Link></li><li><a href="#detail">Reserve</a></li></ul></div>
          <div className="footer__col"><h5>Reach</h5><ul><li><a href="mailto:hello@solitudeink.com">hello@solitudeink.com</a></li></ul></div>
          <div className="footer__col"><h5>Legal</h5><ul><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul></div>
        </div>
        <div className="footer__bottom">
          <span>Solitude Ink · Pressed once</span>
          <div className="footer__bottom-links"><a href="#">Privacy</a><a href="#">Terms</a></div>
        </div>
      </footer>

      {/* ── Sticky Buy Bar ─────────────────────────────────── */}
      <div className={`sticky-buy${stickyShown ? ' is-shown' : ''}`}>
        <div>
          <span className="sticky-buy__title">
            {selected === 'hardcover' ? 'The Hardcover Universe' : 'The Signature Universe'}
            <em> · Edition {selected === 'hardcover' ? 'I' : 'II'}</em>
          </span>
          <span className="sticky-buy__price">${currentPrice}</span>
        </div>
        <div className="sticky-buy__cta">
          <button className="btn btn--gold" onClick={handleAdd}>Reserve No. {reserveNo}</button>
        </div>
      </div>
    </>
  );
}
