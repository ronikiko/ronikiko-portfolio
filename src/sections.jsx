import { useState, useEffect, useRef } from 'react'
import Globe from './Globe.jsx'
import StreamingIntro from './StreamingIntro.jsx'
import { useScramble, useMagnetic } from './hooks.js'
import CodeWindow from './CodeWindow.jsx'

/* ── code snippets ── */
const ABOUT_CODE = [
  `<span class="cmt">// roni.ts</span>`,
  ``,
  `<span class="kw">const</span> <span class="fn">engineer</span> = {`,
  `  <span class="prop">name</span>:      <span class="str">"Roni Kiko"</span>,`,
  `  <span class="prop">role</span>:      <span class="str">"Full-Stack Engineer"</span>,`,
  `  <span class="prop">base</span>:      <span class="str">"Tel Aviv, IL"</span>,`,
  ``,
  `  <span class="prop">years</span>:     <span class="num">8</span>,`,
  `  <span class="prop">products</span>:  <span class="num">12</span>,`,
  ``,
  `  <span class="prop">reach</span>: {`,
  `    <span class="prop">latency</span>:    <span class="str">"Rust"</span>,`,
  `    <span class="prop">ergonomics</span>: <span class="str">"TypeScript"</span>,`,
  `    <span class="prop">math</span>:        <span class="str">"Python"</span>,`,
  `  },`,
  ``,
  `  <span class="prop">available</span>: <span class="bool">true</span>,`,
  `}`,
]

const RUST_CODE = [
  `<span class="cmt">// zero-cost latency</span>`,
  `<span class="kw">async fn</span> <span class="fn">resolve</span>(`,
  `  op: Op,`,
  `) <span class="kw">-></span> Result<span class="type">&lt;()&gt;</span> {`,
  `  <span class="kw">let</span> r = crdt`,
  `    ::<span class="fn">transform</span>(op)?;`,
  `  <span class="fn">broadcast</span>(r).<span class="kw">await</span>`,
  `}`,
  `<span class="cmt">// p99: 47ms</span>`,
]

const TS_CODE = [
  `<span class="cmt">// schema-first apis</span>`,
  `<span class="kw">const</span> router = <span class="fn">createTRPC</span>({`,
  `  <span class="prop">user</span>: proc`,
  `    .<span class="fn">input</span>(z.<span class="fn">object</span>({`,
  `      <span class="prop">id</span>: z.<span class="fn">string</span>(),`,
  `    }))`,
  `    .<span class="fn">query</span>(({ input }) =>`,
  `      db.user.<span class="fn">find</span>(input)`,
  `    ),`,
  `})`,
]

const PY_CODE = [
  `<span class="cmt"># agent orchestration</span>`,
  `<span class="kw">@tool</span>`,
  `<span class="kw">def</span> <span class="fn">search</span>(`,
  `  query: <span class="type">str</span>,`,
  `) <span class="kw">-></span> <span class="type">list</span>[Result]:`,
  `  chunks = <span class="fn">embed</span>(query)`,
  `  <span class="kw">return</span> db.<span class="fn">query</span>(`,
  `    chunks, top_k=<span class="num">8</span>,`,
  `  )`,
]

function ScrambleText({ text }) {
  const [display, scramble, reset] = useScramble(text)
  return <span onMouseEnter={scramble} onMouseLeave={reset}>{display}</span>
}

/* ===== count-up hook ===== */
function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setCount(Math.round(eased * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration])

  return [count, ref]
}

/* ===== copy-to-clipboard hook ===== */
function useCopy(text) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return [copied, copy]
}

