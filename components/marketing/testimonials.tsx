"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "Simple, fast, and respects my users' privacy. Exactly what I needed.",
    author: "Alex Chen",
    role: "Indie Developer",
    avatar: "/developer-working.png",
  },
  {
    quote: "Replaced Google Analytics in one click. The dashboard is beautiful and loads instantly.",
    author: "Sarah Martinez",
    role: "SaaS Founder",
    avatar: "/visionary-leader.png",
  },
  {
    quote: "Finally, analytics that don't slow down my site. The API is a game-changer.",
    author: "James Wilson",
    role: "Content Creator",
    avatar: "/the-creator.png",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance text-white">
            Loved by developers and creators
          </h2>
          <p className="text-lg text-gray-300 text-pretty leading-relaxed">
            Join thousands of indie developers and small businesses who trust Microlytics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass border-white/20 hover:border-blue-400/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-white/20"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
