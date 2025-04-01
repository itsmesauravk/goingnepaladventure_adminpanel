"use client"
import React, { useState, useEffect } from "react"
import {
  User,
  Camera,
  Lock,
  Shield,
  Clock,
  Network,
  Key,
  FileText,
  RefreshCw,
  Save,
} from "lucide-react"

import axios from "axios"
import Cookies from "js-cookie"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

// Type definitions for the profile data
interface SecurityQuestion {
  question: string
  answer: string
}

interface ProfileData {
  fullName: string
  email: string
  phoneNumber: string | null
  role: "Admin" | "Moderator"
  isActive: boolean
  isSuspended: boolean
  lastLoginAt: string | null
  lastLoginIP: string | null
  failedLoginAttempts: number
  twoFactorEnabled: boolean
  securityQuestions: SecurityQuestion[]
  oneTimePassword: number | null
  refreshToken: string | null
  createdAt: string
  updatedAt: string
  profilePicture: string | null
}
import { sessionData } from "../utils/types"
import { toast } from "sonner"

const MyProfile: React.FC = () => {
  const router = useRouter()
  const [hideView, setHideView] = useState<Boolean>(true)
  const [isEditing, setIsEditing] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // Initial state with more robust default values
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "N/A",
    email: "N/A",
    phoneNumber: null,
    role: "Admin",
    isActive: false,
    isSuspended: false,
    lastLoginAt: null,
    lastLoginIP: null,
    failedLoginAttempts: 0,
    twoFactorEnabled: false,
    securityQuestions: [
      { question: "What is your favourite movie?", answer: "" },
      { question: "What was your first pet's name?", answer: "" },
    ],
    oneTimePassword: null,
    refreshToken: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profilePicture: null,
  })

  const { data: sessionData } = useSession()

  const session = sessionData as unknown as sessionData

  const userId = session?.user?.id

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/profile?id=${userId}&s=a`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.data.success) {
        // Merge response data with default state to ensure all fields are present
        setProfileData((prevData) => ({
          ...prevData,
          ...response.data.data,
          securityQuestions: response.data.data.securityQuestions?.length
            ? response.data.data.securityQuestions
            : prevData.securityQuestions,
        }))
      } else {
        console.log(response.data.message)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/update`,
        {
          id: userId,
          fullName: profileData.fullName,
          phoneNumber: profileData.phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (response.data.success) {
        // Refresh profile data
        getUserProfile()
        toast.success("Profile updated successfully")
      } else {
        toast.error(response.data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("An error occurred while updating your profile")
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (userId) {
      getUserProfile()
    }
  }, [userId])

  return (
    <div className="w-full bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-primary text-white p-6 flex items-center justify-between">
          <div className="flex justify-center items-center gap-4">
            <div>
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-primary" />
                )}
              </div>
            </div>
            <div className="">
              <h1 className="text-2xl font-bold">{profileData.fullName}</h1>
              <p className="text-blue-200">{profileData.role}</p>
            </div>
          </div>
          <div>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className=" text-white bg-green-600 font-semibold px-4 py-2 rounded-full shadow-md flex items-center"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <User className="mr-2 text-gray-600" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phoneNumber || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border rounded-md bg-white text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <Shield className="mr-2 text-gray-600" />
                Account Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Network className="mr-3 text-gray-600" />
                    <span>Account Status</span>
                  </div>
                  <span
                    className={`${
                      profileData.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {profileData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="mr-3 text-gray-600" />
                    <span>
                      Last Login: {profileData.lastLoginAt || "Never logged in"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Key className="mr-3 text-gray-600" />
                    <span>
                      Last Login IP: {profileData.lastLoginIP || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Account Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <RefreshCw className="mr-2 text-gray-600" />
                Account Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Failed Login Attempts</span>
                  <span className="text-red-600">
                    {profileData.failedLoginAttempts}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Refresh Token</span>
                  <span className="text-gray-500 text-sm">
                    {profileData.refreshToken ? "Available" : "Not Set"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
