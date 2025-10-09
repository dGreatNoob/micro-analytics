"use client"

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode, CSSProperties } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  id: string
  className?: string
  delay?: number
  style?: CSSProperties
}

export function AnimatedSection({ children, id, className = "", delay = 0, style }: AnimatedSectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: "easeOut" as const,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`w-full section-viewport ${className}`}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div variants={itemVariants} className="w-full h-full flex items-center justify-center">
        {children}
      </motion.div>
    </motion.section>
  )
}
