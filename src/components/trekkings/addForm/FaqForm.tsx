// FAQ.tsx
import React, { memo } from "react"
import { XCircle } from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
}

type FAQField = "question" | "answer"

interface FAQItemProps {
  faq: FAQ
  index: number
  onFaqChange: (id: string, field: FAQField, value: string) => void
  onRemove: (id: string) => void
}

const FAQItem = memo(({ faq, index, onFaqChange, onRemove }: FAQItemProps) => (
  <div className="bg-white p-4 rounded-lg shadow-md mb-4 transition-all duration-200 hover:shadow-lg">
    <div className="flex gap-4 mb-2">
      <div className="flex-1">
        <label htmlFor={`question-${faq.id}`} className="sr-only">
          Question {index + 1}
        </label>
        <input
          id={`question-${faq.id}`}
          type="text"
          value={faq.question}
          onChange={(e) => onFaqChange(faq.id, "question", e.target.value)}
          placeholder="Enter question"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        />
      </div>
      <div className="flex-1">
        <label htmlFor={`answer-${faq.id}`} className="sr-only">
          Answer {index + 1}
        </label>
        <input
          id={`answer-${faq.id}`}
          type="text"
          value={faq.answer}
          onChange={(e) => onFaqChange(faq.id, "answer", e.target.value)}
          placeholder="Enter answer"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(faq.id)}
        className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2"
        aria-label={`Remove FAQ ${index + 1}`}
      >
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  </div>
))

FAQItem.displayName = "FAQItem"

interface FAQListProps {
  faqs: FAQ[]
  onFaqChange: (id: string, field: FAQField, value: string) => void
  onAddFaq: () => void
  onRemoveFaq: (id: string) => void
}

const FAQList: React.FC<FAQListProps> = ({
  faqs,
  onFaqChange,
  onAddFaq,
  onRemoveFaq,
}) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold text-primary mb-4">FAQ</h2>

    {faqs.map((faq, index) => (
      <FAQItem
        key={faq.id}
        faq={faq}
        index={index}
        onFaqChange={onFaqChange}
        onRemove={onRemoveFaq}
      />
    ))}

    <button
      type="button"
      onClick={onAddFaq}
      className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md 
               hover:bg-blue-600 transition-colors duration-200"
    >
      Add New FAQ
    </button>
  </div>
)

export default memo(FAQList)
