"use client";

import { type InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

export default function Input({
  label,
  error,
  className = "",
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          className={`
            w-full px-4 py-3 rounded-xl border bg-white text-slate-900
            placeholder:text-slate-400 outline-none transition-all duration-200
            focus:ring-2 focus:ring-[#008B8B] focus:border-[#008B8B]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : "border-slate-200"}
            ${isPassword ? "pr-12" : ""}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
