export default function ChristianCross({ className = "w-10 h-10 text-primary" }) {
  return (
    <svg viewBox="0 0 100 140" className={className} fill="currentColor">
      <rect x="40" y="10" width="20" height="120" />
      <rect x="20" y="40" width="60" height="20" />
    </svg>
  );
}