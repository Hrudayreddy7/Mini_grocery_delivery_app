import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  unit: string;
  categoryId: string;
  emoji: string;
  description: string;
  bg: string;
  imageUrl?: string;
};

async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, emoji, color, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji,
    color: c.color,
  }));
}

type ProductRow = {
  id: string;
  name: string;
  price: number | string;
  mrp: number | string | null;
  unit: string;
  category_id: string;
  emoji: string;
  description: string;
  bg: string;
  featured: boolean;
  sort_order: number;
  image_url: string | null;
};

async function fetchProducts(): Promise<{ products: Product[]; featuredIds: string[] }> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, price, mrp, unit, category_id, emoji, description, bg, featured, sort_order, image_url"
    )
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as ProductRow[];
  const products: Product[] = rows.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    mrp: p.mrp != null ? Number(p.mrp) : undefined,
    unit: p.unit,
    categoryId: p.category_id,
    emoji: p.emoji,
    description: p.description,
    bg: p.bg,
    imageUrl: p.image_url ?? undefined,
  }));
  const featuredIds = rows.filter((p) => p.featured).map((p) => p.id);
  return { products, featuredIds };
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: fetchCategories, staleTime: 5 * 60_000 });
}

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts, staleTime: 5 * 60_000 });
}

export function useCatalog() {
  const cats = useCategories();
  const prods = useProducts();
  const categories = cats.data ?? [];
  const products = prods.data?.products ?? [];
  const featuredIds = prods.data?.featuredIds ?? [];
  return {
    categories,
    products,
    featuredIds,
    isLoading: cats.isLoading || prods.isLoading,
    error: cats.error ?? prods.error,
    getProduct: (id: string) => products.find((p) => p.id === id),
    getCategory: (id: string) => categories.find((c) => c.id === id),
    getProductsByCategory: (id: string) => products.filter((p) => p.categoryId === id),
  };
}
