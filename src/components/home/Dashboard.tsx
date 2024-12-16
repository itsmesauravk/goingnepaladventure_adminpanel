"use client"
import React, { useContext, useEffect, useState } from "react"
import {
  Users,
  BookOpen,
  Calendar,
  AlertTriangle,
  MountainSnow,
  TicketsPlane,
  TrendingUp,
  TrendingDown,
  Globe,
  Star,
  CloudLightning,
  MailIcon,
} from "lucide-react"
import { PlanTripContext, RequestsMailsContext } from "../utils/ContextProvider"
import axios from "axios"
import Link from "next/link"
import HomeLoading from "./HomeLoading"
import Cookies from "js-cookie"

interface DashboardStats {
  trekkingCount: number
  tourCount: number
  wellnessCount: number
  blogCount: number
  planTripCount: {
    total: number
    pending: number
    viewed: number
    mailed: number
  }
  activityCount: {
    total: number
    popular: number
    active: number
  }
  quoteAndCustomizeCount: {
    quote: {
      total: number
      pending: number
      viewed: number
      mailed: number
    }
    customize: {
      total: number
      pending: number
      viewed: number
      mailed: number
    }
  }
  usersCount: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    trekkingCount: 0,
    tourCount: 0,
    wellnessCount: 0,
    blogCount: 0,
    planTripCount: {
      total: 0,
      pending: 0,
      viewed: 0,
      mailed: 0,
    },
    activityCount: {
      total: 0,
      popular: 0,
      active: 0,
    },
    quoteAndCustomizeCount: {
      quote: {
        total: 0,
        pending: 0,
        viewed: 0,
        mailed: 0,
      },
      customize: {
        total: 0,
        pending: 0,
        viewed: 0,
        mailed: 0,
      },
    },
    usersCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [adminProfile, setAdminProfile] = useState<any>(null)

  const planTripContext = useContext(PlanTripContext)!
  const { setPendingData } = planTripContext

  const requestsMailsContext = useContext(RequestsMailsContext)!
  const { setPendingQuoteData, setPendingCustomizeData } = requestsMailsContext

  const token = Cookies.get("token")

  const fetchAdminProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setAdminProfile(response.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/home/get-count-details`,
        {
          // headers:{
          //   Authorization: `Bearer ${token}`
          // }
          withCredentials: true,
        }
      )

      if (response.data.success) {
        const dashboardStats = response.data.data

        setStats(dashboardStats)
        setPendingData(dashboardStats.planTripCount.pending)
        setPendingQuoteData(dashboardStats.quoteAndCustomizeCount.quote.pending)
        setPendingCustomizeData(
          dashboardStats.quoteAndCustomizeCount.customize.pending
        )
      } else {
        setError("Failed to fetch dashboard data")
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error)
      setError("An error occurred while fetching dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Use an immediately invoked async function to handle the async calls
    const initializeDashboard = async () => {
      await fetchDashboardData()
      await fetchAdminProfile()
    }

    initializeDashboard()
  }, [])

  // Rest of the component remains the same...
  const packageCategories = [
    {
      name: "Treks",
      count: stats.trekkingCount,
      icon: MountainSnow,
      color: "bg-blue-100/50",
      trend: TrendingUp,
      link: "/trekkings",
    },
    {
      name: "Tours",
      count: stats.tourCount,
      icon: Calendar,
      color: "bg-green-100/50",
      trend: TrendingUp,
      link: "/tours",
    },
    {
      name: "Wellness",
      count: stats.wellnessCount,
      icon: TicketsPlane,
      color: "bg-purple-100/50",
      trend: null,
      link: "/wellness",
    },
    {
      name: "Blogs",
      count: stats.blogCount,
      icon: BookOpen,
      color: "bg-orange-100/50",
      trend: TrendingDown,
      link: "/blogs",
    },
  ]

  // Rest of the render logic remains the same...
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-xl text-red-700">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {loading ? (
        <HomeLoading />
      ) : (
        <div className="bg-gray-50 min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800">
                Good Morning,{" "}
                <span className="text-primary">{adminProfile?.fullName}</span>
              </h1>
              <div className="flex space-x-4">
                <div className="flex items-center bg-white shadow-sm rounded-lg px-4 py-2">
                  <Users className="mr-2 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    Users:{" "}
                    <span className="font-semibold text-primary">
                      {stats?.usersCount ? stats.usersCount : "--"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Package Overview Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              {packageCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.link}
                  className={`${category.color} rounded-xl shadow-md hover:shadow-lg transition-all p-6 group`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        {category.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-gray-800">
                          {loading ? "--" : category.count}
                        </p>
                      </div>
                    </div>
                    <category.icon className="text-gray-500 opacity-70 group-hover:scale-110 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Dashboard Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Plan Trip Section */}
              <Link
                href={"/plan-trip"}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <Calendar className="mr-2 text-blue-500" />
                  Plan Trip Overview
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <h3 className="text-gray-600 mb-2 font-semibold">
                      Total Requests
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {loading ? "--" : stats.planTripCount.total}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <h3 className="text-gray-600 mb-2">Viewed</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {loading ? "--" : stats.planTripCount.viewed}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <h3 className="text-gray-600 mb-2">Mailed</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {loading ? "--" : stats.planTripCount.mailed}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <h3 className="text-gray-600 mb-2">Pending</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {loading ? "--" : stats.planTripCount.pending}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Activities Section */}
              <Link
                href={"/acitivities"}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <Globe className="mr-2 text-green-500" />
                  Activities Overview
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <h3 className="text-gray-600 mb-2 font-semibold">
                      Total Activities
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {loading ? "--" : stats.activityCount.total}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <h3 className="text-gray-600 mb-2 flex justify-center items-center">
                      <Star className="mr-1 text-yellow-500" size={16} />
                      Popular
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {loading ? "--" : stats.activityCount.popular}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <h3 className="text-gray-600 mb-2 flex justify-center items-center">
                      <CloudLightning
                        className="mr-1 text-purple-500"
                        size={16}
                      />
                      Active
                    </h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {loading ? "--" : stats.activityCount.active}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Quotes & Customization Section */}
              <Link
                href={"/requests-mails"}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <MailIcon className="mr-2 text-orange-500" />
                  Requests And Mailing
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Quotes */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-center text-gray-600 mb-3 font-semibold">
                      Quote Requests
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-green-600">
                          {loading
                            ? "--"
                            : stats.quoteAndCustomizeCount.quote.total}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Mailed</p>
                        <p className="text-xl font-bold text-blue-600">
                          {loading
                            ? "--"
                            : stats.quoteAndCustomizeCount.quote.mailed}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-xl font-bold text-red-600">
                          {loading
                            ? "--"
                            : stats.quoteAndCustomizeCount.quote.pending}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customize */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-center text-gray-600 mb-3 font-semibold">
                      Customize Requests
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-green-600">
                          {loading
                            ? "--"
                            : stats.quoteAndCustomizeCount.customize.total}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Mailed</p>
                        <p className="text-xl font-bold text-blue-600">
                          {loading
                            ? "--"
                            : stats.quoteAndCustomizeCount.customize.mailed}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-xl font-bold text-red-600">
                          {loading
                            ? "--"
                            : stats.quoteAndCustomizeCount.customize.pending}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard
