export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <div className="brand-mark">N</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
