import React from "react"

interface TripTypeSelectProps {
  tripType: string
  handleTripTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const TripTypeForm: React.FC<TripTypeSelectProps> = ({
  tripType,
  handleTripTypeChange,
}) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-primary">Trip Type</h2>
    <select
      id="tripType"
      value={tripType}
      onChange={handleTripTypeChange}
      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled>
        Select Trip Type
      </option>

      <option value="Family Tour">Family Tour</option>
      <option value="Cultural Tour and Sightseeing">
        Cultural Tour and Sightseeing
      </option>
      <option value="Wildelife and Safari">Wildelife and Safari</option>
      <option value="Heli Tour Expeditions">Heli Tour Expeditions</option>
      <option value="Festival Celebrations Tour">
        Festival Celebrations Tour
      </option>
      <option value="Unique Experiences">Unique Experiences</option>
    </select>
  </div>
)

export default TripTypeForm
