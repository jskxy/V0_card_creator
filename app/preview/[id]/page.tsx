"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { ConceptCard } from "@/components/concept-card"

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

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const [cardData, setCardData] = useState<CardData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("concept-cards")
    if (stored) {
      const cards = JSON.parse(stored) as CardData[]
      const card = cards.find((c) => c.id === params.id)
      if (card) {
        setCardData(card)
      } else {
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [params.id, router])

  const handleDownload = async () => {
    if (!cardData) return

    try {
      const { default: htmlToImage } = await import("html-to-image")
      const element = document.getElementById("concept-card")
      if (!element) return

      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#FFFDF9",
      })

      const link = document.createElement("a")
      link.download = `${cardData.title}-概念卡片.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("下载失败:", error)
      alert("下载失败，请重试")
    }
  }

  const handleShare = async () => {
    if (!cardData) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardData.title} - 概念卡片`,
          text: cardData.explanation,
          url: window.location.href,
        })
      } catch (error) {
        console.error("分享失败:", error)
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert("链接已复制到剪贴板")
    }
  }

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFFDF9" }}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFDF9" }}>
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Button>

            <div className="flex items-center gap-3">
              <Button onClick={handleShare} variant="outline" className="flex items-center gap-2 rounded-xl">
                <Share2 className="w-4 h-4" />
                分享
              </Button>
              <Button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-xl"
                style={{ backgroundColor: "#255FFB" }}
              >
                <Download className="w-4 h-4" />
                下载 PNG
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{cardData.title}</h1>
            <p className="text-gray-600">概念：{cardData.concept}</p>
          </div>

          <div className="flex justify-center">
            <ConceptCard data={cardData} />
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            生成时间：{new Date(cardData.createdAt).toLocaleString("zh-CN")}
          </div>
        </div>
      </main>
    </div>
  )
}
