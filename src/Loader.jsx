import { useState, useEffect, useRef } from 'react'

const LINES = [
  '> init portfolio.v26',
  '> loading assets...',
  '> mounting react...',
  '> calibrating globe...',
  '> ready.',
]

export default function Loader({ onDone }) {
  const [lines, setLines] = useState([])
  const [fading, setFading] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    let i = 0

    const addLine = () => {
      if (!mounted.current) return
      if (i >= LINES.length) {
        setTimeout(() => {
          if (!mounted.current) return
          setFading(true)
          setTimeout(onDone, 600)
        }, 400)
        return
      }
      setLines((prev) => [...prev, LINES[i]])
      i++
      setTimeout(addLine, i === 1 ? 180 : 220 + Math.random() * 140)
    }

    setTimeout(addLine, 280)
    return () => { mounted.current = false }
  }, [])

  return (
    <div className={`loader${fading ? ' fading' : ''}`}>
      <div className="loader-inner">
        <div className="loader-brand">
          <span className="loader-dot" />
          <span>RK / portfolio.v26</span>
        </div>
        <div className="loader-terminal">
          {lines.map((l, i) => (
            <div key={i} className={`loader-line${i === lines.length - 1 && l === '> ready.' ? ' ready' : ''}`}>
              {l}
            </div>
          ))}
        </div>
        <div className="loader-bar">
          <div
            className="loader-progress"
            style={{ width: `${(lines.length / LINES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
