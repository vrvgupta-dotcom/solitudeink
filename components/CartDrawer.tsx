'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, update, remove, total } = useCart();

  return (
    <>
      <div className={`cart-overlay${open ? ' is-open' : ''}`} onClick={onClose} />
      <aside className={`cart${open ? ' is-open' : ''}`} aria-label="Cart">
        <div className="cart__head">
          <h3>Your Reserve <em>{items.length > 0 ? `· ${items.length}` : ''}</em></h3>
          <button className="cart__close" onClick={onClose} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cart__body">
          {items.length === 0 ? (
            <div className="cart__empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto', color: 'var(--gold-deep)' }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Your reserve is empty.</p>
              <Link href="/the-edition" className="link-arrow" onClick={onClose}>
                Enter the universe <span className="arrow">→</span>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item__img">
                  <Image
                    src={item.id === 'hardcover' ? '/si-slipcase-dark.jpg' : '/si-slipcase-ivory.jpg'}
                    alt={item.title}
                    width={90}
                    height={120}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div className="cart-item__body">
                  <div>
                    <p className="cart-item__title">{item.title}<em>Edition {item.id === 'hardcover' ? 'I' : 'II'}</em></p>
                    <p className="cart-item__sub">No. {String(item.no).padStart(4, '0')}</p>
                  </div>
                  <div className="cart-item__qty">
                    <button onClick={() => update(item.id, item.qty - 1)} aria-label="Decrease">−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => update(item.id, item.qty + 1)} aria-label="Increase">+</button>
                  </div>
                  <button className="cart-item__remove" onClick={() => remove(item.id)}>Remove</button>
                </div>
                <span className="cart-item__price">${(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart__foot">
            <div className="cart__row">
              <span>Subtotal</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div className="cart__row">
              <span>White-glove delivery</span>
              <span style={{ color: 'var(--gold)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>Included</span>
            </div>
            <div className="cart__row total">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <Link href="/reserve" className="btn btn--gold" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }} onClick={onClose}>
              Proceed to Reserve
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
