import ProductDetailClient from "./ProductDetailClient";

// Required for Cloudflare Pages deployment
export const runtime = "edge";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Client component fetches product data directly from API
  return <ProductDetailClient product={null} isLoading={true} productId={id} />;
}
