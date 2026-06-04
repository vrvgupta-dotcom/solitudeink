'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { EditionState } from '@/lib/edition';

interface Props {
  edition: EditionState;
}

export default function Topbar({ edition }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const set = () => {
      if (ref.current) {
        document.documentElement.style.setProperty(
          '--topbar-h',
          ref.current.offsetHeight + 'px'
        );
      }
    };
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  const reserveNo = String(edition.reserveNo).padStart(4, '0');

  return (
    <div className="topbar" ref={ref}>
      <span className="topbar__live">
        <span className="topbar__pulse" />
        Pre-launch
      </span>
      <span className="topbar__dot topbar__hide-sm" />
      <span className="topbar__hide-sm">
        The Edition opens at{' '}
        <strong>${edition.hardcover}</strong> and rises as it sells
      </span>
      <span className="topbar__dot topbar__hide-sm" />
      <span>
        <strong>No. {reserveNo}</strong> of {edition.total.toLocaleString()} · your number
      </span>
      <span className="topbar__dot" />
      <Link href="/the-edition" className="topbar__cta">
        Reserve your number →
      </Link>
    </div>
  );
}
