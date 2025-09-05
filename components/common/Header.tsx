'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button as UIButton } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
}

export default function Header({ title, showBack, actions, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { signOut, user } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {onMenuClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {title && (
            <h1 className="text-xl font-semibold text-foreground truncate">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {actions}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/settings')}
            className="p-2"
          >
            <Settings className="h-5 w-5" />
          </Button>
          {user && (
            <UIButton variant="outline" size="sm" onClick={() => signOut()} className="ml-2">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </UIButton>
          )}
        </div>
      </div>
    </motion.header>
  );
}