"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"

const steps = [
  {
    number: "1",
    title: "Add your site and get a unique script",
    description: "Sign up and create a new site in seconds. We'll generate a unique tracking script just for you.",
  },
  {
    number: "2",
    title: "Paste it before your </head> tag",
    description: "Copy the one-line script and add it to your website. Works with any platform or framework.",
  },
  {
    number: "3",
    title: "Watch real-time metrics roll in",
    description: "That's it! Your dashboard will start showing visitor data immediately. No configuration needed.",
  },
]

export function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  
  // Full script text for typewriter effect
  const fullScriptText = `<script async defer src="https://microlytics.app/m.js"\ndata-site="YOUR_SITE_ID"></script>`
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(false)
  
  // Calculate typing speed: 60 WPM = 300 characters per minute = 5 chars per second = 200ms per character
  const typingSpeed = 100 // milliseconds per character
  
  // Typing animation effect
  useEffect(() => {
    if (hoveredStep === 1) { // Step 2 (index 1)
      setIsTyping(true)
      setTypedText("")
      setShowCursor(true)
      
      let currentIndex = 0
      const typeInterval = setInterval(() => {
        if (currentIndex < fullScriptText.length) {
          setTypedText(fullScriptText.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
        }
      }, typingSpeed)
      
      return () => clearInterval(typeInterval)
    } else {
      setTypedText("")
      setIsTyping(false)
      setShowCursor(false)
    }
  }, [hoveredStep, fullScriptText, typingSpeed])

  // Helper function to render syntax-highlighted text
  const renderHighlightedText = (text: string) => {
    const parts = []
    let currentIndex = 0
    
    // Split by different syntax elements
    const regex = /(<script|async|defer|src=|data-site=|"[^"]*"|>\s*<\/script>)/g
    let match
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before match
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index)
        if (beforeText) {
          parts.push({ text: beforeText, color: 'text-gray-300' })
        }
      }
      
      // Add the matched part with appropriate color
      const matchText = match[0]
      let color = 'text-gray-300' // default
      
      if (matchText === '<script' || matchText.includes('</script>')) {
        color = 'text-blue-400'
      } else if (matchText === 'async' || matchText === 'defer') {
        color = 'text-violet-400'
      } else if (matchText === 'src=' || matchText === 'data-site=') {
        color = 'text-blue-400'
      } else if (matchText.startsWith('"') && matchText.endsWith('"')) {
        color = 'text-green-400'
      }
      
      parts.push({ text: matchText, color })
      currentIndex = match.index + matchText.length
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex)
      if (remainingText) {
        parts.push({ text: remainingText, color: 'text-gray-300' })
      }
    }
    
    return parts.map((part, index) => (
      <span key={index} className={part.color}>
        {part.text}
      </span>
    ))
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Heading */}
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Get started in 3 simple steps
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              No complex setup, no configuration files, no headaches. Just add one line of code and you&apos;re done.
            </p>
          </div>

          {/* Right side - Step cards */}
          <div className="space-y-5">
            {/* Step 1 */}
            <Card 
              className={`glass border-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer ${
                hoveredStep === 0 ? 'transform scale-105 shadow-2xl shadow-blue-500/20' : ''
              }`}
              onMouseEnter={() => setHoveredStep(0)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg glow">
                    {steps[0].number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-white">{steps[0].title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{steps[0].description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 with integrated script */}
            <Card 
              className={`glass border-white/20 hover:border-white/30 transition-all duration-150 cursor-pointer ${
                hoveredStep === 1 ? 'transform scale-105 shadow-2xl shadow-blue-500/20' : ''
              }`}
              onMouseEnter={() => setHoveredStep(1)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg glow">
                    {steps[1].number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-white">{steps[1].title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{steps[1].description}</p>
                  </div>
                </div>
                
                {/* Code snippet with typing animation */}
                <div className={`bg-black/20 rounded-lg border border-white/10 overflow-hidden transition-all duration-300 ${
                  hoveredStep === 1 ? 'transform scale-105 shadow-lg shadow-blue-500/20' : ''
                }`}>
                  <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 px-3 py-2 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-300">index.html</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                    </div>
                  </div>
                  <div className="p-3 font-mono text-xs">
                    <div className="text-gray-500">{"<head>"}</div>
                    <div className="pl-3 text-gray-300 flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 whitespace-pre-wrap">
                        {hoveredStep === 1 ? (
                          <div>
                            {renderHighlightedText(typedText)}
                            {showCursor && (
                              <span className="text-blue-400 blink-cursor">|</span>
                            )}
                          </div>
                        ) : (
                          <>
                            <span className="text-blue-400">{"<script "}</span>
                            <span className="text-violet-400">async defer</span>
                            <span className="text-blue-400">{" src="}</span>
                            <span className="text-green-400">&ldquo;https://microlytics.app/m.js&rdquo;</span>
                            <br />
                            <span className="text-blue-400">data-site=</span>
                            <span className="text-green-400">&ldquo;YOUR_SITE_ID&rdquo;</span>
                            <span className="text-blue-400">{"></script>"}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-500">{"</head>"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card 
              className={`glass border-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer ${
                hoveredStep === 2 ? 'transform scale-105 shadow-2xl shadow-blue-500/20' : ''
              }`}
              onMouseEnter={() => setHoveredStep(2)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg glow">
                    {steps[2].number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-white">{steps[2].title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{steps[2].description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
