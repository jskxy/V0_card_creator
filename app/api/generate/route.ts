import { type NextRequest, NextResponse } from "next/server"
import { PROMPT_SNIPPETS, SYSTEM_PROMPT } from "@/lib/prompt-lib"

export async function POST(request: NextRequest) {
  try {
    const { concept, selectedElements } = await request.json()

    if (!concept || concept.length > 60) {
      return NextResponse.json({ error: "概念不能为空且不超过60字" }, { status: 400 })
    }

    // 从环境变量获取API密钥
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY 环境变量未设置")
      return NextResponse.json({ error: "服务配置错误" }, { status: 500 })
    }

    // 构建动态提示词
    const selectedKeys = selectedElements && selectedElements.length > 0 
      ? selectedElements 
      : ['definition', 'plain_explanation', 'application'] // 默认选择

    const snippetBlock = selectedKeys
      .map((key: string) => PROMPT_SNIPPETS[key as keyof typeof PROMPT_SNIPPETS])
      .filter(Boolean)
      .join("\n")

    const finalPrompt = SYSTEM_PROMPT
      .replace("{concept}", concept.trim())
      .replace("{fields}", snippetBlock)

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Concept Card Generator",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: finalPrompt,
          },
          {
            role: "user",
            content: concept,
          },
        ],
        temperature: 0.7,
        max_tokens: 512,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // 尝试解析JSON
    let parsedContent
    try {
      // 首先尝试直接解析
      parsedContent = JSON.parse(content)
    } catch (firstError) {
      try {
        // 如果失败，尝试提取JSON部分（可能包含在代码块或其他文本中）
        const jsonMatch = content.match(/\{[\s\S]*?\}/)
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("未找到有效的JSON格式")
        }
      } catch (secondError) {
        console.error("JSON解析失败:", content)
        console.error("第一次错误:", firstError)
        console.error("第二次错误:", secondError)
        throw new Error("AI返回格式错误，请重试")
      }
    }

    // 验证必要字段（根据选择的元素动态验证）
    for (const key of selectedKeys) {
      if (!parsedContent[key]) {
        console.warn(`缺少字段: ${key}`)
      }
    }

    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error("生成失败:", error)
    return NextResponse.json({ error: "生成失败，请重试" }, { status: 500 })
  }
}
