import type { CSSProperties, ReactNode } from 'react'

/* ============================================================
   BowPress — inline phone mockups (Kenrokuen language)
   Four canonical screens rebuilt as React primitives so the
   blog post shows the current design, not stale PNGs.
   ============================================================ */

const BP = {
  paper:   '#eef2ec',
  paper2:  '#e4ebe3',
  cream:   '#f6f8f3',
  ink:     '#1f2a26',
  ink2:    '#4a5752',
  ink3:    '#8a9690',
  line:    '#c7d2c9',
  line2:   '#d9e1d8',
  pond:    '#4a7989',
  pondDk:  '#2d5a6b',
  pondLt:  '#8fb3bf',
  deep:    '#1e3e4a',
  moss:    '#6d8551',
  pine:    '#4a5f3a',
  maple:   '#b5614a',
  stone:   '#9aa3a0',
  tgtWhite:'#f6f8f3',
  tgtBlack:'#1f2a26',
  tgtBlue: '#4ea8c9',
  tgtRed:  '#d94b3b',
  tgtYellow:'#f0d04a',
}

const fontDisplay = "'Fraunces', Georgia, serif"
const fontUi = "'Inter', -apple-system, system-ui, sans-serif"
const fontMono = "'JetBrains Mono', ui-monospace, Menlo, monospace"

/* ---------- Shared primitives ------------------------------- */

function Eyebrow({ children, color = BP.ink3, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <div style={{
      fontFamily: fontUi, fontSize: 8, fontWeight: 600,
      letterSpacing: '0.22em', textTransform: 'uppercase',
      color, ...style,
    }}>
      {children}
    </div>
  )
}

function Stamp({ children, tone = 'pond' }: { children: ReactNode; tone?: 'pond' | 'moss' | 'maple' | 'stone' | 'solid' | 'pine' }) {
  const color =
    tone === 'moss' ? BP.pine :
    tone === 'pine' ? BP.pine :
    tone === 'maple' ? BP.maple :
    tone === 'stone' ? BP.stone :
    BP.pondDk
  const isSolid = tone === 'solid'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: fontUi, fontSize: 7, fontWeight: 600,
      letterSpacing: '0.22em', textTransform: 'uppercase',
      padding: '2px 5px', border: `1px solid ${isSolid ? BP.pondDk : color}`,
      color: isSolid ? BP.paper : color,
      background: isSolid ? BP.pondDk : 'transparent',
    }}>
      {children}
    </span>
  )
}

function EditLink({ children = 'EDIT' }: { children?: ReactNode }) {
  return (
    <span style={{
      fontFamily: fontUi, fontSize: 8.5, fontWeight: 600,
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: BP.pondDk,
    }}>
      {children}<span style={{ fontFamily: fontDisplay, fontStyle: 'italic', marginLeft: 2 }}>›</span>
    </span>
  )
}

