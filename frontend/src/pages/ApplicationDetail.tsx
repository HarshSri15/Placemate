import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApplicationStore } from '@/stores/applicationStore';
import { StatusBadge } from '@/components/ui/status-badge';
import { Timeline } from '@/components/Timeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign,
  ExternalLink,
  Edit,
  Trash2,
  Clock,
  Briefcase,
  Link as LinkIcon,
  User
} from 'lucide-react';
import { ApplicationStage, STAGE_CONFIG } from '@/types/application';
import { useToast } from '@/hooks/use-toast';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { applications, updateStage, deleteApplication } = useApplicationStore();

  const application = applications.find((app) => app.id === id);

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold mb-2">Application not found</h2>
        <p className="text-muted-foreground mb-4">This application may have been deleted</p>
        <Button asChild>
          <Link to="/applications">Back to Applications</Link>
        </Button>
      </div>
    );
  }

  const handleStageChange = (newStage: ApplicationStage) => {
    updateStage(application.id, newStage);
    toast({
      title: 'Stage updated',
      description: `Moved to ${STAGE_CONFIG[newStage].label}`,
    });
  };

  const handleDelete = () => {
    deleteApplication(application.id);
    toast({
      title: 'Application deleted',
      description: `${application.companyName} has been removed`,
    });
    navigate('/applications');
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 md:pb-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
              <Building2 className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{application.companyName}</h1>
              <p className="text-lg text-muted-foreground">{application.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge stage={application.stage} size="lg" />
                <Badge variant="secondary">{application.jobType}</Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/applications/${application.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete application?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your {application.companyName} application and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Info */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    Location
                  </div>
                  <div className="font-medium">{application.location}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Applied
                  </div>
                  <div className="font-medium">
                    {format(new Date(application.appliedDate), 'MMM d, yyyy')}
                  </div>
                </div>
                {application.salary && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      Salary
                    </div>
                    <div className="font-medium">{application.salary}</div>
                  </div>
                )}
                {application.source && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <LinkIcon className="w-4 h-4" />
                      Source
                    </div>
                    <div className="font-medium">{application.source}</div>
                  </div>
                )}
              </div>

              {application.jobUrl && (
                <div className="mt-4 pt-4 border-t border-border">
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Job Posting
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Interview */}
          {application.nextInterviewDate && new Date(application.nextInterviewDate) > new Date() && (
            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <div className="font-medium">Upcoming Interview</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(application.nextInterviewDate), 'EEEE, MMMM d, yyyy')} at{' '}
                        {format(new Date(application.nextInterviewDate), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Add to Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {application.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground whitespace-pre-wrap">{application.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
              <CardDescription>History of updates for this application</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Timeline events={application.timeline} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Contacts */}
        <div className="space-y-6">
          {/* Update Stage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Stage</CardTitle>
              <CardDescription>Move this application forward</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={application.stage} onValueChange={handleStageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {Object.entries(STAGE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${config.bgColor.replace('bg-', 'bg-')}`} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contacts</CardTitle>
              <CardDescription>People involved in this application</CardDescription>
            </CardHeader>
            <CardContent>
              {application.contacts.length > 0 ? (
                <div className="space-y-3">
                  {application.contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No contacts added yet
                </p>
              )}
              <Button variant="outline" className="w-full mt-3" size="sm">
                Add Contact
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="w-4 h-4 mr-2" />
                Add Preparation Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
