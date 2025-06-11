export const PROMPT_SNIPPETS = {
  definition: `**核心定义**：提供概念的权威、精炼定义，突出关键特征和本质属性。`,
  plain_explanation: `**通俗解释**：用简单易懂的语言重新阐述概念，避免专业术语，贴近日常理解。`,
  prerequisites: `**前置知识**：列出理解该概念所需的基础知识点，帮助读者建立知识基础。`,
  analogy_story: `**类比故事**：通过生活化的比喻、故事或场景来形象化地解释概念。`,
  related_concepts: `**相关概念**：介绍与该概念相关、相似或容易混淆的其他概念，建立知识网络。`,
  common_misconceptions: `**理解误区**：指出学习过程中常见的错误理解或误区，帮助避免conceptual errors。`,
  application: `**学以致用**：展示概念在现实生活、工作或学习中的具体应用场景和价值。`
}

export const SYSTEM_PROMPT = `你是一位专业的概念教学专家，擅长将复杂概念转化为易懂的知识卡片。

请根据用户提供的概念"{concept}"，生成包含以下指定要素的教学内容：

{fields}

要求：
1. 内容要准确、简洁、易懂
2. 语言风格要贴近目标受众
3. 结构清晰，逻辑严密
4. 突出概念的核心价值和实用性
5. 每个要素都要紧扣主题概念

请以结构化的方式组织内容，确保各要素之间逻辑连贯。`

export const CONCEPT_ELEMENTS = [
  {
    key: "definition",
    label: "核心定义",
    description: "提供概念的权威、精炼定义",
    color: "text-blue-600"
  },
  {
    key: "plain_explanation", 
    label: "通俗解释",
    description: "用易懂语言解释概念含义",
    color: "text-green-600"
  },
  {
    key: "prerequisites",
    label: "前置知识", 
    description: "学习此概念需要的基础知识",
    color: "text-purple-600"
  },
  {
    key: "analogy_story",
    label: "类比故事",
    description: "用生活化的故事类比解释",
    color: "text-orange-600"
  },
  {
    key: "related_concepts",
    label: "相关概念",
    description: "与此概念相关或相似的其他概念", 
    color: "text-pink-600"
  },
  {
    key: "common_misconceptions",
    label: "理解误区",
    description: "学习时容易产生的错误理解",
    color: "text-red-600"
  },
  {
    key: "application",
    label: "学以致用", 
    description: "概念在现实生活中的应用场景",
    color: "text-emerald-600"
  }
] 