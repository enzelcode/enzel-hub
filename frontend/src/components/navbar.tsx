'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface NavbarProps {
  title: string;
  user: User | null;
}

export function Navbar({ title, user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <header className="h-16 border-b bg-card border-[#131e1f] sticky top-0 z-30">
      <div className="h-full px-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Olá, {user?.name}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-[#131e1f]"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}