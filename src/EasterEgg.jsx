import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const SCRIPT = [
  '> KONAMI SEQUENCE DETECTED.',
  '> INITIATING OVERRIDE PROTOCOL...',
  '> BYPASSING FIREWALL [████████░░] 80%...',
  '> BYPASSING FIREWALL [██████████] 100%.',
  '> ACCESS GRANTED.',
  '',
  '> // hey. you found the secret.',
  '> // roni kiko — full-stack engineer.',
  '> // also: firm believer in easter eggs.',
  '> // and that great code deserves a secret.',
  '',
  '> // keep building things that matter.',
  '',
  '> SYSTEM RESTORED. returning to portfolio...',
]

export default function EasterEgg({ onClose }) {
  const [lines, setLines] = useState([])
  const [fading, setFading] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    let i = 0
    const add = () => {
      if (!mounted.current) return
      if (i >= SCRIPT.length) {
        setTimeout(() => {
          if (!mounted.current) return
          setFading(true)
          setTimeout(onClose, 700)
        }, 900)
        return
      }
      setLines((p) => [...p, SCRIPT[i]])
      i++
      const prev = SCRIPT[i - 1]
      const delay = prev === '' ? 90 : prev.includes('...') ? 420 : 180 + Math.random() * 110
      setTimeout(add, delay)
    }
    setTimeout(add, 250)
    return () => { mounted.current = false }
  }, [])

  const dismiss = () => { setFading(true); setTimeout(onClose, 700) }

  return createPortal(
    <div className={`egg-overlay${fading ? ' fading' : ''}`} onClick={dismiss}>
      <div className="egg-terminal" onClick={(e) => e.stopPropagation()}>
        <div className="egg-chrome">
          <span className="egg-dot" style={{ background: '#ff5f57' }} />
          <span className="egg-dot" style={{ background: '#febc2e' }} />
          <span className="egg-dot" style={{ background: '#28c840' }} />
          <span className="egg-chrome-title">secret_terminal — bash — 80×24</span>
        </div>
        <div className="egg-body">
          {lines.map((l, i) => (
            <div
              key={i}
              className={[
                'egg-line',
                l.includes('GRANTED') ? 'granted' : '',
                l.includes('RESTORED') ? 'restored' : '',
                l.startsWith('> //') ? 'comment' : '',
              ].filter(Boolean).join(' ')}
            >
              {l || ' '}
            </div>
          ))}
          {lines.length > 0 && lines.length < SCRIPT.length && (
            <span className="egg-cursor">▋</span>
          )}
        </div>
        <div className="egg-footer">click anywhere to dismiss</div>
      </div>
    </div>,
    document.body
  )
}
