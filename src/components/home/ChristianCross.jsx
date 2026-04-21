export default function ChristianCross({ className = "w-16 h-32 text-primary" }) {
  return (
    <svg viewBox="0 0 120 320" className={className} fill="currentColor">
      {/* Top cross */}
      <rect x="50" y="20" width="20" height="80" />
      <rect x="30" y="50" width="60" height="20" />
      
      {/* Middle cross */}
      <rect x="50" y="120" width="20" height="80" />
      <rect x="30" y="150" width="60" height="20" />
      
      {/* Bottom cross */}
      <rect x="50" y="220" width="20" height="80" />
      <rect x="30" y="250" width="60" height="20" />
    </svg>
  );
}