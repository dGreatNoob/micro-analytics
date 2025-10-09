"use client"

import { motion } from 'framer-motion'
import { useSmoothScroll } from '@/lib/smooth-scroll'

const sections = [
  { name: 'Hero', id: 0 },
  { name: 'Features', id: 1 },
  { name: 'How It Works', id: 2 },
  { name: 'Demo', id: 3 },
  { name: 'Pricing', id: 4 },
  { name: 'Testimonials', id: 5 },
  { name: 'CTA', id: 6 },
]

export function SectionNavigator() {
  const { currentSection, scrollToSection } = useSmoothScroll()

  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="relative group"
          >
            <motion.div
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                currentSection === section.id
                  ? 'bg-blue-500 border-blue-400'
                  : 'bg-transparent border-gray-400 hover:border-blue-300'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            
            {/* Section name tooltip */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/80 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap backdrop-blur-sm border border-white/10">
                {section.name}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
