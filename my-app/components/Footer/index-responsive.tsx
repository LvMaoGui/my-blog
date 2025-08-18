import type { NextPage } from 'next';
import Link from 'next/link';
import { Heart, Github, Mail, Rss } from 'lucide-react';
import { Button } from '@/components/components/ui/button';

const ResponsiveFooter: NextPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">Fly</span>
              </div>
              <h3 className="text-lg font-semibold">DengGongFei</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              全栈开发工程师，专注于现代Web技术，
              <br />
              热爱创新与分享，持续学习与成长。
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="mailto:contact@example.com">
                  <Mail className="w-4 h-4" />
                  <span className="sr-only">邮箱</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/rss.xml">
                  <Rss className="w-4 h-4" />
                  <span className="sr-only">RSS订阅</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* 快速导航 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">快速导航</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link 
                  href="/projects" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  项目作品
                </Link>
              </li>
              <li>
                <Link 
                  href="/articles" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  文章
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  联系我
                </Link>
              </li>
            </ul>
          </div>

          {/* 技能专长 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">技能专长</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">前端开发 (React/Vue/Next.js)</li>
              <li className="text-muted-foreground">后端开发 (Node.js/Python)</li>
              <li className="text-muted-foreground">移动开发 (React Native)</li>
              <li className="text-muted-foreground">云服务 (AWS/阿里云)</li>
              <li className="text-muted-foreground">DevOps & CI/CD</li>
            </ul>
          </div>

          {/* 服务内容 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">服务内容</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">网站开发</li>
              <li className="text-muted-foreground">移动应用开发</li>
              <li className="text-muted-foreground">技术咨询</li>
              <li className="text-muted-foreground">系统架构设计</li>
              <li className="text-muted-foreground">代码审查与优化</li>
            </ul>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {currentYear} codeFly. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <Link 
                href="https://beian.miit.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                粤ICP备2024319376号-1
              </Link>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Crafted with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>& passion by codeFly</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ResponsiveFooter;