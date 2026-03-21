export function Card({ children, className = '', dark }) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-soft ${
        dark
          ? 'border-slate-800 bg-slate-900/80 text-slate-100'
          : 'border-slate-100 bg-white text-slate-900'
      } ${className}`}
    >
      {children}
    </div>
  );
}
