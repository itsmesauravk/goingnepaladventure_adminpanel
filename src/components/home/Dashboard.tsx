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
} from "lucide-react"
import { PlanTripContext } from "../utils/ContextProvider"
import axios from "axios"
import Link from "next/link"

interface DashboardStats {
  trekkingCount: number
  tourCount: number
  wellnessCount: number
  blogCount: number
  planTripCount: number
  pendingPlanTripCount: number
  viewedPlanTripCount: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    trekkingCount: 0,
    tourCount: 0,
    wellnessCount: 0,
    blogCount: 0,
    planTripCount: 0,
    pendingPlanTripCount: 0,
    viewedPlanTripCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const planTripContext = useContext(PlanTripContext)!
  const { setPendingData } = planTripContext

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/home/get-count-details`
      )

      if (response.data.success) {
        const dashboardStats = response.data.data
        setStats(dashboardStats)
        setPendingData(dashboardStats.pendingPlanTripCount)
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
    fetchDashboardData()
  }, [])

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
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <div className="flex items-center bg-white shadow-sm rounded-lg px-4 py-2">
              <Users className="mr-2 text-gray-600" />
              <span className="font-medium text-gray-700">Active Users</span>
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

        {/* Plan Trip Section */}
        <Link href={"/plan-trip"} className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Plan Trip Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <h3 className="text-gray-600 mb-2 font-semibold ">
                  Total Requests
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {loading ? "--" : stats.planTripCount}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <h3 className="text-gray-600 mb-2">Viewed Requests</h3>
                <p className="text-3xl font-bold text-green-600">
                  {loading ? "--" : stats.viewedPlanTripCount}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Pending Requests */}
            <div className="bg-red-50 rounded-xl shadow-md p-6 text-center">
              <div className="flex justify-center items-center mb-4">
                <AlertTriangle className="mr-2 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-700">
                  Pending Requests
                </h3>
              </div>
              <p className="text-4xl font-bold text-red-600">
                {loading ? "--" : stats.pendingPlanTripCount}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
