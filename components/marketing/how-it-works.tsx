"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

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
  return (
    <section id="how-it-works" className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance text-white">
            Get started in 3 simple steps
          </h2>
          <p className="text-lg text-gray-300 text-pretty leading-relaxed">
            No complex setup, no configuration files, no headaches. Just add one line of code and you&apos;re done.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1 */}
          <div className="flex gap-6 items-center">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl glow">
              {steps[0].number}
            </div>
            <Card className="flex-1 glass border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{steps[0].title}</h3>
                <p className="text-gray-300 leading-relaxed">{steps[0].description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Step 2 with integrated script */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl glow mt-6">
              {steps[1].number}
            </div>
            <Card className="flex-1 glass border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{steps[1].title}</h3>
                <p className="text-gray-300 leading-relaxed mb-6">{steps[1].description}</p>
                
                {/* Code snippet integrated into step 2 */}
                <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 px-4 py-2 border-b border-white/10 flex items-center justify-between">
                    <span className="text-sm font-mono text-gray-300">index.html</span>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                      <div className="w-3 h-3 rounded-full bg-green-400/50" />
                    </div>
                  </div>
                  <div className="p-4 font-mono text-xs">
                    <div className="text-gray-500">{"<head>"}</div>
                    <div className="pl-4 text-gray-300 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-blue-400">{"<script "}</span>
                      <span className="text-violet-400">async defer</span>
                      <span className="text-blue-400">{" src="}</span>
                      <span className="text-green-400">&ldquo;https://microlytics.app/m.js&rdquo;</span>
                    </div>
                    <div className="pl-12 text-gray-300">
                      <span className="text-blue-400">data-site=</span>
                      <span className="text-green-400">&ldquo;YOUR_SITE_ID&rdquo;</span>
                      <span className="text-blue-400">{"></script>"}</span>
                    </div>
                    <div className="text-gray-500">{"</head>"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6 items-center">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl glow">
              {steps[2].number}
            </div>
            <Card className="flex-1 glass border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{steps[2].title}</h3>
                <p className="text-gray-300 leading-relaxed">{steps[2].description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
