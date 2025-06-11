"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, Trash2, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

export default function LibraryPage() {
  const router = useRouter()
  const [cards, setCards] = useState<CardData[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("concept-cards")
    if (stored) {
      const parsedCards = JSON.parse(stored) as CardData[]
      setCards(parsedCards)
    }
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这张卡片吗？")) {
      const updatedCards = cards.filter((card) => card.id !== id)
      setCards(updatedCards)
      localStorage.setItem("concept-cards", JSON.stringify(updatedCards))
    }
  }

  const handleDownloadAll = async () => {
    if (cards.length === 0) return

    try {
      const { default: JSZip } = await import("jszip")
      const { default: htmlToImage } = await import("html-to-image")

      const zip = new JSZip()

      for (const card of cards) {
        // 这里简化处理，实际应该渲染每个卡片然后转换
        const cardText = `${card.title}\n\n${card.explanation}\n\n背景：${card.background}\n\n相关概念：${card.related.join(", ")}\n\n生活应用：${card.life_use}`
        zip.file(`${card.title}.txt`, cardText)
      }

      const content = await zip.generateAsync({ type: "blob" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(content)
      link.download = "概念卡片集合.zip"
      link.click()
    } catch (error) {
      console.error("批量下载失败:", error)
      alert("批量下载失败，请重试")
    }
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

            {cards.length > 0 && (
              <Button onClick={handleDownloadAll} variant="outline" className="flex items-center gap-2 rounded-xl">
                <Download className="w-4 h-4" />
                批量下载
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">我的卡片库</h1>
          <p className="text-gray-600">共 {cards.length} 张卡片</p>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "#FF6F59" }}
            >
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">还没有卡片</h3>
            <p className="text-gray-600 mb-6">去生成你的第一张概念卡片吧！</p>
            <Button onClick={() => router.push("/")} className="rounded-xl" style={{ backgroundColor: "#255FFB" }}>
              开始生成
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Card key={card.id} className="rounded-2xl border-2 border-gray-100 hover:shadow-lg transition-all group">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: "#FF6F59" }}
                    >
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">{card.title}</h4>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">{card.explanation}</p>
                    <div className="text-xs text-gray-400 mb-4">
                      {new Date(card.createdAt).toLocaleDateString("zh-CN")}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/preview/${card.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl text-sm">
                        查看详情
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(card.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
