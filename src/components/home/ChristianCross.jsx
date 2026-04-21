export default function ChristianCross({ className = "w-64 h-80 text-primary" }) {
  return (
    <svg viewBox="0 0 280 360" className={className} fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
      {/* Left cross */}
      <line x1="60" y1="20" x2="60" y2="240" />
      <line x1="20" y1="90" x2="100" y2="90" />
      
      {/* Center cross (tallest) */}
      <line x1="140" y1="10" x2="140" y2="260" />
      <line x1="80" y1="80" x2="200" y2="80" />
      
      {/* Right cross */}
      <line x1="220" y1="50" x2="220" y2="250" />
      <line x1="180" y1="110" x2="260" y2="110" />
    </svg>
  );
}