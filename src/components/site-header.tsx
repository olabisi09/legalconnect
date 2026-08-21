"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { RiInformationLine, RiNotification2Line } from "@remixicon/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "./ui/popover";
import {
  useNotifications,
  useNotificationUnreadCount,
} from "@/hooks/features/use-notifications";
import { AppEmpty } from "./app-empty";

export function SiteHeader() {
  const pathname = usePathname();
  const { data, isLoading } = useNotifications();
  const { data: unreadCountData } = useNotificationUnreadCount();

  const notifications = data?.data ?? [];
  const unreadCount = unreadCountData ?? 0;

  const routeMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/matters": "Matters",
    "/profile": "Profile",
  };
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">
            {routeMap[pathname] || "Dashboard"}
          </h1>
        </div>
        <Popover>
          <PopoverTrigger
            className="relative"
            render={<Button variant="outline" size="icon" />}
          >
            <RiNotification2Line />
            {unreadCount > 0 && (
              <span className="bg-red-500 grid place-items-center text-[10px] text-white rounded-full w-4 h-4 absolute -top-1 -right-2">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent align="start" className="py-2 px-0">
            <PopoverHeader className="px-4 pb-2 border-b">
              <PopoverTitle className="flex items-center justify-between">
                <p>Notifications</p>
                {unreadCount > 0 && (
                  <Button variant="ghost">Mark all as read</Button>
                )}
              </PopoverTitle>
            </PopoverHeader>
            <div className="px-4 flex flex-col gap-2">
              {isLoading ? (
                <>
                  <NotificationSkeleton />
                  <NotificationSkeleton />
                  <NotificationSkeleton />
                </>
              ) : notifications?.length ? (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    title={notification.title}
                    description={notification.body}
                  />
                ))
              ) : (
                <AppEmpty
                  title="No notifications available"
                  icon={<RiNotification2Line />}
                />
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

function NotificationItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <RiInformationLine className="size-4" />
      <div className="flex flex-col">
        <p className="font-medium">{title || "Title"}</p>
        <p className="text-muted-foreground">{description || "Description"}</p>
      </div>
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <div className="size-4 rounded-full bg-muted" />
      <div className="flex flex-col gap-1">
        <div className="h-3 w-32 rounded bg-muted" />
        <div className="h-2 w-48 rounded bg-muted" />
      </div>
    </div>
  );
}
