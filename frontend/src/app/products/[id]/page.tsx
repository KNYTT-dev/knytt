import ProductDetailClient from "./ProductDetailClient";

// No Edge Runtime - use default Node.js runtime for better compatibility
// Client component will handle data fetching

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Pass null for product - client component will fetch it
  return <ProductDetailClient product={null} isLoading={true} productId={id} />;
}
