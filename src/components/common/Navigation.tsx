'use client';

import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Calendar, BarChart3 } from 'lucide-react';

interface NavigationProps {
  currentPath: string;
}

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/split-builder', icon: Dumbbell, label: 'Splits' },
  { path: '/workout/log', icon: Calendar, label: 'Log' },
  { path: '/workout/history', icon: BarChart3, label: 'History' }
];

export default function Navigation({ currentPath }: NavigationProps) {
  const location = useLocation();
  const currentPagePath = location.pathname;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-t border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = currentPagePath === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-colors relative
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Icon className="h-5 w-5" />
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </motion.div>
                
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}