/* ===== data ===== */
const SKILL_GROUPS = [
  {
    cat: 'Languages',
    items: [
      { name: 'TypeScript', yrs: '8y' },
      { name: 'Python',     yrs: '6y' },
      { name: 'Rust',       yrs: '3y' },
      { name: 'Go',         yrs: '2y' },
      { name: 'SQL',        yrs: '8y' },
    ],
  },
  {
    cat: 'Frontend',
    items: [
      { name: 'React',    yrs: '7y' },
      { name: 'Next.js',  yrs: '5y' },
      { name: 'Tailwind', yrs: '4y' },
      { name: 'Three.js', yrs: '2y' },
      { name: 'WebGL',    yrs: '2y' },
    ],
  },
  {
    cat: 'Backend',
    items: [
      { name: 'Node.js',       yrs: '8y' },
      { name: 'tRPC / GraphQL',yrs: '4y' },
      { name: 'PostgreSQL',    yrs: '7y' },
      { name: 'Redis',         yrs: '5y' },
      { name: 'ClickHouse',    yrs: '2y' },
    ],
  },
  {
    cat: 'Infra · AI',
    items: [
      { name: 'AWS / GCP',   yrs: '6y' },
      { name: 'Docker / K8s',yrs: '5y' },
      { name: 'Terraform',   yrs: '3y' },
      { name: 'LLM Agents',  yrs: '2y' },
      { name: 'Vector DBs',  yrs: '2y' },
    ],
  },
]

const MARQUEE = [
  'TypeScript','React','Rust','Node','Postgres',
  'AWS','Python','GraphQL','WebGL','Kubernetes',
  'Redis','Go','Tailwind','ClickHouse',
]

const EXPERIENCE = [
  {
    period: '2024 — present',
    role: 'Independent',
    company: 'Freelance & Open Source',
    tags: ['LLM Agents', 'Rust', 'WebGL'],
    desc: 'Building agentic tooling and open-source spatial UI libraries between client engagements. Currently exploring the intersection of real-time systems and large language models.',
  },
  {
    period: '2022 — 2024',
    role: 'Platform Lead',
    company: 'Halcyon',
    tags: ['ClickHouse', 'TypeScript', 'AWS'],
    desc: 'Led a team of 6 engineers building the analytics infrastructure. Scaled the event pipeline from 50M to 1.2B events per month without downtime.',
  },
  {
    period: '2020 — 2022',
    role: 'Senior Engineer',
    company: 'Lumen Labs',
    tags: ['Rust', 'CRDT', 'WebSockets'],
    desc: 'Core contributor to the real-time collaboration engine. Designed and built the operational transform layer and conflict resolution system from scratch.',
  },
  {
    period: '2018 — 2020',
    role: 'Full-Stack Engineer',
    company: 'Early Career',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    desc: 'Shipped two consumer products from zero to tens of thousands of users across two early-stage startups.',
  },
]

export const PROJECTS = [
  {
    idx: '01',
    year: '2025',
    name: 'Lumen',
    tagline: 'Realtime collaborative IDE with AI pair-programming. Sub-100ms latency across regions.',
    preview: 'code',
    role: 'Founder / Lead Engineer',
    stack: ['Rust', 'WebSockets', 'CRDT', 'React', 'TypeScript'],
    link: '#',
    details: 'Built a CRDT-based operational transform engine handling concurrent edits at scale. The AI pair-programming layer streams token-by-token into the editor buffer without blocking the main thread. p99 latency held under 100ms across US, EU, and APAC regions.',
  },
  {
    idx: '02',
    year: '2024',
    name: 'Halcyon',
    tagline: 'Self-serve product analytics on ClickHouse. Scaled to 1.2B events/month.',
    preview: 'bars',
    role: 'Platform Lead',
    stack: ['ClickHouse', 'TypeScript', 'tRPC', 'React', 'AWS'],
    link: '#',
    details: 'Designed the entire analytics pipeline from ingestion to query. A custom materialized-view strategy cut query times from 40s to under 200ms on billion-row tables. Self-serve query builder with a SQL compiler that maps drag-and-drop to optimized ClickHouse SQL.',
  },
  {
    idx: '03',
    year: '2024',
    name: 'Nebula UI',
    tagline: 'Open-source spatial component library with WebGL transitions. 4.2k★ on GitHub.',
    preview: 'orb',
    role: 'Creator & Maintainer',
    stack: ['WebGL', 'Three.js', 'React', 'TypeScript', 'GLSL'],
    link: '#',
    details: 'A component library for building spatial interfaces — glass panels, depth blur, 3D tilt cards, and shader-based page transitions. Written as raw WebGL with a thin React wrapper. Zero runtime dependencies beyond React itself.',
  },
  {
    idx: '04',
    year: '2023',
    name: 'Signal / Noise',
    tagline: 'Editorial platform for long-form technical essays. Edge-rendered globally.',
    preview: 'grid',
    role: 'Solo Engineer',
    stack: ['Next.js', 'Edge Runtime', 'MDX', 'PostgreSQL'],
    link: '#',
    details: 'A publishing platform built for technical depth. MDX authoring with custom AST transforms for code callouts, interactive diagrams, and inline proofs. Fully edge-rendered — no cold starts, sub-50ms TTFB globally.',
  },
]

