"use client"
import React, { useState, ChangeEvent, useEffect } from "react"
import {
  User,
  Camera,
  Edit,
  Save,
  Lock,
  Shield,
  Clock,
  Network,
  Key,
  FileText,
  RefreshCw,
} from "lucide-react"

import axios from "axios"
import Cookies from "js-cookie"

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

// Type for input field props
interface InputFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  type?: string
}

const MyProfile: React.FC = () => {
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
      { question: "What is your mother's maiden name?", answer: "" },
      { question: "What was your first pet's name?", answer: "" },
    ],
    oneTimePassword: null,
    refreshToken: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profilePicture: null,
  })

  const token = Cookies.get("token")

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/profile?s=a`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  // Edit mode state
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // Temporary state for editing
  const [editedData, setEditedData] = useState<ProfileData>({ ...profileData })

  // Handle input changes during editing
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle security question changes
  const handleSecurityQuestionChange = (
    index: number,
    field: keyof SecurityQuestion,
    value: string
  ) => {
    const updatedQuestions = [...(editedData.securityQuestions || [])]
    // Ensure the question exists before modifying
    if (!updatedQuestions[index]) {
      updatedQuestions[index] = { question: "", answer: "" }
    }
    updatedQuestions[index][field] = value
    setEditedData((prev) => ({
      ...prev,
      securityQuestions: updatedQuestions,
    }))
  }

  // Save changes handler
  const handleSaveChanges = () => {
    console.log("Saving Profile Data:", editedData)

    // Update profile data
    setProfileData(editedData)

    // Exit edit mode
    setIsEditing(false)
  }

  // Toggle switches
  const toggleSwitch = (field: keyof ProfileData) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  useEffect(() => {
    if (token) {
      getUserProfile()
    }
  }, [token])

  return (
    <div className="w-full bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-primary text-white p-6 flex items-center">
          <div className="relative">
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
            <button
              className="absolute bottom-0 right-0 bg-white text-primary p-2 rounded-full shadow-md"
              onClick={() => {
                /* Implement profile picture upload */
              }}
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold">{profileData.fullName}</h1>
            <p className="text-blue-200">{profileData.role}</p>
          </div>
          <button
            className="ml-auto bg-white text-blue-600 px-4 py-2 rounded-md flex items-center"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
            <Edit className="ml-2 w-5 h-5" />
          </button>
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
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={isEditing ? editedData.fullName : profileData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={isEditing ? editedData.email : profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <InputField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={
                    isEditing
                      ? editedData.phoneNumber || ""
                      : profileData.phoneNumber || "Not provided"
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <Shield className="mr-2 text-gray-600" />
                Account Security
              </h2>
              <div className="space-y-4">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="mr-3 text-gray-600" />
                    <span>Two-Factor Authentication</span>
                  </div>
                  {isEditing ? (
                    <button
                      onClick={() => toggleSwitch("twoFactorEnabled")}
                      className={`toggle-switch ${
                        editedData.twoFactorEnabled
                          ? "bg-green-500"
                          : "bg-gray-300"
                      } relative inline-block w-12 h-6 rounded-full`}
                    >
                      <span
                        className={`dot absolute top-1 ${
                          editedData.twoFactorEnabled ? "right-1" : "left-1"
                        } w-4 h-4 bg-white rounded-full transition-all`}
                      />
                    </button>
                  ) : (
                    <span
                      className={`${
                        profileData.twoFactorEnabled
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {profileData.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </span>
                  )}
                </div>

                {/* Account Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Network className="mr-3 text-gray-600" />
                    <span>Account Status</span>
                  </div>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleSwitch("isActive")}
                        className={`toggle-switch ${
                          editedData.isActive ? "bg-green-500" : "bg-gray-300"
                        } relative inline-block w-12 h-6 rounded-full`}
                      >
                        <span
                          className={`dot absolute top-1 ${
                            editedData.isActive ? "right-1" : "left-1"
                          } w-4 h-4 bg-white rounded-full transition-all`}
                        />
                      </button>
                      <span>{editedData.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  ) : (
                    <span
                      className={`${
                        profileData.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {profileData.isActive ? "Active" : "Inactive"}
                    </span>
                  )}
                </div>

                {/* Login Information */}
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

            {/* Security Questions */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <FileText className="mr-2 text-gray-600" />
                Security Questions
              </h2>
              {(profileData.securityQuestions || []).length > 0 ? (
                profileData.securityQuestions.map((sq, index) => (
                  <div key={index} className="space-y-2 mb-4">
                    <InputField
                      label={`Security Question ${index + 1}`}
                      name={`securityQuestion-${index}`}
                      value={
                        isEditing
                          ? editedData.securityQuestions?.[index]?.question ||
                            ""
                          : sq.question
                      }
                      onChange={(e) =>
                        handleSecurityQuestionChange(
                          index,
                          "question",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                    />
                    <InputField
                      label="Answer"
                      name={`securityAnswer-${index}`}
                      type="password"
                      value={
                        isEditing
                          ? editedData.securityQuestions?.[index]?.answer || ""
                          : ""
                      }
                      onChange={(e) =>
                        handleSecurityQuestionChange(
                          index,
                          "answer",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No security questions set</p>
              )}
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

          {/* Save Changes Button */}
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
              >
                Save Changes
                <Save className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Reusable Input Field Component
const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  type = "text",
}) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md ${
        disabled ? "bg-gray-100 text-gray-500" : "bg-white"
      }`}
    />
  </div>
)

export default MyProfile
