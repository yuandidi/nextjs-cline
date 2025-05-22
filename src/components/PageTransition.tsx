// components/PageTransition.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const createParticles = (x: number, y: number) => {
  const particles = []
  for (let i = 0; i < 30; i++) {
    particles.push({
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 10 + 5,
      speed: Math.random() * 5 + 2,
      opacity: 1
    })
  }
  return particles
}

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [particles, setParticles] = useState<any[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionComplete, setTransitionComplete] = useState(false)
  
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // 保存当前路径用于比较
  const [prevPath, setPrevPath] = useState(pathname)
  const [prevSearch, setPrevSearch] = useState(searchParams.toString())
  
  // 页面内容的引用
  const contentRef = useRef<HTMLDivElement>(null)
  
  // 存储点击位置
  const clickPositionRef = useRef<{ x: number; y: number } | null>(null)
  
  // 跟踪上一次点击时间，避免重复触发
  const lastClickTimeRef = useRef(0)
  
  // 添加点击反馈状态
  const [clickFeedback, setClickFeedback] = useState<{ x: number; y: number } | null>(null)

  // 监听页面元素加载完成
  const observeContentLoaded = useCallback(() => {
    if (!contentRef.current) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && isTransitioning) {
            setTimeout(() => {
              setTransitionComplete(true)
              setTimeout(() => {
                setIsLoading(false)
                setIsTransitioning(false)
                setParticles([])
                setTransitionComplete(false)
              }, 300)
            }, 200)
            
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    
    observer.observe(contentRef.current)
    
    setTimeout(() => {
      if (isTransitioning) {
        setTransitionComplete(true)
        setTimeout(() => {
          setIsLoading(false)
          setIsTransitioning(false)
          setParticles([])
          setTransitionComplete(false)
        }, 300)
        observer.disconnect()
      }
    }, 3000)
  }, [isTransitioning])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 忽略右键点击
      if (e.button !== 0) return
      
      // 防止双击/快速点击导致的重复触发
      const now = Date.now()
      if (now - lastClickTimeRef.current < 300) {
        return
      }
      lastClickTimeRef.current = now
      
      // 记录点击位置用于视觉反馈
      setClickFeedback({ x: e.clientX, y: e.clientY })
      
      // 短暂延迟后清除反馈，避免干扰视觉效果
      setTimeout(() => {
        setClickFeedback(null)
      }, 100)
      
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return
      
      // 允许内部链接和 hash 链接
      const isExternal = href.startsWith('http') || href.startsWith('//')
      const isSamePageHash = href.startsWith('#') && href.split('#')[0] === pathname
      
      if (isExternal && !isSamePageHash) return
      
      // 存储点击位置
      clickPositionRef.current = { x: e.clientX, y: e.clientY }
      
      // 创建粒子动画
      setParticles(createParticles(e.clientX, e.clientY))
      setIsLoading(true)
      setIsTransitioning(true)
      setTransitionComplete(false)
      
      console.log('Navigation started:', href) // 调试日志
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname])

  useEffect(() => {
    if (isTransitioning && (pathname !== prevPath || searchParams.toString() !== prevSearch)) {
      observeContentLoaded()
    }
    
    setPrevPath(pathname)
    setPrevSearch(searchParams.toString())
  }, [pathname, searchParams, isTransitioning, observeContentLoaded])

  useEffect(() => {
    if (!isLoading) return
    
    const animate = () => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + Math.cos(p.angle) * p.speed,
          y: p.y + Math.sin(p.angle) * p.speed
        }))
      )
      
      requestAnimationFrame(animate)
    }
    
    animate()
  }, [isLoading])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div 
        ref={contentRef} 
        className="min-h-screen w-full"
        style={{ opacity: isTransitioning ? 0.3 : 1, transition: 'opacity 0.3s ease' }}
      >
        {children}
      </div>
      
      {/* 点击反馈指示器 */}
      {clickFeedback && (
        <div
          className="fixed rounded-full bg-cyan-400/50 pointer-events-none"
          style={{
            left: clickFeedback.x,
            top: clickFeedback.y,
            width: 40,
            height: 40,
            transform: 'translate(-50%, -50%)',
            animation: 'clickFeedback 0.5s ease-out forwards'
          }}
        />
      )}
      
      {isLoading && (
        <div 
          className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center ${
            transitionComplete ? 'opacity-0 transition-opacity duration-300' : ''
          }`}
          style={{ pointerEvents: transitionComplete ? 'none' : 'auto' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-20 animate-pan">
            <div className="h-full w-[200%] bg-[length:50%_100%] bg-repeat-x"></div>
          </div>
          
          {/* 粒子效果 */}
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{
                left: p.x,
                top: p.y,
                width: p.radius * 2,
                height: p.radius * 2,
                transform: `translate(-50%, -50%)`,
                opacity: p.opacity
              }}
            />
          ))}
          
          <div className="text-4xl font-bold animate-hologram">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              LOADING
            </span>
            <div className="h-2 w-48 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes pan {
          0% { background-position: 0% 50%; }
          100% { background-position: -200% 50%; }
        }
        @keyframes hologram {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes clickFeedback {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        .animate-pan {
          animation: pan 6s linear infinite;
        }
        .animate-hologram {
          animation: hologram 2s linear infinite;
        }
      `}</style>
    </div>
  )
}