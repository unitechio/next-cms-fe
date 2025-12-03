"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { User } from "@/features/auth/types";
import { dashboard } from "@/config/nav";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function SidebarContent({
  pathname,
  user,
  logout,
  setOpen,
  isCollapsed = false,
  toggleCollapse,
  isMobile = false,
}: {
  pathname: string;
  user: User | null;
  logout: () => void;
  setOpen: (open: boolean) => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
  isMobile?: boolean;
}) {
  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className={cn("px-6 py-4 flex items-center gap-3", isCollapsed && "px-4 justify-center")}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="font-bold text-primary-foreground">G</span>
        </div>
        {!isCollapsed && (
          <span className="font-bold text-xl tracking-tight whitespace-nowrap overflow-hidden">
            GoCMS
          </span>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <TooltipProvider delayDuration={0}>
          {dashboard.map((item) => {
            const isActive = pathname === item.path;
            const LinkContent = (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return LinkContent;
          })}
        </TooltipProvider>
      </nav>

      <Separator />

      {/* User Profile & Logout */}
      <div className="p-4 space-y-2">
        <Link href="/dashboard/profile">
          <div className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors cursor-pointer",
            isCollapsed && "justify-center px-2"
          )}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
              <AvatarFallback>
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </Link>

        {isCollapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={logout}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        )}
      </div>

      {/* Collapse Toggle Button (Desktop only) */}
      {!isMobile && (
        <div className="absolute -right-3 top-20 z-50">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full border shadow-md bg-background cursor-pointer"
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  isCollapsed,
  toggleCollapse
}: {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
        >
          <SidebarContent
            pathname={pathname}
            user={user}
            logout={logout}
            setOpen={setOpen}
            isMobile={true}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed top-0 left-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent
          pathname={pathname}
          user={user}
          logout={logout}
          setOpen={setOpen}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
      </aside>
    </>
  );
}
