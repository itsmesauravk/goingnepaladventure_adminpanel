import React from "react"
import { Camera, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Link {
  text: string
  url: string
}

interface Highlight {
  content: string
  links: Link[]
}

interface HighlightChildProps {
  index: number
  highlight: Highlight
  updateHighlight: (updatedHighlight: Highlight) => void
  removeHighlight: () => void
}

const HighlightForm: React.FC<HighlightChildProps> = ({
  index,
  highlight,
  updateHighlight,
  removeHighlight,
}) => {
  const updateContent = (content: string) => {
    updateHighlight({ ...highlight, content })
  }

  const addLink = () => {
    const updatedLinks = [...highlight.links, { text: "", url: "" }]
    updateHighlight({ ...highlight, links: updatedLinks })
  }

  const updateLink = (
    linkIndex: number,
    key: "text" | "url",
    value: string
  ) => {
    const updatedLinks = [...highlight.links]
    updatedLinks[linkIndex][key] = value
    updateHighlight({ ...highlight, links: updatedLinks })
  }

  const removeLink = (linkIndex: number) => {
    const updatedLinks = [...highlight.links]
    updatedLinks.splice(linkIndex, 1)
    updateHighlight({ ...highlight, links: updatedLinks })
  }

  return (
    <div className="mb-4 border-b pb-4">
      <div className="flex items-center justify-between">
        <Input
          type="text"
          placeholder="Highlight Content"
          value={highlight.content}
          onChange={(e) => updateContent(e.target.value)}
          className="flex-grow"
        />
        <Button
          type="button"
          onClick={removeHighlight}
          className="ml-4 text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </Button>
      </div>

      {highlight.links.map((link, linkIndex) => (
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
            className="flex-grow mr-2"
          />
          <Button
            type="button"
            onClick={() => removeLink(linkIndex)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={addLink}
        className="mt-2 flex items-center"
      >
        <Camera size={18} className="mr-2" />
        Add Link
      </Button>
    </div>
  )
}

export default HighlightForm
