import React, { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface TextAreaProps
  extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, "size" | "color"> {
  label?: ReactNode;
  error?: string;
  loading?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
        <div>
          <textarea
            ref={ref}
            {...props}
            rows={2}
            className={`w-full px-4 py-2 transition-colors duration-200 rounded-lg shadow-sm outline-none
                ${
                  error
                    ? "border border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 placeholder-red-400"
                    : "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
                }
                ${loading ? "opacity-60 cursor-not-allowed" : ""}
                ${className}`}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs font-normal text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

export default Textarea;
