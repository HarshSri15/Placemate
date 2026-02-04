import { useState } from 'react';
import { useApplicationStore } from '@/stores/applicationStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/EmptyState';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { 
  Bell, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Settings,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Reminders() {
  const { applications } = useApplicationStore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Get upcoming interviews
  const upcomingInterviews = applications
    .filter((app) => 
      app.nextInterviewDate && 
      isAfter(new Date(app.nextInterviewDate), new Date())
    )
    .sort((a, b) => 
      new Date(a.nextInterviewDate!).getTime() - new Date(b.nextInterviewDate!).getTime()
    );

  // Get applications with deadlines
  const upcomingDeadlines = applications
    .filter((app) => 
      app.deadline && 
      isAfter(new Date(app.deadline), new Date()) &&
      isBefore(new Date(app.deadline), addDays(new Date(), 7))
    )
    .sort((a, b) => 
      new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    );

  // Get applications needing follow-up (applied > 7 days ago with no update)
  const needsFollowUp = applications.filter((app) => 
    app.stage === 'applied' && 
    isBefore(new Date(app.appliedDate), addDays(new Date(), -7))
  );

  const totalReminders = upcomingInterviews.length + upcomingDeadlines.length + needsFollowUp.length;

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Reminders</h1>
          <p className="text-muted-foreground">Stay on top of your applications</p>
        </div>
        <Badge variant="secondary" className="w-fit">
          {totalReminders} active reminders
        </Badge>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure how you want to be reminded</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive browser notifications
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-warning" />
                <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
              </div>
              <Badge variant="secondary">{upcomingInterviews.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 5).map((app) => {
                  const daysUntil = Math.ceil(
                    (new Date(app.nextInterviewDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isUrgent = daysUntil <= 2;

                  return (
                    <Link
                      key={app.id}
                      to={`/applications/${app.id}`}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg transition-colors',
                        isUrgent ? 'bg-warning/10 hover:bg-warning/15' : 'bg-muted/50 hover:bg-muted'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          isUrgent ? 'bg-warning/20' : 'bg-muted'
                        )}>
                          <Target className={cn('w-5 h-5', isUrgent ? 'text-warning' : 'text-muted-foreground')} />
                        </div>
                        <div>
                          <div className="font-medium">{app.companyName}</div>
                          <div className="text-sm text-muted-foreground">{app.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn('font-medium', isUrgent && 'text-warning')}>
                          {format(new Date(app.nextInterviewDate!), 'MMM d')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<Calendar className="w-6 h-6 text-muted-foreground" />}
                title="No upcoming interviews"
                description="Your interview schedule is clear"
                className="py-8"
              />
            )}
          </CardContent>
        </Card>

        {/* Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-destructive" />
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </div>
              <Badge variant="secondary">{upcomingDeadlines.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map((app) => {
                  const daysUntil = Math.ceil(
                    (new Date(app.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <Link
                      key={app.id}
                      to={`/applications/${app.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <div className="font-medium">{app.companyName}</div>
                          <div className="text-sm text-muted-foreground">{app.stage} deadline</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-destructive">
                          {format(new Date(app.deadline!), 'MMM d')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {daysUntil} days left
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircle2 className="w-6 h-6 text-success" />}
                title="No urgent deadlines"
                description="You're all caught up!"
                className="py-8"
              />
            )}
          </CardContent>
        </Card>

        {/* Follow-up Needed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" />
                <CardTitle className="text-lg">Needs Follow-up</CardTitle>
              </div>
              <Badge variant="secondary">{needsFollowUp.length}</Badge>
            </div>
            <CardDescription>
              Applications with no response for over 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {needsFollowUp.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {needsFollowUp.map((app) => {
                  const daysSince = Math.ceil(
                    (new Date().getTime() - new Date(app.appliedDate).getTime()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <Link
                      key={app.id}
                      to={`/applications/${app.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{app.companyName}</div>
                        <div className="text-sm text-muted-foreground">
                          Applied {daysSince} days ago
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircle2 className="w-6 h-6 text-success" />}
                title="All applications are fresh"
                description="No follow-ups needed right now"
                className="py-8"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
