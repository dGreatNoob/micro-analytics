"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type AuthMode = "signin" | "signup"

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGitHubLoading, setIsGitHubLoading] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    
    if (mode === "signup") {
      if (!formData.name) {
        newErrors.name = "Name is required"
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
      
      if (!formData.terms) {
        newErrors.terms = "You must accept the terms and conditions"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      if (mode === "signup") {
        // Handle signup
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          setErrors({ general: errorData.error || "Failed to create account" })
          return
        }

        // After successful signup, sign them in
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })
        
        if (result?.error) {
          setErrors({ general: "Account created but failed to sign in" })
        } else {
          window.location.href = "/dashboard"
        }
      } else {
        // Handle signin
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })
        
        if (result?.error) {
          setErrors({ general: "Invalid credentials" })
        } else {
          window.location.href = "/dashboard"
        }
      }
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    setIsGoogleLoading(true)
    signIn("google", { callbackUrl: "/dashboard" })
  }

  const handleGitHubAuth = () => {
    setIsGitHubLoading(true)
    signIn("github", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="min-h-screen w-full animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <Card className="relative w-full max-w-md glass border-white/20 shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center items-center gap-3 mb-2">
            <Image 
              src="/app.png" 
              alt="Microlytics Logo" 
              width={48} 
              height={48} 
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold text-white tracking-tight">Microlytics</span>
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {mode === "signin" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              {mode === "signin" 
                ? "Sign in to access your analytics dashboard" 
                : "Join thousands of privacy-focused developers"
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          {/* Mode Toggle */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "signin"
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading || isGoogleLoading || isGitHubLoading}
              className="h-11 bg-white/90 text-gray-900 hover:bg-white hover:shadow-lg disabled:opacity-50 transition-all duration-300 hover-scale"
              size="lg"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
            </Button>

            <Button
              onClick={handleGitHubAuth}
              disabled={isLoading || isGoogleLoading || isGitHubLoading}
              className="h-11 bg-gray-900/90 text-white hover:bg-gray-900 hover:shadow-lg disabled:opacity-50 transition-all duration-300 hover-scale"
              size="lg"
            >
              {isGitHubLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {errors.general}
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword}</p>}
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) => handleInputChange("terms", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border border-white/20 bg-white/10 focus:ring-2 focus:ring-blue-400/50 text-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/legal/terms" className="text-blue-400 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/legal/privacy" className="text-blue-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && <p className="text-red-400 text-xs">{errors.terms}</p>}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading || isGitHubLoading}
              className="w-full h-11 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-medium transition-all duration-300 hover-scale disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "signin" ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                mode === "signin" ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1"
            >
              <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

