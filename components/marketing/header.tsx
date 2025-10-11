"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false) // Close mobile menu after navigation
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10 shadow-lg"
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
              <button
                onClick={() => scrollToSection("section-0")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Image 
                  src="/app_icon.png" 
                  alt="Microlytics Logo" 
                  width={32} 
                  height={32} 
                  className="h-8 w-8 sm:h-9 sm:w-9"
                />
                <span className="text-lg sm:text-xl font-semibold text-white">Microlytics</span>
              </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => scrollToSection("section-1")}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("section-2")}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("section-4")}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </button>
            <Link href="#docs" className="text-sm text-gray-300 hover:text-white transition-colors">
              Docs
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-600 hover:to-violet-700 glow-hover"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-4">
              <nav className="flex flex-col space-y-3">
                <button
                  onClick={() => scrollToSection("section-1")}
                  className="text-left text-sm text-gray-300 hover:text-white transition-colors py-2"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("section-2")}
                  className="text-left text-sm text-gray-300 hover:text-white transition-colors py-2"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("section-4")}
                  className="text-left text-sm text-gray-300 hover:text-white transition-colors py-2"
                >
                  Pricing
                </button>
                <Link href="#docs" className="text-sm text-gray-300 hover:text-white transition-colors py-2">
                  Docs
                </Link>
              </nav>
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                <Link href="/auth/signin">
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10 justify-start">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-600 hover:to-violet-700">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
