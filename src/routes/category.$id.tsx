import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/data";

export const Route = createFileRoute("/category/$id")({
  component: CategoryPage,
});

function CategoryPage() {
  const { id } = Route.useParams();
  const { getCategory, getProductsByCategory, isLoading } = useCatalog();
  const cat = getCategory(id);
  const [sort, setSort] = useState<"popular" | "low" | "high">("popular");
  if (!cat) {
    if (isLoading) {
      return (
        <AppShell title="Loading…" back>
          <div className="p-8 text-center text-sm text-muted-foreground">Loading category…</div>
        </AppShell>
      );
    }
    return (
      <AppShell title="Not found" back>
        <div className="p-8 text-center">
          <p>Category not found.</p>
          <Link to="/categories" className="text-primary font-bold">
            Back to categories
          </Link>
        </div>
      </AppShell>
    );
  }
  const list = [...getProductsByCategory(id)].sort((a, b) =>
    sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : 0
  );

  return (
    <AppShell title={cat.name} back>
      <div
        className="px-4 py-5 -mt-px"
        style={{ background: `linear-gradient(180deg, ${cat.color}, transparent)` }}
      >
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-2xl bg-card grid place-items-center text-3xl shadow-card">
            {cat.emoji}
          </div>
          <div>
            <h1 className="text-xl font-black">{cat.name}</h1>
            <p className="text-xs text-muted-foreground">{list.length} items</p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(
          [
            { v: "popular", l: "Popular" },
            { v: "low", l: "Price: Low → High" },
            { v: "high", l: "Price: High → Low" },
          ] as const
        ).map((o) => (
          <button
            key={o.v}
            onClick={() => setSort(o.v)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border whitespace-nowrap transition ${
              sort === o.v
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
      <div className="px-4 pb-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </AppShell>
  );
}
