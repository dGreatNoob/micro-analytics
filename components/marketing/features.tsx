"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Code } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const features = [
  {
    icon: Shield,
    title: "Privacy-First by Design",
    description:
      "We don't track users across sites. 100% GDPR-compliant. No cookies, no fingerprinting, no personal data collection.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description:
      "Real-time dashboards with zero-lag pageviews. See what's happening on your site right now, not hours later.",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description:
      "One-line install snippet. Works with any stack — React, Vue, WordPress, static sites. Simple REST API included.",
  },
]

export function Features() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className="w-full h-full relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance text-white">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-lg text-gray-300 text-pretty leading-relaxed">
            Microlytics gives you the essential analytics you need without the complexity, tracking, or privacy concerns
            of traditional tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`glass border-white/20 hover:border-blue-400/50 transition-all duration-500 glow-hover ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center mb-4 border border-white/10">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
