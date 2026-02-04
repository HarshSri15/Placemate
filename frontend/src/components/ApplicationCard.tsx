import { Application } from '@/types/application';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  MoreHorizontal,
  Clock
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ApplicationCardProps {
  application: Application;
  variant?: 'default' | 'compact' | 'pipeline';
  onStageChange?: (stage: Application['stage']) => void;
  onDelete?: () => void;
  className?: string;
}

export function ApplicationCard({
  application,
  variant = 'default',
  onStageChange,
  onDelete,
  className,
}: ApplicationCardProps) {
  const hasUpcomingInterview = application.nextInterviewDate && 
    new Date(application.nextInterviewDate) > new Date();

  if (variant === 'pipeline') {
    return (
      <Card className={cn('card-hover cursor-pointer group', className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-sm leading-tight">{application.companyName}</h4>
                <p className="text-xs text-muted-foreground">{application.role}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <MapPin className="w-3 h-3" />
            {application.location}
          </div>

          {hasUpcomingInterview && (
            <div className="flex items-center gap-1.5 text-xs text-warning bg-warning/10 px-2 py-1 rounded-md">
              <Clock className="w-3 h-3" />
              Interview {formatDistanceToNow(new Date(application.nextInterviewDate!), { addSuffix: true })}
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {format(new Date(application.appliedDate), 'MMM d')}
            </span>
            <Badge variant="secondary" className="text-xs">
              {application.jobType}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/applications/${application.id}`}>
        <Card className={cn('card-hover', className)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">{application.companyName}</h4>
                  <p className="text-sm text-muted-foreground">{application.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge stage={application.stage} />
                {hasUpcomingInterview && (
                  <div className="hidden sm:flex items-center gap-1 text-sm text-warning">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(application.nextInterviewDate!), 'MMM d')}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card className={cn('card-hover', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Building2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{application.companyName}</h3>
              <p className="text-muted-foreground">{application.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge stage={application.stage} size="lg" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem asChild>
                  <Link to={`/applications/${application.id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/applications/${application.id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                {application.jobUrl && (
                  <DropdownMenuItem asChild>
                    <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
                      Open Job Posting <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={onDelete}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {application.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Applied {format(new Date(application.appliedDate), 'MMM d, yyyy')}
          </div>
          {application.salary && (
            <Badge variant="secondary">{application.salary}</Badge>
          )}
        </div>

        {hasUpcomingInterview && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Interview scheduled for {format(new Date(application.nextInterviewDate!), 'MMMM d, yyyy')}
            </span>
          </div>
        )}

        {application.notes && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {application.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
