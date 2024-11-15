"use client"

import React from "react"

// Types
export interface Link {
  text: string
  url: string
}

export interface Highlight {
  content: string
  links: Link[]
}

interface HighlightsProps {
  highlights: Highlight[]
  onContentChange: (index: number, value: string) => void
  onLinkChange: (
    highlightIndex: number,
    linkIndex: number,
    key: keyof Link,
    value: string
  ) => void
  onAddLink: (highlightIndex: number) => void
  onAddHighlight: () => void
  onRemoveHighlight: (index: number) => void
  onRemoveLink: (highlightIndex: number, linkIndex: number) => void
}

const Highlights: React.FC<HighlightsProps> = ({
  highlights,
  onContentChange,
  onLinkChange,
  onAddLink,
  onAddHighlight,
  onRemoveHighlight,
  onRemoveLink,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Highlights</h2>
        <button
          type="button"
          onClick={onAddHighlight}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Add New Highlight
        </button>
      </div>

      <div className="space-y-6">
        {highlights.map((highlight, highlightIndex) => (
          <div
            key={highlightIndex}
            className="border border-gray-200 p-6 rounded-lg shadow-sm bg-white"
          >
            {/* Content Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <button
                  type="button"
                  onClick={() => onRemoveHighlight(highlightIndex)}
                  className="text-red-500 hover:text-red-700 text-sm transition-colors"
                >
                  Remove Highlight
                </button>
              </div>
              <textarea
                value={highlight.content}
                onChange={(e) =>
                  onContentChange(highlightIndex, e.target.value)
                }
                placeholder="Enter highlight content"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
              />
            </div>

            {/* Links Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Links
                </label>
                <button
                  type="button"
                  onClick={() => onAddLink(highlightIndex)}
                  className="text-blue-500 hover:text-blue-700 text-sm transition-colors"
                >
                  Add New Link
                </button>
              </div>

              {highlight.links.map((link, linkIndex) => (
                <div
                  key={linkIndex}
                  className="flex items-center gap-3 bg-gray-50 p-3 rounded-md"
                >
                  <input
                    type="text"
                    value={link.text}
                    onChange={(e) =>
                      onLinkChange(
                        highlightIndex,
                        linkIndex,
                        "text",
                        e.target.value
                      )
                    }
                    placeholder="Link text"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      onLinkChange(
                        highlightIndex,
                        linkIndex,
                        "url",
                        e.target.value
                      )
                    }
                    placeholder="URL"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveLink(highlightIndex, linkIndex)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Highlights
