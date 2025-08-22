'use client'

import { Variants } from 'motion/react'

// 페이지 전환 애니메이션 variants
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

// 스크롤 기반 애니메이션 variants
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

// 카드 스태거 애니메이션
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

// 모달/드로어 애니메이션
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

// 드로어 슬라이드업
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

// 사이드바 슬라이드
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

// 탭 전환 애니메이션
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

// 알림/토스트 애니메이션
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

// 리스트 아이템 등장 애니메이션
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

// 로딩 스켈레톤 애니메이션
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

// 오류 상태 애니메이션
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

// 성공 상태 애니메이션
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

// 복합 페이지 레이아웃 애니메이션
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

// 섹션별 애니메이션 (헤더, 사이드바, 메인)
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

// 검색 결과 애니메이션
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

// 스크롤 트리거 애니메이션 설정
export const scrollAnimationSettings = {
  threshold: 0.1,
  triggerOnce: true,
  rootMargin: "-50px 0px"
}

// 페이지 전체 전환 컨테이너
export const pageTransitionSettings = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
}

// 사전정의된 easing 함수들
export const easingFunctions = {
  easeInOut: [0.4, 0.0, 0.2, 1],
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  spring: { type: "spring", stiffness: 300, damping: 30 },
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  snappy: { type: "spring", stiffness: 500, damping: 25 }
}

// 애니메이션 지연 계산 함수
export const calculateStaggerDelay = (index: number, baseDelay: number = 0.1, maxDelay: number = 1) => {
  return Math.min(index * baseDelay, maxDelay)
}

// 화면 크기별 애니메이션 설정
export const getResponsiveAnimation = (isMobile: boolean) => ({
  initial: isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: isMobile 
    ? { duration: 0.3, ease: "easeOut" }
    : { duration: 0.4, ease: "easeOut", type: "spring", stiffness: 300 }
})

// 프리셋 애니메이션 조합
export const presetAnimations = {
  // 카드 호버 효과
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.05, 
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }
  },
  
  // 버튼 클릭 효과
  buttonTap: {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 }
  },
  
  // 로딩 펄스
  loadingPulse: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity
    }
  },
  
  // 알림 배지 바운스
  notificationBounce: {
    scale: [1, 1.3, 1],
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}