'use client';

import { useEffect, useRef, useState } from 'react';

const POEMS = [
  {
    quote: 'जहाँ तुम नहीं थे, वहीं मैं था\nतुम्हारे न होने में तुम्हें ढूँढता था',
    // DEVANAGARI COPY-EDIT NEEDED: Please have a native Hindi speaker verify all poem text before launch
    en: 'Where you were not, there I was — searching for you in your absence.',
    cite: 'Movement I · पहली बारिश',
  },
  {
    quote: 'आत्मा ने आत्मा को पहचाना\nबिना शब्दों के, बिना देखे',
    // DEVANAGARI COPY-EDIT NEEDED
    en: 'The soul recognised the soul — without words, without sight.',
    cite: 'Movement III · मानसी',
  },
  {
    quote: 'विरह में भी मिलन है\nजो जाता है, वो रहता है',
    // DEVANAGARI COPY-EDIT NEEDED
    en: 'Even in separation there is union — what leaves, remains.',
    cite: 'Movement V · नारी की आवाज़',
  },
  {
    quote: 'ब्रह्मांड याद करता है खुद को\nतुम्हारे ज़रिए, मेरे ज़रिए',
    // DEVANAGARI COPY-EDIT NEEDED
    en: 'The universe remembers itself — through you, through me.',
    cite: 'Movement X · आत्म-विरह',
  },
];

export default function PoemReader() {
  const [active, setActive]     = useState(0);
  const [paused, setPaused]     = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (i: number) => setActive(((i % POEMS.length) + POEMS.length) % POEMS.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setActive((a) => (a + 1) % POEMS.length), 9000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const poem = POEMS[active];

  return (
    <div
      className="poem-reader"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="poem is-active">
        <p className="poem__quote" style={{ whiteSpace: 'pre-line' }}>{poem.quote}</p>
        <p className="poem__en">{poem.en}</p>
        <p className="poem__cite">{poem.cite}</p>
      </div>

      <div className="poem-nav">
        <button className="poem-nav__btn" onClick={() => go(active - 1)} aria-label="Previous poem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="poem-nav__dots">
          {POEMS.map((_, i) => (
            <button
              key={i}
              className={`poem-nav__dot${i === active ? ' is-active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Poem ${i + 1}`}
            />
          ))}
        </div>
        <button className="poem-nav__btn" onClick={() => go(active + 1)} aria-label="Next poem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
