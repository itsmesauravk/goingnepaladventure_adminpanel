"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Plus, Trash2, ImageIcon, Upload } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { Separator } from "@radix-ui/react-separator"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import Cookies from "js-cookie"

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

    // Uncomment for actual API submission
    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/activities/create-activity`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          withCredentials: true,
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <form onSubmit={handleSubmit} className=" mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center bg-gray-50 rounded-t-xl border-b">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create New Activity
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Activity Title
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter activity title"
                    className="border-gray-300 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className="border-gray-300 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    className="border-gray-300 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Location & Group Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Location & Group Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Specific Location
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter specific location"
                    className="border-gray-300 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Min Group Size
                    </label>
                    <Input
                      type="number"
                      name="groupSizeMin"
                      value={formData.groupSizeMin}
                      onChange={handleChange}
                      placeholder="Min size"
                      className="border-gray-300 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Max Group Size
                    </label>
                    <Input
                      type="number"
                      name="groupSizeMax"
                      value={formData.groupSizeMax}
                      onChange={handleChange}
                      placeholder="Max size"
                      className="border-gray-300 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Seasons */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Best Seasons
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(formData.seasons).map((season) => (
                  <div
                    key={season}
                    className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg"
                  >
                    <Checkbox
                      checked={
                        formData.seasons[
                          season as keyof typeof formData.seasons
                        ]
                      }
                      onCheckedChange={() =>
                        handleSeasonToggle(
                          season as keyof typeof formData.seasons
                        )
                      }
                      className="data-[state=checked]:bg-blue-600 bg-white"
                    />
                    <label className="text-sm font-medium">
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Overview */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Activity Overview
              </h3>
              <Textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Provide a detailed overview of the activity..."
                className="min-h-32 border-gray-300 focus:ring-blue-500"
                required
              />
            </div>

            <Separator />

            {/* Service Includes */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Services Included
              </h3>
              <div className="space-y-3">
                {formData.serviceIncludes.map((service, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={service}
                      onChange={(e) =>
                        handleArrayChange(
                          "serviceIncludes",
                          index,
                          e.target.value
                        )
                      }
                      placeholder="Enter included service"
                      className="border-gray-300 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeArrayItem("serviceIncludes", index)}
                      className="shrink-0"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("serviceIncludes")}
                  className="w-full border-dashed"
                >
                  <Plus size={18} className="mr-2" /> Add Service
                </Button>
              </div>
            </div>

            <Separator />

            {/* Things to Know */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Things to Know
              </h3>
              <div className="space-y-3">
                {formData.thingsToKnow.map((thing, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={thing}
                      onChange={(e) =>
                        handleArrayChange("thingsToKnow", index, e.target.value)
                      }
                      placeholder="Enter important information"
                      className="border-gray-300 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeArrayItem("thingsToKnow", index)}
                      className="shrink-0"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("thingsToKnow")}
                  className="w-full border-dashed"
                >
                  <Plus size={18} className="mr-2" /> Add Information
                </Button>
              </div>
            </div>

            <Separator />

            {/* FAQs */}
            <div>
              <h3 className="text-xl font-semibold max-w-[500px] text-gray-800 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4 max-w-[600px]">
                {formData.FAQs.map((faq, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardContent className="p-4 space-y-3">
                      <Input
                        value={faq.question}
                        onChange={(e) =>
                          handleFAQChange(index, "question", e.target.value)
                        }
                        placeholder="Enter question"
                        className="border-gray-300 focus:ring-blue-500"
                      />
                      <Textarea
                        value={faq.answer}
                        onChange={(e) =>
                          handleFAQChange(index, "answer", e.target.value)
                        }
                        placeholder="Enter answer"
                        className="border-gray-300 focus:ring-blue-500"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFAQ(index)}
                        className="w-full"
                      >
                        <Trash2 size={18} className="mr-2" /> Remove FAQ
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFAQ}
                  className="w-full border-dashed"
                >
                  <Plus size={18} className="mr-2" /> Add FAQ
                </Button>
              </div>
            </div>

            <Separator />

            {/* Image Uploads */}
            <div className="space-y-6">
              {/* Thumbnail Upload */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Thumbnail Image
                </h3>
                <div className="space-y-4 max-w-[600px]">
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center justify-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">JPG or JPEG</p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        ref={thumbnailInputRef}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                  {formData.thumbnailPreview && (
                    <div className="flex items-center gap-4">
                      <img
                        src={formData.thumbnailPreview}
                        alt="Thumbnail Preview"
                        className="w-32 h-32 object-cover rounded-lg"
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
              </div>

              {/* Gallery Upload */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Gallery Images
                </h3>
                <div className="space-y-4 max-w-[600px]">
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center justify-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">JPG or JPEG</p>
                      </div>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        ref={galleryInputRef}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
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
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white text-lg bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? "Creating, Please Wait..." : "Create Activity"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default CreateActivityForm
