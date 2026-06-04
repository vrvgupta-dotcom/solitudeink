import Image from 'next/image';
import Link from 'next/link';
import Particles from '@/components/Particles';
import PoemReader from '@/components/PoemReader';
import Reveal from '@/components/Reveal';
import { deriveEditionState, EDITION_CONFIG } from '@/lib/edition';

const edition = deriveEditionState(340);

const MOVEMENTS = [
  { no: 'i',    deva: 'पहली बारिश',     en: 'The First Rain',        theme: 'Longing before knowing · the ache of anticipation',          tag: 'Opening' },
  { no: 'ii',   deva: 'मेरे भीतर तुम',  en: 'You Within Me',         theme: 'The beloved as an interior state',                           tag: 'Union' },
  { no: 'iii',  deva: 'मानसी',           en: 'Manasi',                theme: 'The imagined woman · love made from silence',                tag: 'Creation' },
  { no: 'iv',   deva: 'नदी का मोड़',     en: "The River's Bend",      theme: 'Where two lives touch and diverge',                         tag: 'Encounter' },
  { no: 'v',    deva: 'नारी की आवाज़',  en: "The Woman's Voice",     theme: 'Womanhood, grief, and the power that outlasts both',         tag: 'Voice' },
  { no: 'vi',   deva: 'ख़ामोशी',         en: 'The Silence',           theme: 'What is said between the words',                            tag: 'Stillness' },
  { no: 'vii',  deva: 'घर वापसी',       en: 'The Return Home',       theme: 'Homecoming as an inner journey',                            tag: 'Return' },
  { no: 'viii', deva: 'रात का राग',      en: "The Night's Raga",      theme: 'Desire, insomnia, the hour between self and self',           tag: 'Night' },
  { no: 'ix',   deva: 'खुद से मिलना',   en: 'Meeting Oneself',       theme: 'The self as the final beloved',                             tag: 'Self-Union' },
  { no: 'x',    deva: 'आत्म-विरह',      en: 'Self-Separation',       theme: 'The bittersweet close · knowing you cannot keep yourself',  tag: 'Close' },
];
// ⚠️ DEVANAGARI COPY-EDIT NEEDED: All Hindi strings require native-speaker review before launch

const ARRIVES = [
  { title: 'Ten Clothbound Books', note: 'Edition I',   desc: 'All ten movements, printed on 100gsm laid paper, cloth-bound in deep charcoal.' },
  { title: 'Slipcase',             note: 'Handmade',    desc: 'A rigid, lined slipcase in black bookcloth — spine-out, as they belong on a shelf.' },
  { title: 'A Signed Note',        note: 'Signed',      desc: 'Yatendra writes a personal note for every Edition II set, by hand.' },
  { title: 'Your Number',          note: 'Numbered',    desc: 'Embossed in gold on the slipcase and hand-written inside each book.' },
  { title: 'Certificate',          note: 'Recorded',    desc: 'Your number recorded in the edition ledger. Provenance for the shelf, and for after.' },
  { title: 'White-Glove Delivery', note: 'Included',    desc: 'Wrapped in black tissue and ribbon — arrives as a gift should arrive.' },
];

const pct       = Math.round(edition.pct * 100);
const reserveNo = String(edition.reserveNo).padStart(4, '0');
const nextStepStr = edition.nextStepNo
  ? `No. ${String(edition.nextStepNo).padStart(4, '0')}`
  : '—';
const romanNums = ['i', 'ii', 'iii', 'iv', 'v'] as const;

