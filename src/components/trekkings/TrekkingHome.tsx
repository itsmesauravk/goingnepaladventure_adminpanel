"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"
import { DeleteTrek } from "./DeleteTrek"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CustomPagination } from "../utils/Pagination"

interface Trekking {
  _id: string
  name: string
  slug: string
  thumbnail: string
  location: string
  difficulty: string
  price: number
  days: {
    min: number
    max: number
  }
  groupSize: {
    min: number
    max: number
  }
}

const TrekkingHome: React.FC = () => {
  const router = useRouter()
  const [trekking, setTrekking] = useState<Trekking[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTrekToDelete, setSelectedTrekToDelete] = useState<
    string | null
  >(null)

  // Fetch trekking data
  const getTrekking = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/treks`,
        {
          params: {
            page,
            limit,
          },
        }
      )
      if (response.data.success) {
        setTrekking(response.data.data)
        setTotalPages(response.data.totalPages)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleDeleteClick = (trekId: string) => {
    setSelectedTrekToDelete(trekId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      // Implement delete logic here
      await axios.delete(`/your-delete-endpoint/${selectedTrekToDelete}`)
      // Refresh trekking list or remove item from state
      setDeleteModalOpen(false)
    } catch (error) {
      console.error("Delete failed", error)
    }
  }

  const handleNextPage = (page: number) => {
    page = page + 1
    setPage(page)
  }
  const handlePrevPage = (page: number) => {
    page = page - 1
    setPage(page)
  }

  useEffect(() => {
    getTrekking()
  }, [page, limit])

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Heading and Add New Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Trekkings</h2>
        <button
          className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-md"
          onClick={() => router.push("/trekking/add-trek")}
        >
          Add New
        </button>
      </div>

      {/* Separator */}
      <hr className="border-gray-300 mb-6" />

      {/* Title */}
      <h3 className="text-xl text-gray-700 mb-4 font-semibold">
        Our Trekkings
      </h3>

      {/* Filter and Search */}
      <div className="flex items-center justify-between mb-6">
        <select
          className="p-2 border border-gray-300 text-primary rounded-md w-1/3"
          defaultValue=""
        >
          <option value="" disabled>
            Filter by Category
          </option>
          <option value="mountain">Mountain</option>
          <option value="desert">Desert</option>
          <option value="forest">Forest</option>
        </select>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search Trekkings"
            className="p-2 border text-primary border-gray-300 rounded-md w-full"
          />
          <button className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            Search
          </button>
        </div>
      </div>

      {/* TREKKING S */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 mb-5">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                Trek Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {trekking.map((trek) => (
              <tr key={trek._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                  <img
                    src={trek.thumbnail}
                    alt={trek.name}
                    className="h-24 w-32 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4 border-r border-gray-200">
                  <div className="text-lg">
                    <p className="font-semibold text-gray-900 mb-1">
                      {trek.name}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md"
                    onClick={() =>
                      router.push(`/trekking/edit-trek/${trek.slug}`)
                    }
                  >
                    View Details
                  </button>

                  <Button
                    type="button"
                    variant="destructive"
                    className="ml-6"
                    onClick={() => handleDeleteClick(trek._id)}
                  >
                    <Trash2 size={18} />
                  </Button>

                  <DeleteTrek
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirmDelete={confirmDelete}
                    itemName={trek?.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      {/* LOADER */}
      {/* LOADER */}
      {loading && <Loader />}

      {!loading && trekking.length === 0 && (
        <p className="text-center mt-10 text-2xl text-gray-500">
          No trekkings found.
        </p>
      )}
    </div>
  )
}

export default TrekkingHome
