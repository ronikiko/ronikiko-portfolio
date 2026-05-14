import { useState, useEffect, useRef, useCallback } from 'react'

/* ── text scramble ── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'

export function useScramble(text, speed = 28) {
  const [display, setDisplay] = useState(text)
  const timer = useRef(null)

  const scramble = useCallback(() => {
    clearTimeout(timer.current)
    let frame = 0
    const total = Math.ceil(text.length * 1.7)
    const step = () => {
      const revealed = Math.floor((frame / total) * text.length)
      setDisplay(
        [...text].map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < revealed) return ch
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      frame++
      if (frame <= total) timer.current = setTimeout(step, speed)
      else setDisplay(text)
    }
    step()
  }, [text, speed])

  const reset = useCallback(() => {
    clearTimeout(timer.current)
    setDisplay(text)
  }, [text])

  useEffect(() => () => clearTimeout(timer.current), [])
  return [display, scramble, reset]
}

/* ── magnetic pull ── */
export function useMagnetic(strength = 0.32) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let tx = 0, ty = 0, cx = 0, cy = 0, raf

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      const threshold = Math.max(r.width, r.height) * 1.5
      if (dist < threshold) {
        const f = (1 - dist / threshold) * strength
        tx = dx * f; ty = dy * f
      } else {
        tx = 0; ty = 0
      }
    }

    const tick = () => {
      cx += (tx - cx) * 0.14
      cy += (ty - cy) * 0.14
      el.style.transform = `translate(${cx.toFixed(2)}px,${cy.toFixed(2)}px)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      el.style.transform = ''
    }
  }, [strength])

  return ref
}

/* ── konami code ── */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export function useKonami(callback) {
  const buf = useRef([])
  const cb = useRef(callback)
  cb.current = callback

  useEffect(() => {
    const onKey = (e) => {
      buf.current = [...buf.current, e.key].slice(-KONAMI.length)
      if (buf.current.join(',') === KONAMI.join(',')) {
        cb.current()
        buf.current = []
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