/* ---------- Phone frame ------------------------------------- */

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="bp-phone" style={{
      width: 300, height: 620, background: BP.ink,
      padding: 6, borderRadius: 32, flexShrink: 0,
    }}>
      <div style={{
        width: '100%', height: '100%',
        background: BP.paper, borderRadius: 26,
        overflow: 'hidden', position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Status bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 18px 4px', fontFamily: fontUi, fontSize: 10, fontWeight: 600, color: BP.ink,
        }}>
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <svg width="12" height="8" viewBox="0 0 12 8"><path d="M1 7 L3 5 L5 7 M5 4 L7 2 L9 4 M9 1 L11 -1" stroke={BP.ink} strokeWidth="1" fill="none" strokeLinecap="round"/></svg>
            <svg width="10" height="8" viewBox="0 0 10 8"><path d="M5 6 Q2 4 1 3 Q3 1 5 1 Q7 1 9 3 Q8 4 5 6" stroke={BP.ink} strokeWidth="0.8" fill="none"/></svg>
            <svg width="16" height="8" viewBox="0 0 16 8">
              <rect x="0.5" y="1.5" width="13" height="5" rx="1" fill="none" stroke={BP.ink} strokeWidth="0.8"/>
              <rect x="2" y="3" width="9" height="2" fill={BP.ink}/>
              <rect x="14" y="3" width="1.2" height="2" rx="0.5" fill={BP.ink}/>
            </svg>
          </span>
        </div>

        {/* Screen content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>

        {/* Home indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 6 }}>
          <div style={{ width: 90, height: 3, background: BP.ink, borderRadius: 2, opacity: 0.9 }} />
        </div>
      </div>
    </div>
  )
}

function NavBar({ title, eyebrow, right }: { title: string; eyebrow?: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${BP.line}` }}>
      {eyebrow && <Eyebrow style={{ marginBottom: 4 }}>{eyebrow}</Eyebrow>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
        <div style={{
          fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
          fontSize: 22, color: BP.ink, lineHeight: 1.1, letterSpacing: '-0.005em',
        }}>
          {title}
        </div>
        {right}
      </div>
    </div>
  )
}

/* ---------- Target face (real WA colors) -------------------- */

function TargetFace({ size = 120, arrows = [] }: { size?: number; arrows?: Array<{ x: number; y: number }> }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block' }}>
        <circle cx="100" cy="100" r="96" fill={BP.tgtWhite} stroke={BP.ink} strokeWidth="0.3"/>
        <circle cx="100" cy="100" r="86" fill="none" stroke={BP.ink} strokeWidth="0.25"/>
        <circle cx="100" cy="100" r="76" fill={BP.tgtBlack}/>
        <circle cx="100" cy="100" r="66" fill="none" stroke={BP.cream} strokeWidth="0.25"/>
        <circle cx="100" cy="100" r="56" fill={BP.tgtBlue}/>
        <circle cx="100" cy="100" r="46" fill="none" stroke={BP.ink} strokeWidth="0.25"/>
        <circle cx="100" cy="100" r="36" fill={BP.tgtRed}/>
        <circle cx="100" cy="100" r="26" fill="none" stroke={BP.ink} strokeWidth="0.25"/>
        <circle cx="100" cy="100" r="16" fill={BP.tgtYellow}/>
        <circle cx="100" cy="100" r="8" fill="none" stroke={BP.ink} strokeWidth="0.25"/>
        <circle cx="100" cy="100" r="1.2" fill={BP.ink}/>
      </svg>
      {arrows.map((a, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${a.x * 100}%`, top: `${a.y * 100}%`,
          transform: 'translate(-50%,-50%)',
          width: Math.max(6, size * 0.035), height: Math.max(6, size * 0.035),
          borderRadius: '50%',
          background: BP.ink, border: `1px solid ${BP.cream}`,
          opacity: 0.45 + 0.55 * ((i + 1) / arrows.length),
        }} />
      ))}
    </div>
  )
}

/* ---------- Phone 1: Analytics ------------------------------ */

function AnalyticsPhone() {
  return (
    <PhoneFrame>
      <NavBar
        title="Analytics"
        eyebrow="BOWPRESS · LEDGER"
        right={<EditLink>FILTER</EditLink>}
      />
      <div style={{ padding: '10px 12px 0' }}>
        {/* Filter banner */}
        <div style={{
          border: `1px solid ${BP.line}`, background: BP.paper2,
          padding: '8px 10px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
              fontSize: 12, color: BP.ink, lineHeight: 1.2,
            }}>
              Last 7 days<span style={{ color: BP.ink3, margin: '0 3px' }}>·</span>
              Hoyt compound<span style={{ color: BP.ink3, margin: '0 3px' }}>·</span>50m
            </div>
            <div style={{
              fontFamily: fontMono, fontSize: 8, color: BP.ink3,
              letterSpacing: '0.04em', marginTop: 2,
            }}>
              14 SESSIONS · 342 ARROWS
            </div>
          </div>
          <EditLink>EDIT</EditLink>
        </div>

        {/* Overview card */}
        <div style={{
          marginTop: 10, border: `1px solid ${BP.line}`, padding: 10,
        }}>
          <Eyebrow>OVERVIEW · 7 DAYS</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
            <div>
              <div style={{
                fontFamily: fontDisplay, fontWeight: 400, fontSize: 40,
                color: BP.deep, lineHeight: 1, letterSpacing: '-0.02em',
              }}>
                10<span style={{ color: BP.maple }}>.</span>2
              </div>
              <Eyebrow style={{ marginTop: 4 }}>AVG / ARROW</Eyebrow>
              <div style={{
                fontFamily: fontMono, fontSize: 8, color: BP.pine,
                marginTop: 3, letterSpacing: '0.04em',
              }}>
                ▲ 0.3 <span style={{ color: BP.ink3, marginLeft: 2 }}>VS PREV WK</span>
              </div>
            </div>
            <div style={{ borderLeft: `1px solid ${BP.line2}`, paddingLeft: 10 }}>
              <div style={{
                fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                fontSize: 26, color: BP.pondDk, lineHeight: 1,
              }}>
                72<span style={{ fontSize: 12, color: BP.ink3 }}>%</span>
              </div>
              <Eyebrow style={{ marginTop: 4 }}>X RATE</Eyebrow>
              <div style={{
                fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                fontSize: 18, color: BP.ink, marginTop: 10, lineHeight: 1,
              }}>
                5<span style={{
                  fontFamily: fontUi, fontStyle: 'normal', fontSize: 8,
                  color: BP.ink3, letterSpacing: '0.18em', marginLeft: 4,
                  textTransform: 'uppercase', fontWeight: 600,
                }}>sessions</span>
              </div>
            </div>
          </div>

          {/* Mini bars */}
          <div style={{ marginTop: 12, display: 'flex', gap: 2, height: 18, alignItems: 'flex-end' }}>
            {[0.62, 0.78, 0.55, 0.88, 0.94, 0.71, 0.83].map((h, i) => (
              <div key={i} style={{
                flex: 1, height: `${h * 100}%`,
                background: h > 0.8 ? BP.pondDk : BP.pond,
              }} />
            ))}
          </div>
          <div style={{
            marginTop: 4, display: 'flex', justifyContent: 'space-between',
            fontFamily: fontMono, fontSize: 7.5, color: BP.ink3, letterSpacing: '0.04em',
          }}>
            <span>M T W T F S S</span><span>7-DAY INDEX</span>
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ marginTop: 12 }}>
          <Eyebrow style={{ marginBottom: 4 }}>TUNING SUGGESTIONS · RANKED</Eyebrow>
          <div style={{ border: `1px solid ${BP.line}`, padding: '0 10px' }}>
            {[
              { n: '01', t: 'Twist top cable +¼ turn', tag: 'EQUIPMENT', tone: 'pond' as const },
              { n: '02', t: 'Release drifts after arrow 30', tag: 'WATCH', tone: 'maple' as const },
              { n: '03', t: 'Rest vertical — no change', tag: 'HOLD', tone: 'pine' as const },
            ].map((s, i, arr) => (
              <div key={s.n} style={{
                display: 'grid', gridTemplateColumns: '18px 1fr auto', gap: 8,
                padding: '9px 0', alignItems: 'start',
                borderBottom: i < arr.length - 1 ? `1px solid ${BP.line2}` : 0,
              }}>
                <div style={{
                  fontFamily: fontDisplay, fontStyle: 'italic', fontSize: 13,
                  color: BP.pond, paddingTop: 1,
                }}>{s.n}</div>
                <div>
                  <div style={{
                    fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                    fontSize: 11.5, color: BP.ink, lineHeight: 1.25,
                  }}>{s.t}</div>
                  <div style={{
                    fontFamily: fontMono, fontSize: 7.5, color: BP.ink3,
                    letterSpacing: '0.03em', marginTop: 3,
                  }}>CONF 0.{80 - i * 10} · N={[37, 128, 312][i]}</div>
                </div>
                <Stamp tone={s.tone}>{s.tag}</Stamp>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ---------- Phone 2: Session Log ---------------------------- */

function SessionLogPhone() {
  const sessions = [
    { day: '24', mo: 'APR', name: 'Hoyt compound', meta: '50m · 60 arrows', score: 542, delta: 8, xs: 12, best: false },
    { day: '22', mo: 'APR', name: 'Hoyt compound', meta: '70m · 72 arrows', score: 651, delta: 21, xs: 18, best: true },
    { day: '20', mo: 'APR', name: 'Mathews Phase4', meta: '50m · 48 arrows', score: 432, delta: -4, xs: 7, best: false },
    { day: '18', mo: 'APR', name: 'Hoyt compound', meta: '50m · 60 arrows', score: 538, delta: 3, xs: 10, best: false },
  ]

  return (
    <PhoneFrame>
      <NavBar
        title="Session log"
        eyebrow="BOWPRESS · LEDGER"
        right={<EditLink>FILTER</EditLink>}
      />
      <div style={{ padding: '10px 12px 0' }}>
        {/* Filter banner */}
        <div style={{
          border: `1px solid ${BP.line}`, background: BP.paper2,
          padding: '8px 10px', marginBottom: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
              fontSize: 12, color: BP.ink,
            }}>
              Apr 2026<span style={{ color: BP.ink3, margin: '0 3px' }}>·</span>14 sessions
            </div>
            <div style={{
              fontFamily: fontMono, fontSize: 8, color: BP.ink3,
              letterSpacing: '0.04em', marginTop: 2,
            }}>
              342 ARROWS · ALL BOWS
            </div>
          </div>
          <EditLink>EDIT</EditLink>
        </div>

        {/* Session rows */}
        <div style={{ border: `1px solid ${BP.line}`, padding: '0 10px' }}>
          {sessions.map((s, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 10,
              padding: '10px 0', alignItems: 'center',
              borderBottom: i < sessions.length - 1 ? `1px solid ${BP.line2}` : 0,
            }}>
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <div style={{
                  fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 17, color: s.best ? BP.pine : BP.pondDk,
                }}>{s.day}</div>
                <div style={{
                  fontFamily: fontUi, fontSize: 7, color: BP.ink3,
                  letterSpacing: '0.18em', fontWeight: 600, marginTop: 2,
                }}>{s.mo}</div>
              </div>
              <div>
                <div style={{
                  fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 12, color: BP.ink, lineHeight: 1.2,
                }}>
                  {s.name}
                  {s.best && <span style={{ marginLeft: 5 }}><Stamp tone="pine">BEST</Stamp></span>}
                </div>
                <div style={{
                  fontFamily: fontMono, fontSize: 8, color: BP.ink3,
                  letterSpacing: '0.04em', marginTop: 3,
                }}>
                  {s.meta.toUpperCase()} · {s.xs} Xs
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                  fontSize: 18, color: BP.ink, lineHeight: 1,
                }}>{s.score}</div>
                <div style={{
                  marginTop: 3, fontFamily: fontMono, fontSize: 8,
                  color: s.delta >= 0 ? BP.pine : BP.maple,
                  letterSpacing: '0.04em',
                }}>
                  {s.delta >= 0 ? '▲' : '▼'} {Math.abs(s.delta)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Month grid */}
        <div style={{ marginTop: 12 }}>
          <Eyebrow style={{ marginBottom: 6 }}>APRIL · VOLUME</Eyebrow>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 3,
          }}>
            {Array.from({ length: 30 }).map((_, i) => {
              const v = [0, 0, 1, 0, 2, 0, 0, 1, 3, 0, 1, 2, 0, 0, 2, 1, 0, 3, 1, 0, 2, 4, 0, 1, 2, 0, 3, 1, 0, 2][i]
              const peak = i === 21
              return (
                <div key={i} style={{
                  height: 14,
                  background:
                    v === 0 ? BP.paper2 :
                    v === 1 ? BP.pondLt :
                    v === 2 ? BP.pond :
                    BP.pondDk,
                  border: peak ? `1px solid ${BP.pine}` : `1px solid ${BP.line2}`,
                }} />
              )
            })}
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ---------- Phone 3: Session Setup -------------------------- */

function SessionSetupPhone() {
  return (
    <PhoneFrame>
      <NavBar title="New session" eyebrow="BOWPRESS · SETUP" />
      <div style={{ padding: '12px 14px 0' }}>
        {/* Bow card */}
        <Eyebrow>BOW</Eyebrow>
        <div style={{
          marginTop: 8, padding: '10px 12px', background: BP.paper2,
          border: `1px solid ${BP.line}`,
          display: 'grid', gridTemplateColumns: '1fr auto',
          alignItems: 'center', gap: 8,
        }}>
          <div>
            <div style={{
              fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
              fontSize: 14, color: BP.ink, lineHeight: 1.15,
            }}>My Hoyt</div>
            <div style={{
              fontFamily: fontMono, fontSize: 8, color: BP.ink3,
              marginTop: 3, letterSpacing: '0.04em',
            }}>COMPOUND · 28.5" · 110GR X10</div>
          </div>
          <EditLink>CHANGE</EditLink>
        </div>

        {/* Distance */}
        <div style={{ marginTop: 16 }}>
          <Eyebrow>DISTANCE</Eyebrow>
          <div style={{
            marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            border: `1px solid ${BP.line}`,
          }}>
            {['20yd', '50m', '70m'].map((d, i) => {
              const on = d === '50m'
              return (
                <div key={d} style={{
                  padding: '12px 4px 8px', textAlign: 'center',
                  borderRight: i < 2 ? `1px solid ${BP.line}` : 0,
                  background: on ? BP.pondDk : BP.paper,
                }}>
                  <div style={{
                    fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                    fontSize: 16, color: on ? BP.paper : BP.ink2, lineHeight: 1,
                  }}>{d}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Target face */}
        <div style={{ marginTop: 16 }}>
          <Eyebrow>TARGET FACE</Eyebrow>
          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[['10-ring', '122cm'], ['6-ring', '80cm']].map(([n, sz], i) => {
              const on = i === 0
              return (
                <div key={n} style={{
                  padding: '10px 6px 8px',
                  border: `1px solid ${on ? BP.pondDk : BP.line}`,
                  background: on ? BP.paper2 : BP.paper,
                  boxShadow: on ? `inset 0 0 0 1px ${BP.pondDk}` : 'none',
                  textAlign: 'center',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><TargetFace size={36} /></div>
                  <div style={{
                    fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                    fontSize: 10.5, color: on ? BP.pondDk : BP.ink, marginTop: 5,
                  }}>{n}</div>
                  <div style={{
                    fontFamily: fontMono, fontSize: 7.5, color: BP.ink3,
                    letterSpacing: '0.04em', marginTop: 1,
                  }}>{sz}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Intention note */}
        <div style={{ marginTop: 16 }}>
          <Eyebrow>INTENTION</Eyebrow>
          <div style={{
            marginTop: 8, padding: '10px 12px', border: `1px solid ${BP.line2}`,
            borderLeft: `2px solid ${BP.pond}`,
            fontFamily: fontDisplay, fontStyle: 'italic', fontSize: 11.5,
            color: BP.ink2, lineHeight: 1.4,
          }}>
            Keep back tension through the click. Breathe out on release.
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 20 }}>
          <div style={{
            background: BP.pondDk, padding: '12px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                fontSize: 17, color: BP.paper, lineHeight: 1,
              }}>Begin session</div>
              <div style={{
                fontFamily: fontUi, fontSize: 7.5, fontWeight: 600,
                letterSpacing: '0.22em', color: BP.pondLt,
                textTransform: 'uppercase', marginTop: 4,
              }}>50M · HOYT · 10-RING FACE</div>
            </div>
            <span style={{ fontFamily: fontDisplay, fontStyle: 'italic', color: BP.paper, fontSize: 18 }}>›</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ---------- Phone 4: Active Session ------------------------- */

function ActiveSessionPhone() {
  const arrows = [
    { x: 0.48, y: 0.44 },
    { x: 0.52, y: 0.51 },
    { x: 0.46, y: 0.49 },
    { x: 0.54, y: 0.47 },
    { x: 0.50, y: 0.46 },
    { x: 0.49, y: 0.50 },
  ]

  return (
    <PhoneFrame>
      <NavBar
        title="Arrow 16"
        eyebrow={
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span style={{
              display: 'inline-block', width: 5, height: 5,
              background: BP.maple, borderRadius: '50%', marginRight: 6,
            }} />
            IN SESSION
          </span>
        }
        right={
          <div style={{ textAlign: 'right', lineHeight: 1 }}>
            <div style={{
              fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
              fontSize: 13, color: BP.ink,
            }}>56:04</div>
            <div style={{
              fontFamily: fontMono, fontSize: 7.5, color: BP.ink3,
              letterSpacing: '0.06em', marginTop: 2,
            }}>ELAPSED</div>
          </div>
        }
      />
      <div style={{ padding: '10px 12px 0' }}>
        {/* Config banner */}
        <div style={{
          border: `1px solid ${BP.line}`, background: BP.paper2,
          padding: '7px 10px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{
            fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
            fontSize: 11, color: BP.ink, lineHeight: 1.2,
          }}>
            50m · My Hoyt · 10-ring
          </div>
          <EditLink>CHANGE</EditLink>
        </div>

        {/* Target */}
        <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'center' }}>
          <TargetFace size={210} arrows={arrows} />
        </div>

        {/* Recent arrows strip */}
        <div style={{
          padding: '8px 0 10px',
          borderTop: `1px solid ${BP.line}`,
          borderBottom: `1px solid ${BP.line}`,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 7,
          }}>
            <Eyebrow>RECENT ARROWS</Eyebrow>
            <div style={{
              fontFamily: fontMono, fontSize: 8, color: BP.ink3, letterSpacing: '0.04em',
            }}>
              <span style={{
                fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                fontSize: 11, color: BP.ink,
              }}>10<span style={{ color: BP.maple }}>.</span>4</span>
              {' '}AVG · LAST 6
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
            {[
              { v: 10, i: 10 }, { v: 'X' as const, i: 11 }, { v: 9, i: 12 },
              { v: 10, i: 13 }, { v: 'X' as const, i: 14 }, { v: 10, i: 15 },
            ].map((a, i) => {
              const isX = a.v === 'X'
              return (
                <div key={i} style={{
                  border: `1px solid ${isX ? BP.pondDk : BP.line}`, background: BP.paper,
                  padding: '5px 2px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 1,
                }}>
                  <span style={{
                    fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                    fontSize: 13, color: isX ? BP.pondDk : BP.ink, lineHeight: 1,
                  }}>{a.v}</span>
                  <span style={{
                    fontFamily: fontMono, fontSize: 7, color: BP.ink3, letterSpacing: '0.04em',
                  }}>#{a.i}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Totals */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          padding: '10px 2px', borderBottom: `1px solid ${BP.line}`, gap: 8,
        }}>
          <div>
            <Eyebrow>SCORE</Eyebrow>
            <div style={{
              fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
              fontSize: 18, color: BP.pondDk, marginTop: 3, lineHeight: 1,
            }}>156</div>
          </div>
          <div style={{ borderLeft: `1px solid ${BP.line2}`, paddingLeft: 8 }}>
            <Eyebrow>X COUNT</Eyebrow>
            <div style={{
              fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
              fontSize: 18, color: BP.ink, marginTop: 3, lineHeight: 1,
            }}>4</div>
          </div>
          <div style={{ borderLeft: `1px solid ${BP.line2}`, paddingLeft: 8 }}>
            <Eyebrow>BEST</Eyebrow>
            <div style={{
              fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
              fontSize: 12, color: BP.ink, marginTop: 3, lineHeight: 1.1,
            }}>3 in a row
              <div style={{
                fontFamily: fontMono, fontStyle: 'normal', fontSize: 7,
                color: BP.ink3, marginTop: 1, letterSpacing: '0.04em',
              }}>#12–15</div>
            </div>
          </div>
        </div>

        {/* Action row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          padding: '9px 0', borderBottom: `1px solid ${BP.line}`, gap: 6,
        }}>
          {['UNDO', 'NOTE', 'FLAG FLIER'].map((a) => (
            <div key={a} style={{
              textAlign: 'center',
              fontFamily: fontUi, fontSize: 8.5, fontWeight: 600,
              letterSpacing: '0.2em', color: BP.pondDk,
            }}>{a}</div>
          ))}
        </div>

        {/* Finish CTA */}
        <div style={{ marginTop: 10 }}>
          <div style={{
            background: BP.pondDk, padding: '10px 12px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontFamily: fontDisplay, fontStyle: 'italic', fontWeight: 500,
                fontSize: 15, color: BP.paper, lineHeight: 1,
              }}>Finish</div>
              <div style={{
                fontFamily: fontUi, fontSize: 7, fontWeight: 600,
                letterSpacing: '0.22em', color: BP.pondLt,
                textTransform: 'uppercase', marginTop: 3,
              }}>SAVE · SYNC · LOG</div>
            </div>
            <span style={{ fontFamily: fontDisplay, fontStyle: 'italic', color: BP.paper, fontSize: 16 }}>›</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ---------- Exports ----------------------------------------- */

export function BowPressPhoneRow({ innerRef }: { innerRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="screenshot-row bp-phone-row" ref={innerRef}>
      <div className="bp-phone-cell">
        <AnalyticsPhone />
        <span className="screenshot-caption">Analytics</span>
      </div>
      <div className="bp-phone-cell">
        <SessionLogPhone />
        <span className="screenshot-caption">Session Log</span>
      </div>
      <div className="bp-phone-cell">
        <SessionSetupPhone />
        <span className="screenshot-caption">New Session</span>
      </div>
      <div className="bp-phone-cell">
        <ActiveSessionPhone />
        <span className="screenshot-caption">Active Session</span>
      </div>
    </div>
  )
}
