'use client';

import './globals.css';
import { useState } from 'react';
import { CartProvider, useCart } from '@/components/CartProvider';
import Topbar from '@/components/Topbar';
import Nav from '@/components/Nav';
import CartDrawer from '@/components/CartDrawer';
import Toast from '@/components/Toast';
import type { EditionState } from '@/lib/edition';
import { deriveEditionState } from '@/lib/edition';

// Hardcoded edition state seeded server-side — swap fetchClaimed() in lib/edition.ts when backend is ready
const EDITION: EditionState = deriveEditionState(340);

function Shell({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <Topbar edition={EDITION} />
      <Nav cartCount={count} onCartOpen={() => setCartOpen(true)} />
      <main>{children}</main>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toast />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi-Latn" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Solitude Ink — आत्म-मिलन – आत्म-विरह</title>
        <meta name="description" content="A finite 10-book Hindi poetry universe by Yatendra Chandra. 2,000 numbered sets. The price only rises." />
      </head>
      <body>
        <CartProvider>
          <Shell>{children}</Shell>
        </CartProvider>
      </body>
    </html>
  );
}
