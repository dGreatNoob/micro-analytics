"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulate login validation
      if (email === "demo@example.com" && password === "password") {
        login("demo-token") // Set auth token
        router.push(callbackUrl)
      } else {
        setError("Invalid email or password.")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen w-full animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Back to home link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      {/* Login form */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-2xl p-8 glow-hover">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Microlytics
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-200">Sign in to your account to continue</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-background/50 border-border/50 focus:border-blue-400/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-background/50 border-border/50 focus:border-blue-400/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white glow disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-gray-300">Or continue with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="bg-background/50 border-border/50 hover:bg-background/70">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="bg-background/50 border-border/50 hover:bg-background/70">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              GitHub
            </Button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-200 mt-6">
            {"Don't have an account? "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-300 mb-3">Trusted by 10,000+ developers</p>
          <div className="flex items-center justify-center gap-6 text-gray-200">
            <div className="text-xs">🔒 SSL Encrypted</div>
            <div className="text-xs">✓ GDPR Compliant</div>
            <div className="text-xs">⚡ SOC 2 Certified</div>
          </div>
        </div>
      </div>
    </div>
  )
}
