"use client"
import React, { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageUp, Save, ArrowLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"
import axios from "axios"
import { useParams } from "next/navigation"

const EditBlogForm = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const param = useParams()
  const slug = param.slug

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

  const getSingleBlog = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/blogs/get-blog-by-slug/${slug}`
      )

      if (response.data.success) {
        const blogData = response.data.data
        setTitle(blogData.title)
        setDescription(blogData.description)
        setImagePreview(blogData.blogImage)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditBlog = async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/blogs/edit-blog`,
        formData
      )

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

  useEffect(() => {
    getSingleBlog()
  }, [])

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
              onClick={handleEditBlog}
              disabled={!title || !description || !image || isSubmitting}
              className="w-full bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Save className="mr-2" />
              {isSubmitting
                ? "Uploading Post, please wait..."
                : "Update Blog Post"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditBlogForm
