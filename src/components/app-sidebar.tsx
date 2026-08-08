"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  RiCameraLine,
  RiFileHistoryLine,
  RiHomeGearLine,
  RiHomeLine,
  RiUserLine,
} from "@remixicon/react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: RiHomeLine,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: RiUserLine,
    },
    {
      title: "Audit Logs",
      url: "/audit-logs",
      icon: RiFileHistoryLine,
    },
    // {
    //   title: "Users",
    //   url: "/dashboard/users",
    //   icon: RiFileHistoryLine,
    // },
    // {
    //   title: "Settings",
    //   url: "/dashboard/settings",
    //   icon: RiHomeGearLine,
    // },
    // {
    //   title: "Login",
    //   url: "/login",
    //   icon: RiFileHistoryLine,
    // },
    // {
    //   title: "Register",
    //   url: "/register",
    //   icon: RiHomeGearLine,
    // },
    // {
    //   title: "404 Page",
    //   url: "/404-page",
    //   icon: RiFileHistoryLine,
    // },
    // {
    //   title: "500 Page",
    //   url: "/500-page",
    //   icon: RiHomeGearLine,
    // },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: RiCameraLine,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: RiFileHistoryLine,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: RiFileHistoryLine,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Get Pro",
  //     url: "https://shadcnuikit.com/pricing",
  //     icon: RiFileHistoryLine,
  //   },
  //   {
  //     title: "Shadcn UI Kit",
  //     url: "https://shadcnuikit.com/",
  //     icon: RiFileHistoryLine,
  //   },
  //   {
  //     title: "Bundui Component",
  //     url: "https://bundui.io",
  //     icon: RiFileHistoryLine,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <Image
                  src="https://shadcnuikit.com/logo.png"
                  className="size-6 rounded-sm group-data-[collapsible=icon]:size-5"
                  alt="shadcn ui kit svg logo"
                  width={24}
                  height={24}
                />
                <span className="text-base font-medium">Shadcn UI Kit</span>
              </a>
            </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
