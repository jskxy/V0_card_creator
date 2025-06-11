export const PROMPT_SNIPPETS = {
  definition: `"definition": "",          // ≤15 字，权威精炼书面定义`,
  plain_explanation: `"plain_explanation": "",   // 1–2 句，孩子能听懂的口语化解释，每句 ≤25 字`,
  prerequisites: `"prerequisites": [],    // 必备前置知识点数组，≤3 条，每条用双引号`,
  analogy_story: `"analogy_story": "",    // 1 句直观类比或小故事，≤30 字`,
  related_concepts: `"related_concepts": [], // 2–3 个易混概念，每项括号内简述`,
  common_misconceptions: `"common_misconceptions": [], // 1–2 条常见误区，每条 ≤20 字`,
  application: `"application": ""         // 1–2 句概念在生活或跨学科应用`
}

export const SYSTEM_PROMPT = `
你是一名经验丰富的小学老师，请针对"{concept}"生成 JSON 对象，仅包含以下字段：
{fields}

写作要求：
1. 语言简洁具体，避免复杂学术长句。
2. 字段顺序与上方保持一致，不要输出任何未列出的字段。
3. 按 JSON 语法输出；不要带注释或其他说明文字。
`.trim()

export const CONCEPT_ELEMENTS = [
  { 
    key: 'definition', 
    label: '核心定义', 
    color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
    description: '权威精炼的书面定义'
  },
  { 
    key: 'plain_explanation', 
    label: '通俗解释', 
    color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
    description: '孩子能听懂的口语化解释'
  },
  { 
    key: 'prerequisites', 
    label: '前置知识', 
    color: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
    description: '必备的前置知识点'
  },
  { 
    key: 'analogy_story', 
    label: '类比故事', 
    color: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
    description: '直观的类比或小故事'
  },
  { 
    key: 'related_concepts', 
    label: '相关概念', 
    color: 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200',
    description: '易混淆的相关概念'
  },
  { 
    key: 'common_misconceptions', 
    label: '理解误区', 
    color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
    description: '常见的理解误区'
  },
  { 
    key: 'application', 
    label: '生活应用', 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
    description: '在生活中的实际应用'
  }
] 