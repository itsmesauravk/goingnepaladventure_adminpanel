"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import { Trash2, Plus, SortAsc, EyeIcon, Calendar, MapIcon } from "lucide-react"

import { CustomPagination } from "../utils/Pagination"
import { Switch } from "../ui/switch"

import { toast } from "sonner"
import HomeLoading from "../home/HomeLoading"

interface User {
  _id: string
  userName: string
  userEmail: string
  userPhone: string
  userAddress: string
  userCountry: string
}

const UsersInfoHome: React.FC = () => {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(20)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("-date")
  // const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  // const [selectedActivityToDelete, setSelectedActivityToDelete] = useState<
  //   string | null
  // >(null)
  // const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  // Fetch activities data with filters
  const getUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/users/get`,
        {
          params: {
            page,
            limit,
            search,
            sort,
          },
        }
      )
      if (response.data.success) {
        setUsers(response.data.data)
        // setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.log("Failed to fetch user data")
    } finally {
      setLoading(false)
    }
  }

  // const handleDeleteClick = (activityId: string) => {
  //   setSelectedActivityToDelete(activityId)
  //   setDeleteModalOpen(true)
  // }

  // const confirmDelete = async () => {
  //   try {
  //     setDeleteLoading(true)
  //     if (selectedActivityToDelete) {
  //       const response = await axios.delete(
  //         `${process.env.NEXT_PUBLIC_API_URL_DEV}/activities/delete-activity/${selectedActivityToDelete}`
  //       )
  //       if (response.data.success) {
  //         setDeleteLoading(false)
  //         toast.success(response.data.message)
  //         getActivities()
  //       } else {
  //         setDeleteLoading(false)
  //         toast.error(response.data.message)
  //       }
  //     }
  //   } catch (error) {
  //     setDeleteLoading(false)
  //     toast.error("Failed to delete activity")
  //   } finally {
  //     setDeleteModalOpen(false)
  //   }
  // }

  useEffect(() => {
    const searchData = setTimeout(() => {
      getUsers()
    }, 1000)
    return () => clearTimeout(searchData)
  }, [search])

  useEffect(() => {
    getUsers()
  }, [page, limit, sort])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Users Manager</h2>
        </div>
        <p className="text-gray-600">Manage your user details options</p>
      </div>

      {/* Filters Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <SortAsc className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={visibility}
            onChange={(e) => {
              setVisibility(e.target.value)
              setPage(1)
            }}
          >
            <option value="all">Visibility (All)</option>
            <option value="isPopular">Popular</option>
            <option value="isActivated">Active</option>
            <option value="notPopular">Not Popular</option>
            <option value="notActivated">Not Active</option>
          </select>
        </div>

        <div className="relative">
          <SortAsc className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Sort by...</option>
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="viewsCount">Views: Low to High</option>
            <option value="-viewsCount">Views: High to Low</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities by title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div> */}

      {/* Activities List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-md font-semibold text-primary">
                      {user.userName ? user.userName : "-"}
                    </h3>
                  </div>
                </td>
                {/* contact  */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {user.userPhone ? user.userPhone : "-"}
                    </span>
                  </div>
                </td>
                {/* email  */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {user.userEmail ? user.userEmail : "-"}
                    </span>
                  </div>
                </td>
                {/* address  */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {user.userAddress ? user.userAddress : "-"},{" "}
                      {user.userCountry ? user.userCountry : "-"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      variant="destructive"
                      // onClick={() => handleDeleteClick(user._id)}
                      onClick={() => toast.warning("Not now")}
                      className="px-4 py-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading and Empty States */}
      {/* Loading and Empty States */}
      {loading && (
        <div className="flex justify-center mt-40">
          <HomeLoading />
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">No users found</p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {users.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  )
}

export default UsersInfoHome
