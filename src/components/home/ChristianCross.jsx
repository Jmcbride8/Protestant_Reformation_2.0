export default function ChristianCross({ className = "w-64 h-80 text-primary" }) {
  return (
    <svg viewBox="0 0 280 360" className={className} fill="currentColor">
      {/* Left cross */}
      <rect x="48" y="20" width="24" height="240" />
      <rect x="20" y="82" width="80" height="24" />
      
      {/* Center cross (tallest) */}
      <rect x="128" y="10" width="24" height="270" />
      <rect x="80" y="68" width="120" height="24" />
      
      {/* Right cross */}
      <rect x="208" y="50" width="24" height="220" />
      <rect x="180" y="98" width="80" height="24" />
    </svg>
  );
}