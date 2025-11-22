'use client'

import { Variants } from 'motion/react'

// Page transition animation variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1], // Custom easing
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.4, 0.0, 1, 1]
    }
  }
}

// Scroll-based animation variants
export const scrollVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

// Card stagger animation
export const cardStaggerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
}

export const cardChildVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateX: 15,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
}

// Modal/drawer animation
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
}

// Drawer slide-up
export const drawerVariants: Variants = {
  hidden: {
    y: "100%",
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
}

// Sidebar slide
export const sidebarVariants: Variants = {
  closed: {
    x: "-100%",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

// Tab transition animation
export const tabVariants: Variants = {
  inactive: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2
    }
  },
  active: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

// Notification/toast animation
export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 300,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    x: 300,
    scale: 0.8,
    transition: {
      duration: 0.2
    }
  }
}

// List item appearance animation
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.95
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
}

// Loading skeleton animation
export const skeletonVariants: Variants = {
  loading: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
}

// Error state animation
export const errorVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  },
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.4
    }
  }
}

// Success state animation
export const successVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15
    }
  }
}

// Composite page layout animation
export const layoutVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
      delayChildren: 0.1,
      when: "beforeChildren"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      when: "afterChildren"
    }
  }
}

// Animation by section (header, sidebar, main)
export const headerVariants: Variants = {
  hidden: {
    y: -50,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

export const mainContentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
}

// Search result animation
export const searchResultVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    height: "auto",
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    scale: 0.8,
    transition: {
      duration: 0.2
    }
  }
}

// Scroll trigger animation settings
export const scrollAnimationSettings = {
  threshold: 0.1,
  triggerOnce: true,
  rootMargin: "-50px 0px"
}

// Full page transition container
export const pageTransitionSettings = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
}

// Predefined easing functions
export const easingFunctions = {
  easeInOut: [0.4, 0.0, 0.2, 1],
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  spring: { type: "spring", stiffness: 300, damping: 30 },
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  snappy: { type: "spring", stiffness: 500, damping: 25 }
}

// Animation delay calculation function
export const calculateStaggerDelay = (index: number, baseDelay: number = 0.1, maxDelay: number = 1) => {
  return Math.min(index * baseDelay, maxDelay)
}

// Animation settings by screen size
export const getResponsiveAnimation = (isMobile: boolean) => ({
  initial: isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: isMobile 
    ? { duration: 0.3, ease: "easeOut" }
    : { duration: 0.4, ease: "easeOut", type: "spring", stiffness: 300 }
})

// Preset animation combinations
export const presetAnimations = {
  // Card hover effect
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.05, 
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }
  },
  
  // Button click effect
  buttonTap: {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 }
  },
  
  // Loading pulse
  loadingPulse: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity
    }
  },
  
  // Notification badge bounce
  notificationBounce: {
    scale: [1, 1.3, 1],
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}