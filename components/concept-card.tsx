"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Lightbulb, Users, Zap } from "lucide-react"

interface CardData {
  title: string
  explanation: string
  background: string
  related: string[]
  life_use: string
}

interface ConceptCardProps {
  data: CardData
}

export function ConceptCard({ data }: ConceptCardProps) {
  return (
    <div id="concept-card" className="w-full max-w-md">
      <Card className="rounded-3xl border-4 border-gray-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 text-center" style={{ backgroundColor: "#FF6F59" }}>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto"></div>
        </div>

        <CardContent className="p-8 space-y-6" style={{ backgroundColor: "#FFFDF9" }}>
          {/* 通俗解释 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#255FFB" }}
              >
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">简单解释</h3>
            </div>
            <p className="text-gray-700 leading-relaxed pl-11">{data.explanation}</p>
          </div>

          {/* 背景故事 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#2ECC71" }}
              >
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">小故事</h3>
            </div>
            <p className="text-gray-700 leading-relaxed pl-11">{data.background}</p>
          </div>

          {/* 相关概念 */}
          {data.related && data.related.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#9B59B6" }}
                >
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">相关概念</h3>
              </div>
              <div className="pl-11 space-y-2">
                {data.related.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 学以致用 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#F39C12" }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">生活中的用处</h3>
            </div>
            <p className="text-gray-700 leading-relaxed pl-11">{data.life_use}</p>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">概念卡片生成器 · 让学习更有趣</p>
        </div>
      </Card>
    </div>
  )
}
