"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, RotateCcw } from "lucide-react"
import * as htmlToImage from 'html-to-image'

interface CardData {
  id: string
  concept: string
  html: string
  timestamp: string
}

// 添加动态路由配置
export const dynamic = 'force-dynamic'

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (params.id) {
      const stored = localStorage.getItem("concept-cards")
      if (stored) {
        const cards = JSON.parse(stored) as CardData[]
        const card = cards.find(c => c.id === params.id)
        if (card) {
          setCardData(card)
        } else {
          // 如果未找到卡片，跳转回首页
          router.push('/')
          return
        }
      } else {
        router.push('/')
        return
      }
    }
    setIsLoading(false)
  }, [params.id, router])

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      // 为了避免跨域问题，我们需要等待一下让样式完全加载
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        width: 750,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        },
        filter: (node) => {
          // 过滤掉可能引起问题的元素
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            // 跳过外部CSS链接
            if (element.tagName === 'LINK' && element.getAttribute('rel') === 'stylesheet') {
              return false;
            }
            // 跳过外部字体
            if (element.tagName === 'STYLE' && element.textContent?.includes('@import')) {
              return false;
            }
          }
          return true;
        }
      })
      
      const link = document.createElement('a')
      link.download = `概念卡片-${cardData?.concept || 'card'}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.warn('PNG下载失败，尝试JPEG格式:', error)
      
      try {
        // 备用方案：使用JPEG格式，配置更宽松
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const dataUrl = await htmlToImage.toJpeg(cardRef.current, {
          quality: 0.95,
          width: 750,
          pixelRatio: 1,
          backgroundColor: '#ffffff',
          cacheBust: true,
          skipFonts: true,
          filter: (node) => {
            // 更宽松的过滤策略
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              if (element.tagName === 'SCRIPT') return false;
              if (element.tagName === 'LINK' && element.getAttribute('rel') === 'stylesheet') {
                return false;
              }
            }
            return true;
          }
        })
        
        const link = document.createElement('a')
        link.download = `概念卡片-${cardData?.concept || 'card'}.jpg`
        link.href = dataUrl
        link.click()
      } catch (secondError) {
        console.warn('JPEG下载也失败，尝试SVG格式:', secondError)
        
        // 最后的备用方案：使用SVG（最稳定但可能样式不完整）
        try {
          const dataUrl = await htmlToImage.toSvg(cardRef.current, {
            width: 750,
            backgroundColor: '#ffffff',
            skipFonts: true,
            filter: (node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                if (element.tagName === 'SCRIPT') return false;
                if (element.tagName === 'LINK') return false;
                if (element.tagName === 'STYLE') return false;
              }
              return true;
            }
          })
          
          const link = document.createElement('a')
          link.download = `概念卡片-${cardData?.concept || 'card'}.svg`
          link.href = dataUrl
          link.click()
        } catch (thirdError) {
          console.error('所有下载方案都失败:', thirdError)
          // 提供更友好的错误提示
          const errorMsg = `下载失败，可能的解决方案：
• 刷新页面后重试
• 在卡片上右键选择"另存为图片"
• 尝试使用截图工具
• 检查浏览器是否阻止了下载`
          alert(errorMsg)
        }
      }
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `概念魔方 - ${cardData?.concept}`,
          text: `查看我生成的概念卡片：${cardData?.concept}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('分享取消或失败')
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('链接已复制到剪贴板！')
      } catch (error) {
        console.error('分享失败:', error)
      }
    }
  }

  const handleRegenerate = () => {
    // 保存当前概念和选择的要素到 sessionStorage
    if (cardData) {
      sessionStorage.setItem('regenerate-concept', cardData.concept)
    }
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">未找到卡片数据</p>
          <Button onClick={() => router.push('/')}>返回首页</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                返回首页
              </Button>
              <h1 className="text-xl font-semibold text-slate-900">
                概念卡片 - {cardData.concept}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重新生成
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                分享
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                下载
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Card Preview */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
              <div 
                ref={cardRef}
                className="w-full max-w-[750px] mx-auto"
                dangerouslySetInnerHTML={{ __html: cardData.html }}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:w-80 space-y-6">
            {/* 卡片信息 */}
            <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">卡片信息</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-500">概念名称</span>
                  <p className="font-medium text-slate-900">{cardData.concept}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">生成时间</span>
                  <p className="text-sm text-slate-700">
                    {new Date(cardData.timestamp).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">操作</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载为图片
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  分享卡片
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新生成
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
