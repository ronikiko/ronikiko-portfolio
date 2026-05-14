import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -100, my = -100, rx = -100, ry = -100
    let rafId

    const onMove = (e) => { mx = e.clientX; my = e.clientY }

    const tick = () => {
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`
      rafId = requestAnimationFrame(tick)
    }

    const onOver = (e) => {
      if (e.target.closest('a, button, .proj-row, [data-hover]')) {
        ring.classList.add('expanded')
      }
    }
    const onOut = (e) => {
      if (e.target.closest('a, button, .proj-row, [data-hover]')) {
        ring.classList.remove('expanded')
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}
