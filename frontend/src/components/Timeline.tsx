import { TimelineEvent, STAGE_CONFIG } from '@/types/application';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Send, 
  Code, 
  Terminal, 
  Users, 
  Trophy, 
  XCircle,
  MessageSquare,
  Bell,
  Calendar
} from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const stageIcons = {
  applied: Send,
  oa: Code,
  tech: Terminal,
  hr: Users,
  offer: Trophy,
  rejected: XCircle,
};

const typeIcons = {
  stage_change: null,
  interview: Calendar,
  note: MessageSquare,
  reminder: Bell,
};

export function Timeline({ events, className }: TimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={cn('relative space-y-0', className)}>
      {sortedEvents.map((event, index) => {
        const StageIcon = stageIcons[event.stage];
        const TypeIcon = typeIcons[event.type];
        const Icon = TypeIcon || StageIcon;
        const config = STAGE_CONFIG[event.stage];
        const isLast = index === sortedEvents.length - 1;

        return (
          <div key={event.id} className="relative flex gap-4 pb-6">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[15px] top-8 h-full w-px bg-border" />
            )}
            
            {/* Icon */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                config.bgColor
              )}
            >
              <Icon className={cn('h-4 w-4', config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{event.title}</p>
                <time className="text-xs text-muted-foreground">
                  {format(new Date(event.date), 'MMM d, h:mm a')}
                </time>
              </div>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
