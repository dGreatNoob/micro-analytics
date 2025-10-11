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
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.42, 0, 0.58, 1], // Smooth ease-in-out
        staggerChildren: 0.1,
        delayChildren: delay + 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.42, 0, 0.58, 1]
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1]
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
