import React from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FAQ {
  question: string
  answer: string
}

interface FAQChildProps {
  index: number
  faq: FAQ
  updateFAQ: (updatedFAQ: FAQ) => void
  removeFAQ: () => void
}

const FAQForm: React.FC<FAQChildProps> = ({
  index,
  faq,
  updateFAQ,
  removeFAQ,
}) => {
  const updateField = (key: "question" | "answer", value: string) => {
    updateFAQ({ ...faq, [key]: value })
  }

  return (
    <div className="mb-4  border p-2 rounded-md border-primary pb-4">
      <h2 className="text-lg font-bold mb-2">FAQ {index + 1}</h2>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Question"
          value={faq.question}
          onChange={(e) => updateField("question", e.target.value)}
        />
        <Input
          type="text"
          placeholder="Answer"
          value={faq.answer}
          onChange={(e) => updateField("answer", e.target.value)}
        />
      </div>

      <Button
        type="button"
        onClick={removeFAQ}
        variant={"destructive"}
        className="mt-4"
      >
        <Trash2 size={18} className="mr-2" />
        Remove Question
      </Button>
    </div>
  )
}

export default FAQForm
