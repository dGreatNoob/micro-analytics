"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const testimonials = [
  {
    quote: "Simple, fast, and respects my users' privacy. Exactly what I needed.",
    author: "Alex Chen",
    role: "Indie Developer",
    avatar: "/images/developer-working.png",
  },
  {
    quote: "Replaced Google Analytics in one click. The dashboard is beautiful and loads instantly.",
    author: "Sarah Martinez",
    role: "SaaS Founder",
    avatar: "/images/visionary-leader.png",
  },
  {
    quote: "Finally, analytics that don't slow down my site. The API is a game-changer.",
    author: "James Wilson",
    role: "Content Creator",
    avatar: "/images/the-creator.png",
  },
]

export function Testimonials() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  })

  return (
    <div className="w-full h-full flex items-center justify-center" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance text-white">
            Loved by developers and creators
          </h2>
          <p className="text-lg text-gray-300 text-pretty leading-relaxed">
            Join thousands of indie developers and small businesses who trust Microlytics.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.15 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <Card className="glass border-white/20 hover:border-blue-400/50 transition-all duration-300 h-full">
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
