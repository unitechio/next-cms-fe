'use client';

import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import { NotificationIndicator } from '@/features/notifications/components/notification-indicator';

export function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-background border-b">
      <div className="flex items-center">
        <MobileSidebar />
      </div>
      <div className="flex items-center gap-4">
        <NotificationIndicator />
        <UserNav />
      </div>
    </header>
  );
}
