import { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Input } from '@/components/components/ui/input';
import { Textarea } from '@/components/components/ui/textarea';
import { Badge } from '@/components/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar';
import { useToast } from '@/components/hooks/use-toast';
import { Heart, MessageCircle, Share2, User } from 'lucide-react';

const ShadcnDemo: NextPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title || !content) {
      toast({
        title: "请填写完整信息",
        description: "标题和内容都不能为空",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "提交成功",
      description: "您的文章已成功提交",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">shadcn/ui 组件演示</h1>
        <p className="text-muted-foreground">
          这是一个展示 shadcn/ui 组件库的演示页面，展示了各种组件的使用效果。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 文章编辑卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>创建文章</CardTitle>
            <CardDescription>
              使用 shadcn/ui 组件创建一篇新文章
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">文章标题</label>
              <Input
                placeholder="请输入文章标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">文章内容</label>
              <Textarea
                placeholder="请输入文章内容"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSubmit}>发布文章</Button>
              <Button variant="outline" onClick={() => {
                setTitle('');
                setContent('');
              }}>
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 文章展示卡片 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="作者头像" />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">示例文章标题</CardTitle>
                <CardDescription>作者：张三 • 2024年1月15日</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              这是一篇使用 shadcn/ui 组件展示的示例文章。文章内容简洁明了，
              展示了现代化的 UI 设计风格。
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">Next.js</Badge>
              <Badge variant="secondary">shadcn/ui</Badge>
              <Badge variant="secondary">TypeScript</Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>128</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>24</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share2 className="w-4 h-4" />
                <span>分享</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 按钮演示 */}
        <Card>
          <CardHeader>
            <CardTitle>按钮组件</CardTitle>
            <CardDescription>不同样式的按钮组件展示</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>默认按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="destructive">危险按钮</Button>
            </div>
          </CardContent>
        </Card>

        {/* 徽章演示 */}
        <Card>
          <CardHeader>
            <CardTitle>徽章组件</CardTitle>
            <CardDescription>不同样式的徽章组件展示</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>默认徽章</Badge>
              <Badge variant="secondary">次要徽章</Badge>
              <Badge variant="outline">轮廓徽章</Badge>
              <Badge variant="destructive">危险徽章</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">技术栈升级完成</h3>
        <p className="text-sm text-muted-foreground">
          ✅ Next.js 15.4.6 (从 14.0.3 升级)
          <br />
          ✅ React 19.1.1 (从 18.2.0 升级)
          <br />
          ✅ shadcn/ui 组件库集成完成
          <br />
          ✅ Tailwind CSS 配置优化
          <br />
          ✅ Toast 通知系统集成
        </p>
      </div>
    </div>
  );
};

export default ShadcnDemo;