"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Plus, Trash2, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

const CreateActivityForm: React.FC = () => {
  const router = useRouter()
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    country: "",
    location: "",
    groupSizeMin: "",
    groupSizeMax: "",
    seasons: {
      spring: false,
      summer: false,
      autumn: false,
      winter: false,
    },
    overview: "",
    serviceIncludes: [""],
    thingsToKnow: [""],
    FAQs: [{ question: "", answer: "" }],
    thumbnail: null as File | null,
    thumbnailPreview: null as string | null,
    gallery: [] as File[],
    galleryPreviews: [] as string[],
    isPopular: false,
    isActivated: true,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSeasonToggle = (season: keyof typeof formData.seasons) => {
    setFormData((prev) => ({
      ...prev,
      seasons: {
        ...prev.seasons,
        [season]: !prev.seasons[season],
      },
    }))
  }

  const handleArrayChange = (
    field: "serviceIncludes" | "thingsToKnow",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: "serviceIncludes" | "thingsToKnow") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (
    field: "serviceIncludes" | "thingsToKnow",
    index: number
  ) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const newPreviews: string[] = []

      const readFiles = newFiles.map((file) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            newPreviews.push(reader.result as string)
            resolve()
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readFiles).then(() => {
        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...newFiles],
          galleryPreviews: [...prev.galleryPreviews, ...newPreviews],
        }))
      })
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
      galleryPreviews: prev.galleryPreviews.filter((_, i) => i !== index),
    }))
  }

  const handleFAQChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const newFAQs = [...formData.FAQs]
    newFAQs[index][field] = value
    setFormData((prev) => ({ ...prev, FAQs: newFAQs }))
  }

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      FAQs: [...prev.FAQs, { question: "", answer: "" }],
    }))
  }

  const removeFAQ = (index: number) => {
    const newFAQs = formData.FAQs.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, FAQs: newFAQs }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all required fields
    const requiredFields = [
      "title",
      "price",
      "country",
      "location",
      "groupSizeMin",
      "groupSizeMax",
      "overview",
    ]

    const isValidSeason = Object.values(formData.seasons).some(
      (season) => season
    )
    if (!isValidSeason) {
      toast.error("Please select at least one season")
      return
    }

    const missingFields = requiredFields.filter((field) => {
      const value = formData[field as keyof typeof formData]
      return value === "" || value === "0"
    })

    if (missingFields.length > 0 || !formData.thumbnail) {
      toast.error("Please fill all required fields and upload a thumbnail")
      return
    }

    const bestSeasons = Object.keys(formData.seasons).filter(
      (season) => formData.seasons[season as keyof typeof formData.seasons]
    )

    const formDataToSubmit = new FormData()

    formDataToSubmit.append("title", formData.title)
    formDataToSubmit.append("price", formData.price)
    formDataToSubmit.append("country", formData.country)
    formDataToSubmit.append("location", formData.location)
    formDataToSubmit.append("groupSizeMin", formData.groupSizeMin)
    formDataToSubmit.append("groupSizeMax", formData.groupSizeMax)
    formDataToSubmit.append("overview", formData.overview)
    formDataToSubmit.append("bestSeason", JSON.stringify(bestSeasons))
    formDataToSubmit.append(
      "serviceIncludes",
      JSON.stringify(formData.serviceIncludes)
    )
    formDataToSubmit.append(
      "thingsToKnow",
      JSON.stringify(formData.thingsToKnow)
    )
    formDataToSubmit.append("FAQs", JSON.stringify(formData.FAQs))

    // Append thumbnail
    if (formData.thumbnail) {
      formDataToSubmit.append("thumbnail", formData.thumbnail)
    }

    // Append gallery images
    formData.gallery.forEach((file) => {
      formDataToSubmit.append("image", file)
    })

    console.log(formDataToSubmit)

    // Uncomment for actual API submission
    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/activities/create-activity`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        router.push("/activities")
        setLoading(false)
      } else {
        setLoading(false)
        toast.error(response.data.message)
      }
    } catch (error) {
      setLoading(false)
      toast.error("Failed to create activity")
      console.error(error)
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Create New Activity
        </h2>

        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Activity Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Activity Title"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Price</label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Country</label>
            <Input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              required
            />
          </div>
        </div>

        {/* Location & Group Details */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Specific Location
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Specific Location"
              required
            />
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block text-gray-700 mb-2">Min Group Size</label>
              <Input
                type="number"
                name="groupSizeMin"
                value={formData.groupSizeMin}
                onChange={handleChange}
                placeholder="Min Group Size"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Max Group Size</label>
              <Input
                type="number"
                name="groupSizeMax"
                value={formData.groupSizeMax}
                onChange={handleChange}
                placeholder="Max Group Size"
                required
              />
            </div>
          </div>
        </div>

        {/* Seasons */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Best Seasons</label>
          <div className="flex gap-4">
            {Object.keys(formData.seasons).map((season) => (
              <div key={season} className="flex items-center space-x-2">
                <Checkbox
                  checked={
                    formData.seasons[season as keyof typeof formData.seasons]
                  }
                  onCheckedChange={() =>
                    handleSeasonToggle(season as keyof typeof formData.seasons)
                  }
                />
                <label>
                  {season.charAt(0).toUpperCase() + season.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Overview */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Activity Overview</label>
          <Textarea
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            placeholder="Activity Overview"
            required
          />
        </div>

        {/* Service Includes */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Service Includes</label>
          {formData.serviceIncludes.map((service, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={service}
                onChange={(e) =>
                  handleArrayChange("serviceIncludes", index, e.target.value)
                }
                placeholder="Service"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeArrayItem("serviceIncludes", index)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem("serviceIncludes")}
          >
            <Plus size={16} className="mr-2" /> Add Service
          </Button>
        </div>

        {/* Things to Know */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Things to Know</label>
          {formData.thingsToKnow.map((thing, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={thing}
                onChange={(e) =>
                  handleArrayChange("thingsToKnow", index, e.target.value)
                }
                placeholder="Thing to Know"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeArrayItem("thingsToKnow", index)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem("thingsToKnow")}
          >
            <Plus size={16} className="mr-2" /> Add Thing to Know
          </Button>
        </div>

        {/* FAQs */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Frequently Asked Questions
          </label>
          {formData.FAQs.map((faq, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <Input
                value={faq.question}
                onChange={(e) =>
                  handleFAQChange(index, "question", e.target.value)
                }
                placeholder="Question"
                className="mb-2"
              />
              <Textarea
                value={faq.answer}
                onChange={(e) =>
                  handleFAQChange(index, "answer", e.target.value)
                }
                placeholder="Answer"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeFAQ(index)}
                className="mt-2"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addFAQ}>
            <Plus size={16} className="mr-2" /> Add FAQ
          </Button>
        </div>

        {/* Thumbnail Upload with Preview */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Thumbnail Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            ref={thumbnailInputRef}
            className="mb-2"
            required
          />
          {formData.thumbnailPreview && (
            <div className="mt-2 flex items-center">
              <img
                src={formData.thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-32 h-32 object-cover rounded-lg mr-4"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    thumbnail: null,
                    thumbnailPreview: null,
                  }))
                  if (thumbnailInputRef.current)
                    thumbnailInputRef.current.value = ""
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* Gallery Upload with Previews */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Gallery Images</label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleGalleryUpload}
            ref={galleryInputRef}
            className="mb-2"
            required
          />
          <div className="grid grid-cols-4 gap-2 mt-2">
            {formData.galleryPreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Gallery Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-0 right-0"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full text-white">
          {loading ? "Creating, Please Wait..." : "Create Activity"}
        </Button>
      </form>
    </div>
  )
}

export default CreateActivityForm
