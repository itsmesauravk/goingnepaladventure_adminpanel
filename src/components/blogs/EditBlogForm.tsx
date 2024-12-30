"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { Editor as TinyMCEEditor } from "tinymce"
import { Editor } from "@tinymce/tinymce-react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

// UI Components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Icons
import { ImageUp, Save, Plus, X, Link } from "lucide-react"
import { FaArrowLeft } from "react-icons/fa6"

// Types
interface BlogLink {
  text: string
  url: string
}

interface BlogPostProps {
  onSubmit?: (blogData: {
    title: string
    image: File | null
    description: string
    links: BlogLink[]
  }) => Promise<void> | void
}

const EditBlogForm: React.FC<BlogPostProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [links, setLinks] = useState<BlogLink[]>([{ text: "", url: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [blogId, setBlogId] = useState<string | null>(null)
  // const [isClient, setIsClient] = useState(false)
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const route = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

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

  const slug = useParams().slug as string

  const handleAddLink = () => {
    setLinks([...links, { text: "", url: "" }])
  }

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index)
    setLinks(newLinks.length > 0 ? newLinks : [{ text: "", url: "" }])
  }

  const handleLinkChange = (
    index: number,
    field: keyof BlogLink,
    value: string
  ) => {
    const newLinks = [...links]
    newLinks[index][field] = value
    setLinks(newLinks)
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setImage(null)
    setImagePreview(null)
    setLinks([{ text: "", url: "" }])

    if (editorRef.current) {
      editorRef.current.setContent("")
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getSingleBlog = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/blogs/get-blog-by-slug/${slug}`
      )

      if (response.data.success) {
        const blogData = response.data.data
        setBlogId(blogData._id)
        setTitle(blogData.title)
        setDescription(blogData.description)
        setImagePreview(blogData.blogImage)
        setLinks(blogData.links)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditBlog = async () => {
    // Validate inputs
    if (!title || !description.replace(/<[^>]*>/g, "").trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate links
    const validLinks = links.filter(
      (link) => link.text.trim() && link.url.trim()
    )

    if (!blogId) {
      toast.error("Cannot find blog post to update, try reloading the page")
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("id", blogId)
      formData.append("title", title)
      formData.append("description", description)
      formData.append("links", JSON.stringify(validLinks))

      // Only append image if a new image is selected
      if (image) {
        formData.append("image", image as Blob)
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/blogs/edit-blog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.data.success) {
        toast.success(response.data.message || "Blog post updated successfully")
        route.push("/blogs")
      } else {
        toast.error(response.data.message || "Failed to update blog post")
      }
    } catch (error: any) {
      console.error("Error updating blog:", error)
      toast.error(error.response?.data?.message || "Failed to update blog post")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    getSingleBlog()
  }, [slug])

  // if (!isClient) return null

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
          <h1 className="text-3xl font-bold">Edit Blog - {title} </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="w-full space-y-6">
          {/* Previous sections remain the same (title, image, description) */}
          {/* Title Input */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Blog Title</Label>
            <Input
              placeholder="Enter Blog Title"
              value={title}
              required
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
                ref={fileInputRef}
                required
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
                <div className="flex items-center space-x-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-52 h-40 object-cover rounded-md border-2 border-primary/30"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* TinyMCE Editor */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Blog Content</Label>
            <Editor
              apiKey={
                process.env.NEXT_PUBLIC_TINYMCE_API_KEY 
              }
              onInit={(evt, editor) => {
                editorRef.current = editor
              }}
              initialValue={description}
              onEditorChange={(content) => setDescription(content)}
              init={{
                height: 300,
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

          {/* New Links Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold flex items-center">
              <Link className="mr-2" /> Related Links
            </Label>
            {links.map((link, index) => (
              <div key={index} className="flex space-x-2 items-center">
                <Input
                  placeholder="Link Text"
                  value={link.text}
                  onChange={(e) =>
                    handleLinkChange(index, "text", e.target.value)
                  }
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) =>
                    handleLinkChange(index, "url", e.target.value)
                  }
                  className="flex-1"
                  disabled={isSubmitting}
                />
                {links.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveLink(index)}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={handleAddLink}
              disabled={isSubmitting}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Another Link
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleEditBlog}
            disabled={isSubmitting}
            className="w-full bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Save className="mr-2" />
            {isSubmitting
              ? "Updating Post, please wait..."
              : "Update Blog Post"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditBlogForm
