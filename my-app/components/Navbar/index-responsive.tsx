import type { NextPage } from 'next';
import { useState } from 'react';
import { navs } from './config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import { 
  Home, 
  MessageCircle, 
  Tag, 
  LogIn, 
  LogOut, 
  User, 
  Menu,
  X,
  PenTool,
  Search,
  Palette
} from 'lucide-react';

import { Button } from '@/components/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/components/ui/sheet';
import { Input } from '@/components/components/ui/input';

import Login from 'components/Login';
import { useStore } from 'store';
import request from 'service/fetch';
import { cn } from '@/components/lib/utils';
import { useToast } from '@/components/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeCustomizer } from '@/components/theme-customizer';

import logo from 'public/Logo/logo.png';

const ResponsiveNavbar: NextPage = () => {
  const store = useStore();
  const { userId, avatar, nickname } = store.user.userInfo;
  const { push, asPath } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // 跳转到个人页
  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`);
    setIsMobileMenuOpen(false);
  };

  // 获取菜单图标
  const getMenuIcon = (labelName: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (labelName) {
      case '首页':
        return <Home {...iconProps} />;
      case '咨询':
        return <MessageCircle {...iconProps} />;
      case '标签':
        return <Tag {...iconProps} />;
      default:
        return null;
    }
  };

  // 退出登录
  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res.code === '0') {
        store.user.setUserInfo({});
        toast({
          title: "退出成功",
          description: res?.msg || '已成功退出登录',
        });
      } else {
        toast({
          title: "退出失败",
          description: res?.msg || '未知错误',
          variant: "destructive",
        });
      }
    });
    setIsMobileMenuOpen(false);
  };

  const handleGotoEditorPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      toast({
        title: "请先登录",
        description: "您需要登录后才能写文章",
        variant: "destructive",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setIsShowLogin(true);
    setIsMobileMenuOpen(false);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // 移动端菜单项组件
  const MobileMenuItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <Link 
      href={item.value} 
      className={cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {getMenuIcon(item.label)}
      <span className="font-medium">{item.label}</span>
    </Link>
  );

  return (
    <>
      {/* 主导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo区域 */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/Logo/logo.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* 桌面端导航菜单 */}
            <nav className="hidden md:flex items-center space-x-6">
              {navs.map((item) => {
                const isActive = asPath === item.value;
                return (
                  <Link
                    key={item.key}
                    href={item.value}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-accent"
                    )}
                  >
                    {getMenuIcon(item.label)}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 搜索框 - 桌面端 */}
            <div className="hidden lg:flex items-center">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="search"
                  placeholder="搜索文章..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* 用户操作区域 */}
            <div className="flex items-center space-x-3">
              {/* 主题切换按钮 */}
              <ThemeToggle />
              
              {/* 自定义主题按钮 */}
              <ThemeCustomizer />
              
              {/* 写文章按钮 - 桌面端 */}
              <Button 
                onClick={handleGotoEditorPage} 
                size="sm"
                className="hidden sm:flex items-center space-x-2"
              >
                <PenTool className="w-4 h-4" />
                <span>写作</span>
              </Button>

              {/* 用户菜单 */}
              {userId ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatar} alt={nickname || '用户'} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {nickname && (
                          <p className="font-medium">{nickname}</p>
                        )}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {userId}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleGotoPersonalPage}>
                      <Home className="w-4 h-4 mr-2" />
                      个人主页
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleGotoEditorPage} className="sm:hidden">
                      <PenTool className="w-4 h-4 mr-2" />
                      写作
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      退出登录
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleLogin} size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  登录
                </Button>
              )}

              {/* 移动端菜单按钮 */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="md:hidden h-8 w-8 p-0"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">打开菜单</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <Image
                        src="/Logo/logo.png"
                        alt="Logo"
                        width={120}
                        height={40}
                        className="h-8 w-auto"
                      />
                    </SheetTitle>
                    <SheetDescription>
                      探索精彩内容，分享你的想法
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {/* 移动端搜索 */}
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="search"
                        placeholder="搜索文章..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </form>

                    {/* 导航菜单 */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground px-4">导航</h3>
                      {navs.map((item) => {
                        const isActive = asPath === item.value;
                        return (
                          <MobileMenuItem 
                            key={item.key} 
                            item={item} 
                            isActive={isActive} 
                          />
                        );
                      })}
                    </div>

                    {/* 用户操作 */}
                    <div className="space-y-2 pt-4 border-t">
                      <h3 className="text-sm font-medium text-muted-foreground px-4">操作</h3>
                      
                      {/* 主题设置 */}
                      <div className="flex items-center justify-between px-4 py-2">
                        <span className="text-sm font-medium">主题设置</span>
                        <div className="flex items-center space-x-2">
                          <ThemeToggle />
                          <ThemeCustomizer />
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleGotoEditorPage}
                        variant="ghost"
                        className="w-full justify-start space-x-3 px-4 py-3 h-auto"
                      >
                        <PenTool className="w-4 h-4" />
                        <span>写作</span>
                      </Button>

                      {userId ? (
                        <>
                          <Button 
                            onClick={handleGotoPersonalPage}
                            variant="ghost"
                            className="w-full justify-start space-x-3 px-4 py-3 h-auto"
                          >
                            <Home className="w-4 h-4" />
                            <span>个人主页</span>
                          </Button>
                          <Button 
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-start space-x-3 px-4 py-3 h-auto text-destructive hover:text-destructive"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>退出登录</span>
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={handleLogin}
                          className="w-full justify-start space-x-3 px-4 py-3 h-auto"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>登录</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* 登录弹窗 */}
      <Login isShow={isShowLogin} onClose={handleClose} />
    </>
  );
};

export default observer(ResponsiveNavbar);