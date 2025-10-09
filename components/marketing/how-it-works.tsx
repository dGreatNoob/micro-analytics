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
            <Card className="glass border-white/20 hover:border-white/30 transition-all">
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
            <Card className="glass border-white/20 hover:border-white/30 transition-all">
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
                
                {/* Code snippet */}
                <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
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
                      <span className="text-blue-400">{"<script "}</span>
                      <span className="text-violet-400">async defer</span>
                      <span className="text-blue-400">{" src="}</span>
                      <span className="text-green-400">&ldquo;https://microlytics.app/m.js&rdquo;</span>
                    </div>
                    <div className="pl-10 text-gray-300">
                      <span className="text-blue-400">data-site=</span>
                      <span className="text-green-400">&ldquo;YOUR_SITE_ID&rdquo;</span>
                      <span className="text-blue-400">{"></script>"}</span>
                    </div>
                    <div className="text-gray-500">{"</head>"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="glass border-white/20 hover:border-white/30 transition-all">
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
