export async function GET() {
  // 这里连接数据库或调用CMS API
  const games = await prisma.game.findMany({
    select: { slug: true, updatedAt: true }
  });
  return Response.json(games);
}
