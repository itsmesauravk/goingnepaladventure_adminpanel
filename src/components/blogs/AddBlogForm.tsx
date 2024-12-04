"use client"
import React, { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageUp, Save, ArrowLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"
import axios from "axios"
import { FaArrowLeft } from "react-icons/fa6"
import { useRouter } from "next/navigation"

interface BlogPostProps {
  onSubmit: (blogData: {
    title: string
    image: File | null
    description: string
  }) => Promise<void> | void
}

const AddBlogForm: React.FC<BlogPostProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const route = useRouter()

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image must be smaller than 5MB")
          return
        }

        setImage(file)
        setImagePreview(URL.createObjectURL(file))
      }
    },
    []
  )

  const handleAddBlog = async () => {
    if (!title.trim() || !description.trim() || !image) {
      return toast.error("Please fill all fields")
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("image", image)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/blogs/add-blog`,
        formData
      )

      console.log(response)

      if (response.data.success) {
        toast.success(response.data.message)
        setTitle("")
        setDescription("")
        setImage(null)
        setImagePreview(null)
        setIsSubmitting(false)
      } else {
        toast.error(response.data.message)
        setIsSubmitting(false)
      }
    } catch (error) {
      toast.error("Failed to create blog post")
      setIsSubmitting(false)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => route.back()}
            className="hover:bg-teal-700 p-2 rounded-full transition-colors"
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Add New Tour</h1>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-6">
            <Input
              placeholder="Enter Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg"
              disabled={isSubmitting}
            />

            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={isSubmitting}
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center cursor-pointer bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ImageUp className="mr-2" />
                Upload Cover Image
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-52 h-40 object-cover rounded-md border-2 border-primary/30"
                />
              )}
            </div>

            <Textarea
              placeholder="Write your blog content here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-64 resize-y text-base"
              disabled={isSubmitting}
            />

            <Button
              onClick={handleAddBlog}
              disabled={!title || !description || !image || isSubmitting}
              className="w-full bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Save className="mr-2" />
              {isSubmitting
                ? "Uploading Post, please wait..."
                : "Create Blog Post"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddBlogForm
