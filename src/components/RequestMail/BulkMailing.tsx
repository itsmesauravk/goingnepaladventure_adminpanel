"use client"
import React, { useState, useMemo, useEffect } from "react"
import {
  Search,
  ArrowLeft,
  User,
  Mail,
  Paperclip,
  X,
  CheckSquare,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { useRouter } from "next/navigation"
import axios from "axios"

interface User {
  _id: string
  userName: string
  userEmail: string
  userAddress: string
  userCountry: string
}

// Dummy user data
const DUMMY_USERS = [
  {
    _id: "1",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    userAddress: "Admin",
    userCountry: "Nepal",
  },
  {
    _id: "2",
    userName: "Jane Smith",
    userEmail: "jane.smith@example.com",
    userAddress: "Manager",
    userCountry: "Nepal",
  },
  {
    _id: "3",
    userName: "Mike Johnson",
    userEmail: "mike.johnson@example.com",
    userAddress: "Sales",
    userCountry: "Nepal",
  },
  {
    _id: "4",
    userName: "Emily Brown",
    userEmail: "emily.brown@example.com",
    userAddress: "Support",
    userCountry: "Nepal",
  },
  {
    _id: "5",
    userName: "Alex Wilson",
    userEmail: "alex.wilson@example.com",
    userAddress: "Marketing",
    userCountry: "Nepal",
  },
]

const BulkMailing = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [users, setUsers] = useState<User[]>([])

  // New loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const router = useRouter()

  // Filtered users based on search
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user?.userName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        user?.userEmail?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        user?.userAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.userCountry?.toLowerCase()?.includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, users])

  // Get users
  const getUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/users/get`
      )
      const data = response.data
      if (data.success) {
        setUsers(data.data)
      } else {
        setError(data.message || "Failed to fetch users")
      }
    } catch (error) {
      console.error(error)
      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "An error occurred"
          : "An unexpected error occurred"
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  // Remove selected user
  const removeSelectedUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId))
  }

  // Handle file attachment
  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // Send email handler
  const handleSendEmail = async () => {
    // Validation
    if (selectedUsers.length === 0) {
      setEmailError("Please select at least one recipient")
      return
    }

    if (!subject.trim()) {
      setEmailError("Please enter a subject")
      return
    }

    if (!message.trim()) {
      setEmailError("Please enter a message")
      return
    }

    // Reset previous email error
    setEmailError(null)
    setIsEmailSending(true)

    try {
      // Collect selected user details
      const recipients = users.filter((user) =>
        selectedUsers.includes(user._id)
      )

      // Simulate email sending (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Sending email to:", recipients)
      console.log("Subject:", subject)
      console.log("Message:", message)
      console.log("Attachments:", attachments)

      // Reset form
      //   setSelectedUsers([])
      //   setSubject("")
      //   setMessage("")
      //   setAttachments([])

      // Optional: Show success toast or alert
      alert("Emails sent successfully!")
    } catch (error) {
      console.error("Email sending failed:", error)
      setEmailError("Failed to send emails. Please try again.")
    } finally {
      setIsEmailSending(false)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => {
            router.back()
          }}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" />
          Back to Requests and Mails
        </Button>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <Mail className="mr-3 text-blue-600" /> Bulk Mailing
        </h1>

        {/* User Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Recipients
          </label>

          {/* Search and Selection Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  <Search className="mr-2" />
                )}
                {selectedUsers.length > 0
                  ? `${selectedUsers.length} users selected`
                  : "Select users"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Select Recipients</DialogTitle>
              </DialogHeader>

              {/* Search Input */}
              <div className="mb-4">
                <Input
                  placeholder="Search users by name, email, or role"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* User List */}
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="animate-spin text-blue-600" />
                  </div>
                ) : error ? (
                  <div className="text-center text-red-600">
                    Failed to load users
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className={`flex items-center justify-between p-3 hover:bg-gray-100 rounded 
                        ${
                          selectedUsers.includes(user._id) ? "bg-blue-50" : ""
                        }`}
                    >
                      <div className="flex items-center">
                        <CheckSquare
                          className={`mr-3 cursor-pointer 
                            ${
                              selectedUsers.includes(user._id)
                                ? "text-blue-600"
                                : "text-gray-300"
                            }`}
                          onClick={() => toggleUserSelection(user._id)}
                        />
                        <div>
                          <p className="font-semibold">{user.userName}</p>
                          <p className="text-sm text-gray-500">
                            {user.userEmail}
                          </p>
                          <p className="text-xs text-gray-400">
                            {user.userAddress}, {user.userCountry}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Selected Users Display */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedUsers.map((userId) => {
                const user = users.find((u) => u._id === userId)
                return (
                  <div
                    key={userId}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full 
                      flex items-center gap-2"
                  >
                    {user?.userName}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-red-600"
                      onClick={() => removeSelectedUser(userId)}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Email Details */}
        <div className="space-y-4">
          {/* Email Error Alert */}
          {emailError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Email Error</AlertTitle>
              <AlertDescription>{emailError}</AlertDescription>
            </Alert>
          )}

          {/* Subject Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Subject
            </label>
            <Input
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <Textarea
              placeholder="Compose your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          {/* File Attachment */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Attachments
            </label>
            <div className="flex items-center">
              <Input
                type="file"
                multiple
                onChange={handleFileAttachment}
                className="w-full"
              />
            </div>

            {/* Attachment Preview */}
            {attachments.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full 
                      flex items-center gap-2"
                  >
                    <Paperclip className="w-4 h-4" />
                    {file.name}
                    <X
                      className="w-4 h-4 cursor-pointer hover:text-red-600"
                      onClick={() => removeAttachment(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendEmail}
            className="w-full mt-4 text-white"
            disabled={selectedUsers.length === 0 || isEmailSending}
          >
            {isEmailSending ? (
              <>
                <Loader2 className="mr-2 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="mr-2" /> Send Bulk Email
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BulkMailing
