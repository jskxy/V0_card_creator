'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">加载失败</h2>
        <p className="text-slate-600 mb-6">{error.message}</p>
        <div className="space-x-4">
          <Button onClick={() => reset()}>重试</Button>
          <Button variant="outline" onClick={() => router.push('/')}>返回首页</Button>
        </div>
      </div>
    </div>
  )
} 