export default function HomePage() {
  return (
    <>
      {/* ── 01 Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <Particles count={32} />
        <div className="hero__copy">
          <div className="hero__eyebrow">
            <span className="rule">An Emotional Literary Universe</span>
          </div>
          {/* ⚠️ DEVANAGARI COPY-EDIT NEEDED */}
          <h1 className="hero__deva">आत्म-मिलन<br /><em>–</em><br />आत्म-विरह</h1>
          <p className="hero__english">
            <em>Self-Union and Self-Separation</em> — a complete poetic universe, pressed once, and never again.
          </p>
          <div className="hero__tagline">
            {/* ⚠️ DEVANAGARI COPY-EDIT NEEDED */}
            <span className="deva">जो मिलता है, वो बिछड़ता है — जो बिछड़ता है, वो रहता है।</span>
            <span className="en">What is found is lost — what is lost, remains.</span>
          </div>
          <p className="hero__body">
            Ten books. One universe. 2,000 numbered sets — pressed once, then closed forever.
            A rising-price edition: the earlier you arrive, the less you pay.
          </p>
          <div className="hero__ctas">
            <a href="#editions" className="btn btn--gold btn--lg">Enter the Universe <span className="arrow">→</span></a>
            <a href="#read" className="btn btn--ghost btn--lg">Read a poem</a>
          </div>
          <div className="hero__meta">
            <div className="hero__meta-item">
              <span className="hero__meta-k">Opens at</span>
              <span className="hero__meta-v">${edition.hardcover}</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-k">Numbered to</span>
              <span className="hero__meta-v">2,000</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-k">Author</span>
              <span className="hero__meta-v">Yatendra Chandra</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__visual-frame">
            <Image src="/book1-mockup.jpg" alt="पहली बारिश — Book One of Ten" fill priority className="hero__img" />
            <div className="hero__img-mask" />
            <div className="hero__caption">
              <span>Book One of Ten · पहली बारिश</span>
              <span>The doorway into the universe</span>
            </div>
          </div>
        </div>

        <div className="hero__scroll">
          Enter slowly
          <span className="hero__scroll-line" />
        </div>
      </section>

      {/* ── 02 The Promise ──────────────────────────────────────── */}
      <section className="promise section" id="promise">
        <div className="wrap">
          <Reveal><p className="eyebrow" style={{ marginBottom: '18px' }}>The Promise</p></Reveal>
          <div className="promise__grid">
            <div>
              <Reveal>
                <h2 className="section-head__title" style={{ marginTop: 0 }}>
                  Some books are printed.<br /><em>This one is pressed — once.</em>
                </h2>
              </Reveal>
              <Reveal delay={1}>
                <div className="promise__body">
                  <p>When the 2,000th set is reserved, the edition closes. No reprints. No second run. Every copy is numbered in sequence — yours carries the exact number you reserved, embossed in gold on the slipcase and written by hand inside each book.</p>
                  <p>The rising price is not a trick. It is a record: the early readers arrive first, pay least, and carry the lowest numbers. The last reader pays the most. That is the only honest way to sell something that can never come back.</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <blockquote className="promise__pull">
                A number pressed in gold lasts longer than the price you paid for it.
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 03 Price Ladder ─────────────────────────────────────── */}
      <section className="ladder section" id="price">
        <div className="wrap">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(36px,4vw,56px)' }}>
              <p className="eyebrow">The Rising Price</p>
              <h2 className="section-head__title" style={{ marginTop: '14px' }}>Earlier means <em>less.</em></h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="ladder__live">
              <div>
                <p className="k">Reserved so far</p>
                <p className="v">{edition.claimed}</p>
                <p className="sub">of {edition.total.toLocaleString()} · your number would be {reserveNo}</p>
              </div>
              <div>
                <p className="k">Current price</p>
                <p className="v">${edition.hardcover}</p>
                <p className="sub">{edition.remainingInTier} sets remain at this price</p>
              </div>
              <div>
                <p className="k">Next step</p>
                <p className="v sm">{nextStepStr}</p>
                <p className="sub">then the price rises to the next rung</p>
              </div>
            </div>
            <div className="ladder__progress">
              <span style={{ width: `${pct}%` }} />
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="ladder__table">
              {EDITION_CONFIG.ladder.map((rung, i) => {
                const isCurrent = i === edition.tierIndex;
                const prevUpTo  = i === 0 ? 0 : EDITION_CONFIG.ladder[i - 1].upTo;
                return (
                  <div key={i} className={`ladder__row${isCurrent ? ' is-current' : ''}`}>
                    <span className="idx">{romanNums[i]}</span>
                    <span className="rng">Sets {(prevUpTo + 1).toLocaleString()} – {rung.upTo.toLocaleString()}</span>
                    <span className="price">${rung.price}</span>
                    <span className="tag">{isCurrent ? 'Current price' : i < edition.tierIndex ? 'Closed' : 'Ahead'}</span>
                  </div>
                );
              })}
            </div>
            <p className="ladder__note">The price never drops. Every number reserved advances the counter.</p>
          </Reveal>
        </div>
      </section>

      {/* ── 04 The Two Editions ─────────────────────────────────── */}
      <section className="section" id="editions" style={{ background: 'linear-gradient(180deg,#0b0907,#050402)' }}>
        <div className="wrap">
          <Reveal>
            <div className="section-head--center" style={{ marginBottom: 'clamp(48px,6vw,80px)' }}>
              <p className="eyebrow">The Two Editions</p>
              <h2 className="section-head__title">Choose how you <em>arrive.</em></h2>
            </div>
          </Reveal>
          <div className="editions__grid">
            <Reveal>
              <div className="edition-card">
                <div className="edition-card__media">
                  <Image src="/si-slipcase-dark.jpg" alt="The Hardcover Universe — Edition I" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="edition-card__body">
                  <p className="edition-card__eyebrow">Edition I</p>
                  <h3 className="edition-card__title">The Hardcover <em>Universe</em></h3>
                  <p className="edition-card__kicker">Ten clothbound books in a black slipcase</p>
                  <p className="edition-card__desc">All ten movements, hand-numbered and wrapped in black tissue. Your number is embossed on the slipcase and written inside each book. White-glove worldwide delivery included.</p>
                  <div className="edition-card__price">
                    <span className="from">From</span>
                    <span className="amt">${edition.hardcover}</span>
                    <span className="rise">→ rises to ${edition.final}</span>
                  </div>
                  <Link href="/the-edition?edition=hardcover" className="btn btn--ghost">Reserve the Hardcover Universe</Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="edition-card edition-card--feature">
                <div className="edition-card__media">
                  <span className="edition-card__flag">Signed · Numbered</span>
                  <Image src="/si-slipcase-ivory.jpg" alt="The Signature Numbered Universe — Edition II" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="edition-card__body">
                  <p className="edition-card__eyebrow">Edition II</p>
                  <h3 className="edition-card__title">The Signature Numbered <em>Universe</em></h3>
                  <p className="edition-card__kicker">Signed by the author · numbered by hand</p>
                  <p className="edition-card__desc">Everything in Edition I, plus Yatendra's signature in each volume and a personal handwritten note. Your number is recorded in the edition ledger. White-glove worldwide delivery included.</p>
                  <div className="edition-card__price">
                    <span className="from">From</span>
                    <span className="amt">${edition.signature}</span>
                    <span className="rise">→ rises to ${edition.final + 300}</span>
                  </div>
                  <Link href="/the-edition?edition=signature" className="btn btn--gold">Reserve the Signature Universe</Link>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <p className="editions__note">Both editions are complete. There are no individual book sales. White-glove worldwide delivery is included in both — no shipping charge, anywhere.</p>
          </Reveal>
        </div>
      </section>

      {/* ── 05 What Arrives ─────────────────────────────────────── */}
      <section className="arrives section">
        <div className="wrap">
          <div className="arrives__grid">
            <Reveal>
              <div className="arrives__media">
                <Image src="/si-slipcase-ivory.jpg" alt="What arrives" fill style={{ objectFit: 'cover' }} />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="eyebrow" style={{ marginBottom: '14px' }}>What Arrives</p>
                <h2 className="section-head__title" style={{ marginTop: 0, marginBottom: 'clamp(28px,4vw,48px)' }}>Not a box. <em>An arrival.</em></h2>
              </Reveal>
              <ul className="arrives__list">
                {ARRIVES.map((item, i) => (
                  <Reveal key={item.title} delay={(i % 3) as 0 | 1 | 2 | 3}>
                    <li>
                      <span className="ic" aria-hidden>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                      <div>
                        <h4>{item.title} <em>{item.note}</em></h4>
                        <p>{item.desc}</p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 Ten Movements ────────────────────────────────────── */}
      <section className="movements section" id="movements">
        <div className="wrap">
          <Reveal>
            <div className="movements__intro">
              <p className="eyebrow" style={{ marginBottom: '14px' }}>Ten Movements</p>
              <h2 className="section-head__title" style={{ marginTop: 0 }}>One universe. <em>Ten thresholds.</em></h2>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(243,232,210,0.65)', marginTop: '18px' }}>Each book is a movement in a single emotional symphony — from longing to union, from union to loss, from loss back to the self.</p>
            </div>
          </Reveal>
          <div className="movements__list">
            {MOVEMENTS.map((m, i) => (
              <Reveal key={m.no} delay={(i % 3) as 0 | 1 | 2 | 3}>
                <div className="mvmt">
                  <span className="mvmt__no">{m.no}</span>
                  <div>
                    {/* ⚠️ DEVANAGARI COPY-EDIT NEEDED */}
                    <div className="mvmt__deva">{m.deva}</div>
                    <div className="mvmt__en">{m.en}</div>
                  </div>
                  <p className="mvmt__theme">{m.theme}</p>
                  <span className="mvmt__tag">{m.tag}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="movements__close">
              Ten books that form one long breath held between self-union and self-separation — until the universe remembers itself. <em>The universe remembers itself.</em>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 07 Gifting ──────────────────────────────────────────── */}
      <section className="gifting section">
        <div className="wrap">
          <div className="gifting__grid">
            <Reveal>
              <div className="gifting__media">
                <Image src="/book3-mockup.jpg" alt="Gifting" fill style={{ objectFit: 'cover' }} />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="eyebrow" style={{ marginBottom: '14px' }}>Gifting</p>
                <h2 className="section-head__title" style={{ marginTop: 0 }}>A gift that <em>keeps its number.</em></h2>
              </Reveal>
              <Reveal delay={1}>
                <div className="gifting__body">
                  <p>When you give a numbered set, you give a permanent position in literary history. The number belongs to the recipient — recorded in the edition ledger under their name.</p>
                  <p>Arrives wrapped in black tissue with a handwritten card from Yatendra. We ship directly to the person you're giving it to, anywhere in the world.</p>
                </div>
                <div className="gifting__actions">
                  <Link href="/the-edition" className="btn btn--gold">Gift a Universe</Link>
                  <Link href="/the-edition" className="btn btn--ghost">See both editions</Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 08 Authenticity ─────────────────────────────────────── */}
      <section className="trust section" id="authenticity">
        <div className="wrap">
          <Reveal>
            <div className="section-head--center" style={{ marginBottom: 0 }}>
              <p className="eyebrow">Authenticity</p>
              <h2 className="section-head__title" style={{ marginTop: '14px' }}>Every set is <em>recorded.</em></h2>
            </div>
          </Reveal>
          <div className="trust__grid">
            {[
              { title: 'A number,',   em: 'by hand',  body: 'Your number is pressed in gold on the slipcase and written in ink inside each volume. It cannot be replicated.' },
              { title: 'A signature', em: '& a note', body: "Edition II sets carry Yatendra's signature across every title page and a personal note written in the same session." },
              { title: 'A certificate,', em: 'recorded', body: 'Your number is entered in the edition ledger — a permanent record of provenance that travels with the set, forever.' },
            ].map((cell, i) => (
              <Reveal key={cell.em} delay={i as 0 | 1 | 2}>
                <div className="trust__cell">
                  <div className="seal">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h4>{cell.title} <em>{cell.em}</em></h4>
                  <p>{cell.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 09 Read a Poem ──────────────────────────────────────── */}
      <section className="immersive section" id="read">
        <div className="wrap">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(36px,5vw,64px)' }}>
              <p className="eyebrow">Read a Poem</p>
              <h2 className="section-head__title" style={{ marginTop: '14px' }}>Arrive before <em>you decide.</em></h2>
            </div>
          </Reveal>
          <Reveal delay={1}><PoemReader /></Reveal>
        </div>
      </section>

      {/* ── 10 Author ───────────────────────────────────────────── */}
      <section className="author section" id="author">
        <div className="wrap">
          <div className="author__grid">
            <Reveal>
              <div className="author__portrait">
                <svg className="author__silhouette" viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e6cd92"/>
                      <stop offset="100%" stopColor="#8a7240"/>
                    </linearGradient>
                  </defs>
                  <ellipse cx="100" cy="62" rx="36" ry="44" fill="url(#sg)" opacity=".85"/>
                  <path d="M36 260 C36 180 164 180 164 260" fill="url(#sg)" opacity=".7"/>
                  <line x1="100" y1="106" x2="100" y2="180" stroke="url(#sg)" strokeWidth="2" opacity=".5"/>
                </svg>
                <span className="author__sig">Yatendra</span>
              </div>
            </Reveal>
            <div className="author__copy">
              <Reveal>
                <p className="eyebrow" style={{ marginBottom: '14px' }}>The Author</p>
                <h2>A quiet voice, <em>writing slowly,</em> listening longer.</h2>
              </Reveal>
              <Reveal delay={1}>
                <div className="author__bio">
                  {/* ⚠️ DEVANAGARI COPY-EDIT NEEDED for the book title inline below */}
                  <p className="lede">Yatendra Chandra writes in Hindi — slowly, privately, without a deadline. आत्म-मिलन – आत्म-विरह is his first work published as a numbered edition.</p>
                  <p>The ten books were written over seven years. They were not planned as a sequence — they became one. Each title was finished before the next was begun. The order was decided last, when the whole shape became clear.</p>
                  <p>He does not give readings. He does not explain the poems. He believes the reader arrives at a poem alone, and that is the only way it works.</p>
                </div>
              </Reveal>
              <Reveal delay={2}>
                <div className="author__philosophy">
                  <div><h5>On writing</h5><p>The poem is finished when it no longer needs me.</p></div>
                  <div><h5>On the edition</h5><p>2,000 readers is enough. More would change what it is.</p></div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11 Final Call ───────────────────────────────────────── */}
      <section className="final" id="reserve">
        <Particles count={22} className="final__particles" />
        <Reveal>
          <p className="eyebrow rule--center" style={{ position: 'relative', zIndex: 2 }}>Your number is waiting</p>
          <h2 className="final__title">Some journeys are not travelled.<br /><em>They are remembered.</em></h2>
          <p className="final__sub">No. {reserveNo} of 2,000 — the price only rises from here.</p>
        </Reveal>
        <Reveal delay={1}>
          <div className="final__ctas">
            <Link href="/the-edition" className="btn btn--gold btn--lg">Reserve your number — ${edition.hardcover} <span className="arrow">→</span></Link>
            <a href="#read" className="btn btn--ghost btn--lg">Read a poem first</a>
          </div>
        </Reveal>
      </section>

      {/* ── 12 Footer ───────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer__grid">
          <div className="footer__brand">
            <svg width="24" height="30" viewBox="0 0 22 28" fill="none">
              <path d="M11 2C11 2 4 8 4 16C4 20.418 7.134 24 11 24C14.866 24 18 20.418 18 16C18 8 11 2 11 2Z" stroke="#c9a96a" strokeWidth="1" fill="none"/>
              <line x1="11" y1="24" x2="11" y2="28" stroke="#c9a96a" strokeWidth="1"/>
            </svg>
            {/* ⚠️ DEVANAGARI COPY-EDIT NEEDED */}
            <h3>आत्म-मिलन – आत्म-विरह</h3>
            <p>A finite 10-book Hindi poetry universe by Yatendra Chandra. Pressed once. Never again.</p>
            <p className="small">© 2026 Solitude Ink. All rights reserved.</p>
          </div>
          <div className="footer__col">
            <h5>The Edition</h5>
            <ul>
              <li><Link href="/the-edition">Reserve your number</Link></li>
              <li><a href="#price">Price ladder</a></li>
              <li><a href="#editions">Two editions</a></li>
              <li><a href="#movements">Ten movements</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>To Keep</h5>
            <ul>
              <li><a href="#read">Read a poem</a></li>
              <li><a href="#authenticity">Authenticity</a></li>
              <li><a href="#author">The author</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Reach</h5>
            <ul>
              <li><a href="mailto:hello@solitudeink.com">hello@solitudeink.com</a></li>
              <li><a href="#" aria-label="Press enquiries">Press enquiries</a></li>
              <li><a href="#" aria-label="Gift orders">Gift orders</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          {/* ⚠️ DEVANAGARI COPY-EDIT NEEDED */}
          <span>Solitude Ink · आत्म-मिलन – आत्म-विरह · Pressed once</span>
          <div className="footer__bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Imprint</a>
          </div>
        </div>
      </footer>
    </>
  );
}
