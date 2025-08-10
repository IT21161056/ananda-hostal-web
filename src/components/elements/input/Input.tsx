import React, { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color"> {
  label?: ReactNode;
  error?: string;
  loading?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, loading, className = "", required = false, ...props },
    ref
  ) => {
    return (
      <div>
        {label && (
          <div className="space-x-1 flex">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {label}
            </label>
            {required && <label className="text-red-500">*</label>}
          </div>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            className={`w-full px-4 py-2 transition-colors duration-200 rounded-lg shadow-sm outline-none
              ${
                error
                  ? "border border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 placeholder-red-400"
                  : "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
              }
              ${loading ? "opacity-60 cursor-not-allowed" : ""}
              ${className}`}
            disabled={loading}
            {...props}
          />
          {loading && (
            <span className="absolute right-3">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
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
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs font-normal text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
