'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from '@/components/task-card';
import { KanbanTask, Column } from '@/components/kanban-board';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: Column;
  tasks: KanbanTask[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "h-fit transition-colors",
        isOver && "ring-2 ring-primary ring-opacity-50"
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", getStatusColor(column.status))} />
            {column.title}
          </span>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Nenhuma tarefa
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getStatusColor(status: KanbanTask['status']): string {
  switch (status) {
    case 'todo':
      return 'bg-slate-400';
    case 'in-progress':
      return 'bg-blue-400';
    case 'review':
      return 'bg-yellow-400';
    case 'done':
      return 'bg-green-400';
    default:
      return 'bg-gray-400';
  }
}