import React from "react"

interface BestSeasonsSelectProps {
  selectedSeasons: string[]
  handleSeasonChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const BestSeasonsSelect: React.FC<BestSeasonsSelectProps> = ({
  selectedSeasons,
  handleSeasonChange,
}) => (
  <div className="">
    <h2 className="text-lg font-semibold text-primary mb-3">
      Best Seasons (Multiple)
    </h2>
    <select
      id="bestSeasons"
      name="bestSeasons"
      multiple
      value={selectedSeasons}
      onChange={handleSeasonChange}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="Winter">Winter</option>
      <option value="Spring">Spring</option>
      <option value="Summer">Summer</option>
      <option value="Autumn">Autumn</option>
    </select>
    <div className="mt-2 text-sm text-gray-600">
      Selected Seasons:{" "}
      <span className="font-semibold text-secondary">
        {selectedSeasons.length > 0 ? selectedSeasons.join(", ") : "None"}
      </span>
    </div>
    <div className="mt-1 text-xs text-gray-500">
      Note: Hold down `Ctrl` (Windows) or `Cmd` (Mac) to select multiple
      seasons.
    </div>
  </div>
)

export default BestSeasonsSelect
