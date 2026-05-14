const DOT_COLORS = ['#ff5f57', '#febc2e', '#28c840']

export default function CodeWindow({ filename, lines, className = '' }) {
  return (
    <div className={`code-window ${className}`}>
      <div className="code-chrome">
        <div className="code-dots">
          {DOT_COLORS.map((c) => (
            <span key={c} className="code-dot" style={{ background: c }} />
          ))}
        </div>
        <span className="code-filename">{filename}</span>
      </div>
      <pre className="code-body">
        {lines.map((line, i) => (
          <div key={i} className="code-line">
            <span className="code-ln">{String(i + 1).padStart(2, ' ')}</span>
            <span
              className="code-content"
              dangerouslySetInnerHTML={{ __html: line === '' ? '&nbsp;' : line }}
            />
          </div>
        ))}
      </pre>
    </div>
  )
}
