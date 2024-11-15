import React, { FC } from "react"

interface NameInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const NameInput: FC<NameInputProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">Name</h2>
    <input
      type="text"
      id="name"
      name="name"
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter trek name"
    />
  </div>
)

export default NameInput
