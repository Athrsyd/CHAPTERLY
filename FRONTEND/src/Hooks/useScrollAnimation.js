// Custom hook untuk reuse scroll animation logic
import { useInView } from 'motion/react'
import { useRef } from 'react'

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px', ...options })
  return { ref, isInView }
}

export default useScrollAnimation
