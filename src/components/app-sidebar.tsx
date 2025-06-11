import ROUTERS from "@/constants/router";
import * as React from "react";
import {
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconUsers,
} from "@tabler/icons-react";
import { useAppSelector } from "@/hooks";

import { NavMain } from "@/components/nav-main";
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

const data = {
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isInitialized } = useAppSelector(state => state.auth);
  const userData = user
    ? {
        name: user.name || user.email.split("@")[0],
        email: user.email,
        avatar: "/avatars/default.jpg",
      }
    : {
        name: "Guest",
        email: "",
        avatar: "/avatars/default.jpg",
      };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang tải thông tin...
      </div>
    );
  }

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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}