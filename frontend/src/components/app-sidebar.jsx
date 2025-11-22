"use client"

import * as React from "react"
import {
  Package,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Warehouse,
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
          url: "/operations?filter=IN",
        },
        {
          title: "Deliveries",
          url: "/operations?filter=OUT",
        },
        {
          title: "Transfers",
          url: "/operations?filter=INT",
        },
        {
          title: "Adjustments",
          url: "/operations?filter=ADJ",
        },
      ],
    },
  ];

  const navSecondary = [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/dashboard">
                <Warehouse className="!size-5" />
                <span className="text-base font-semibold">Odoo IMS</span>
              </a>
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
