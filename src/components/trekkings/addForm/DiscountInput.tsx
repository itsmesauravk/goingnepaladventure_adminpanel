// DiscountInput.tsx
import React from "react"

interface DiscountInputProps {
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const DiscountInput: React.FC<DiscountInputProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">Discount (in %)</h2>

    <div className="relative rounded-md shadow-sm">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
        $
      </span>
      <input
        type="number"
        id="price"
        name="price"
        value={value}
        required
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 pl-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter price"
        min={0}
      />
    </div>
    <p className="text-sm text-gray-500 mt-1">
      Enter the discount in percentage.
    </p>
  </div>
)

export default DiscountInput
