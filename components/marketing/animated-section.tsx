"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode, CSSProperties, useRef } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  id: string
  className?: string
  delay?: number
  style?: CSSProperties
}

export function AnimatedSection({ children, id, className = "", delay = 0, style }: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  })
  
  // No parallax - keep it static

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth curved easing
        staggerChildren: 0.12,
        delayChildren: delay + 0.15
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.98,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.99
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  // Combine refs
  const setRefs = (node: HTMLElement | null) => {
    ref(node)
    if (sectionRef) {
      (sectionRef as any).current = node
    }
  }

  return (
    <motion.section
      ref={setRefs}
      id={id}
      className={`w-full section-viewport ${className}`}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      exit="exit"
    >
      <motion.div 
        variants={itemVariants} 
        className="w-full h-full flex items-center justify-center px-4"
      >
        {children}
      </motion.div>
    </motion.section>
  )
}
