import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router";
import { cn } from "~/utils/cn";

// Base styles shared between Button and ButtonLink
const baseStyles =
  "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

const variantStyles = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  secondary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost:
    "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
};

const sizeStyles = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

// Common props for both Button and ButtonLink
type CommonProps = {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
};

// Button component
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    CommonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      type = "button",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          disabledStyles,
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// ButtonLink component
export interface ButtonLinkProps extends LinkProps, CommonProps {
  disabled?: boolean;
  className?: string;
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const disabledStyles = disabled
      ? "opacity-50 pointer-events-none"
      : "cursor-pointer";

    return (
      <Link
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          disabledStyles,
          className
        )}
        {...props}
        onClick={disabled ? (e) => e.preventDefault() : props.onClick}
      >
        {children}
      </Link>
    );
  }
);

ButtonLink.displayName = "ButtonLink";
