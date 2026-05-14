import { useState, useEffect, useRef, useCallback } from 'react'
import Background from './Background.jsx'
import Cursor from './Cursor.jsx'
import Loader from './Loader.jsx'
import ProjectDrawer from './ProjectDrawer.jsx'
import EasterEgg from './EasterEgg.jsx'
import { Hero, About, Experience, Skills, Projects } from './sections.jsx'
import { useKonami } from './hooks.js'

const SECTIONS = [
  { id: 'hero',       label: 'Home',   short: 'Home',  num: '01' },
  { id: 'about',      label: 'About',  short: 'About', num: '02' },
  { id: 'experience', label: 'Exp.',   short: 'Exp',   num: '03' },
  { id: 'skills',     label: 'Stack',  short: 'Stack', num: '04' },
  { id: 'projects',   label: 'Work',   short: 'Work',  num: '05' },
]

function useAmbientSound() {
  const [on, setOn] = useState(false)
  const nodes = useRef(null)

  const toggle = useCallback(() => {
    if (!nodes.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const master = ctx.createGain()
      master.gain.value = 0
      master.connect(ctx.destination)

      ;[[55, 'sine', 0.55], [110, 'triangle', 0.22], [165, 'triangle', 0.10]].forEach(([freq, type, vol]) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.type = type
        osc.frequency.value = freq + Math.random() * 0.5
        g.gain.value = vol
        osc.connect(g); g.connect(master); osc.start()
      })

      const lfo = ctx.createOscillator()
      const lfoG = ctx.createGain()
      lfo.frequency.value = 0.07
      lfoG.gain.value = 0.006
      lfo.connect(lfoG); lfoG.connect(master.gain); lfo.start()

      nodes.current = { ctx, master }
    }

    const { ctx, master } = nodes.current
    const t = ctx.currentTime
    master.gain.cancelScheduledValues(t)
    if (!on) {
      master.gain.setTargetAtTime(0.042, t, 2.5)
    } else {
      master.gain.setTargetAtTime(0, t, 2)
    }
    setOn((v) => !v)
  }, [on])

  return [on, toggle]
}

function ScrollProgress({ shellRef }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const el = shellRef.current
    if (!el) return
    const onScroll = () => {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight) || 0
      setPct(Math.min(100, p * 100))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [shellRef])

  return (
    <div className="scroll-track">
      <div className="scroll-bar" style={{ width: `${pct}%` }} />
    </div>
  )
}

function ChromeTop({ active, soundOn, onSoundToggle }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setTime(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="chrome-top">
      <div className="brand">
        <span className="dot" />
        <span>RK / portfolio.v26</span>
      </div>
      <div className="meta">
        <span className="meta-sec">SEC {active.num}</span>
        <span>{time} GMT+3</span>
        <button className="sound-btn" onClick={onSoundToggle} title={soundOn ? 'Mute ambient' : 'Play ambient sound'}>
          {soundOn ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          )}
        </button>
        <span className="live"><i /> live</span>
      </div>
    </div>
  )
}

function NavDots({ active, onGo }) {
  return (
    <div className="nav-dots">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          className={active.id === s.id ? 'active' : ''}
          onClick={() => onGo(s.id)}
        >
          <span className="pill" />
          <span className="nav-label">{s.num} {s.label}</span>
          <span className="nav-label-short">{s.short}</span>
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [active, setActive] = useState(SECTIONS[0])
  const [selectedProject, setSelectedProject] = useState(null)
  const [eggActive, setEggActive] = useState(false)
  const [soundOn, onSoundToggle] = useAmbientSound()
  const shellRef = useRef(null)
  const lastSection = useRef('hero')

  useKonami(() => setEggActive(true))

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.4) {
          const id = e.target.dataset.section
          const meta = SECTIONS.find((s) => s.id === id)
          if (meta && meta.id !== lastSection.current) {
            lastSection.current = meta.id
            setActive(meta)
          }
        }
      })
    }, { threshold: [0.4, 0.6], root: shell })

    shell.querySelectorAll('section[data-section]').forEach((s) => io.observe(s))

    const fio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12, root: shell })

    shell.querySelectorAll('.fade-in').forEach((el) => fio.observe(el))

    return () => { io.disconnect(); fio.disconnect() }
  }, [])

  const go = (id) => {
    const target = shellRef.current?.querySelector(`[data-section="${id}"]`)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const onKey = (e) => {
      if (selectedProject || eggActive) return
      const i = SECTIONS.findIndex((s) => s.id === active.id)
      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && i < SECTIONS.length - 1) {
        e.preventDefault(); go(SECTIONS[i + 1].id)
      } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && i > 0) {
        e.preventDefault(); go(SECTIONS[i - 1].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, selectedProject, eggActive])

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Background />
      <ScrollProgress shellRef={shellRef} />
      <ChromeTop active={active} soundOn={soundOn} onSoundToggle={onSoundToggle} />
      <NavDots active={active} onGo={go} />
      <main className="shell" ref={shellRef}>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects onProjectClick={setSelectedProject} />
      </main>
      <Cursor />
      {selectedProject && (
        <ProjectDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
      {eggActive && <EasterEgg onClose={() => setEggActive(false)} />}
    </>
  )
}
