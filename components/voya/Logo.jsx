export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-7 w-7">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-clay via-sage to-ocean opacity-90" />
        <div className="absolute inset-[3px] rounded-full bg-bone" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[15px] italic text-ink leading-none">v</span>
        </div>
      </div>
      <span className="font-display text-[22px] tracking-tight text-ink">Voya</span>
    </div>
  );
}
