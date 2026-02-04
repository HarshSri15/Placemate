import { cn } from '@/lib/utils';
import { ApplicationStage, STAGE_CONFIG } from '@/types/application';

interface StatusBadgeProps {
  stage: ApplicationStage;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ stage, size = 'md', showIcon = true, className }: StatusBadgeProps) {
  const config = STAGE_CONFIG[stage];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
        config.bgColor,
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <span className={cn('w-1.5 h-1.5 rounded-full', 
          stage === 'applied' && 'bg-primary',
          stage === 'oa' && 'bg-accent',
          stage === 'tech' && 'bg-warning',
          stage === 'hr' && 'bg-success',
          stage === 'offer' && 'bg-success',
          stage === 'rejected' && 'bg-destructive'
        )} />
      )}
      {config.label}
    </span>
  );
}
