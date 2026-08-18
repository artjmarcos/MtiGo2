import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const StandardCard: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-[20px] p-5
        border border-[#E0E8E1]
        shadow-[0_4px_12px_rgba(0,0,0,0.06)]
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-[0_6px_18px_rgba(0,0,0,0.1)] hover:border-[#B8E0BA] active:scale-[0.98]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const ElevatedCard: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-[20px] p-5
        border border-[#B8E0BA]/70
        shadow-[0_10px_25px_rgba(74,158,92,0.12)]
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-[0_12px_30px_rgba(74,158,92,0.18)] active:scale-[0.98]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

interface StatusCardProps extends CardProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  icon?: React.ReactNode;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  children,
  status,
  icon,
  className = '',
  ...props
}) => {
  const styles = {
    success: 'bg-[#E8F5E9] border-[#A5D6A7] text-[#1B3A1F]',
    warning: 'bg-[#FFF8E1] border-[#FFE082] text-[#5D4037]',
    error: 'bg-[#FFEBEE] border-[#FFCDD2] text-[#B71C1C]',
    info: 'bg-[#E3F2FD] border-[#90CAF9] text-[#0D47A1]',
    neutral: 'bg-[#F4FAF5] border-[#E0E8E1] text-[#1B3A1F]'
  };

  return (
    <div
      className={`
        rounded-[18px] p-4 border flex items-start gap-3.5
        ${styles[status]}
        ${className}
      `}
      {...props}
    >
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};
