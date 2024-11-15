"use client"

import Image from "next/image"
import React from "react"
import { useRouter } from "next/navigation"

const TrekkingHome: React.FC = () => {
  const router = useRouter()

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
      <h3 className="text-xl font-medium text-gray-700 mb-4">Our Trekkings</h3>

      {/* Filter and Search */}
      <div className="flex items-center justify-between mb-6">
        {/* Dropdown for Filter */}
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

        {/* Search Input and Button */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search Trekkings"
            className="p-2 border text-primary  border-gray-300 rounded-md w-full"
          />
          <button className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            Search
          </button>
        </div>
      </div>

      {/* Dummy Trekking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <div
            key={id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <Image
              src={"/going.png"}
              alt={`Trekking ${id}`}
              width={150}
              height={150}
              className="rounded-md mb-4"
              unoptimized
            />
            <h4 className="text-lg font-semibold text-gray-800">
              Trekking Title {id}
            </h4>
            <p className="text-gray-600 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              vel viverra risus.
            </p>
            <button className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrekkingHome
