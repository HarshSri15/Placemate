import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Bell, 
  Kanban,
  Target,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: Kanban,
    title: 'Visual Pipeline',
    description: 'Track applications across stages with our intuitive Kanban board. Never lose sight of where you stand.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Get timely notifications for upcoming interviews, deadlines, and follow-ups.',
  },
  {
    icon: BarChart3,
    title: 'Insightful Analytics',
    description: 'Understand your placement journey with conversion rates, response times, and success metrics.',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Set application targets and track your progress towards landing your dream job.',
  },
];

const stats = [
  { value: '10K+', label: 'Students' },
  { value: '50K+', label: 'Applications Tracked' },
  { value: '8K+', label: 'Offers Received' },
];

const testimonials = [
  {
    quote: "PlaceMate helped me stay organized during the chaotic placement season. Landed my dream job at Google!",
    author: "Priya S.",
    role: "SDE at Google",
  },
  {
    quote: "The analytics feature showed me where I was losing candidates. Improved my conversion rate by 40%.",
    author: "Rahul M.",
    role: "Backend Developer at Stripe",
  },
  {
    quote: "Finally, a tool that understands the Indian placement process. Highly recommend for all college students.",
    author: "Ananya K.",
    role: "SWE Intern at Microsoft",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">PlaceMate</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            Trusted by 10,000+ students
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Track Your Placements.
            <br />
            <span className="gradient-text">Land Your Dream Job.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The all-in-one platform to organize applications, track interview rounds, 
            and stay on top of your placement journey. No more spreadsheet chaos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="w-full sm:w-auto glow-primary" asChild>
              <Link to="/signup">
                Start Tracking Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link to="/demo">View Demo</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="relative rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative p-4 sm:p-8">
              {/* Mock Dashboard UI */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {['24 Applied', '12 Active', '4 Interviews', '2 Offers'].map((stat, i) => (
                  <div key={i} className="bg-muted/50 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">{stat.split(' ')[1]}</div>
                    <div className="text-xl font-bold">{stat.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
              
              {/* Mock Pipeline */}
              <div className="flex gap-4 overflow-x-auto pb-4">
                {['Applied', 'OA', 'Tech Round', 'HR', 'Offer'].map((stage, i) => (
                  <div key={i} className="flex-shrink-0 w-48 bg-muted/30 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${
                        i === 0 ? 'bg-primary' : 
                        i === 1 ? 'bg-accent' : 
                        i === 2 ? 'bg-warning' : 
                        i === 3 ? 'bg-success' : 'bg-success'
                      }`} />
                      <span className="text-sm font-medium">{stage}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{[8, 5, 4, 3, 2][i]}</span>
                    </div>
                    {[...Array([3, 2, 2, 2, 1][i])].map((_, j) => (
                      <div key={j} className="bg-card rounded-lg p-3 mb-2 shadow-sm">
                        <div className="w-24 h-3 bg-muted rounded mb-2" />
                        <div className="w-16 h-2 bg-muted/50 rounded" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built specifically for students navigating the placement process. 
              Every feature designed to reduce anxiety and increase clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="card-hover">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, yet powerful
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { step: 1, title: 'Add Applications', desc: 'Log company, role, and application details in seconds' },
              { step: 2, title: 'Track Progress', desc: 'Move applications through stages as you progress' },
              { step: 3, title: 'Get Reminders', desc: 'Never miss an interview or deadline again' },
              { step: 4, title: 'Analyze & Improve', desc: 'Use insights to optimize your strategy' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by students everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="card-hover">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">{t.author.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{t.author}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-success/10 rounded-3xl p-8 sm:p-12 border border-border/50">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to ace your placements?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of students who've transformed their placement journey with PlaceMate.
            </p>
            <Button size="lg" className="glow-primary" asChild>
              <Link to="/signup">
                Get Started — It's Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Free forever
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-success" />
                No credit card
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">PlaceMate</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PlaceMate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
