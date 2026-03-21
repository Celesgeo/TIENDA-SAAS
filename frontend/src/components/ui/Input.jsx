export function Input({ label, className = '', id, ...rest }) {
  const cid = id || rest.name;
  return (
    <label className="block space-y-1.5">
      {label != null && label !== false && (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      )}
      <input
        id={cid}
        className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${className}`}
        {...rest}
      />
    </label>
  );
}
