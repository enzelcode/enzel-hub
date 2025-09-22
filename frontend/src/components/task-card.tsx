'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { KanbanTask } from '@/components/kanban-board';
import { Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: KanbanTask;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isBeingDragged = isDragging || isSortableDragging;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all hover:shadow-md",
        isBeingDragged && "opacity-50 rotate-2 shadow-lg"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-sm line-clamp-2 flex-1">
            {task.title}
          </h3>
          <Badge
            variant={getPriorityVariant(task.priority)}
            className="text-xs ml-2 flex-shrink-0"
          >
            {getPriorityLabel(task.priority)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>

          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="truncate max-w-20">{task.assignee}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {task.project}
          </Badge>

          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs">
              {getInitials(task.assignee)}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}

function getPriorityVariant(priority: KanbanTask['priority']) {
  switch (priority) {
    case 'urgent':
      return 'destructive';
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
}

function getPriorityLabel(priority: KanbanTask['priority']): string {
  switch (priority) {
    case 'urgent':
      return 'Urgente';
    case 'high':
      return 'Alta';
    case 'medium':
      return 'Média';
    case 'low':
      return 'Baixa';
    default:
      return 'Baixa';
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}