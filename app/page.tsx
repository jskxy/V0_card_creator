"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Sparkles, Download, Share2, Menu, User, Star, Shield, Cpu, Box, Lightbulb } from "lucide-react"
import HistorySidebar from "@/components/HistorySidebar"
import SmartWaiting from "@/components/SmartWaiting"

interface CardData {
  id: string
  concept: string
  html: string
  timestamp: string
}

// 本地示例图片 - 使用三张高质量的示例图片
const localImages = [
  "/examples/1.png",
  "/examples/2.png",
  "/examples/3.png"
]

// 2张图片横向排列，与输入框宽度形成完美比例
const exampleImages = [
  "/examples/2.png",
  "/examples/3.png"
];

// 产品特点
const PRODUCT_FEATURES = [
  {
    icon: Shield,
    label: "无需登录",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200"
  },
  {
    icon: Star,
    label: "100% 免费",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
    borderColor: "border-amber-200"
  },
  {
    icon: Cpu,
    label: "AI 驱动",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600",
    borderColor: "border-violet-200"
  }
]

export default function HomePage() {
  const [concept, setConcept] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showSmartWaiting, setShowSmartWaiting] = useState(false)
  const [waitingProgress, setWaitingProgress] = useState(0)

  // 页面加载时检查是否有重新生成的数据
  useEffect(() => {
    const regenerateConcept = sessionStorage.getItem('regenerate-concept')
    if (regenerateConcept) {
      setConcept(regenerateConcept)
      sessionStorage.removeItem('regenerate-concept')
    }
  }, [])

  // 烟雾效果函数
  const createSmokeEffect = (x: number, y: number) => {
    // 创建主烟雾云
    const smokeCloud = document.createElement('div')
    smokeCloud.className = 'smoke-cloud'
    smokeCloud.style.left = `${x}px`
    smokeCloud.style.top = `${y}px`
    document.body.appendChild(smokeCloud)

    // 创建小粒子
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const particle = document.createElement('div')
        particle.className = 'smoke-particle'
        particle.style.left = `${x + (Math.random() - 0.5) * 40}px`
        particle.style.top = `${y + (Math.random() - 0.5) * 40}px`
        document.body.appendChild(particle)

        setTimeout(() => particle.remove(), 2500)
      }, i * 300)
    }

    setTimeout(() => smokeCloud.remove(), 3000)
  }

  // 鼠标移动事件处理
  useEffect(() => {
    let lastSmokeTime = 0
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastSmokeTime > 200) { // 限制烟雾生成频率
        createSmokeEffect(e.clientX, e.clientY)
        lastSmokeTime = now
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleGenerate = async () => {
    if (!concept.trim() || concept.length > 60) return

    setIsGenerating(true)
    setShowSmartWaiting(true) // 立即显示智能等待界面
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          concept: concept.trim()
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        // 显示服务器返回的具体错误信息
        const errorMessage = data.error || `HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      // 创建新卡片数据
      const newCard: CardData = {
        id: Date.now().toString(),
        concept: data.concept,
        html: data.html,
        timestamp: data.timestamp,
      }

      // 保存到localStorage
      const stored = localStorage.getItem("concept-cards")
      const existingCards = stored ? JSON.parse(stored) : []
      const updatedCards = [newCard, ...existingCards]
      localStorage.setItem("concept-cards", JSON.stringify(updatedCards))

      // API完成，让进度条快速到达100%
      setWaitingProgress(100)
      
      // 给用户一点时间看到完成状态，然后关闭等待界面
      setTimeout(() => {
        setShowSmartWaiting(false)
        // 跳转到预览页
        window.location.href = `/preview/${newCard.id}`
      }, 800)
    } catch (error) {
      console.error("生成失败:", error)
      // 关闭等待界面
      setShowSmartWaiting(false)
      // 显示更详细的错误信息
      alert(`生成失败: ${error instanceof Error ? error.message : '未知错误'}，请重试`)
    } finally {
      setIsGenerating(false)
      setWaitingProgress(0) // 重置进度
    }
  }

  const handleExampleDownload = (imageUrl: string, index: number) => {
    // 创建一个临时链接来下载图片
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `concept-example-${index + 1}.jpg`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExampleShare = async (imageUrl: string, index: number) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '概念魔方 - 示例图片',
          text: `查看这张精美的概念图片 #${index + 1}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('分享取消或失败')
      }
    } else {
      // 降级方案：复制链接到剪贴板
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('链接已复制到剪贴板！')
      } catch (error) {
        console.error('分享失败:', error)
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 text-slate-800">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        
        {/* 智能等待界面 */}
        <SmartWaiting 
          concept={concept}
          isVisible={showSmartWaiting}
          externalProgress={waitingProgress}
          onClose={() => setShowSmartWaiting(false)}
        />
        
        {/* 历史记录侧边栏 */}
        <HistorySidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <div className="layout-container flex h-full grow flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 flex items-center justify-between whitespace-nowrap bg-white/80 px-6 sm:px-10 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3 text-slate-900">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-7 h-7 text-blue-600 hover:text-blue-700 transition-colors"
                aria-label="打开历史记录"
              >
                <Menu className="w-full h-full" />
              </button>
              
              {/* 概念魔方Logo */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg relative">
                <div className="w-5 h-5 text-white relative">
                  <Box className="w-full h-full" />
                  <div className="absolute inset-0 w-full h-full border border-white/30 rounded-sm transform rotate-12"></div>
                  <div className="absolute inset-0 w-full h-full border border-white/20 rounded-sm transform -rotate-12"></div>
                </div>
              </div>
              
              <h1 className="text-slate-900 text-xl font-bold leading-tight tracking-tight cute-font">概念魔方</h1>
            </div>
            
            <div className="flex gap-3 text-sm font-medium">
              <Button variant="ghost" size="sm" className="rounded-xl header-link">
                <User className="w-4 h-4 mr-2" />
                我的卡片
              </Button>
            </div>
          </header>
          
          <main className="px-4 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8 sm:py-12">
            <div className="layout-content-container flex flex-col max-w-7xl w-full flex-1">
              
              {/* Hero Section */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight apple-gradient-text cute-font leading-tight mb-4">
                  转动思维的魔方，看见概念的形状
                </h2>
                <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed mb-6">
                  给我一个概念，还你一个洞见
                </p>
                
                {/* 产品特点 */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                  {PRODUCT_FEATURES.map((feature, index) => (
                    <div 
                      key={index}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${feature.bgColor} ${feature.textColor} ${feature.borderColor} text-sm font-medium`}
                    >
                      <feature.icon className="w-4 h-4" />
                      {feature.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Generator Section - 世界级宽度优化 */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl mb-12 p-6 sm:p-8 w-full max-w-5xl mx-auto">
                {/* 输入框 */}
                <div className="relative mb-6">
                  <textarea
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    className="w-full min-h-[120px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    placeholder="请输入您想要了解的概念，例如：量子纠缠、光合作用、傅里叶变换、区块链、认知失调..."
                    maxLength={60}
                    disabled={isGenerating}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-slate-400">
                    {concept.length}/60
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleGenerate}
                    disabled={!concept.trim() || concept.length > 60 || isGenerating}
                    className="flex min-w-[180px] items-center justify-center h-12 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cute-font"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        AI 正在生成卡片...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        生成概念卡片
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Example Gallery */}
              <section className="pt-12">
                {/* 美化的标题区域 */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-500"></div>
                    <div className="relative">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        概念卡片展示
                      </h3>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>
                    <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-purple-500"></div>
                  </div>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    体验AI生成的精美概念卡片，让复杂知识变得简单易懂
                  </p>
                </div>

                {/* 完美匹配的横向图片画廊 */}
                <div className="flex justify-center gap-8 max-w-10xl mx-auto px-100">
                  {exampleImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative group w-[1600px] h-[600px] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-slate-50 to-slate-100"
                    >
                      {/* 图片本体 */}
                      <img
                        src={imageUrl}
                        alt={`示例${index + 1}`}
                        className="w-full h-full object-contain select-none pointer-events-none"
                        draggable={false}
                      />
                      {/* 悬停时显示的操作按钮 */}
                      <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                        <button
                          onClick={() => handleExampleDownload(imageUrl, index)}
                          className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white flex items-center justify-center text-slate-700 hover:text-blue-600 transform hover:scale-110 transition-all duration-300 shadow-lg border border-white/30"
                          title="下载示例"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleExampleShare(imageUrl, index)}
                          className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white flex items-center justify-center text-slate-700 hover:text-emerald-600 transform hover:scale-110 transition-all duration-300 shadow-lg border border-white/30"
                          title="分享示例"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 精美的底部装饰 */}
                <div className="mt-16 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500/60 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-500/60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-pink-500/60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <div className="w-40 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                </div>
              </section>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center">
                    <Box className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 cute-font">概念魔方</span>
                </div>
                
                <p className="text-slate-600 text-center mb-8 max-w-md">
                  让复杂概念变得简单易懂，用AI为你的学习之路点亮明灯
                </p>
                
                <div className="border-t border-slate-200 pt-8 w-full">
                  <p className="text-center text-sm text-slate-500">
                    © 2024 概念魔方. 让学习更简单，让知识更有趣.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
