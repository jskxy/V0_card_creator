# 概念卡片生成器 - 安装配置指南

## 项目简介
这是一个基于 Next.js 的概念卡片生成器，使用 OpenRouter API 调用AI模型来生成适合小学生的教学卡片。

## 安装步骤

### 1. 安装依赖
```bash
pnpm install
```

### 2. 配置环境变量
创建 `.env.local` 文件（在项目根目录）：
```bash
# OpenRouter API 配置
OPENROUTER_API_KEY=your_openrouter_api_key_here

# 应用配置  
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 获取 API 密钥
1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册账户并登录
3. 在控制台获取您的 API 密钥
4. 将密钥替换 `.env.local` 文件中的 `your_openrouter_api_key_here`

### 4. 运行项目
```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 重要文件说明

### `.env.local` - 环境变量配置文件
- `OPENROUTER_API_KEY`: OpenRouter API 密钥，用于调用AI服务
- `NEXT_PUBLIC_APP_URL`: 应用的URL地址，用于API请求的Referer头

### `app/api/generate/route.ts` - AI生成API端点
- 处理概念卡片生成请求
- 调用 OpenRouter API 使用 DeepSeek 模型
- 返回格式化的教学卡片数据

### `app/page.tsx` - 主页面
- 概念输入界面
- 显示最近生成的卡片
- 处理用户交互

## 安全注意事项
- 绝不要将 `.env.local` 文件提交到代码仓库
- API 密钥应该保密，不要在代码中硬编码
- 生产环境部署时确保正确设置环境变量

## 故障排除
1. 如果遇到API调用失败，检查API密钥是否正确设置
2. 确保网络连接正常，能访问OpenRouter服务
3. 检查控制台日志获取详细错误信息 