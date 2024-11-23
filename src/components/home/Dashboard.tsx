"use client"
import React, { useState, useEffect } from "react"

const Dashboard: React.FC = () => {
  // Dummy data for the dashboard
  const [stats, setStats] = useState({
    totalTours: 100,
    activeTours: 80,
    featuredTours: 20,
    totalVisitors: 1500,
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      action: "Added a new tour",
      tourName: "Mountain Adventure",
      date: "2024-11-20",
    },
    {
      id: 2,
      action: "Updated tour details",
      tourName: "Beach Paradise",
      date: "2024-11-19",
    },
    {
      id: 3,
      action: "Deleted a tour",
      tourName: "City Tour",
      date: "2024-11-18",
    },
  ])

  // UseEffect for any future data fetching (if necessary)
  useEffect(() => {
    // Simulate data fetching, we can use this to fetch real data in the future
    // setStats(fetchedStats);
    // setRecentActivity(fetchedActivity);
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Tours */}
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Total Tours</h3>
            <p className="text-3xl font-bold text-primary">
              {stats.totalTours}
            </p>
          </div>
        </div>

        {/* Active Tours */}
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              Active Tours
            </h3>
            <p className="text-3xl font-bold text-primary">
              {stats.activeTours}
            </p>
          </div>
        </div>

        {/* Featured Tours */}
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              Featured Tours
            </h3>
            <p className="text-3xl font-bold text-primary">
              {stats.featuredTours}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Activity
        </h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Tour Name</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((activity) => (
              <tr key={activity.id} className="border-b border-gray-200">
                <td className="px-4 py-2">{activity.action}</td>
                <td className="px-4 py-2">{activity.tourName}</td>
                <td className="px-4 py-2">{activity.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: You can add charts/graphs here */}
    </div>
  )
}

export default Dashboard
