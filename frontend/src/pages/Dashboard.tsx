import { useApplicationStore } from '@/stores/applicationStore';
import { StatsCard } from '@/components/ui/stats-card';
import { ApplicationCard } from '@/components/ApplicationCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Trophy, 
  XCircle,
  ArrowRight,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { STAGE_CONFIG } from '@/types/application';

export default function Dashboard() {
  const { applications, getDashboardStats } = useApplicationStore();
  const stats = getDashboardStats();

  // Get upcoming interviews (next 7 days)
  const upcomingInterviews = applications
    .filter((app) => 
      app.nextInterviewDate && 
      isAfter(new Date(app.nextInterviewDate), new Date()) &&
      isBefore(new Date(app.nextInterviewDate), addDays(new Date(), 7))
    )
    .sort((a, b) => 
      new Date(a.nextInterviewDate!).getTime() - new Date(b.nextInterviewDate!).getTime()
    )
    .slice(0, 3);

  // Get recent applications
  const recentApplications = applications
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get stage distribution for chart
  const stageData = Object.entries(STAGE_CONFIG)
    .filter(([key]) => key !== 'rejected')
    .map(([stage, config]) => ({
      name: config.label.split(' ')[0],
      count: applications.filter((app) => app.stage === stage).length,
      fill: `hsl(var(--stage-${stage}))`,
    }));

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your placement journey</p>
        </div>
        <Button asChild>
          <Link to="/applications/new">
            Add Application
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Applications"
          value={stats.totalApplications}
          subtitle="All time"
          icon={Briefcase}
          iconColor="text-primary"
        />
        <StatsCard
          title="Active"
          value={stats.activeApplications}
          subtitle="In progress"
          icon={TrendingUp}
          iconColor="text-accent"
        />
        <StatsCard
          title="Interviews"
          value={stats.interviewsScheduled}
          subtitle="Scheduled"
          icon={Calendar}
          iconColor="text-warning"
        />
        <StatsCard
          title="Offers"
          value={stats.offersReceived}
          subtitle={`${stats.rejections} rejected`}
          icon={Trophy}
          iconColor="text-success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Interviews */}
          {upcomingInterviews.length > 0 && (
            <Card className="border-warning/30 bg-warning/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-warning" />
                    <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-warning/10 text-warning">
                    {upcomingInterviews.length} scheduled
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingInterviews.map((app) => (
                  <Link
                    key={app.id}
                    to={`/applications/${app.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Target className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{app.companyName}</div>
                        <div className="text-sm text-muted-foreground">{app.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-warning">
                        {format(new Date(app.nextInterviewDate!), 'MMM d')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(app.nextInterviewDate!), 'h:mm a')}
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Applications */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Applications</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/applications">
                    View all
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    variant="compact"
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No applications yet</p>
                  <Button asChild>
                    <Link to="/applications/new">Add your first application</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Insights */}
        <div className="space-y-6">
          {/* Response Rate */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Response Rate</CardTitle>
              <CardDescription>Companies that responded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold">{stats.responseRate}%</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Good
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.responseRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pipeline Overview</CardTitle>
              <CardDescription>Applications by stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stageData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={60}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[0, 4, 4, 0]}
                      fill="hsl(var(--primary))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/pipeline">
                  <Target className="w-4 h-4 mr-2" />
                  View Pipeline
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/analytics">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/reminders">
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Reminders
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
