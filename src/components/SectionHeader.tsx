export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; onClick?: () => void };
}) {
  return (
    <div className="mb-3 flex items-end justify-between px-1">
      <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
      {action && (
        <button
          onClick={action.onClick}
          className="text-xs font-semibold text-primary transition hover:text-primary-glow"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
