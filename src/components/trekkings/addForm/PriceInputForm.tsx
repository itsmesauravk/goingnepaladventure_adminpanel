// PriceInput.tsx
import React from "react"

interface PriceInputProps {
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const PriceInput: React.FC<PriceInputProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">Price</h2>

    <div className="relative rounded-md shadow-sm">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
        Rs
      </span>
      <input
        type="number"
        id="price"
        name="price"
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 pl-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter price"
        min={0}
      />
    </div>
    <p className="text-sm text-gray-500 mt-1">Enter the price in Rupees.</p>
  </div>
)

export default PriceInput
