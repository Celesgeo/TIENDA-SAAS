import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-500 shadow-soft border border-transparent',
  secondary:
    'bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled,
  ...rest
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
