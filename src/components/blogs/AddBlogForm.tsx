"use client"
import React, { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageUp, Save, ArrowLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"

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

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !description.trim() || !image) {
      toast.error("Please fill all fields")
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({ title, image, description })
      toast.success("Blog post created successfully")

      // Reset form
      setTitle("")
      setDescription("")
      setImage(null)
      setImagePreview(null)
    } catch (error) {
      toast.error("Failed to create blog post")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }, [title, description, image, onSubmit])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link
          href="/blogs"
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="mr-2" /> Back to Blogs
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Create Blog Post</h1>
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
              onClick={handleSubmit}
              disabled={!title || !description || !image || isSubmitting}
              className="w-full bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Save className="mr-2" />
              {isSubmitting ? "Creating..." : "Create Blog Post"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddBlogForm
