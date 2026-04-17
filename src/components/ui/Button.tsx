import { type ReactNode, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  rounded?: boolean;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#008B8B] text-white hover:bg-[#006E6E] shadow-sm hover:shadow-md active:scale-[0.98]",
  outline:
    "border-2 border-[#008B8B] text-[#008B8B] bg-transparent hover:bg-[#E0F5F5] active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-700 hover:text-[#008B8B] hover:bg-[#E0F5F5] active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  rounded = false,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008B8B] focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${rounded ? "rounded-full" : "rounded-xl"}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
