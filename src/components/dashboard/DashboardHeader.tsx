import { Moon, Sun, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  lastUpdated: Date;
  newBillsCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onMarkAllRead: () => void;
}

export function DashboardHeader({
  lastUpdated,
  newBillsCount,
  isDarkMode,
  onToggleDarkMode,
  onMarkAllRead,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Virginia Legislative Bills Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live bill status and updates
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Last Updated */}
          <span className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleString()}
          </span>

          {/* New Bills Notification */}
          {newBillsCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {newBillsCount}
              </Badge>
            </Button>
          )}

          {/* Dark Mode Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleDarkMode}
            className="h-9 w-9"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle dark mode</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
