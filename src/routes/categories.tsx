import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useCatalog } from "@/lib/data";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — OCEANIX" },
      { name: "description", content: "Browse all OCEANIX grocery categories." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { categories, getProductsByCategory } = useCatalog();
  return (
    <AppShell title="Categories">
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {categories.map((c) => {
          const count = getProductsByCategory(c.id).length;
          return (
            <Link
              key={c.id}
              to="/category/$id"
              params={{ id: c.id }}
              className="rounded-2xl p-4 flex flex-col gap-2 shadow-card border border-border/60 hover:-translate-y-0.5 hover:shadow-elevated transition"
              style={{ background: c.color }}
            >
              <span className="text-4xl">{c.emoji}</span>
              <div>
                <h3 className="font-bold leading-tight">{c.name}</h3>
                <p className="text-[11px] font-medium opacity-70">{count} products</p>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
