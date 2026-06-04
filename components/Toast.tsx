'use client';

import { useEffect, useRef, useState } from 'react';

interface ToastMsg { id: number; text: string; }

let _show: ((msg: string) => void) | null = null;
export const showToast = (msg: string) => _show?.(msg);

export default function Toast() {
  const [msg, setMsg]       = useState<ToastMsg | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    _show = (text: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMsg({ id: Date.now(), text });
      setVisible(true);
      timerRef.current = setTimeout(() => setVisible(false), 2600);
    };
    return () => { _show = null; };
  }, []);

  return (
    <div className={`toast${visible ? ' is-shown' : ''}`} role="status" aria-live="polite">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>Added — <em>{msg?.text}</em></span>
    </div>
  );
}
