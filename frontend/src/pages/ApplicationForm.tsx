import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplicationStore } from '@/stores/applicationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ApplicationStage, STAGE_CONFIG } from '@/types/application';

export default function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { applications, addApplication, updateApplication } = useApplicationStore();
  
  const existingApp = id ? applications.find((app) => app.id === id) : null;
  const isEditing = !!existingApp;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: existingApp?.companyName || '',
    role: existingApp?.role || '',
    location: existingApp?.location || '',
    jobType: existingApp?.jobType || 'full-time' as const,
    salary: existingApp?.salary || '',
    stage: existingApp?.stage || 'applied' as ApplicationStage,
    appliedDate: existingApp?.appliedDate ? new Date(existingApp.appliedDate) : new Date(),
    deadline: existingApp?.deadline ? new Date(existingApp.deadline) : undefined,
    nextInterviewDate: existingApp?.nextInterviewDate ? new Date(existingApp.nextInterviewDate) : undefined,
    source: existingApp?.source || '',
    jobUrl: existingApp?.jobUrl || '',
    notes: existingApp?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (isEditing && existingApp) {
      updateApplication(existingApp.id, {
        ...formData,
        status: formData.stage === 'offer' || formData.stage === 'rejected' ? 'completed' : 'active',
      });
      toast({
        title: 'Application updated',
        description: `${formData.companyName} application has been updated.`,
      });
    } else {
      addApplication({
        ...formData,
        status: formData.stage === 'offer' || formData.stage === 'rejected' ? 'completed' : 'active',
        contacts: [],
      });
      toast({
        title: 'Application added',
        description: `${formData.companyName} has been added to your pipeline.`,
      });
    }

    setIsLoading(false);
    navigate('/applications');
  };

  return (
    <div className="max-w-2xl mx-auto pb-16 md:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Application' : 'Add Application'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update your application details' : 'Track a new job application'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>Enter the job and company information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Google, Microsoft, etc."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  placeholder="Software Engineer, SDE Intern, etc."
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Location & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, Remote, etc."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value: 'full-time' | 'internship' | 'contract') => 
                    setFormData({ ...formData, jobType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Salary & Stage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input
                  id="salary"
                  placeholder="$100,000/year or $8,000/month"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Current Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value: ApplicationStage) => 
                    setFormData({ ...formData, stage: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {Object.entries(STAGE_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Applied Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.appliedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.appliedDate ? format(formData.appliedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.appliedDate}
                      onSelect={(date) => date && setFormData({ ...formData, appliedDate: date })}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Next Interview (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.nextInterviewDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.nextInterviewDate ? format(formData.nextInterviewDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.nextInterviewDate}
                      onSelect={(date) => setFormData({ ...formData, nextInterviewDate: date })}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Source & URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Application Source *</Label>
                <Input
                  id="source"
                  placeholder="LinkedIn, Referral, Career Fair, etc."
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                 required
                 />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job URL (Optional)</Label>
                <Input
                  id="jobUrl"
                  type="url"
                  placeholder="https://careers.company.com/job/..."
                  value={formData.jobUrl}
                  onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this application..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? 'Saving...' : 'Adding...'}
              </>
            ) : (
              isEditing ? 'Save Changes' : 'Add Application'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
