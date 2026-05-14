import { useEffect, useRef } from 'react'

export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(2, window.devicePixelRatio || 1)

    let W = 0, H = 0
    let stars = [], particles = []
    let mx = 0, my = 0, tmx = 0, tmy = 0
    let rafId

    function seed() {
      stars = []
      const N = Math.floor((W * H) / 7000)
      for (let i = 0; i < N; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: Math.random() * 0.8 + 0.2,
          r: Math.random() * 1.2 + 0.2,
          tw: Math.random() * Math.PI * 2,
          twS: Math.random() * 0.02 + 0.005,
        })
      }
      particles = []
      for (let i = 0; i < 14; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: Math.random() * 80 + 60,
          hue: Math.random() < 0.5 ? 210 : 260,
        })
      }
    }

    function resize() {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * DPR
      canvas.height = H * DPR
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      seed()
    }

    const onMouse = (e) => {
      tmx = (e.clientX / W - 0.5) * 2
      tmy = (e.clientY / H - 0.5) * 2
    }

    function tick() {
      mx += (tmx - mx) * 0.05
      my += (tmy - my) * 0.05
      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < -p.r) p.x = W + p.r
        if (p.x > W + p.r) p.x = -p.r
        if (p.y < -p.r) p.y = H + p.r
        if (p.y > H + p.r) p.y = -p.r
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        const col = p.hue === 210 ? '88, 166, 255' : '167, 139, 250'
        grad.addColorStop(0, `rgba(${col}, 0.10)`)
        grad.addColorStop(1, `rgba(${col}, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const s of stars) {
        s.tw += s.twS
        const px = s.x + mx * 30 * s.z
        const py = s.y + my * 30 * s.z
        const a = 0.4 + Math.sin(s.tw) * 0.4
        ctx.fillStyle = `rgba(${s.z > 0.7 ? '200, 220, 255' : '160, 180, 220'}, ${a * s.z})`
        ctx.beginPath()
        ctx.arc(px, py, s.r * s.z, 0, Math.PI * 2)
        ctx.fill()
        if (s.z > 0.75 && a > 0.6) {
          ctx.fillStyle = `rgba(180, 210, 255, ${a * 0.1})`
          ctx.beginPath()
          ctx.arc(px, py, s.r * 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <div className="void">
      <canvas ref={canvasRef} />
      <div className="grid" />
      <div className="noise" />
    </div>
  )
}
