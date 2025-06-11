"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Sparkles, Download, Share2, Menu } from "lucide-react"
import HistorySidebar from "@/components/HistorySidebar"
import { CONCEPT_ELEMENTS } from "@/lib/prompt-lib"

interface CardData {
  id: string
  concept: string
  title: string
  explanation: string
  background: string
  related: string[]
  life_use: string
  createdAt: string
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

export default function HomePage() {
  const [concept, setConcept] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [recentCards, setRecentCards] = useState<CardData[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedElements, setSelectedElements] = useState<string[]>(['definition', 'plain_explanation', 'application'])

  useEffect(() => {
    // 加载最近的3张卡片
    const stored = localStorage.getItem("concept-cards")
    if (stored) {
      const cards = JSON.parse(stored) as CardData[]
      setRecentCards(cards.slice(0, 3))
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

      if (!response.ok) throw new Error("生成失败")

      const data = await response.json()

      // 创建新卡片数据
      const newCard: CardData = {
        id: Date.now().toString(),
        concept: concept.trim(),
        ...data,
        createdAt: new Date().toISOString(),
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
      alert("生成失败，请重试")
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
          <header className="sticky top-0 z-30 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white/80 px-6 sm:px-10 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3 text-slate-900">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-7 h-7 text-blue-600 hover:text-blue-700 transition-colors"
                aria-label="打开历史记录"
              >
                <Menu className="w-full h-full" />
              </button>
              
              <div className="w-7 h-7 text-blue-600">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
                </svg>
              </div>
              
              <h1 className="text-slate-900 text-xl font-bold leading-tight tracking-tight cute-font">概念魔方</h1>
            </div>
            
            <div className="flex flex-1 justify-end gap-4 sm:gap-6">
              <nav className="hidden sm:flex items-center gap-6">
                <a className="text-slate-700 hover:text-blue-600 text-sm font-medium leading-normal header-link" href="#">首页</a>
                <a className="text-slate-700 hover:text-blue-600 text-sm font-medium leading-normal header-link" href="#">探索</a>
                <a className="text-slate-700 hover:text-blue-600 text-sm font-medium leading-normal header-link" href="#">创作</a>
              </nav>
              
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 border-2 border-white shadow-sm bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            </div>
          </header>

          {/* Main Content */}
          <main className="px-4 sm:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8 sm:py-12">
            <div className="layout-content-container flex flex-col max-w-4xl w-full flex-1">
              
              {/* Hero Section */}
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight apple-gradient-text cute-font leading-tight">
                  转动思维的魔方，看见概念的形状
                </h2>
                <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed mt-3 max-w-2xl mx-auto">
                  给我一个概念，还你一幅视觉叙事
                </p>
              </div>

              {/* Input Section */}
              <div className="bg-white/70 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl mb-12">
                <div className="relative mb-6">
                  <textarea
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    className="form-input w-full min-w-0 resize-y overflow-hidden rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 border border-slate-300 hover:border-slate-400 focus:border-blue-600 bg-slate-50/80 focus:bg-white min-h-40 placeholder:text-slate-400 p-4 text-base font-normal leading-relaxed transition-all duration-200 shadow-sm focus:shadow-md"
                    placeholder="例如：量子纠缠、光合作用、傅里叶变换"
                    rows={5}
                    maxLength={60}
                    disabled={isGenerating}
                  />
                  <div className="absolute right-3 bottom-3 text-sm text-slate-400">
                    {concept.length}/60
                  </div>
                </div>

                {/* 概念要素选择 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                    <h3 className="text-sm font-semibold text-slate-700">选择要包含的概念要素</h3>
                    <div className="text-xs text-slate-500">({selectedElements.length}/7)</div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {CONCEPT_ELEMENTS.map((element) => (
                      <button
                        key={element.key}
                        onClick={() => handleElementToggle(element.key)}
                        className={`
                          relative group px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all duration-200
                          ${selectedElements.includes(element.key) 
                            ? element.color + ' ring-2 ring-offset-1 ring-slate-300' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }
                        `}
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full transition-colors ${
                            selectedElements.includes(element.key) ? 'bg-current' : 'bg-slate-300'
                          }`}></div>
                          {element.label}
                        </div>
                        
                        {/* 悬停提示 */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {element.description}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-xs text-slate-500">
                    💡 点击上方按钮来定制您的概念卡片内容
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleGenerate}
                    disabled={!concept.trim() || concept.length > 60 || isGenerating || selectedElements.length === 0}
                    className="flex min-w-[160px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-base font-semibold leading-normal tracking-wide shadow-lg hover:shadow-xl generate-button cute-font disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        AI 正在生成...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        <span className="truncate">生成图片</span>
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
