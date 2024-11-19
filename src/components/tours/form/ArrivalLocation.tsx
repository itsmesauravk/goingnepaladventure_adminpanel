import React from "react"

interface ArrivalLocationProps {
  arrivalLocation: string
  handleArrivalLocationChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
}

const ArrivalLocation: React.FC<ArrivalLocationProps> = ({
  arrivalLocation,
  handleArrivalLocationChange,
}) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-primary">Arrival Location</h2>
    <input
      type="text"
      id="location"
      name="location"
      value={arrivalLocation}
      onChange={handleArrivalLocationChange}
      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter Arrival Location"
    />
  </div>
)

export default ArrivalLocation
