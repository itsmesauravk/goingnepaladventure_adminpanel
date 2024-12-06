"use client"
import React, { useState, ChangeEvent, FormEvent } from "react"
import { ArrowLeft, ImagePlus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader } from "../loading/Loader"
import axios from "axios"

// Define type for the uploaded file
type FileInputEvent = ChangeEvent<HTMLInputElement>

// Component definition
const TripsAndToursForm: React.FC = () => {
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleImageUpload = (e: FileInputEvent) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      toast.error("No file selected or invalid file type.")
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!coverImage) {
      toast.error("A cover image is required.")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("image", coverImage)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trips-and-tours/create`,
        formData
      )
      const data = response.data

      if (data.success) {
        toast.success(data.message)
        setTitle("")
        setDescription("")
        setCoverImage(null)
        setImagePreview(null)
      } else {
        toast.error(data.message)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error saving trip/tour:", error)
      toast.error("Failed to save Trip/Tour. Please try again.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">
          Create New Trips And Tours (Category)
        </h1>
      </div>

      <Card className="w-full max-w-2xl mx-auto ">
        <CardHeader>
          <CardTitle>Trips & Tours Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 text-md">
            <div>
              <Label htmlFor="title" className="text-md">
                Title <span className="text-red-500 text-md">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="mt-2 text-md"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-md">
                Description{" "}
                <span className="text-gray-400 text-md">(optional)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter trip/tour description"
                className="mt-2 min-h-[120px] text-md"
              />
            </div>

            <div>
              <Label className="text-md">
                Cover Image <span className="text-red-500 text-md">*</span>
              </Label>
              <div className="mt-2 flex items-center space-x-4 ">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden text-md"
                  id="coverImageUpload"
                />
                <Label
                  htmlFor="coverImageUpload"
                  className="cursor-pointer text-md"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className=""
                    id="coverImageUpload"
                  />
                </Label>
                {imagePreview && (
                  <div className="w-24 h-24 rounded-md overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="flex text-white text-md items-center space-x-2"
              >
                {loading ? (
                  <div className="flex gap-2 items-center">
                    Creating... <Loader width="20px" height="20px" />
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <Save className="h-4 w-4" /> Create
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default TripsAndToursForm
