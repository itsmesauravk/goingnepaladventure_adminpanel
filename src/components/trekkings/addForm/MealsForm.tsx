import React from "react"

interface MealSelectProps {
  meal: string
  handleMealChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const MealSelect: React.FC<MealSelectProps> = ({ meal, handleMealChange }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-primary  mt-2">Meal Type</h2>
    <label
      htmlFor="meal"
      className="block mb-2 text-sm font-medium text-gray-700"
    >
      Select a meal type
    </label>
    <select
      id="meal"
      value={meal}
      onChange={handleMealChange}
      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled>
        Select a meal type
      </option>
      <option value="Inclusive">Inclusive</option>
      <option value="Exclusive">Exclusive</option>
    </select>
  </div>
)

export default MealSelect
