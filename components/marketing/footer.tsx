import Link from "next/link"
import { Twitter, Github } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 glass relative">
      <div className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <Image 
                    src="/app.png" 
                    alt="Microlytics Logo" 
                    width={20} 
                    height={20} 
                    className="h-5 w-5"
                  />
                  <span className="text-lg font-semibold text-white">Microlytics</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">Privacy-first analytics for the modern web.</p>
              </div>

          <div>
            <h3 className="font-semibold mb-2 text-white text-sm">Product</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#docs" className="text-gray-400 hover:text-white transition-colors">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="#api" className="text-gray-400 hover:text-white transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-white text-sm">Company</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-white text-sm">Legal</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="#privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400">Copyright © 2025 Microlytics.</p>
          <div className="flex gap-4">
            <Link href="#twitter" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#github" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
        </div>
      </div>
    </footer>
  )
}
