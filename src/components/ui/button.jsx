export function Button({ children, onClick, variant = 'default' }) {
  const base = 'rounded-lg px-4 py-2 font-medium';
  const styles = {
    default: 'bg-purple-600 text-white hover:bg-purple-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  };
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
}
