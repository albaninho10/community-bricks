interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  name: string;
}

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className,
  name
}: InputProps) => {

  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} 
          ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};