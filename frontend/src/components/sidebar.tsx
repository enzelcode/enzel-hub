'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderOpen,
  Kanban,
  Users,
  Settings,
  ChevronRight,
  User
} from 'lucide-react';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: '/dashboard',
  },
  {
    id: 'projetos',
    name: 'Projetos',
    icon: <FolderOpen className="w-5 h-5" />,
    href: '/projetos',
  },
  {
    id: 'kanban',
    name: 'Kanban',
    icon: <Kanban className="w-5 h-5" />,
    href: '/kanban',
  },
  {
    id: 'clientes',
    name: 'Clientes',
    icon: <Users className="w-5 h-5" />,
    href: '/clientes',
  },
  {
    id: 'configuracoes',
    name: 'Configurações',
    icon: <Settings className="w-5 h-5" />,
    href: '/configuracoes',
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className, onExpandChange }: SidebarProps & { onExpandChange?: (expanded: boolean) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandChange?.(newExpanded);
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-[#131e1f] transition-all duration-300 flex flex-col",
          isExpanded ? "w-64" : "w-16",
          className
        )}
      >
      {/* Expand/Collapse Button */}
      <div className="h-16 flex items-center justify-center border-b border-[#131e1f]">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="w-8 h-8 hover:bg-muted"
        >
          <ChevronRight
            className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")}
          />
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.id}>
                {!isExpanded ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-center h-10 transition-all duration-200",
                          isActive && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => router.push(item.href)}
                      >
                        <span className="flex-shrink-0">
                          {item.icon}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10 transition-all duration-200 px-3",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    <span className="flex-shrink-0">
                      {item.icon}
                    </span>
                    <span className="ml-3 text-sm font-medium">
                      {item.name}
                    </span>
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-2 border-t border-[#131e1f]">
        {!isExpanded ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center h-10"
              >
                <span className="flex-shrink-0">
                  <User className="w-5 h-5" />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Perfil</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-3"
          >
            <span className="flex-shrink-0">
              <User className="w-5 h-5" />
            </span>
            <span className="ml-3 text-sm font-medium">
              Perfil
            </span>
          </Button>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}