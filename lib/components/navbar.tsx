'use client';

import { LocaleDropdown } from '@/lib/components/locale-dropdown';
import { siteConfig } from '@/lib/config/site';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/lib/ui/components/button';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/lib/ui/components/sheet';
import { cn } from '@/lib/utils/commons';
import { Menu, ChevronDown, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import React from 'react';
import { NavbarItem } from '../types';

interface NavItem {
  title: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// 响应式导航栏主组件
export default function AppNavbar({ items }: { items: NavbarItem[] }) {
  // 国际化翻译hooks
  const nt = useTranslations('Navbar'); // 导航栏专用翻译
  const t = useTranslations();          // 通用翻译

  // 组件状态管理
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);  // 移动端菜单开关状态
  const [openItems, setOpenItems] = React.useState<string[]>([]); // 展开的子菜单项
  const pathname = usePathname();    // 当前路由路径
  const locale = useLocale();        // 当前语言设置

  // 检查当前路径是否匹配链接
  const isActive = (href: string) => pathname === href;

  // 切换子菜单展开状态
  const toggleSubmenu = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)  // 关闭已展开的子菜单
        : [...prev, title]                     // 展开新的子菜单
    );
  };

  // Logo图片处理（使用配置或默认路径）
  const logoUrl = siteConfig.logoUrl ? siteConfig.logoUrl : '/logo.png'

  // 语言切换处理函数（待实现）
  const handleLocaleChange = (value: string) => {
    // implement locale change logic here
  };

  // 语言显示名称配置（待完善）
  const localeNames = {
    // implement locale names here
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-navbar backdrop-blur supports-[backdrop-filter]:bg-navbar/95">
      {/* 主容器 */}
      <div className="container flex h-16 items-center px-4">
        
        {/* 移动端菜单（小于md断点显示） */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          {/* 汉堡菜单按钮 */}
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" className="text-navbar-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          {/* 侧边菜单内容 */}
          <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-navbar/95 backdrop-blur supports-[backdrop-filter]:bg-navbar/60">
            {/* 菜单头部 */}
            <SheetHeader>
              <SheetTitle className="text-navbar-foreground">
                {nt('title')} {/* 显示翻译后的标题 */}
              </SheetTitle>
            </SheetHeader>

            {/* 菜单项列表 */}
            <div className="flex flex-col gap-4 py-4">
              {items.map((item) => (
                <div key={item.title}>
                  {/* 带子菜单的导航项 */}
                  {item.children ? (
                    <div className="flex flex-col gap-2">
                      {/* 子菜单切换按钮 */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSubmenu(item.title);
                        }}
                        type="button"
                        className="flex items-center justify-between px-4 py-2 text-sm font-medium text-navbar-foreground/80 hover:text-navbar-foreground transition-colors"
                      >
                        <span>{item.title}</span>
                        {/* 动态旋转箭头图标 */}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            openItems.includes(item.title) ? "rotate-180" : ""
                          )}
                        />
                      </button>

                      {/* 子菜单内容（动态高度过渡效果） */}
                      <div className={cn(
                        "ml-4 flex flex-col gap-2 overflow-hidden transition-all duration-200",
                        openItems.includes(item.title) ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      )}>
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-navbar-foreground/80',
                              'hover:bg-navbar-foreground/10 hover:text-navbar-foreground transition-colors',
                              isActive(child.href) && 'bg-navbar-foreground/10 text-navbar-foreground'
                            )}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // 普通导航链接
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-navbar-foreground/80',
                        'hover:bg-navbar-foreground/10 hover:text-navbar-foreground transition-colors',
                        isActive(item.href) && 'bg-navbar-foreground/10 text-navbar-foreground'
                      )}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* 语言切换组件区域 */}
              <div className="px-4 py-2">
                <LocaleDropdown />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* 网站LOGO区域 */}
        <div className="flex items-center gap-6 p-32">
          <Link href="/" className="flex items-center space-x-2 group">
            {/* Logo图片（带错误处理） */}
            <img
              src={logoUrl}
              className="h-10 md:h-14 w-auto rounded-xl"
              alt={`${t('title')} logo`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                console.error('Image load failed:', e);
              }}
            />
            {/* 网站名称 */}
            <div>
              <p className="text-lg md:text-xl font-bold text-navbar-foreground/80 hover:text-navbar-foreground transition-colors">
                {siteConfig.name as any}
              </p>
            </div>
          </Link>
        </div>

        {/* 桌面端导航菜单（md断点以上显示） */}
        <div className="text-navbar-foreground/80 hidden md:flex flex-1 justify-end p-4">
          <NavigationMenu.Root className="relative">
            <NavigationMenu.List className="flex gap-2">
              {items.map((item) => (
                <NavigationMenu.Item key={item.title} className="relative">
                  {item.children ? (
                    // 带下拉菜单的导航项
                    <>
                      <NavigationMenu.Trigger className="...">
                        {item.title}
                        {/* 下拉箭头图标 */}
                        <ChevronDown className="..." />
                      </NavigationMenu.Trigger>
                      {/* 下拉菜单内容 */}
                      <NavigationMenu.Content className="...">
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href}
                            className="..."
                          >
                            {child.title}
                          </Link>
                        ))}
                      </NavigationMenu.Content>
                    </>
                  ) : (
                    // 普通导航链接
                    <Link
                      href={item.href}
                      className="..."
                    >
                      {item.title}
                    </Link>
                  )}
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>

        {/* 桌面端语言切换 */}
        <div className="hidden md:flex items-center gap-4">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <LocaleDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
