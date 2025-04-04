// 修复导入路径别名格式
import { defaultLocale, localePrefix, locales, pathnames } from '@/lib/i18n/locales'; 
// 原路径 '@lib/i18n/locales' → 修正为 '@/lib/i18n/locales'
import { createNavigation } from 'next-intl/navigation';

export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation({
  defaultLocale,
  locales,
  pathnames,
  localePrefix,
});

export function getPathnameWithLocale(pathname: string, locale: string) {
  if (locale === 'en') {
    return pathname;
  }
  // 添加对空路径的处理
  if (pathname === '/') {
    return `/${locale}`;
  }
  if (pathname.startsWith('/')) {
    return `/${locale}${pathname}`;
  }
  return pathname;
}
