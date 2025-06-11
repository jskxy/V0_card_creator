import { type NextRequest, NextResponse } from "next/server"
import { CARD_PROMPT_TEMPLATE } from "@/lib/cardPromptLib"

export async function POST(request: NextRequest) {
  try {
    const { concept } = await request.json()

    if (!concept || concept.length > 60) {
      return NextResponse.json({ error: "概念不能为空且不超过60字" }, { status: 400 })
    }

    // 获取API密钥 - 优先使用环境变量，否则使用备用密钥
    const apiKey = process.env.OPENROUTER_API_KEY || "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"
    
    if (!apiKey) {
      console.error("API密钥未配置")
      return NextResponse.json({ error: "服务配置错误：API密钥未找到" }, { status: 500 })
    }

    // 生成最终提示词
    const finalPrompt = CARD_PROMPT_TEMPLATE.replace("{concept}", concept.trim())

    console.log("使用API密钥前缀:", apiKey.substring(0, 20) + "...") // 调试日志
    console.log("生成的提示词长度:", finalPrompt.length) // 调试日志

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": encodeURIComponent("概念魔方 - Concept Card Generator"),
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4096,
        stream: false,
      }),
    })

    if (!response.ok) {
      let errorInfo;
      let errorText = "";
      
      try {
        // 先读取响应文本
        errorText = await response.text()
        // 尝试解析为JSON
        errorInfo = JSON.parse(errorText)
      } catch {
        // 如果JSON解析失败，使用原始文本
        errorInfo = { message: errorText || "未知错误" }
      }
      
      console.error("OpenRouter API错误:", {
        status: response.status,
        statusText: response.statusText,
        errorInfo
      })

      // 针对不同错误码提供更友好的提示
      let userMessage = "生成失败，请重试"
      if (response.status === 401) {
        userMessage = "API认证失败，请检查密钥配置"
      } else if (response.status === 429) {
        userMessage = "请求过于频繁，请稍后重试"
      } else if (response.status === 500) {
        userMessage = "服务器内部错误，请稍后重试"
      }

      throw new Error(userMessage)
    }

    const data = await response.json()
    console.log("API响应状态:", response.status) // 调试日志

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("API返回数据无效:", data)
      throw new Error("API返回数据格式错误")
    }

    const htmlContent = data.choices[0].message.content

    // 验证返回的是HTML内容
    if (!htmlContent || !htmlContent.includes('<html')) {
      console.error("返回内容不是有效HTML:", htmlContent?.substring(0, 200))
      throw new Error("AI未返回有效的HTML内容")
    }

    // 清理HTML内容（移除可能的代码块标记）
    let cleanedHtml = htmlContent
    if (htmlContent.includes('```html')) {
      cleanedHtml = htmlContent.replace(/```html\n?/g, '').replace(/\n?```/g, '')
    }
    if (htmlContent.includes('```')) {
      cleanedHtml = htmlContent.replace(/```[\s\S]*?\n/g, '').replace(/\n?```/g, '')
    }

    console.log("成功生成HTML内容，长度:", cleanedHtml.length) // 调试日志

    return NextResponse.json({ 
      html: cleanedHtml,
      concept: concept.trim(),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("生成失败详细信息:", error)
    const errorMessage = error instanceof Error ? error.message : "未知错误"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
