import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

const CITIES = [
  { name: 'Tel Aviv',      loc: [32.0853,  34.7818],  size: 0.10, primary: true },
  { name: 'San Francisco', loc: [37.7749, -122.4194], size: 0.06 },
  { name: 'New York',      loc: [40.7128,  -74.0060], size: 0.06 },
  { name: 'London',        loc: [51.5074,   -0.1278], size: 0.06 },
  { name: 'Berlin',        loc: [52.5200,   13.4050], size: 0.05 },
  { name: 'Tokyo',         loc: [35.6762,  139.6503], size: 0.06 },
  { name: 'Singapore',     loc: [ 1.3521,  103.8198], size: 0.05 },
  { name: 'Sydney',        loc: [-33.8688, 151.2093], size: 0.05 },
  { name: 'São Paulo',     loc: [-23.5505,  -46.6333],size: 0.05 },
  { name: 'Bangalore',     loc: [12.9716,   77.5946], size: 0.05 },
]

function slerp(a, b, t) {
  const toRad = (d) => (d * Math.PI) / 180
  const toXYZ = ([lat, lon]) => {
    const φ = toRad(lat), λ = toRad(lon)
    return [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)]
  }
  const toLatLon = ([x, y, z]) => [
    Math.asin(z) * 180 / Math.PI,
    Math.atan2(y, x) * 180 / Math.PI,
  ]
  const p1 = toXYZ(a), p2 = toXYZ(b)
  const dot = p1[0]*p2[0] + p1[1]*p2[1] + p1[2]*p2[2]
  const omega = Math.acos(Math.max(-1, Math.min(1, dot)))
  const sinO = Math.sin(omega) || 1
  const k1 = Math.sin((1 - t) * omega) / sinO
  const k2 = Math.sin(t * omega) / sinO
  return toLatLon([p1[0]*k1 + p2[0]*k2, p1[1]*k1 + p2[1]*k2, p1[2]*k1 + p2[2]*k2])
}

export default function Globe() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const pointerDown = useRef(null)
  const pointerMove = useRef(0)
  const phi = useRef(0)
  const arcsRef = useRef([])
  const arcSeed = useRef(0)

  function spawnArc() {
    const a = CITIES[0]
    const b = CITIES[1 + Math.floor(Math.random() * (CITIES.length - 1))]
    const id = ++arcSeed.current
    const samples = 18
    const points = []
    for (let i = 0; i <= samples; i++) {
      points.push(slerp(a.loc, b.loc, i / samples))
    }
    arcsRef.current.push({ id, points, born: performance.now(), life: 2200 })
  }

  useEffect(() => {
    const wrap = wrapRef.current
    let width = wrap ? wrap.offsetWidth : 600
    let globe = null
    let arcInterval = null
    let stopped = false

    const onResize = () => {
      if (wrapRef.current) width = wrapRef.current.offsetWidth
    }
    window.addEventListener('resize', onResize)

    if (!canvasRef.current) return

    globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(2, window.devicePixelRatio || 1),
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.28,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6.5,
      baseColor: [0.32, 0.42, 0.62],
      markerColor: [88 / 255, 166 / 255, 1],
      glowColor: [0.18, 0.36, 0.78],
      markers: CITIES.map((c) => ({ location: c.loc, size: c.size })),
      onRender: (state) => {
        if (pointerDown.current == null) phi.current += 0.0028
        state.phi = phi.current + pointerMove.current
        state.width = width * 2
        state.height = width * 2

        const now = performance.now()
        const markers = CITIES.map((c) => ({ location: c.loc, size: c.size }))
        arcsRef.current = arcsRef.current.filter((a) => now - a.born < a.life)
        for (const a of arcsRef.current) {
          const t = (now - a.born) / a.life
          const head = Math.min(1, t * 1.6)
          const tail = Math.max(0, t * 1.6 - 0.4)
          for (let i = 0; i < a.points.length; i++) {
            const p = i / (a.points.length - 1)
            if (p > tail && p < head) {
              const edge = Math.min(p - tail, head - p) / 0.2
              markers.push({ location: a.points[i], size: 0.018 + Math.min(edge, 1) * 0.025 })
            }
          }
        }
        state.markers = markers
      },
    })

    canvasRef.current.style.opacity = '1'
    spawnArc()
    arcInterval = setInterval(spawnArc, 1400)

    return () => {
      stopped = true
      if (globe) globe.destroy()
      if (arcInterval) clearInterval(arcInterval)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="globe-wrap" ref={wrapRef}>
      <div className="globe-glow" />
      <div className="globe-ring globe-ring-1" />
      <div className="globe-ring globe-ring-2" />
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        onPointerDown={(e) => {
          pointerDown.current = e.clientX - pointerMove.current * 100
          e.currentTarget.style.cursor = 'grabbing'
        }}
        onPointerUp={(e) => {
          pointerDown.current = null
          e.currentTarget.style.cursor = 'grab'
        }}
        onPointerOut={(e) => {
          pointerDown.current = null
          e.currentTarget.style.cursor = 'grab'
        }}
        onMouseMove={(e) => {
          if (pointerDown.current !== null) {
            pointerMove.current = (e.clientX - pointerDown.current) / 100
          }
        }}
        onTouchMove={(e) => {
          if (pointerDown.current !== null && e.touches[0]) {
            pointerMove.current = (e.touches[0].clientX - pointerDown.current) / 80
          }
        }}
      />
    </div>
  )
}
