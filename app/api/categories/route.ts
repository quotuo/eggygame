export async function GET() {
  const categories = await prisma.category.findMany({
    select: { slug: true, totalPages: true }
  });
  return Response.json(categories);
}
