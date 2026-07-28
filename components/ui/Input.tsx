import { forwardRef, type InputHTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, onClick, type, ...props }, ref) => {
    const inputId = id ?? props.name;
    const isDateInput = type === "date";

    const handleClick = (event: MouseEvent<HTMLInputElement>) => {
      onClick?.(event);
      if (isDateInput && !event.defaultPrevented && "showPicker" in event.currentTarget) {
        try {
          event.currentTarget.showPicker();
        } catch {
          // Some browsers reject showPicker if not allowed for this gesture.
        }
      }
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-800"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          onClick={isDateInput ? handleClick : onClick}
          className={cn(
            "flex h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900",
            "placeholder:text-neutral-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isDateInput &&
              "cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
            error && "border-red-400 focus-visible:ring-red-500",
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-neutral-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
