import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, name, required, hint, error, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {hint && <span className="label-hint"> · {hint}</span>}
      </label>
      {children}
      {error && (
        <p className="field-error" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function TextInput({ invalid, className, ...props }: InputProps) {
  return <input className={cn("input", invalid && "input-error", className)} {...props} />;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  placeholder?: string;
}

export function SelectInput({ invalid, className, placeholder, children, ...props }: SelectProps) {
  return (
    <select className={cn("input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222.5%22%3E%3Cpath d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')] bg-[position:right_0.7rem_center] bg-no-repeat pr-9", invalid && "input-error", className)} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function TextareaInput({ invalid, className, ...props }: TextareaProps) {
  return <textarea className={cn("input min-h-[96px] resize-y", invalid && "input-error", className)} {...props} />;
}
