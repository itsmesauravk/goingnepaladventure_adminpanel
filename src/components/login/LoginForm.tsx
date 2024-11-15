"use client"

import React, { useState, useEffect } from "react"

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setEmail("")
    setPassword("")
    setError("")
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation for email and password
    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }
    setError("")

    // Authentication logic here
    // Example: Call an API to authenticate the admin
    console.log("Logging in with:", { email, password })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          GNA Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
              required
            />
          </div>

          {/* Error Message */}
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full p-3 text-white bg-secondary hover:bg-primary rounded  transition-colors duration-200"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
