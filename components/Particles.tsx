'use client';

import { useEffect, useRef } from 'react';

interface Props {
  count?: number;
  className?: string;
}

export default function Particles({ count = 32, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left   = Math.random() * 100 + '%';
      p.style.animationDelay    = Math.random() * 12 + 's';
      p.style.animationDuration = (8 + Math.random() * 10) + 's';
      el.appendChild(p);
    }
  }, [count]);

  return <div ref={ref} className={className ?? 'hero__particles'} aria-hidden />;
}
