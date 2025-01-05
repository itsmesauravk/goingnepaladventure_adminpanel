"use client"
import {
  Home,
  MountainSnow,
  TicketsPlane,
  Settings,
  Bus,
  User2,
  ChevronUp,
  BookOpen,
  Binoculars,
  Sailboat,
  Users2Icon,
  Mails,
} from "lucide-react"

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
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import {
  AdminDetailsContext,
  PlanTripContext,
  RequestsMailsContext,
} from "./ContextProvider"
import axios from "axios"
import { toast } from "sonner"
import Cookies from "js-cookie"
import LogoutModal from "../home/LogoutAlert"

export function AppSidebar() {
  const pathname = usePathname()
  const planTripContext = useContext(PlanTripContext)
  const requestsMailsContext = useContext(RequestsMailsContext)
  const { adminInfo } = useContext(AdminDetailsContext)!
  const router = useRouter()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  if (!planTripContext) {
    throw new Error("PlanTripContext must be used within a PlanTripProvider")
  }
  if (!requestsMailsContext) {
    throw new Error(
      "RequestsMailsContext must be used within a RequestsMailsProvider"
    )
  }

  const { pendingData } = planTripContext
  const { pendingQuoteData, pendingCustomizeData } = requestsMailsContext
  const pendingPlanTripData = pendingData
  const pendingDataCount = pendingQuoteData + pendingCustomizeData

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/")
  }

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
      icon: Binoculars,
    },
    {
      title: "Wellness",
      url: "/wellness",
      icon: TicketsPlane,
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: BookOpen,
    },
    {
      title: "Activities",
      url: "/activities",
      icon: Sailboat,
    },
    {
      title: "Plan Trip",
      url: "/plan-trip",
      icon: Bus,
      notificationCount: pendingData,
    },
    {
      title: "Requests & Mails",
      url: "/requests-mails",
      icon: Mails,
      pendingData: pendingDataCount,
    },
    {
      title: "Clients Info",
      url: "/users-info",
      icon: Users2Icon,
    },
  ]

  //auth check
  const validateLogin = async () => {
    const token = Cookies.get("token")
    if (!token) {
      router.push("/login")
      return
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/validate`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.data.success) {
        return true
      } else {
        router.push("/login")
        return
      }
    } catch (error) {
      router.push("/login")
      return
    }
  }

  const logoutHandler = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/logout`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        Cookies.remove("token")
        Cookies.remove("refreshToken")
        router.push("/login")
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.log(error)
    }
  }

  useEffect(() => {
    validateLogin()
  }, [])

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Image src="/going.png" alt="Logo" width={140} height={140} />
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
                        className={`mt-2 hover:text-primary ${
                          isActive(item.url) ? "bg-primary text-white" : ""
                        }`}
                        href={item.url}
                      >
                        <item.icon />
                        <span className="text-xl">{item.title}</span>
                        {item.notificationCount && pendingPlanTripData > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {pendingPlanTripData}
                          </span>
                        )}
                        {item.pendingData && pendingDataCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {pendingDataCount}
                          </span>
                        )}
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
                  <SidebarMenuButton className="text-lg font-semibold h-16 mb-6">
                    <User2 /> {adminInfo?.fullName}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <Link href={"/my-account"}>
                    <DropdownMenuItem className="text-lg">
                      My Account
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => setIsLogoutModalOpen(true)}>
                    <span className="text-lg text-red-800">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logoutHandler}
      />
    </>
  )
}
