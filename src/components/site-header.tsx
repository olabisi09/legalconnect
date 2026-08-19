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
import { Skeletonize } from "./skeletonize";

export function SiteHeader() {
  const pathname = usePathname();
  const { data, isLoading } = useNotifications();
  const { data: unreadCount } = useNotificationUnreadCount();

  const notifications = data?.data ?? [];

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
          <PopoverTrigger render={<Button variant="outline" size="icon" />}>
            <RiNotification2Line />
          </PopoverTrigger>
          <PopoverContent align="start" className="py-2 px-0">
            <PopoverHeader className="px-4 pb-2 border-b">
              <PopoverTitle className="flex items-center justify-between">
                <p>Notifications</p>
                <Button variant="ghost">Mark all as read</Button>
              </PopoverTitle>
            </PopoverHeader>
            <div className="px-4 flex flex-col gap-2">
              <Skeletonize loading={true}>
                {/* {notifications.map((notification, index) => (
                  <NotificationItem
                    key={notification.id ?? `notification-${index}`}
                    title={notification.title}
                    description={notification.body}
                  />
                ))} */}
                <div className="flex items-center gap-4">
                  <RiInformationLine className="size-4" />
                  <div className="flex flex-col">
                    <p className="font-medium">title</p>
                    <p className="text-muted-foreground">description</p>
                  </div>
                </div>
              </Skeletonize>
              {/* {isLoading ? (
                <div>Loading...</div>
              ) : notifications?.length ? (
                <Skeletonize loading={true}>
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      title={notification.title}
                      description={notification.body}
                    />
                  ))}
                </Skeletonize>
              ) : (
                <div>No notifications</div>
              )} */}
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