/* ===== sub-components ===== */
function StatCard({ num, label }) {
  const isNumeric = !isNaN(parseInt(num, 10))
  const target = isNumeric ? parseInt(num, 10) : 0
  const [count, ref] = useCountUp(target)
  const display = isNumeric ? String(count).padStart(2, '0') : num

  return (
    <div className="stat" ref={ref}>
      <div className="num">{display}</div>
      <div className="lab">{label}</div>
    </div>
  )
}

function ProjectPreview({ kind }) {
  if (kind === 'bars') {
    return (
      <div className="preview-bars">
        {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
          <b key={i} style={{ height: `${h}%`, opacity: 0.4 + h / 200 }} />
        ))}
      </div>
    )
  }
  if (kind === 'orb') return <div className="preview-orb"><i /></div>
  if (kind === 'code') {
    return (
      <div className="preview-code">
        <div><span className="c">{'// realtime edits'}</span></div>
        <div><span className="k">async fn</span> <span className="s">resolve</span>(op: Op) {'{'}</div>
        <div>&nbsp;&nbsp;<span className="k">let</span> rebased = transform(op);</div>
        <div>&nbsp;&nbsp;broadcast(rebased).<span className="k">await</span>;</div>
        <div>{'}'}</div>
        <div><span className="c">{'// 47ms p99'}</span></div>
      </div>
    )
  }
  return <div className="preview-grid" />
}

/* ===== HERO ===== */
export function Hero() {
  return (
    <section className="scene hero" data-section="hero">
      <div className="stage">
        <div className="eyebrow">
          <span className="tag">
            <span className="pulse" /> available · Q3 2026
          </span>
          <span>Full-stack engineer</span>
        </div>
        <h1>
          <span className="word">Roni</span>{' '}
          <span className="word serif">Kiko.</span>
        </h1>
        <StreamingIntro />
        <div className="hero-meta-row">
          <span className="chip"><span className="dot-g" /> Tel Aviv · GMT+3</span>
          <span className="chip"><span className="dot-b" /> Open to staff roles</span>
        </div>
        <div className="now-row fade-in d3">
          <span className="now-pulse" />
          <span className="now-label">now</span>
          <span className="now-sep">→</span>
          <span className="now-text">building an LLM-powered code review agent</span>
        </div>
      </div>

      <div className="hero-globe-col">
        <Globe />
      </div>
    </section>
  )
}

/* ===== PHOTO CARD ===== */
function PhotoCard({ className = '' }) {
  return (
    <div className={`id-card ${className}`}>
      <div className="id-card-img-wrap">
        <img
          src="/me.png"
          alt="Roni Kiko"
          className="id-card-img"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="id-card-initials">RK</div>
        <div className="id-card-scanlines" />
        <div className="id-card-scan" />
        <div className="id-card-tint" />
        <span className="id-card-corner tl" />
        <span className="id-card-corner tr" />
        <span className="id-card-corner bl" />
        <span className="id-card-corner br" />
      </div>
      <div className="id-card-info">
        <div className="id-card-header">
          <span className="id-card-badge">SYS // AUTHORIZED</span>
          <span className="id-card-id">ID-7731-RK</span>
        </div>
        <div className="id-card-name">RONI KIKO</div>
        <div className="id-card-role">Full-Stack Engineer</div>
        <div className="id-card-status">
          <span className="id-card-dot" />
          STATUS: ACTIVE
        </div>
      </div>
    </div>
  )
}

