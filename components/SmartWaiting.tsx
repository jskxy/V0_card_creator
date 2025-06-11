"use client"

import React, { useState, useEffect } from "react"
import { Brain, Lightbulb, Cog, Rocket, Clock, Sparkles } from "lucide-react"

interface SmartWaitingProps {
  concept: string
  isVisible: boolean
  externalProgress?: number
  onClose?: () => void
}

// 预设的知识片段库
const conceptInsights = {
  // 科技类
  "人工智能|AI|机器学习|深度学习|神经网络": [
    "💡 人工智能这个词最早在1956年就被提出了",
    "🤖 你知道吗？Siri、小爱同学都是AI技术的应用",
    "📈 AI正在改变我们生活的方方面面",
    "🧠 神经网络的灵感来自人类大脑的工作方式"
  ],
  
  // 数学物理类
  "傅里叶|频率|信号|变换|数学|微积分|概率": [
    "🎵 音乐播放器的均衡器就用到了傅里叶变换",
    "📷 JPEG图片压缩也离不开这个数学工具",
    "🔬 这个理论已经有200多年历史了",
    "🌊 任何复杂的波形都可以分解为简单波的组合"
  ],
  
  // 商业类
  "区块链|比特币|加密|去中心化|数字货币": [
    "⛓️ 区块链就像一个永远无法篡改的账本",
    "💰 比特币是区块链技术的第一个应用",
    "🔐 每个区块都像保险箱一样安全",
    "🌍 区块链让陌生人之间也能建立信任"
  ],
  
  // 心理学类
  "认知|心理|思维|情绪|行为|学习": [
    "🧠 我们的大脑每天处理超过3万个想法",
    "💭 认知偏差影响着我们的每一个决定",
    "🎯 理解心理规律能帮我们更好地生活",
    "🔄 改变思维模式比改变行为更有效"
  ],
  
  // 物理化学类
  "量子|原子|分子|能量|力|运动": [
    "⚛️ 原子内部99.9%都是空的空间",
    "🌟 量子世界的规律与日常经验完全不同",
    "💫 能量既不能创造也不能消灭，只能转换",
    "🔬 微观世界充满了神奇和不确定性"
  ],
  
  // 通用兜底
  "default": [
    "🧠 复杂的概念往往蕴含着简单的道理",
    "🔍 理解一个概念最好的方法是找到合适的类比",
    "💡 每个伟大的发现都始于一个简单的想法",
    "🎯 掌握核心原理比记住细节更重要",
    "🌟 知识的美妙在于连接看似无关的事物",
    "🚀 好奇心是探索世界最强大的动力"
  ]
};

// 相关词汇映射
const wordMaps = {
  "人工智能|AI|机器学习": ["算法", "数据", "学习", "智能", "未来", "模型"],
  "区块链|比特币": ["去中心化", "加密", "信任", "网络", "安全", "共识"],
  "傅里叶|变换": ["频率", "信号", "数学", "变换", "分析", "波形"],
  "量子|原子": ["微观", "不确定性", "叠加", "纠缠", "观测", "概率"],
  "认知|心理": ["思维", "情绪", "行为", "意识", "记忆", "感知"],
  "default": ["概念", "理解", "应用", "原理", "实践", "探索"]
};

// 进度阶段
const progressStages = [
  { icon: Brain, text: "理解概念内涵", color: "text-blue-500" },
  { icon: Lightbulb, text: "寻找生动类比", color: "text-yellow-500" },
  { icon: Cog, text: "分析核心原理", color: "text-purple-500" },
  { icon: Rocket, text: "构建应用场景", color: "text-green-500" }
];

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getConceptTrivia(concept: string): string[] {
  // 关键词匹配
  for (const [keywords, trivias] of Object.entries(conceptInsights)) {
    if (keywords === 'default') continue;
    
    const keywordList = keywords.split('|');
    if (keywordList.some(keyword => 
        concept.toLowerCase().includes(keyword.toLowerCase())
    )) {
      return getRandomItems(trivias, 2);
    }
  }
  
  // 兜底方案
  return getRandomItems(conceptInsights.default, 2);
}

function generateRelatedWords(concept: string): string[] {
  // 匹配并返回相关词汇
  for (const [pattern, words] of Object.entries(wordMaps)) {
    if (pattern !== 'default' && new RegExp(pattern, 'i').test(concept)) {
      return getRandomItems(words, 5);
    }
  }
  
  // 通用词汇
  return getRandomItems(wordMaps.default, 5);
}

