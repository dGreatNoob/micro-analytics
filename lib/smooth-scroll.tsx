"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface SmoothScrollContextType {
  currentSection: number
  setCurrentSection: (section: number) => void
  scrollToSection: (section: number) => void
}

const SmoothScrollContext = createContext<SmoothScrollContextType | undefined>(undefined)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const scrollToSection = (sectionIndex: number) => {
    if (isScrolling) return
    
    setIsScrolling(true)
    setCurrentSection(sectionIndex)
    
    const targetSection = document.getElementById(`section-${sectionIndex}`)
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    
    setTimeout(() => setIsScrolling(false), 1000)
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (isScrolling) return
      
      const delta = e.deltaY
      const sections = ['section-0', 'section-1', 'section-2', 'section-3', 'section-4', 'section-5', 'section-6']
      
      if (delta > 0 && currentSection < sections.length - 1) {
        scrollToSection(currentSection + 1)
      } else if (delta < 0 && currentSection > 0) {
        scrollToSection(currentSection - 1)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return
      
      const sections = ['section-0', 'section-1', 'section-2', 'section-3', 'section-4', 'section-5', 'section-6']
      
      if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        scrollToSection(currentSection + 1)
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        scrollToSection(currentSection - 1)
      }
    }

    document.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentSection, isScrolling])

  return (
    <SmoothScrollContext.Provider value={{ currentSection, setCurrentSection, scrollToSection }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext)
  if (context === undefined) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider')
  }
  return context
}
