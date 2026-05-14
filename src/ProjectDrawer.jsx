import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function ProjectDrawer({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!project) return null

  return createPortal(
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="drawer-eyebrow">
          <span className="drawer-idx">{project.idx}</span>
          <span className="drawer-year">{project.year}</span>
        </div>

        <h2 className="drawer-title">{project.name}</h2>

        <p className="drawer-tagline">{project.tagline}</p>

        <div className="drawer-divider" />

        <p className="drawer-details">{project.details}</p>

        <div className="drawer-meta">
          <div className="drawer-meta-row">
            <span className="drawer-label">Role</span>
            <span className="drawer-value">{project.role}</span>
          </div>
          <div className="drawer-meta-row">
            <span className="drawer-label">Year</span>
            <span className="drawer-value">{project.year}</span>
          </div>
        </div>

        <div className="drawer-stack">
          {project.stack.map((s) => (
            <span key={s} className="drawer-tag">{s}</span>
          ))}
        </div>

        <a className="drawer-link" href={project.link} target="_blank" rel="noopener noreferrer">
          View project
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </a>
      </aside>
    </div>,
    document.body
  )
}
