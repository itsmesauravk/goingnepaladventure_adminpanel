"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"

import { CustomPagination } from "../utils/Pagination"
import { DeleteTour } from "./DeleteTour"
import axios from "axios"

interface Tour {
  _id: string
  name: string
  slug: string
  thumbnail: string
  location: string
  price: number
  tripType: string
  category: string
}

const TourHome: React.FC = () => {
  const router = useRouter()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTourToDelete, setSelectedTourToDelete] = useState<
    string | null
  >(null)
  const [loading, setLoading] = useState(false)
  const [tours, setTours] = useState<Tour[]>([])

  const handleDeleteClick = (tourId: string) => {
    setSelectedTourToDelete(tourId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    alert("Delete service is currently unavailable")
    setDeleteModalOpen(false)
  }

  // get all tours
  const getTourHandler = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/tour/tours`
      )

      if (response.data.success) {
        setTours(response.data.data)
        setLoading(false)
      } else {
        console.log(response.data.message)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    getTourHandler()
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Heading and Add New Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Tours</h2>
        <button
          className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md"
          onClick={() => router.push("/tours/add-tour")}
        >
          Add New Tour
        </button>
      </div>

      {/* Separator */}
      <hr className="border-blue-300 mb-6" />

      {/* Title */}
      <h3 className="text-xl text-primary mb-4 font-semibold">
        Explore Our Tours
      </h3>

      {/* Tours Table */}
      <div className="overflow-x-auto rounded-lg border border-blue-200 mb-5">
        <table className="min-w-full bg-white">
          <thead className="bg-tourPrimary text-white border-b border-blue-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider border-r border-blue-200">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider border-r border-blue-200">
                Tour Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium  uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-blue-200">
            {tours.map((tour) => (
              <tr key={tour._id} className="hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap border-r border-blue-200">
                  <img
                    src={tour.thumbnail}
                    alt={tour.name}
                    className="h-24 w-32 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4 border-r border-blue-200">
                  <div className="text-lg">
                    <p className="font-semibold text-blue-900 mb-1">
                      {tour.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      Trip Type: {tour.tripType}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="bg-primary hover:bg-primary text-white py-2 px-4 rounded-md"
                    onClick={() => router.push(`/tours/edit-tour/${tour.slug}`)}
                  >
                    View Details
                  </button>

                  <Button
                    type="button"
                    variant="destructive"
                    className="ml-6"
                    onClick={() => handleDeleteClick(tour._id)}
                  >
                    <Trash2 size={18} />
                  </Button>

                  <DeleteTour
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirmDelete={confirmDelete}
                    itemName={tour?.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loader */}

      {loading && <Loader />}

      {!loading && tours.length === 0 && (
        <p className="text-center mt-10 text-2xl text-gray-500">
          No Tours found.
        </p>
      )}

      <div className="mt-5 mb-5">
        <CustomPagination
          currentPage={1} // Pagination is hardcoded for now
          totalPages={1}
          onPageChange={(newPage) => console.log(`Change to page: ${newPage}`)}
        />
      </div>
    </div>
  )
}

export default TourHome
