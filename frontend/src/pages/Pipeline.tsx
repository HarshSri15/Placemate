import { useState } from 'react';
import { useApplicationStore } from '@/stores/applicationStore';
import { ApplicationCard } from '@/components/ApplicationCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { ApplicationStage, STAGE_CONFIG } from '@/types/application';
import { Plus, Kanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const stages: ApplicationStage[] = ['applied', 'oa', 'tech', 'hr', 'offer', 'rejected'];

export default function Pipeline() {
  const { applications, updateStage } = useApplicationStore();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<ApplicationStage | null>(null);

  const getApplicationsByStage = (stage: ApplicationStage) => {
    return applications.filter((app) => app.stage === stage);
  };

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggingId(appId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: ApplicationStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stage: ApplicationStage) => {
    e.preventDefault();
    if (draggingId) {
      updateStage(draggingId, stage);
    }
    setDraggingId(null);
    setDragOverStage(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverStage(null);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Pipeline</h1>
          <p className="text-muted-foreground">Drag applications between stages</p>
        </div>
        <Button asChild>
          <Link to="/applications/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Application
          </Link>
        </Button>
      </div>

      {/* Pipeline Board */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => {
            const config = STAGE_CONFIG[stage];
            const stageApps = getApplicationsByStage(stage);
            const isDropTarget = dragOverStage === stage;

            return (
              <div
                key={stage}
                className="w-72 flex-shrink-0"
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      stage === 'applied' && 'bg-primary',
                      stage === 'oa' && 'bg-accent',
                      stage === 'tech' && 'bg-warning',
                      stage === 'hr' && 'bg-success',
                      stage === 'offer' && 'bg-success',
                      stage === 'rejected' && 'bg-destructive'
                    )} />
                    <span className="font-medium text-sm">{config.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stageApps.length}
                  </Badge>
                </div>

                {/* Column Content */}
                <div
                  className={cn(
                    'pipeline-column transition-colors duration-200 min-h-[400px]',
                    isDropTarget && 'bg-primary/10 ring-2 ring-primary ring-dashed'
                  )}
                >
                  {stageApps.length > 0 ? (
                    stageApps.map((app) => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          'cursor-grab active:cursor-grabbing',
                          draggingId === app.id && 'opacity-50'
                        )}
                      >
                        <Link to={`/applications/${app.id}`}>
                          <ApplicationCard
                            application={app}
                            variant="pipeline"
                          />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-center p-4">
                      <div className="text-muted-foreground text-sm">
                        <p>No applications</p>
                        <p className="text-xs mt-1">Drag items here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Hint */}
      <div className="md:hidden text-center text-sm text-muted-foreground">
        <p>← Scroll horizontally to see all stages →</p>
      </div>
    </div>
  );
}
