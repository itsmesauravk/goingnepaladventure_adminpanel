"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import React, { useState } from "react"

// Page Component
const page = () => {
  // State to manage the email input and loading state
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Handle the change of the email input
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter a valid email address")
      return
    }
    setLoading(true)
    setError("")
    setMessage("We have sent password reset instructions to your email.")

    // Simulate the API call
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="forgot-password-container w-full">
      <div className="header">
        <h2>Forgot Password?</h2>
        <p>Enter your email address to search for your account.</p>
      </div>

      <div className="form">
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={handleEmailChange}
          className="email-input "
        />

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <div className="buttons mt-6">
          <Link href="/login">
            <Button
              className="bg-gray-400 text-white hover:bg-gray-500"
              disabled={loading}
            >
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-white"
          >
            {loading ? "Sending..." : "Search"}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .forgot-password-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f9f9f9;
          padding: 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        h2 {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        p {
          font-size: 16px;
          color: #666;
        }

        .form {
          width: 100%;
          max-width: 400px;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .email-input {
          margin-bottom: 20px;
        }

        .error-message {
          color: red;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .success-message {
          color: green;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        Button {
          width: 100%;
          margin-top: 10px;
        }

        Button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default page
