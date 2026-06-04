'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Props {
  cartCount: number;
  onCartOpen: () => void;
}

export default function Nav({ cartCount, onCartOpen }: Props) {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        {/* Brand */}
        <Link href="/" className="nav__brand">
          <svg viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M11 2C11 2 4 8 4 16C4 20.418 7.134 24 11 24C14.866 24 18 20.418 18 16C18 8 11 2 11 2Z" stroke="#c9a96a" strokeWidth="1" fill="none"/>
            <line x1="11" y1="24" x2="11" y2="28" stroke="#c9a96a" strokeWidth="1"/>
          </svg>
          Solitude Ink
        </Link>

        {/* Centre links */}
        <div className="nav__links">
          <a href="/#price">Price</a>
          <a href="/#editions">Editions</a>
          <a href="/#movements">Movements</a>
          <a href="/#read">A Poem</a>
          <a href="/#author">Author</a>
        </div>

        {/* Right */}
        <div className="nav__right">
          <Link href="/the-edition" className="nav__cart">The Edition</Link>
          <button className="nav__cart" onClick={onCartOpen} aria-label="Open cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="nav__cart-count">{cartCount}</span>
            )}
          </button>
          <button
            className={`nav__burger${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div className={`nav__mobile-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <button className="nav__mobile-close" onClick={closeMenu} aria-label="Close menu">×</button>
        <a href="/#price"     onClick={closeMenu}>Price Ladder</a>
        <div className="menu-divider" />
        <a href="/#editions"  onClick={closeMenu}>The <em>Two</em> Editions</a>
        <div className="menu-divider" />
        <a href="/#movements" onClick={closeMenu}>Ten Movements</a>
        <div className="menu-divider" />
        <a href="/#read"      onClick={closeMenu}>Read a <em>Poem</em></a>
        <div className="menu-divider" />
        <a href="/#author"    onClick={closeMenu}>The Author</a>
        <Link href="/the-edition" className="menu-reserve" onClick={closeMenu}>
          Reserve Your Number →
        </Link>
      </div>
    </>
  );
}
