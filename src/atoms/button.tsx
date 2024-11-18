interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className,
  isLoading,
  disabled
}: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {isLoading ? 'Chargement...' : children}
    </button>
  );
};