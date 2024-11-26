"use client"
import React, { useState } from "react"
import {
  Package,
  Mountain,
  Flame,
  Users,
  Tent,
  Footprints,
  Globe,
  BookOpen,
  Activity,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react"

const Dashboard: React.FC = () => {
  // Comprehensive dashboard state
  const [stats, setStats] = useState({
    totalPackages: 157,
    trekPackages: 45,
    tourPackages: 62,
    wellnessPackages: 25,
    activitiesPackages: 25,
    totalBookings: 1245,
    totalRevenue: 245600,
    activeUsers: 3420,
    newPackagesThisMonth: 12,
    averageBookingValue: 197,
  })

  const packageCategories = [
    {
      name: "Treks",
      count: stats.trekPackages,
      icon: <Mountain className="text-blue-600" />,
      color: "bg-blue-100",
      trend: "up",
    },
    {
      name: "Tours",
      count: stats.tourPackages,
      icon: <Footprints className="text-green-600" />,
      color: "bg-green-100",
      trend: "up",
    },
    {
      name: "Wellness",
      count: stats.wellnessPackages,
      icon: <Activity className="text-purple-600" />,
      color: "bg-purple-100",
      trend: "stable",
    },
    {
      name: "Activities",
      count: stats.activitiesPackages,
      icon: <Flame className="text-orange-600" />,
      color: "bg-orange-100",
      trend: "up",
    },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="text-gray-600" />
            <span className="text-lg font-medium">
              Active Users: {stats.activeUsers.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-600" />
            <span className="text-lg font-medium">
              New Packages: {stats.newPackagesThisMonth}
            </span>
          </div>
        </div>
      </div>

      {/* Package Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {packageCategories.map((category) => (
          <div
            key={category.name}
            className={`${category.color} p-6 rounded-lg shadow-md flex items-center justify-between hover:scale-105 transition-transform`}
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                {category.name}
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {category.count}
              </p>
            </div>
            <div>
              {category.trend === "up" ? (
                <TrendingUp className="text-green-600" />
              ) : (
                <div className="w-6 h-6"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Financial Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Packages */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Packages
            </h3>
            <Package className="text-gray-500" />
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">
              {stats.totalPackages.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Bookings & Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Bookings</h3>
            <DollarSign className="text-gray-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.totalBookings.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg. Booking Value</p>
              <p className="text-2xl font-bold text-blue-600">
                ${stats.averageBookingValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Revenue
            </h3>
            <TrendingUp className="text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
