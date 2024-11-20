"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"

import { CustomPagination } from "../utils/Pagination"
import { DeleteWellness } from "./DeleteWellness"

interface Wellness {
  _id: string
  name: string
  slug: string
  thumbnail: string
  location: string
  price: number
  duration: number // Days
  category: string
}

const WellnessHome: React.FC = () => {
  const router = useRouter()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedWellnessToDelete, setSelectedWellnessToDelete] = useState<
    string | null
  >(null)

  // Hardcoded wellnesss data
  const WellnessData: Wellness[] = [
    {
      _id: "1",
      slug: "everest-base-camp-trek",
      name: "Everest Base Camp Trek",
      thumbnail:
        "https://plus.unsplash.com/premium_photo-1672115680958-54438df0ab82?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW91bnRhaW5zfGVufDB8fDB8fHww",
      location: "Nepal",
      price: 1200,
      duration: 14,
      category: "Adventure",
    },
    {
      _id: "2",
      slug: "annapurna-circuit-trek",
      name: "Annapurna Circuit Trek",
      thumbnail:
        "https://plus.unsplash.com/premium_photo-1672115680958-54438df0ab82?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW91bnRhaW5zfGVufDB8fDB8fHww",
      location: "Nepal",
      price: 1000,
      duration: 12,
      category: "Adventure",
    },
    {
      _id: "3",
      name: "Langtang Valley Trek",
      slug: "langtang-valley-trek",
      thumbnail:
        "https://plus.unsplash.com/premium_photo-1672115680958-54438df0ab82?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW91bnRhaW5zfGVufDB8fDB8fHww",
      location: "Nepal",
      price: 800,
      duration: 10,
      category: "Adventure",
    },
    {
      _id: "4",
      slug: "ghorepani-poon-hill-trek",
      name: "Ghorepani Poon Hill Trek",
      thumbnail:
        "https://plus.unsplash.com/premium_photo-1672115680958-54438df0ab82?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW91bnRhaW5zfGVufDB8fDB8fHww",
      location: "Nepal",
      price: 600,
      duration: 7,
      category: "Adventure",
    },
  ]

  const handleDeleteClick = (wellnessId: string) => {
    setSelectedWellnessToDelete(wellnessId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    alert("Delete service is currently unavailable")
    setDeleteModalOpen(false)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Heading and Add New Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Wellness</h2>
        <button
          className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md"
          onClick={() => router.push("/wellness/add-wellness")}
        >
          Add New Wellness
        </button>
      </div>

      {/* Separator */}
      <hr className="border-blue-300 mb-6" />

      {/* Title */}
      <h3 className="text-xl text-primary mb-4 font-semibold">
        Explore Our Wellness
      </h3>

      {/* Wellness Table */}
      <div className="overflow-x-auto rounded-lg border border-blue-200 mb-5">
        <table className="min-w-full bg-white">
          <thead className="bg-wellnessPrimary text-white border-b border-blue-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider border-r border-blue-200">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider border-r border-blue-200">
                Wellness Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium  uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-blue-200">
            {WellnessData.map((wellness) => (
              <tr key={wellness._id} className="hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap border-r border-blue-200">
                  <img
                    src={wellness.thumbnail}
                    alt={wellness.name}
                    className="h-24 w-32 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4 border-r border-blue-200">
                  <div className="text-lg">
                    <p className="font-semibold text-blue-900 mb-1">
                      {wellness.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      Duration: {wellness.duration} days
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="bg-primary hover:bg-primary text-white py-2 px-4 rounded-md"
                    onClick={() =>
                      router.push(`/wellness/edit-wellness/${wellness.slug}`)
                    }
                  >
                    View Details
                  </button>

                  <Button
                    type="button"
                    variant="destructive"
                    className="ml-6"
                    onClick={() => handleDeleteClick(wellness._id)}
                  >
                    <Trash2 size={18} />
                  </Button>

                  <DeleteWellness
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirmDelete={confirmDelete}
                    itemName={wellness?.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <CustomPagination
          currentPage={1} // Pagination is hardcoded for now
          totalPages={1}
          onPageChange={(newPage) => console.log(`Change to page: ${newPage}`)}
        />
      </div>

      {/* Loader */}
      {WellnessData.length === 0 && (
        <p className="text-center mt-10 text-2xl text-blue-500">
          No wellness found.
        </p>
      )}
    </div>
  )
}

export default WellnessHome
