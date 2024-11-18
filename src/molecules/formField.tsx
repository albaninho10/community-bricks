import { Input } from "@src/atoms/input";

export type FieldType = 'text' | 'email' | 'password'

interface FormFieldProps {
    name: string
    label?: string
    type?: FieldType
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
    placeholder?: string
    required?: boolean
}

export const FormField = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    name,
    required
}: FormFieldProps) => (
    <div className="mb-4">
        {label && (
            <label className="block text-sm font-medium mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
        )}
        <Input
            type={type}
            value={value}
            onChange={onChange}
            error={error}
            placeholder={placeholder}
            name={name}
        />
    </div>
)