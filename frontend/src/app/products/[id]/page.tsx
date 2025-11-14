import ProductDetailClient from "./ProductDetailClient";
import type { ProductResult } from "@/types/api";

// Required for Cloudflare Pages deployment
export const runtime = "edge";

async function getProduct(productId: string): Promise<ProductResult | null> {
  try {
    // Use production API URL directly for Cloudflare Pages Edge Runtime
    // Environment variables don't work reliably in Edge Runtime SSR
    const API_URL = "https://knytt-api-prod-kouzugqpra-uc.a.run.app";

    const response = await fetch(`${API_URL}/api/v1/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      console.error(`Failed to fetch product: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <ProductDetailClient product={product} isLoading={false} productId={id} />
  );
}
