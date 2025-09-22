'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { KanbanColumn } from '@/components/kanban-column';
import { TaskCard } from '@/components/task-card';
import { CreateTaskModal } from '@/components/create-task-modal';
import { TaskService, Task } from '@/services/taskService';
import { ProjectService, Project } from '@/services/projectService';
import { TeamMemberService, TeamMember } from '@/services/teamMemberService';

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  dueDate: string;
  project: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

export interface Column {
  id: string;
  title: string;
  status: KanbanTask['status'];
  color: string;
}

const columns: Column[] = [
  { id: 'todo', title: 'A Fazer', status: 'todo', color: 'bg-slate-100' },
  { id: 'in-progress', title: 'Em Progresso', status: 'in-progress', color: 'bg-blue-100' },
  { id: 'review', title: 'Revisão', status: 'review', color: 'bg-yellow-100' },
  { id: 'done', title: 'Concluído', status: 'done', color: 'bg-green-100' }
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const [tasksData, projectsData, teamMembersData] = await Promise.all([
        TaskService.getAllTasks(),
        ProjectService.getAllProjects(),
        TeamMemberService.getAllTeamMembers()
      ]);

      // Convert API tasks to Kanban tasks
      const kanbanTasks: KanbanTask[] = tasksData.map(task => {
        const project = projectsData.find(p => p.id === task.projectId);
        const assignee = teamMembersData.find(m => m.id === task.assigneeId);

        return {
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          assignee: assignee?.name || 'Desconhecido',
          dueDate: task.dueDate,
          project: project?.name || 'Projeto Desconhecido',
          status: task.status
        };
      });

      setTasks(kanbanTasks);
      setProjects(projectsData);
      setTeamMembers(teamMembersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id as string;
    const overColumnId = over.id as string;

    const task = tasks.find(t => t.id === activeTaskId);
    if (!task) return;

    const column = columns.find(c => c.id === overColumnId);
    if (!column) return;

    if (task.status !== column.status) {
      try {
        // Update in backend
        await TaskService.updateTaskStatus(activeTaskId, column.status);

        // Update local state
        setTasks(tasks =>
          tasks.map(t =>
            t.id === activeTaskId
              ? { ...t, status: column.status }
              : t
          )
        );
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }

    setActiveTask(null);
  }

  async function handleCreateTask(newTaskData: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigneeId: string;
    dueDate: string;
    projectId: string;
    status: 'todo' | 'in-progress' | 'review' | 'done';
  }) {
    try {
      const createdTask = await TaskService.createTask(newTaskData);

      // Convert to Kanban task
      const project = projects.find(p => p.id === createdTask.projectId);
      const assignee = teamMembers.find(m => m.id === createdTask.assigneeId);

      const kanbanTask: KanbanTask = {
        id: createdTask.id,
        title: createdTask.title,
        description: createdTask.description,
        priority: createdTask.priority,
        assignee: assignee?.name || 'Desconhecido',
        dueDate: createdTask.dueDate,
        project: project?.name || 'Projeto Desconhecido',
        status: createdTask.status
      };

      setTasks(tasks => [...tasks, kanbanTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  const getTasksByStatus = (status: KanbanTask['status']) => {
    return tasks.filter(task => task.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando tarefas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.status)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateTask={handleCreateTask}
        projects={projects}
        teamMembers={teamMembers}
      />
    </div>
  );
}