import React from "react";
import { Icon, type IconifyIcon } from "@iconify/react";

interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "size" | "color"
  > {
  variant?: "primary" | "secondary";
  icon?: IconifyIcon | string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  className = "",
  icon,
  loading = false,
  children,
  ...rest
}) => {
  const baseClasses =
    "px-4 py-2 rounded-lg transition-colors duration-200 font-medium";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed",
    secondary:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        <span className="flex gap-2 items-center">
          {icon && <Icon icon={icon} width={20} height={20} />}
          {children}
        </span>
      )}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
