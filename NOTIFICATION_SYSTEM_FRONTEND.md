# Notification System Frontend Implementation

This document outlines the implementation of the real-time notification system in the Next.js frontend.

## Features

1.  **Real-time Updates**: Uses WebSockets to receive notifications instantly without page refresh.
2.  **Notification Management**:
    *   View list of notifications.
    *   Mark individual or all notifications as read.
    *   Delete individual or all notifications.
    *   Filter by type (info, success, warning, error) and priority (low, normal, high, urgent).
3.  **UI Components**:
    *   `NotificationBell`: A bell icon with unread count badge, placed in the dashboard header. Opens a popover with recent notifications.
    *   `NotificationList`: A scrollable list of notifications with "Load More" functionality.
    *   `NotificationItem`: Displays individual notification details with actions.
    *   `NotificationsPage`: A dedicated full-page view for managing all notifications (`/dashboard/notifications`).
4.  **Toast Notifications**: Uses `sonner` to display toast popups when new notifications arrive.

## Architecture

### Directory Structure

```
src/features/notifications/
├── components/
│   ├── notification-bell.tsx
│   ├── notification-item.tsx
│   └── notification-list.tsx
├── hooks/
│   ├── useNotifications.ts
│   └── useWebSocket.ts
├── notification.service.ts
└── types.ts
```

### Key Components

*   **`useWebSocket` Hook**: Manages the WebSocket connection, including auto-reconnection and heartbeat (ping/pong).
*   **`useNotifications` Hook**: Manages notification state (list, unread count, stats) and exposes methods for CRUD operations. It integrates with `useWebSocket` to listen for incoming messages.
*   **`NotificationService`**: Handles REST API calls to the backend for fetching and updating notifications.

## Integration

1.  **Layout**: The `DashboardHeader` component includes the `NotificationBell`.
2.  **Context**: The `AuthProvider` wraps the application, but the notification system manages its own state via hooks.
3.  **Toaster**: The `Toaster` component from `sonner` is added to `RootLayout` to enable toast notifications.

## Usage

To use the notification system in other parts of the app:

```typescript
import { useNotifications } from "@/features/notifications/hooks/useNotifications";

export function MyComponent() {
  const { createNotification } = useNotifications(); // If you implement create in frontend (usually backend triggers it)
  // ...
}
```

## Backend Requirements

The frontend expects the backend to be running and accessible at the URL configured in `NEXT_PUBLIC_API_URL`. The WebSocket endpoint is derived from this URL (replacing `http` with `ws`).
