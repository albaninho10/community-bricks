import { Button } from "@src/atoms/button";
import { FieldType, FormField } from "@src/molecules/formField";
import { useState } from "react";

export type BaseFormData = Record<string, string>;

export interface FormConfig<T> {
    name: keyof T
    label?: string
    type: FieldType
    placeholder?: string
    required?: boolean
    validation?: (value: string) => string | undefined
}

type ValidateFormFields<T, F extends FormConfig<T>[]> = {
    [K in keyof T]: F extends (infer U extends FormConfig<T>)[]
    ? U extends { name: K }
    ? U
    : never
    : never
} extends Record<keyof T, FormConfig<T>>
    ? F
    : never;

interface FormProps<T extends Record<string, string>> {
    fields: ValidateFormFields<T, FormConfig<T>[]>
    onSubmit: (data: T) => Promise<void>
    submitText: string
    initialValues?: Partial<T>
    isLoading?: boolean
    serverError?: string
}

export function Form<T extends Record<string, string>>({
    fields,
    onSubmit,
    submitText,
    initialValues = {},
    isLoading,
    serverError
}: FormProps<T>) {
    const [values, setValues] = useState<Partial<T>>(initialValues)
    const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>)

    const validateField = (name: keyof T, value: string) => {
        const field = fields.find(f => f.name === name)
        if (!field) return undefined

        if (field.required && !value) return 'Ce champ est requis'
        if (field.validation) return field.validation(value)
        if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Email invalide'
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValues(prev => ({ ...prev, [name]: value }))

        const error = validateField(name as keyof T, value)
        setErrors(prev => ({
            ...prev,
            [name]: error || ''
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: Record<keyof T, string> = {} as Record<keyof T, string>
        let hasErrors = false

        fields.forEach(field => {
            const error = validateField(field.name, values[field.name] || '')
            if (error) {
                newErrors[field.name] = error
                hasErrors = true
            }
        })

        if (hasErrors) {
            setErrors(newErrors)
            return
        }

        await onSubmit(values as T)
    }

    console.log(errors)

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
                <FormField
                    key={String(field.name)}
                    name={String(field.name)}
                    label={field.label}
                    type={field.type}
                    value={values[field.name] || ''}
                    onChange={handleChange}
                    error={errors[field.name]}
                    placeholder={field.placeholder}
                    required={field.required}
                />
            ))}

            {serverError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {serverError}
                </div>
            )}

            <Button
                type="submit"
                isLoading={isLoading}
                disabled={Object.values(errors).some(Boolean)}
                className="w-full"
            >
                {submitText}
            </Button>
        </form>
    )
}