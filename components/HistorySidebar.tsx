"use client"

import { useEffect, useState } from "react"
import { X, Clock, Download, Share2 } from "lucide-react"

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

interface HistorySidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function HistorySidebar({ isOpen, onClose }: HistorySidebarProps) {
  const [cards, setCards] = useState<CardData[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("concept-cards")
    if (stored) {
      const allCards = JSON.parse(stored) as CardData[]
      setCards(allCards)
    }
  }, [isOpen])

  const handleCardClick = (cardId: string) => {
    window.location.href = `/preview/${cardId}`
  }

  const handleDownload = (card: CardData, e: React.MouseEvent) => {
    e.stopPropagation()
    // 这里可以实现下载功能
    console.log('下载卡片:', card.concept)
  }

  const handleShare = async (card: CardData, e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({
          title: `概念魔方 - ${card.concept}`,
          text: `查看这张关于"${card.concept}"的概念卡片`,
          url: `${window.location.origin}/preview/${card.id}`
        })
      } catch (error) {
        console.log('分享取消或失败')
      }
    } else {
      // 降级方案：复制链接到剪贴板
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/preview/${card.id}`)
        alert('链接已复制到剪贴板！')
      } catch (error) {
        console.error('分享失败:', error)
      }
    }
  }

  return (
    <>
      {/* 背景遮罩 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 侧边栏 */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 
        backdrop-blur-xl border-r border-slate-200/50 shadow-2xl z-50 transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 cute-font">历史记录</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto p-4">
            {cards.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm">暂无历史记录</p>
                <p className="text-slate-400 text-xs mt-1">生成您的第一张概念卡片吧！</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cards.map((card) => (
                  <div 
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                        {card.concept}
                      </h3>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDownload(card, e)}
                          className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-blue-600 flex items-center justify-center shadow-sm hover:shadow transition-all"
                          title="下载"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleShare(card, e)}
                          className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-emerald-600 flex items-center justify-center shadow-sm hover:shadow transition-all"
                          title="分享"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    {card.title && (
                      <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                        {card.title}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        {new Date(card.createdAt).toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="text-blue-500 group-hover:text-blue-600 font-medium">
                        查看详情
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 