/* ===== ABOUT ===== */
export function About() {
  return (
    <section className="scene about" data-section="about">
      <div className="about-inner">
        <div className="about-top">
          <div>
            <div className="section-num fade-in"><span className="bar" /> 02 / About</div>
            <h2 className="quote fade-in d1">
              <span className="mark">/</span>
              I build <span className="em">composed systems</span> at the seam where interface meets infrastructure.
            </h2>
          </div>
        </div>

        <div className="body">
          <div className="fade-in d2">
            <p>
              I'm a <strong>full-stack engineer</strong> with eight years of shipping products that
              live between the browser tab and the database three layers down.
              I write <strong>Rust</strong> when latency is the product, <strong>TypeScript</strong> when
              ergonomics are, and <strong>Python</strong> when the math is.
            </p>
            <p>
              Lately I've been obsessed with <strong>agentic systems</strong> — software that thinks
              alongside its operator, surfaces what matters, and stays out of the way.
              Before independent work, I led platform teams at two Series B startups,
              shipping to millions of users without breaking the things that mattered.
            </p>
          </div>

          <PhotoCard className="fade-in d3" />
        </div>
      </div>
    </section>
  )
}

/* ===== EXPERIENCE ===== */
export function Experience() {
  return (
    <section className="scene experience" data-section="experience">
      <div className="exp-inner">
        <div className="head fade-in">
          <div>
            <div className="section-num"><span className="bar" /> 03 / Experience</div>
            <h2>Where I've <span className="em">shipped</span>.</h2>
          </div>
        </div>

        <div className="exp-list fade-in d1">
          {EXPERIENCE.map((e, i) => (
            <div key={i} className="exp-item">
              <div className="exp-period">{e.period}</div>
              <div className="exp-body">
                <div className="exp-role">{e.role}</div>
                <div className="exp-company">{e.company}</div>
                <p className="exp-desc">{e.desc}</p>
                <div className="exp-tags">
                  {e.tags.map((t) => (
                    <span key={t} className="exp-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===== SKILLS ===== */
export function Skills() {
  return (
    <section className="scene skills" data-section="skills">
      <div className="skills-inner">
        <div className="head fade-in">
          <div>
            <div className="section-num"><span className="bar" /> 04 / Stack</div>
            <h2>Tools, used <span className="em">deliberately</span>.</h2>
          </div>
          <div className="right">
            A non-exhaustive list. Proficiency is what survives a 2am production incident.
          </div>
        </div>

        <div className="skill-columns fade-in d1">
          {SKILL_GROUPS.map((g) => (
            <div className="skill-col" key={g.cat}>
              <div className="cat-name">{g.cat}</div>
              <ul>
                {g.items.map((s) => (
                  <li key={s.name}>
                    <ScrambleText text={s.name} />
                    <span className="yrs">{s.yrs}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="code-trio fade-in d2">
          <CodeWindow filename="performance.rs" lines={RUST_CODE} />
          <CodeWindow filename="api.ts"         lines={TS_CODE}   />
          <CodeWindow filename="agent.py"       lines={PY_CODE}   />
        </div>

        <div className="marquee fade-in d3">
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i}>{m}<i>◆</i></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===== PROJECTS ===== */
export function Projects({ onProjectClick }) {
  const [copiedEmail, copyEmail] = useCopy('hello@ronikiko.dev')
  const emailRef = useMagnetic(0.3)
  const resumeRef = useMagnetic(0.3)

  return (
    <section className="scene projects" data-section="projects">
      <div className="projects-inner">
        <div className="head fade-in">
          <div>
            <div className="section-num"><span className="bar" /> 05 / Selected work</div>
            <h2>Things I've <span className="em">built</span>.</h2>
          </div>
          <div className="count">{PROJECTS.length} of many</div>
        </div>

        <div className="proj-list fade-in d1">
          {PROJECTS.map((p) => (
            <div key={p.idx} className="proj-row" onClick={() => onProjectClick(p)}>
              <div className="idx">{p.idx}</div>
              <div className="pname"><ScrambleText text={p.name} /></div>
              <div className="ptag">{p.tagline}</div>
              <div className="pyear">{p.year}</div>
              <div className="parrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </div>
              <div className="preview-pop">
                <ProjectPreview kind={p.preview} />
              </div>
            </div>
          ))}
        </div>

        <div className="contact-strip fade-in d2">
          <span className="contact-label">// end of transmission</span>
          <div className="contact-right">
            <button ref={emailRef} className="contact-email" onClick={copyEmail}>
              {copiedEmail ? '✓ copied' : 'hello@ronikiko.dev'}
              {!copiedEmail && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
            <a ref={resumeRef} href="/resume.pdf" download className="resume-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Resume
            </a>
            <div className="contact-links">
              <a href="#">github</a>
              <a href="#">linkedin</a>
              <a href="#">x</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
