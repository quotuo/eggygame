import type { MetadataRoute } from 'next'

// 添加语言和页面配置（建议放在文件顶部）
const languages = [
  'en',     // 英语
  'zh-CN',  // 简体中文
  'es',     // 西班牙语 
  'fr',     // 法语
  'bn',     // 孟加拉语
  'ru',     // 俄语
  'pt',     // 葡萄牙语
  'pt-BR',  // 巴西葡萄牙语
  'id',     // 印度尼西亚语
  'de',     // 德语
  'ja',     // 日语
  'tr',     // 土耳其语
  'vi',     // 越南语
  'th',     // 泰语
  'ko',     // 韩语
  'it',     // 意大利语
  'uk',     // 乌克兰语
  'zh-TW'   // 繁体中文
]; // 根据实际语言配置
const pages = ['about', 'contact', 'privacy']; // 根据实际静态页面配置

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eggycar.coolgame.us';
  
  // 动态获取游戏数据
  // 添加错误处理逻辑
  const gamesRes = await fetch(`${baseUrl}/api/games`);
  if (!gamesRes.ok) {
    console.error(`Failed to fetch games: ${gamesRes.status}`);
    return []; // 或返回基础页面
  }
  const games = await gamesRes.json();
  
  // 动态获取分类数据 
  const categoriesRes = await fetch(`${baseUrl}/api/categories`);
  const categories = await categoriesRes.json();

  return [
    // 首页
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    
    // 动态游戏页面
    ...games.flatMap((game: any) => [
      {
        url: `${baseUrl}/games/${game.slug}`,
        lastModified: new Date(game.updatedAt),
        changeFrequency: 'daily',
        priority: 0.8
      },
      // 多语言游戏页面
      ...languages.map(lang => ({
        url: `${baseUrl}/${lang}/games/${game.slug}`,
        lastModified: new Date(game.updatedAt),
        changeFrequency: 'daily',
        priority: 0.7
      }))
    ]),

    // 动态分类分页
    ...categories.flatMap((category: any) => 
      Array.from({ length: category.totalPages }, (_, i) => ({
        url: `${baseUrl}/categories/${category.slug}/page/${i + 1}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6
      }))
    ), // 添加这个逗号

    // 修复多语言生成（使用baseUrl替代硬编码域名）
    ...languages.map(lang => ({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),

    // 修复静态页面路径（使用baseUrl）
    ...pages.map(page => ({
      url: `${baseUrl}/${page}`, // 使用动态域名
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),

    // 修复多语言静态页面路径
    ...languages.flatMap(lang => 
      pages.map(page => ({
        url: `${baseUrl}/${lang}/${page}`, // 使用动态域名
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    )
  ]
}