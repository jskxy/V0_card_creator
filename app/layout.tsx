import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '概念魔方 - 转动思维的魔方，看见概念的形状',
  description: 'AI驱动的概念可视化工具，将抽象概念转化为视觉叙事。给我一个概念，还你一幅视觉叙事。',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700;900" 
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      </head>
      <body style={{fontFamily: '"Plus Jakarta Sans", "Noto Sans", "Noto Sans SC", sans-serif'}}>
        {children}
        
        {/* 简化的烟雾光标效果脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                let mouseX = 0;
                let mouseY = 0;
                let lastSmokeTime = 0;
                
                // 跟踪鼠标位置
                document.addEventListener('mousemove', function(e) {
                  mouseX = e.clientX;
                  mouseY = e.clientY;
                  
                  const now = Date.now();
                  // 降低生成频率，每200ms最多生成一次大烟雾
                  if (now - lastSmokeTime > 200 && Math.random() < 0.6) {
                    createSmokeCloud(mouseX, mouseY);
                    lastSmokeTime = now;
                    
                    // 同时生成一些小粒子作为辅助效果
                    if (Math.random() < 0.4) {
                      createSmokeParticle(mouseX, mouseY);
                    }
                  }
                });
                
                function createSmokeCloud(x, y) {
                  const cloud = document.createElement('div');
                  cloud.className = 'smoke-cloud';
                  cloud.style.left = x + 'px';
                  cloud.style.top = y + 'px';
                  
                  // 添加轻微的随机偏移
                  const offsetX = (Math.random() - 0.5) * 30;
                  const offsetY = (Math.random() - 0.5) * 30;
                  cloud.style.transform = 'translate(' + (offsetX - 50) + '%, ' + (offsetY - 50) + '%)';
                  
                  document.body.appendChild(cloud);
                  
                  // 3秒后移除烟雾云
                  setTimeout(() => {
                    if (cloud.parentNode) {
                      cloud.parentNode.removeChild(cloud);
                    }
                  }, 3000);
                }
                
                function createSmokeParticle(x, y) {
                  const particle = document.createElement('div');
                  particle.className = 'smoke-particle';
                  
                  // 随机位置围绕鼠标
                  const offsetX = (Math.random() - 0.5) * 40;
                  const offsetY = (Math.random() - 0.5) * 40;
                  
                  particle.style.left = (x + offsetX) + 'px';
                  particle.style.top = (y + offsetY) + 'px';
                  
                  document.body.appendChild(particle);
                  
                  // 2.5秒后移除粒子
                  setTimeout(() => {
                    if (particle.parentNode) {
                      particle.parentNode.removeChild(particle);
                    }
                  }, 2500);
                }
                
                // 点击时只创建一个大烟雾云
                document.addEventListener('click', function(e) {
                  createSmokeCloud(e.clientX, e.clientY);
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
