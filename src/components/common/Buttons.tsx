import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text' | 'danger' | 'accent';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'normal' | 'compact' | 'large';
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  size = 'normal',
  ...props
}) => {
  const heightClass = size === 'compact' ? 'h-12 text-base' : size === 'large' ? 'h-16 text-xl' : 'h-[60px] text-lg';
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${fullWidth ? 'w-full' : 'w-auto px-6'}
        ${heightClass}
        bg-[#7BC47F] hover:bg-[#6EB372] active:scale-[0.96] transition-all duration-150
        text-white font-semibold rounded-[16px] shadow-[0_4px_14px_rgba(123,196,127,0.35)]
        flex items-center justify-center gap-3 select-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        focus:outline-none focus:ring-4 focus:ring-[#7BC47F]/40
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin text-white" />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span className="truncate">{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  size = 'normal',
  ...props
}) => {
  const heightClass = size === 'compact' ? 'h-12 text-base' : size === 'large' ? 'h-16 text-xl' : 'h-[60px] text-lg';
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${fullWidth ? 'w-full' : 'w-auto px-6'}
        ${heightClass}
        bg-white hover:bg-[#F4FAF5] active:scale-[0.96] transition-all duration-150
        text-[#4A9E5C] font-semibold rounded-[16px] border-2 border-[#4A9E5C]
        flex items-center justify-center gap-3 select-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        focus:outline-none focus:ring-4 focus:ring-[#7BC47F]/30
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin text-[#4A9E5C]" />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span className="truncate">{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export const TextButton: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${fullWidth ? 'w-full' : 'w-auto'}
        h-[56px] px-4 min-h-[48px]
        bg-transparent hover:bg-[#E8F5E9]/50 active:scale-[0.96] transition-all
        text-[#4A9E5C] hover:text-[#2E7D40] font-semibold text-base
        flex items-center justify-center gap-2 select-none cursor-pointer rounded-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export const DangerButton: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${fullWidth ? 'w-full' : 'w-auto px-6'}
        h-[60px] text-lg
        bg-[#E57373] hover:bg-[#D32F2F] active:scale-[0.96] transition-all duration-150
        text-white font-semibold rounded-[16px] shadow-[0_4px_14px_rgba(229,115,115,0.3)]
        flex items-center justify-center gap-3 select-none cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-red-300
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin text-white" />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span className="truncate">{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