export default function SmartWaiting({ concept, isVisible, externalProgress, onClose }: SmartWaitingProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [triviaItems, setTriviaItems] = useState<string[]>([]);
  const [relatedWords, setRelatedWords] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [motivationText, setMotivationText] = useState("");

  const motivations = [
    `"${concept}"即将为你揭开神秘面纱`,
    "复杂概念，简单理解，马上就好",
    "好的解释值得等待，精彩即将呈现",
    "正在为你定制专属的理解方式"
  ];

  useEffect(() => {
    if (isVisible) {
      // 初始化数据
      setTriviaItems(getConceptTrivia(concept));
      setRelatedWords(generateRelatedWords(concept));
      setMotivationText(motivations[Math.floor(Math.random() * motivations.length)]);
      setProgress(0);
      setCurrentStage(0);

      // 更真实的进度动画 - 根据实际API响应时间调整
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          let increment;
          
          // 分阶段不同的进度增长速度，模拟真实API处理过程
          if (prev < 15) {
            // 初始阶段：较快（连接建立）
            increment = Math.random() * 2 + 1; // 1-3%
          } else if (prev < 40) {
            // 处理阶段：中等速度（AI思考）
            increment = Math.random() * 1.5 + 0.5; // 0.5-2%
          } else if (prev < 70) {
            // 生成阶段：稍慢（内容生成）
            increment = Math.random() * 1 + 0.3; // 0.3-1.3%
          } else if (prev < 85) {
            // 优化阶段：更慢（最后处理）
            increment = Math.random() * 0.8 + 0.2; // 0.2-1%
          } else if (prev < 95) {
            // 接近完成：很慢（防止过早完成）
            increment = Math.random() * 0.3 + 0.1; // 0.1-0.4%
          } else {
            // 停在95%附近，等待真实API完成
            increment = Math.random() * 0.1; // 几乎不动
          }
          
          const newProgress = Math.min(prev + increment, 95);
          
          if (newProgress >= 95) {
            clearInterval(progressTimer);
            return 95; // 最多到95%，留5%给真实完成
          }
          return newProgress;
        });
      }, 300); // 每300ms更新一次，更平滑

      // 阶段切换 - 与进度同步
      const stageTimer = setInterval(() => {
        setCurrentStage(prev => (prev + 1) % progressStages.length);
      }, 4000); // 每4秒切换一次阶段，给用户更多时间阅读

      return () => {
        clearInterval(progressTimer);
        clearInterval(stageTimer);
      };
    }
  }, [isVisible, concept]);

  // 当组件关闭时，快速完成进度条
  useEffect(() => {
    if (!isVisible && progress > 0 && progress < 100) {
      setProgress(100);
    }
  }, [isVisible]);

  // 监听外部进度变化
  useEffect(() => {
    if (externalProgress !== undefined && externalProgress > progress) {
      setProgress(externalProgress);
    }
  }, [externalProgress, progress]);
  
  // 动态计算预估时间
  const getEstimatedTime = () => {
    if (progress < 20) return "30-45";
    if (progress < 50) return "20-30"; 
    if (progress < 80) return "10-20";
    if (progress < 95) return "5-10";
    return "即将完成";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
        
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-full translate-y-12 -translate-x-12"></div>

        {/* 主要内容 */}
        <div className="relative z-10">
          {/* 标题区域 */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              探索 "{concept}" 的世界
            </h3>
            <p className="text-gray-600 text-sm">
              {motivationText}
            </p>
          </div>

          {/* 相关词汇云 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              相关概念
            </h4>
            <div className="flex flex-wrap gap-2">
              {relatedWords.map((word, index) => (
                <span
                  key={word}
                  className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm border border-blue-200 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* 知识小贴士 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              有趣知识
            </h4>
            <div className="space-y-2">
              {triviaItems.map((trivia, index) => (
                <div
                  key={index}
                  className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700 animate-slide-in"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  {trivia}
                </div>
              ))}
            </div>
          </div>

          {/* 当前阶段 */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              {React.createElement(progressStages[currentStage].icon, {
                className: `w-5 h-5 ${progressStages[currentStage].color}`
              })}
              <span className="text-sm font-medium text-gray-700">
                {progressStages[currentStage].text}
              </span>
            </div>
          </div>

          {/* 进度条 */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>生成进度</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 时间估计 */}
          <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            预计还需 {getEstimatedTime()}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
} 