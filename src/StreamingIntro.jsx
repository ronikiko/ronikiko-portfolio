import { useState, useEffect, useRef } from 'react'
import { useMagnetic } from './hooks.js'

const INTRO_LINES = [
  "I build systems where thought and machinery meet — quietly, deliberately, and with intent.",
  "Shipping software is easy. Building systems that outlast their makers — that's the craft.",
  "Every interface is a theory about how people think. I spend my days proving mine right.",
  "The best code I've written doesn't exist — it's the complexity I chose not to add.",
  "Signal over noise. Depth over surface. Systems that think before they speak.",
  "I make the invisible visible — the data, the latency, the decisions hiding in plain sight.",
]

export default function StreamingIntro() {
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const seedRef = useRef(0)
  const lineIndex = useRef(0)
  const regenRef = useMagnetic(0.28)

  function generate() {
    setLoading(true)
    setDone(false)
    setText('')
    const seed = ++seedRef.current
    const line = INTRO_LINES[lineIndex.current % INTRO_LINES.length]
    lineIndex.current++

    let i = 0
    const step = () => {
      if (seed !== seedRef.current) return
      i += Math.max(1, Math.round(line.length / 80))
      setText(line.slice(0, i))
      if (i < line.length) {
        setTimeout(step, 18 + Math.random() * 24)
      } else {
        setDone(true)
        setLoading(false)
      }
    }
    setTimeout(step, 320)
  }

  useEffect(() => { generate() }, [])

  return (
    <>
      <div className={`ai-line${done ? ' done' : ''}`}>
        {text}
        <span className="caret" />
      </div>
      <div className="ai-meta">
        <span>// generated · model: haiku-4.5</span>
        <button
          ref={regenRef}
          className={`regen${loading ? ' spin' : ''}`}
          onClick={generate}
          disabled={loading}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 3v6h-6" />
          </svg>
          regenerate
        </button>
      </div>
    </>
  )
}
