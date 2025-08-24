import React from "react";
import { Icon, type IconifyIcon } from "@iconify/react";

interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: IconifyIcon | string;
  iconClasses?: string;
  mask?: "hex" | "hexed" | "blob" | "deca" | "diamond";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "error";
  variant?: "solid" | "outlined" | "ghost";
  shape?: "straight" | "rounded" | "circular";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg";
}

const IconBox: React.FC<IconBoxProps> = ({
  color = "default",
  icon,
  mask,
  variant = "solid",
  shape = "straight",
  size = "md",
  shadow = "none",
  className = "",
  iconClasses = "",
  ...props
}) => {
  // Base classes
  const baseClasses = "relative flex items-center justify-center shrink-0";

  // Color classes
  const colorClasses = {
    solid: {
      default: "bg-gray-200 text-gray-800",
      primary: "bg-blue-500 text-white",
      secondary: "bg-purple-500 text-white",
      success: "bg-green-500 text-white",
      warning: "bg-yellow-500 text-white",
      error: "bg-red-500 text-white",
    },
    outlined: {
      default: "border border-gray-300 text-gray-800 bg-transparent",
      primary: "border border-blue-500 text-blue-500 bg-transparent",
      secondary: "border border-purple-500 text-purple-500 bg-transparent",
      success: "border border-green-500 text-green-500 bg-transparent",
      warning: "border border-yellow-500 text-yellow-500 bg-transparent",
      error: "border border-red-500 text-red-500 bg-transparent",
    },
    ghost: {
      default: "text-gray-800 bg-transparent",
      primary: "text-blue-500 bg-transparent",
      secondary: "text-purple-500 bg-transparent",
      success: "text-green-500 bg-transparent",
      warning: "text-yellow-500 bg-transparent",
      error: "text-red-500 bg-transparent",
    },
  };

  // Shape classes
  const shapeClasses = {
    straight: "rounded-none",
    rounded: "rounded-lg",
    circular: "rounded-full",
  };

  // Size classes
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl",
  };

  // Shadow classes
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
  };

  // Mask classes
  const getMaskClass = () => {
    if (shape !== "straight" || variant === "outlined") return "";

    switch (mask) {
      case "hex":
        return "mask mask-hex";
      case "hexed":
        return "mask mask-hexed";
      case "blob":
        return "mask mask-blob";
      case "deca":
        return "mask mask-deca";
      case "diamond":
        return "mask mask-diamond";
      default:
        return "";
    }
  };

  // Combine all classes
  const combinedClasses = [
    baseClasses,
    colorClasses[variant][color],
    shapeClasses[shape],
    sizeClasses[size],
    shadowClasses[shadow],
    getMaskClass(),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={combinedClasses} {...props}>
      <Icon icon={icon} className={iconClasses} />
    </div>
  );
};

export default IconBox;
