'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, FileText, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  currentPath: string;
}

export default function Navigation({ currentPath }: NavigationProps) {
  const currentPagePath = usePathname();
  const { user } = useAuth();

  // Dynamic navigation based on user role
  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: Home, label: 'Dashboard' }
    ];

    if (user?.role === 'teacher') {
      return [
        { path: '/dashboard/teacher', icon: Home, label: 'Dashboard' },
        { path: '/assignments/create', icon: Plus, label: 'Create' }
      ];
    } else if (user?.role === 'student') {
      return [
        { path: '/dashboard/student', icon: Home, label: 'Dashboard' },
        { path: '/assignments', icon: FileText, label: 'Assignments' }
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-t border-border"
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center h-16 ${navItems.length === 1 ? 'justify-center' : 'justify-around'}`}>
          {navItems.map((item) => {
            const isActive = currentPagePath === item.path || 
              (item.path === '/dashboard' && currentPagePath.startsWith('/dashboard'));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex flex-col items-center justify-center space-y-2 p-4 rounded-xl transition-all duration-200 relative
                  ${isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Icon className="h-6 w-6" />
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </motion.div>
                
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}