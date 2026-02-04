import { useApplicationStore } from '@/stores/applicationStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { STAGE_CONFIG } from '@/types/application';
import { TrendingUp, TrendingDown, Target, Clock, Trophy, BarChart3 } from 'lucide-react';

export default function Analytics() {
  const { applications, getDashboardStats, getAnalyticsData } = useApplicationStore();
  const stats = getDashboardStats();
  const analyticsData = getAnalyticsData();

  // Calculate stage distribution
  const stageDistribution = Object.entries(STAGE_CONFIG).map(([stage, config]) => ({
    name: config.label,
    value: applications.filter((app) => app.stage === stage).length,
    color: stage === 'applied' ? 'hsl(210, 100%, 45%)' :
           stage === 'oa' ? 'hsl(262, 83%, 58%)' :
           stage === 'tech' ? 'hsl(38, 92%, 50%)' :
           stage === 'hr' ? 'hsl(152, 69%, 40%)' :
           stage === 'offer' ? 'hsl(152, 69%, 35%)' :
           'hsl(0, 84%, 60%)',
  }));

  // Calculate conversion funnel
  const funnelData = [
    { stage: 'Applied', count: applications.length, rate: 100 },
    { stage: 'OA', count: applications.filter(a => ['oa', 'tech', 'hr', 'offer'].includes(a.stage)).length, rate: 0 },
    { stage: 'Tech', count: applications.filter(a => ['tech', 'hr', 'offer'].includes(a.stage)).length, rate: 0 },
    { stage: 'HR', count: applications.filter(a => ['hr', 'offer'].includes(a.stage)).length, rate: 0 },
    { stage: 'Offer', count: applications.filter(a => a.stage === 'offer').length, rate: 0 },
  ].map((item, index, arr) => ({
    ...item,
    rate: index === 0 ? 100 : arr[index - 1].count > 0 ? Math.round((item.count / arr[index - 1].count) * 100) : 0
  }));

  // Application sources
  const sourceData = applications.reduce((acc, app) => {
    const source = app.source || 'Other';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceChartData = Object.entries(sourceData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Insights into your placement journey</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{stats.responseRate}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-success">
              <TrendingUp className="w-3 h-3" />
              +5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offer Rate</p>
                <p className="text-2xl font-bold">
                  {applications.length > 0 
                    ? Math.round((stats.offersReceived / applications.length) * 100) 
                    : 0}%
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-success" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.offersReceived} offers from {applications.length} applications
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                <p className="text-2xl font-bold">{analyticsData.avgTimeToResponse} days</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Average time to first response
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interview Rate</p>
                <p className="text-2xl font-bold">
                  {applications.length > 0 
                    ? Math.round(((applications.length - applications.filter(a => a.stage === 'applied' || a.stage === 'rejected').length) / applications.length) * 100)
                    : 0}%
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-accent" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Applications that got interviews
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applications Over Time</CardTitle>
            <CardDescription>Monthly application trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.applicationsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stage Distribution</CardTitle>
            <CardDescription>Current applications by stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stageDistribution.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Funnel</CardTitle>
            <CardDescription>Application to offer conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((item, index) => (
                <div key={item.stage} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.stage}</span>
                    <div className="flex items-center gap-2">
                      <span>{item.count}</span>
                      {index > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={item.rate >= 70 ? 'bg-success/10 text-success' : item.rate >= 40 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}
                        >
                          {item.rate}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / (funnelData[0].count || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Sources</CardTitle>
            <CardDescription>Where your applications come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--accent))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 text-success mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Strength</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your technical round conversion rate is above average. Keep focusing on DSA prep!
              </p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 text-warning mb-2">
                <Target className="w-4 h-4" />
                <span className="font-medium">Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Consider diversifying your application sources. LinkedIn has higher response rates.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Tip</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Applications sent on Tuesday-Thursday have 23% higher response rates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
