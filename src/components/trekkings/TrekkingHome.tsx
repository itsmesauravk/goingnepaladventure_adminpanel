"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Image from "next/image"

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

  const getTrekking = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/treks`
      )
      if (response.data.success) {
        setTrekking(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTrekking()
  }, [])

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
      <h3 className="text-xl  text-gray-700 mb-4 font-semibold">
        Our Trekkings
      </h3>

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

      {/* Trekking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trekking.map((trek) => (
          <div
            key={trek._id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Thumbnail */}
            <img
              src={trek.thumbnail}
              alt={trek.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />

            {/* Trek Name */}
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {trek.name}
            </h4>
            {/* Location and Difficulty */}
            <p className="text-gray-600 text-sm mb-1">
              <strong>Location:</strong> {trek.location}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <strong>Difficulty:</strong> {trek.difficulty}
            </p>
            {/* Price, Days, and Group Size */}
            <p className="text-gray-600 text-sm mb-1">
              <strong>Price:</strong> ${trek.price}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <strong>Days:</strong> {trek.days.min} - {trek.days.max}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <strong>Group Size:</strong> {trek.groupSize.min} -{" "}
              {trek.groupSize.max}
            </p>
            {/* View Details Button */}
            <button
              className="bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md mt-4 w-full"
              onClick={() => router.push(`/trekking/${trek.slug}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrekkingHome
