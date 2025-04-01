import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "~/utils/cn";

const baseStyles =
  "w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200";

const sizeStyles = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: keyof typeof sizeStyles;
  error?: boolean;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = "md",
      error = false,
      helperText,
      disabled = false,
      type = "text",
      ...props
    },
    ref
  ) => {
    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
      : "";
    
    const errorStyles = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "";

    return (
      <div className="w-full">
        <input
          ref={ref}
          type={type}
          className={cn(
            baseStyles,
            sizeStyles[size],
            errorStyles,
            disabledStyles,
            className
          )}
          disabled={disabled}
          {...props}
        />
        {helperText && (
          <p className={cn(
            "mt-1 text-sm",
            error ? "text-red-500" : "text-gray-500/70 dark:text-gray-400/70"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";