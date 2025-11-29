"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationList } from "./notification-list";

export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const { unreadCount, isConnected } = useNotifications();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                    {isConnected && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border-2 border-background" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <NotificationList onClose={() => setOpen(false)} />
            </PopoverContent>
        </Popover>
    );
}
