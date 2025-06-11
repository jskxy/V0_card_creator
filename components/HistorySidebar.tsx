"use client"

import { useState, useEffect } from "react"
import { X, History, Download, Share2 } from "lucide-react"

interface HistoryItem {
  id: string
  concept: string
  title: string
  imageUrl?: string
  createdAt: string
}

interface HistorySidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function HistorySidebar({ isOpen, onClose }: HistorySidebarProps) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    // 加载历史记录
    const stored = localStorage.getItem("concept-cards")
    if (stored) {
      const cards = JSON.parse(stored) as HistoryItem[]
      setHistoryItems(cards.slice(0, 20)) // 最多显示20条
    }
  }, [isOpen])

  const handleItemClick = (item: HistoryItem) => {
    // 跳转到预览页面
    window.location.href = `/preview/${item.id}`
  }

  const handleDownload = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: 实现下载功能
    console.log("下载:", item.title)
    // 这里可以触发下载逻辑
    if (item.imageUrl) {
      const link = document.createElement('a')
      link.href = item.imageUrl
      link.download = `${item.title || item.concept}.jpg`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = async (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `概念魔方 - ${item.title || item.concept}`,
          text: `查看这个关于"${item.concept}"的概念图片`,
          url: `${window.location.origin}/preview/${item.id}`
        })
      } catch (error) {
        console.log('分享取消或失败')
      }
    } else {
      // 降级方案：复制链接到剪贴板
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/preview/${item.id}`)
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* 侧边栏 */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-lg border-r border-slate-200 
        transform transition-transform duration-300 z-50 shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <History className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 cute-font">生成历史</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-4">
          {historyItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm">还没有生成历史</p>
              <p className="text-slate-400 text-xs mt-1">开始创建您的第一张概念图片吧</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group bg-white/80 rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:bg-white/90 transition-all cursor-pointer hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    {/* 图片预览 */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded"></div>
                      )}
                    </div>
                    
                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-sm truncate mb-1">
                        {item.title || item.concept}
                      </h3>
                      <p className="text-slate-500 text-xs truncate mb-2">
                        {item.concept}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">
                          {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                        </span>
                        
                        {/* 操作按钮 */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleDownload(item, e)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-colors"
                            title="下载"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleShare(item, e)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center transition-colors"
                            title="分享"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="p-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center">
            共 {historyItems.length} 项历史记录
          </p>
        </div>
      </div>
    </>
  )
} 