"use client"

import * as React from "react"
import Link from "next/link"
import {
  Package,
  LayoutDashboard,
  Settings,
  Warehouse,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  ClipboardList,
  History,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({
  ...props
}) {
  const [userData, setUserData] = React.useState({
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  });

  React.useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserData({
          name: user.name || "User",
          email: user.email || "user@example.com",
          avatar: "/avatars/user.jpg",
        });
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
    },
    {
      title: "Operations",
      url: "/operations",
      icon: RefreshCw,
      items: [
        {
          title: "Receipts",
          url: "/operations/receipts",
          icon: ArrowDownLeft,
        },
        {
          title: "Delivery Orders",
          url: "/operations/deliveries",
          icon: ArrowUpRight,
        },
        {
          title: "Inventory Adjustment",
          url: "/operations/adjustments",
          icon: ClipboardList,
        },
        {
          title: "Move History",
          url: "/operations/move-history",
          icon: History,
        },
      ],
    },
  ];

  const navSecondary = [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Warehouse",
          url: "/settings/warehouse",
          icon: Warehouse,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Warehouse className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Odoo IMS</span>
                  <span className="truncate text-xs">Inventory Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
