'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { deriveEditionState } from '@/lib/edition';

// ⚠️ In production, price MUST be validated server-side at submission — never trust client price.
const edition = deriveEditionState(340);

type Step = 1 | 2 | 3;

interface DeliveryForm {
  firstName: string; lastName: string;
  email: string; phone: string;
  address: string; apt: string;
  city: string; state: string; postal: string;
  country: string;
  deliveryType: 'standard' | 'gift';
  note: string;
}

interface PaymentForm {
  method: 'card' | 'paypal' | 'bank';
  cardholder: string; cardNumber: string;
  expiry: string; cvc: string;
  newsletter: boolean;
}

const emptyDelivery: DeliveryForm = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', apt: '', city: '', state: '', postal: '', country: 'United States',
  deliveryType: 'standard', note: '',
};
const emptyPayment: PaymentForm = {
  method: 'card', cardholder: '', cardNumber: '', expiry: '', cvc: '', newsletter: false,
};

export default function ReservePage() {
  const [step, setStep]         = useState<Step>(1);
  const [delivery, setDelivery] = useState<DeliveryForm>(emptyDelivery);
  const [payment, setPayment]   = useState<PaymentForm>(emptyPayment);
  const [orderRef]              = useState(() => `SI-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const { items, total, clear } = useCart();
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const setD = (k: keyof DeliveryForm, v: string) =>
    setDelivery((prev) => ({ ...prev, [k]: v }));
  const setP = (k: keyof PaymentForm, v: string | boolean) =>
    setPayment((prev) => ({ ...prev, [k]: v }));

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ⚠️ PRODUCTION: validate prices server-side here before charging
    clear();
    setStep(3);
  };

  const reserveNo = String(edition.reserveNo).padStart(4, '0');

  return (
    <div className="checkout" ref={topRef}>
      <div className="wrap">
        {/* Minimal nav breadcrumb */}
        <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/the-edition" style={{ fontSize: '11px', letterSpacing: '.26em', textTransform: 'uppercase', color: 'rgba(243,232,210,0.5)' }}>
            ← The Edition
          </Link>
        </div>

        {/* Steps indicator */}
        <div className="steps">
          {(['Delivery', 'Payment', 'Confirmed'] as const).map((label, i) => {
            const n = (i + 1) as Step;
            const cls = step === n ? 'step is-active' : step > n ? 'step is-done' : 'step';
            return (
              <div key={label} style={{ display: 'contents' }}>
                {i > 0 && <div className="step__sep" />}
                <div className={cls}>
                  <span className="step__num">{step > n ? '✓' : n}</span>
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="checkout__grid">
          {/* ── Main panel ── */}
          <div className="checkout__main">

            {/* Step 1 — Delivery */}
            {step === 1 && (
              <form onSubmit={handleDeliverySubmit}>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 300, marginBottom: '32px' }}>
                  Delivery
                </h2>
                <div className="field-row">
                  <div className="field"><label>First Name</label><input required value={delivery.firstName} onChange={e => setD('firstName', e.target.value)} /></div>
                  <div className="field"><label>Last Name</label><input required value={delivery.lastName} onChange={e => setD('lastName', e.target.value)} /></div>
                </div>
                <div className="field-row">
                  <div className="field"><label>Email</label><input type="email" required value={delivery.email} onChange={e => setD('email', e.target.value)} /></div>
                  <div className="field"><label>Phone</label><input value={delivery.phone} onChange={e => setD('phone', e.target.value)} /></div>
                </div>
                <div className="field"><label>Address</label><input required value={delivery.address} onChange={e => setD('address', e.target.value)} /></div>
                <div className="field"><label>Apartment / Suite (optional)</label><input value={delivery.apt} onChange={e => setD('apt', e.target.value)} /></div>
                <div className="field-row-3">
                  <div className="field"><label>City</label><input required value={delivery.city} onChange={e => setD('city', e.target.value)} /></div>
                  <div className="field"><label>State / Region</label><input value={delivery.state} onChange={e => setD('state', e.target.value)} /></div>
                  <div className="field"><label>Postal Code</label><input required value={delivery.postal} onChange={e => setD('postal', e.target.value)} /></div>
                </div>
                <div className="field">
                  <label>Country</label>
                  <select value={delivery.country} onChange={e => setD('country', e.target.value)}>
                    {['United States','United Kingdom','Canada','Australia','India','Germany','France','Japan','Singapore','Other'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <p style={{ fontSize: '10px', letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(243,232,210,0.5)', margin: '32px 0 14px' }}>Presentation</p>
                <div className="radio-group">
                  {[
                    { id: 'standard', label: 'White-glove · hand-wrapped', sub: 'Black tissue, ribbon, and your number card' },
                    { id: 'gift',     label: 'Gift presentation · with inscription', sub: 'Add a personal message from you' },
                  ].map(opt => (
                    <label key={opt.id} className="radio-card">
                      <input type="radio" name="delivery" value={opt.id} checked={delivery.deliveryType === opt.id} onChange={() => setD('deliveryType', opt.id)} />
                      <span className="dot" />
                      <div><div className="label-main">{opt.label}</div><div className="label-sub">{opt.sub}</div></div>
                      <span className="label-price" style={{ fontFamily: 'var(--serif)', color: 'var(--gold)', fontSize: '14px' }}>Included</span>
                    </label>
                  ))}
                </div>

                <div className="field" style={{ marginTop: '16px' }}>
                  <label>Personal note / inscription (optional)</label>
                  <textarea rows={3} value={delivery.note} onChange={e => setD('note', e.target.value)} style={{ resize: 'vertical' }} />
                </div>

                <button type="submit" className="btn btn--gold btn--lg" style={{ marginTop: '32px' }}>
                  Continue to Payment <span className="arrow">→</span>
                </button>
              </form>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <form onSubmit={handlePaymentSubmit}>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 300, marginBottom: '32px' }}>
                  Payment
                </h2>

                {/* ⚠️ PRODUCTION: Replace with Stripe Elements — never handle raw card numbers server-side */}
                <div className="radio-group" style={{ marginBottom: '28px' }}>
                  {[
                    { id: 'card',   label: 'Card',          sub: 'Visa, Mastercard, Amex' },
                    { id: 'paypal', label: 'PayPal',         sub: 'Redirect to PayPal' },
                    { id: 'bank',   label: 'Bank transfer',  sub: 'Details sent by email' },
                  ].map(opt => (
                    <label key={opt.id} className="radio-card">
                      <input type="radio" name="method" value={opt.id} checked={payment.method === opt.id} onChange={() => setP('method', opt.id)} />
                      <span className="dot" />
                      <div><div className="label-main">{opt.label}</div><div className="label-sub">{opt.sub}</div></div>
                    </label>
                  ))}
                </div>

                {payment.method === 'card' && (
                  <>
                    <div className="field"><label>Cardholder Name</label><input required value={payment.cardholder} onChange={e => setP('cardholder', e.target.value)} /></div>
                    <div className="field"><label>Card Number</label><input required placeholder="•••• •••• •••• ••••" maxLength={19} value={payment.cardNumber} onChange={e => setP('cardNumber', e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim())} /></div>
                    <div className="field-row">
                      <div className="field"><label>Expiry</label><input required placeholder="MM / YY" maxLength={7} value={payment.expiry} onChange={e => setP('expiry', e.target.value)} /></div>
                      <div className="field"><label>CVC</label><input required placeholder="•••" maxLength={4} value={payment.cvc} onChange={e => setP('cvc', e.target.value)} /></div>
                    </div>
                  </>
                )}

                <label style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginTop: '28px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={payment.newsletter} onChange={e => setP('newsletter', e.target.checked)} style={{ marginTop: '3px' }} />
                  <span style={{ fontSize: '13px', color: 'rgba(243,232,210,0.65)', lineHeight: 1.6 }}>
                    Notify me when Yatendra publishes again — nothing else.
                  </span>
                </label>

                <div style={{ display: 'flex', gap: '12px', marginTop: '36px' }}>
                  <button type="button" className="btn btn--ghost" onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className="btn btn--gold btn--lg" style={{ flex: 1 }}>
                    Complete Reservation <span className="arrow">→</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 3 — Confirmation */}
            {step === 3 && (
              <div className="complete">
                <div className="complete__seal">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2>Thank you for <em>arriving early.</em></h2>
                <p>Your place in the universe is held.</p>
                <div className="complete__order">{orderRef}</div>
                <p style={{ fontFamily: 'var(--serif)', fontSize: '22px', color: 'var(--gold)', fontStyle: 'italic' }}>
                  Reserved No. {reserveNo} of 2,000
                </p>
                <p>Delivery: Monsoon 2026 · white-glove, presented for keeping</p>

                <div style={{ margin: '36px auto 0', padding: '24px 32px', border: '1px solid var(--gold-soft)', background: 'rgba(201,169,106,0.04)', maxWidth: '480px' }}>
                  {/* ⚠️ DEVANAGARI COPY-EDIT NEEDED */}
                  <p style={{ fontFamily: 'var(--deva)', fontSize: '20px', color: 'var(--gold-bright)', marginBottom: '10px' }}>
                    जो मिलता है, वो बिछड़ता है — जो बिछड़ता है, वो रहता है।
                  </p>
                  <p style={{ fontFamily: 'var(--hand)', fontSize: '32px', color: 'var(--gold)', marginTop: '16px' }}>
                    Yatendra
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
                  <Link href="/" className="btn btn--ghost">← Back to the universe</Link>
                  <a href="/#read" className="btn btn--ghost">Read a poem</a>
                </div>
              </div>
            )}
          </div>

          {/* ── Order summary ── */}
          {step !== 3 && (
            <div className="checkout__side">
              <p style={{ fontSize: '10px', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '22px' }}>Order Summary</p>

              {items.length === 0 ? (
                <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'rgba(243,232,210,0.55)', fontSize: '16px' }}>
                  Your reserve is empty.
                </p>
              ) : (
                <>
                  {items.map((item) => (
                    <div key={item.id} className="summary-item">
                      <Image
                        src={item.id === 'hardcover' ? '/si-slipcase-dark.jpg' : '/si-slipcase-ivory.jpg'}
                        alt={item.title}
                        width={60}
                        height={80}
                        style={{ objectFit: 'cover' }}
                      />
                      <div>
                        <div className="summary-item__title">{item.title}</div>
                        <div className="summary-item__sub">Reserved No. {String(item.no).padStart(4,'0')} · Qty {item.qty}</div>
                      </div>
                      <span className="summary-item__price">${(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="summary-totals">
                    <div className="cart__row">
                      <span>Subtotal</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    <div className="cart__row">
                      <span>White-glove delivery</span>
                      <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)' }}>Included</span>
                    </div>
                    <div className="cart__row total">
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}

              <div style={{ marginTop: '28px', padding: '20px', borderLeft: '1px solid var(--gold-soft)', background: 'rgba(201,169,106,0.04)' }}>
                <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '15px', color: 'rgba(243,232,210,0.78)', lineHeight: 1.6, margin: 0 }}>
                  "The price you pay today is the price of arriving early. It does not rise for you again."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
