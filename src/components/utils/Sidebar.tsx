"use client"
import {
  Calendar,
  Home,
  MountainSnow,
  TicketsPlane,
  Settings,
  User2,
  ChevronUp,
} from "lucide-react"
import { TbTrekking } from "react-icons/tb"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Trekkings",
    url: "/trekkings",
    icon: MountainSnow,
  },
  {
    title: "Tours",
    url: "/tours",
    icon: Calendar,
  },
  {
    title: "Wellness",
    url: "/wellness",
    icon: TicketsPlane,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  const resource = pathname.split("/")[1]

  return (
    <Sidebar>
      <SidebarHeader>
        {/* <SidebarMenu> */}
        {/* <SidebarMenuItem> */}
        <Image src="/going.png" alt="Logo" width={140} height={140} />
        {/* </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl mt-4 text-primary font-semibold">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      className={`mt-2  hover:text-primary ${
                        resource && resource === item.title.toLocaleLowerCase()
                          ? "bg-secondary text-white"
                          : ""
                      } `}
                      href={item.url}
                    >
                      <item.icon />
                      <span className="text-xl">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-xl font-semibold h-16 mb-6">
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span className="text-lg">Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-lg">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
