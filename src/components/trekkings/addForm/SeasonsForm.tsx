import React from "react"

interface BestSeasonsSelectProps {
  selectedSeasons: string[]
  handleSeasonChange: (season: string) => void
}

const BestSeasonsSelect: React.FC<BestSeasonsSelectProps> = ({
  selectedSeasons,
  handleSeasonChange,
}) => {
  const seasons = ["Winter", "Spring", "Summer", "Autumn"]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-primary">
        Best Seasons (Multiple)
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {seasons.map((season) => (
          <div
            key={season}
            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => handleSeasonChange(season)}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center
                ${
                  selectedSeasons.includes(season)
                    ? "border-primary bg-primary"
                    : "border-gray-300"
                }`}
            >
              {selectedSeasons.includes(season) && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-gray-700 font-medium">{season}</span>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-600">
        Selected Seasons:{" "}
        <span className="font-semibold text-secondary">
          {selectedSeasons.length > 0 ? selectedSeasons.join(", ") : "None"}
        </span>
      </div>
    </div>
  )
}

export default BestSeasonsSelect
