"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Sparkles, Download, Share2, Menu, User, Star, Shield, Cpu, Box, Lightbulb } from "lucide-react"
import HistorySidebar from "@/components/HistorySidebar"
import { CONCEPT_ELEMENTS } from "@/lib/prompt-lib"

interface CardData {
  id: string
  concept: string
  html: string
  selectedElements: string[]
  timestamp: string
}

// 示例图片数据
const exampleImages = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120266ceb60?w=400&h=400&fit=crop"
]

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
  const [recentCards, setRecentCards] = useState<CardData[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedElements, setSelectedElements] = useState<string[]>([])

  useEffect(() => {
    // 加载最近的3张卡片
    const stored = localStorage.getItem("concept-cards")
    if (stored) {
      const cards = JSON.parse(stored) as CardData[]
      setRecentCards(cards.slice(0, 3))
    }

    // 检查是否有重新生成的数据
    const regenerateConcept = sessionStorage.getItem('regenerate-concept')
    const regenerateElements = sessionStorage.getItem('regenerate-elements')
    
    if (regenerateConcept && regenerateElements) {
      setConcept(regenerateConcept)
      setSelectedElements(JSON.parse(regenerateElements))
      
      // 清除sessionStorage
      sessionStorage.removeItem('regenerate-concept')
      sessionStorage.removeItem('regenerate-elements')
    }
  }, [])

  const handleElementToggle = (elementKey: string) => {
    setSelectedElements(prev => 
      prev.includes(elementKey)
        ? prev.filter(key => key !== elementKey)
        : [...prev, elementKey]
    )
  }

  const handleGenerate = async () => {
    if (!concept.trim() || concept.length > 60) return
    if (selectedElements.length === 0) {
      alert('请至少选择一个要素')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          concept: concept.trim(),
          selectedElements: selectedElements
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
        selectedElements: data.selectedElements,
        timestamp: data.timestamp,
      }

      // 保存到localStorage
      const stored = localStorage.getItem("concept-cards")
      const existingCards = stored ? JSON.parse(stored) : []
      const updatedCards = [newCard, ...existingCards]
      localStorage.setItem("concept-cards", JSON.stringify(updatedCards))

      // 跳转到预览页
      window.location.href = `/preview/${newCard.id}`
    } catch (error) {
      console.error("生成失败:", error)
      // 显示更详细的错误信息
      alert(`生成失败: ${error instanceof Error ? error.message : '未知错误'}，请重试`)
    } finally {
      setIsGenerating(false)
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
            
            <div className="flex flex-1 justify-end gap-4 sm:gap-6">
              <nav className="hidden sm:flex items-center gap-6">
                <a className="text-slate-700 hover:text-blue-600 text-sm font-medium leading-normal header-link" href="#">首页</a>
                <a className="text-slate-700 hover:text-blue-600 text-sm font-medium leading-normal header-link" href="#">探索</a>
                <a className="text-slate-700 hover:text-blue-600 text-sm font-medium leading-normal header-link" href="#">创作</a>
              </nav>
              
              {/* 登录按钮 */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">登录</span>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="px-4 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8 sm:py-12">
            <div className="layout-content-container flex flex-col max-w-4xl w-full flex-1">
              
              {/* Hero Section */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight apple-gradient-text cute-font leading-tight mb-4">
                  转动思维的魔方，看见概念的形状
                </h2>
                <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed mb-6">
                  给我一个概念，还你一幅视觉叙事
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

              {/* AI Generator Section */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl mb-12 p-6 sm:p-8">
                {/* 输入框 */}
                <div className="relative mb-6">
                  <textarea
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    className="w-full min-h-[120px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    placeholder="请描述您想要生成卡片的概念，例如：量子纠缠、光合作用、傅里叶变换..."
                    maxLength={60}
                    disabled={isGenerating}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-slate-400">
                    {concept.length}/60
                  </div>
                </div>

                {/* 概念要素选择 */}
                <div className="mb-6">
                  {/* 提示文字 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center">
                        <Lightbulb className="w-3 h-3 text-amber-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">选择要包含的概念要素</span>
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {selectedElements.length}/7
                    </div>
                  </div>
                  
                  {/* 优化颜色的要素标签 */}
                  <div className="flex flex-wrap gap-2">
                    {CONCEPT_ELEMENTS.map((element) => (
                      <button
                        key={element.key}
                        onClick={() => handleElementToggle(element.key)}
                        className={`
                          group relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${selectedElements.includes(element.key) 
                            ? 'bg-gradient-to-r from-sky-50 to-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' 
                            : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 hover:text-slate-700 hover:border border border-transparent hover:border-slate-200 hover:shadow-sm'
                          }
                        `}
                      >
                        {element.label}
                        
                        {/* 悬停提示 */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                          {element.description}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleGenerate}
                    disabled={!concept.trim() || concept.length > 60 || isGenerating || selectedElements.length === 0}
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
              <section className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {exampleImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div 
                        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl shadow-lg example-card-image"
                        style={{ backgroundImage: `url("${imageUrl}")` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl image-overlay-buttons p-2">
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleExampleDownload(imageUrl, index)}
                            className="flex items-center justify-center gap-2 rounded-full h-10 w-10 bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 image-action-button" 
                            title="下载"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleExampleShare(imageUrl, index)}
                            className="flex items-center justify-center gap-2 rounded-full h-10 w-10 bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-600 image-action-button" 
                            title="分享"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-slate-100/70 backdrop-blur-lg border-t border-slate-200">
            <div className="max-w-5xl mx-auto px-5 py-10 text-center">
              <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 mb-6">
                <a className="text-slate-600 hover:text-blue-600 text-sm font-medium leading-normal header-link" href="#">服务条款</a>
                <a className="text-slate-600 hover:text-blue-600 text-sm font-medium leading-normal header-link" href="#">隐私政策</a>
                <a className="text-slate-600 hover:text-blue-600 text-sm font-medium leading-normal header-link" href="#">联系我们</a>
              </div>
              <p className="text-slate-500 text-sm font-normal leading-normal">
                © 2024 概念魔方. 版权所有. 用 <span className="text-red-500">♥</span> 精心制作。
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
