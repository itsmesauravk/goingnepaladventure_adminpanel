"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { Editor as TinyMCEEditor } from "tinymce"
import { Editor } from "@tinymce/tinymce-react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// UI Components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Icons
import { ImageUp, Save } from "lucide-react"
import { FaArrowLeft } from "react-icons/fa6"

// Types
interface BlogPostProps {
  onSubmit?: (blogData: {
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
  const [isClient, setIsClient] = useState(false) // To check if we're in the client
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const route = useRouter()

  useEffect(() => {
    setIsClient(true) // Enable rendering dynamic elements only on the client
  }, [])

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
    const editorContent = editorRef.current?.getContent() || ""
    const plainTextDescription = editorContent.replace(/<[^>]*>/g, "").trim()

    if (!title.trim() || !plainTextDescription || !image) {
      return toast.error("Please fill all fields")
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", editorContent)
      formData.append("image", image)

      if (onSubmit) {
        await onSubmit({ title, image, description: editorContent })
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/blogs/add-blog`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )

        if (response.data.success) {
          toast.success(response.data.message)
          resetForm()
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      toast.error("Failed to create blog post")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setImage(null)
    setImagePreview(null)

    if (editorRef.current) {
      editorRef.current.setContent("")
    }
  }

  if (!isClient) return null // Avoid rendering until on the client

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-primary text-white p-6 flex items-center justify-between rounded-md">
        <div className="container mx-auto flex items-center space-x-4">
          <button
            onClick={() => route.back()}
            className="hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Add New Blog</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="w-full space-y-6">
          {/* Title Input */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Blog Title</Label>
            <Input
              placeholder="Enter Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg"
              disabled={isSubmitting}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Cover Image</Label>
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
          </div>

          {/* TinyMCE Editor */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Blog Content</Label>
            <Editor
              apiKey="3o1sg5ivlfql4w6odven9ndmucyy0xbtv42n11e7tbn8whp6"
              onInit={(evt, editor) => {
                editorRef.current = editor
              }}
              initialValue="<p>Write your blog content here...</p>"
              onEditorChange={(content) => setDescription(content)}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleAddBlog}
            disabled={
              !title ||
              !description.replace(/<[^>]*>/g, "").trim() ||
              !image ||
              isSubmitting
            }
            className="w-full bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Save className="mr-2" />
            {isSubmitting
              ? "Uploading Post, please wait..."
              : "Create Blog Post"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddBlogForm
