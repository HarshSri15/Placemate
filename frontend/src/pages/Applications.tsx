import { useState, useEffect } from 'react'; // ✅ Added useEffect
import { useApplicationStore } from '@/stores/applicationStore';
import { ApplicationCard } from '@/components/ApplicationCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Filter, LayoutGrid, List, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationStage, STAGE_CONFIG } from '@/types/application';
import { cn } from '@/lib/utils';

export default function Applications() {
  const { applications, fetchApplications, deleteApplication, isLoading } = useApplicationStore(); // ✅ Added fetchApplications, isLoading
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // ✅ ADD THIS - Fetch applications when component mounts
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.companyName.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || app.stage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  const stageCounts = Object.keys(STAGE_CONFIG).reduce((acc, stage) => {
    acc[stage] = applications.filter((app) => app.stage === stage).length;
    return acc;
  }, {} as Record<string, number>);

  // ✅ ADD THIS - Show loading state
  if (isLoading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">
            {applications.length} total applications
          </p>
        </div>
        <Button asChild>
          <Link to="/applications/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Application
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All stages" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All stages</SelectItem>
              {Object.entries(STAGE_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label} ({stageCounts[key] || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex border border-input rounded-md">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-l-none"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stage Pills */}
      <div className="flex gap-2 flex-wrap">
        <Badge
          variant={stageFilter === 'all' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => setStageFilter('all')}
        >
          All ({applications.length})
        </Badge>
        {Object.entries(STAGE_CONFIG).map(([key, config]) => (
          <Badge
            key={key}
            variant={stageFilter === key ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setStageFilter(key)}
          >
            {config.label} ({stageCounts[key] || 0})
          </Badge>
        ))}
      </div>

      {/* Applications List/Grid */}
      {filteredApplications.length > 0 ? (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
            : 'space-y-4'
        )}>
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              variant={viewMode === 'grid' ? 'default' : 'compact'}
              onDelete={() => deleteApplication(app.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase className="w-8 h-8 text-muted-foreground" />}
          title={search || stageFilter !== 'all' ? 'No applications found' : 'No applications yet'}
          description={
            search || stageFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start tracking your placement journey by adding your first application'
          }
          action={
            !search && stageFilter === 'all' && (
              <Button asChild>
                <Link to="/applications/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Application
                </Link>
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
