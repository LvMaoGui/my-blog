import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { navs } from './config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import { Home, MessageCircle, Tag, LogIn, LogOut, User } from 'lucide-react';

import { Button } from '@/components/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/components/ui/navigation-menu';

import Login from 'components/Login';
import { useStore } from 'store';
import request from 'service/fetch';
import { cn } from '@/components/lib/utils';
import { useToast } from '@/components/hooks/use-toast';

import styles from './index.module.scss';
import logo from 'public/Logo/logo.png';

const Navbar: NextPage = () => {
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;
  const { push, asPath } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const { toast } = useToast();

  // 跳转到个人页
  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`);
  };

  const switchMenuIcon = (labelName: string) => {
    switch (labelName) {
      case '首页':
        return <Home className="w-4 h-4" />;
      case '咨询':
        return <MessageCircle className="w-4 h-4" />;
      case '标签':
        return <Tag className="w-4 h-4" />;
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
  };

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  return (
    <div className={styles.navbar}>
      <section className="hidden sm:flex flex-none">
        <Image
          className={styles.logo}
          width={120}
          height={60}
          src={logo.src}
          alt="logo"
          onClick={() => {
            push('/');
          }}
        />
      </section>
      
      <section className={`${styles.linkArea} flex-auto h-16`}>
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            {navs.map(({ label, value, key }) => {
              const isActive = asPath === value;
              return (
                <NavigationMenuItem key={key}>
                  <Link href={value} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                        isActive
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {switchMenuIcon(label)}
                      <span>{label}</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </section>
      
      <section className="flex-none">
        <div className="flex items-center space-x-4">
          <Button onClick={handleGotoEditorPage} variant="outline">
            写文章
          </Button>
          {userId ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={avatar} alt="用户头像" />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleGotoPersonalPage}>
                  <Home className="w-4 h-4 mr-2" />
                  个人主页
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  退出系统
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin}>
              <LogIn className="w-4 h-4 mr-2" />
              登录
            </Button>
          )}
        </div>
      </section>
      
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);