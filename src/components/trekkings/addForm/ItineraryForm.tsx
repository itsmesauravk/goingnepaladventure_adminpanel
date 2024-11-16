import React from "react"
import { Camera, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Link {
  text: string
  url: string
}

interface Itinerary {
  day: number
  title: string
  details: string
  accommodations: string
  meals: string
  links: Link[]
}

interface ItineraryChildProps {
  index: number
  itinerary: Itinerary
  updateItinerary: (updatedItinerary: Itinerary) => void
  removeItinerary: () => void
}

const ItineraryForm: React.FC<ItineraryChildProps> = ({
  index,
  itinerary,
  updateItinerary,
  removeItinerary,
}) => {
  const updateField = (
    key: "title" | "details" | "accommodations" | "meals",
    value: string
  ) => {
    updateItinerary({ ...itinerary, [key]: value })
  }

  const addLink = () => {
    const updatedLinks = [...itinerary.links, { text: "", url: "" }]
    updateItinerary({ ...itinerary, links: updatedLinks })
  }

  const updateLink = (
    linkIndex: number,
    key: "text" | "url",
    value: string
  ) => {
    const updatedLinks = [...itinerary.links]
    updatedLinks[linkIndex][key] = value
    updateItinerary({ ...itinerary, links: updatedLinks })
  }

  const removeLink = (linkIndex: number) => {
    const updatedLinks = [...itinerary.links]
    updatedLinks.splice(linkIndex, 1)
    updateItinerary({ ...itinerary, links: updatedLinks })
  }

  return (
    <div className="mb-4 border p-2 rounded-md border-primary pb-4">
      <h2 className="text-lg font-bold mb-2">Day {itinerary.day}</h2>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Title"
          value={itinerary.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter itinerary details"
          value={itinerary.details}
          onChange={(e) => updateField("details", e.target.value)}
        />
        <Input
          type="text"
          placeholder="Accommodation"
          value={itinerary.accommodations}
          onChange={(e) => updateField("accommodations", e.target.value)}
        />
        <Input
          type="text"
          placeholder="Meals"
          value={itinerary.meals}
          onChange={(e) => updateField("meals", e.target.value)}
        />
      </div>

      <h1 className="text-lg font-bold mt-4">Links</h1>

      <div className="mt-4">
        {itinerary.links.map((link, linkIndex) => (
          <div key={linkIndex} className="mt-2 flex items-center">
            <Input
              type="text"
              placeholder="Key (text)"
              value={link.text}
              onChange={(e) => updateLink(linkIndex, "text", e.target.value)}
              className="flex-grow mr-2"
            />
            <Input
              type="text"
              placeholder="Value (url)"
              value={link.url}
              onChange={(e) => updateLink(linkIndex, "url", e.target.value)}
              className="flex-grow mr-2 "
            />
            <Button
              type="button"
              variant={"destructive"}
              onClick={() => removeLink(linkIndex)}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          onClick={addLink}
          className="mt-2 flex items-center text-white"
        >
          <Camera size={18} className="mr-2" />
          Add Link
        </Button>
      </div>

      <Button
        type="button"
        onClick={removeItinerary}
        variant={"destructive"}
        className="mt-2"
      >
        <Trash2 size={18} className="mr-2" />
        Remove Itinerary
      </Button>
    </div>
  )
}

export default ItineraryForm
