import ROUTERS from "@/constants/router"
import * as React from "react"
import {
  IconDashboard,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: ROUTERS.ADMIN.dashboard,
      icon: IconDashboard,
    },
    {
      title: "Quản lý cơ sở",
      url: ROUTERS.ADMIN.facility.root,
      icon: IconListDetails,
    },
    {
      title: "Quản lý danh mục",
      url: ROUTERS.ADMIN.category.root,
      icon: IconListDetails,
    },

    {
      title: "Quản lý người dùng",
      url: ROUTERS.ADMIN.user.root,
      icon: IconUsers,
    },
    {
      title: "Quản lý vai trò",
      url: ROUTERS.ADMIN.role.root,
      icon: IconUsers,
    },
    {
      title: "Quản lý Ranks",
      url: ROUTERS.ADMIN.rank.root,
      icon: IconUsers,
    },
    {
      title: "Quản lý dịch vụ",
      url: ROUTERS.ADMIN.service.root,
      icon: IconFolder,
    },
    {
      title: "Quản lý khuyến mãi",
      url: ROUTERS.ADMIN.promotion.root,
      icon: IconFolder,
    },
    {
      title: "Quản lý thanh toán",
      url: ROUTERS.ADMIN.payment.root,
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">Zenora Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
