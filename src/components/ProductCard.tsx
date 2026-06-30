import { Link } from "@tanstack/react-router";
import { Plus, Minus } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { items, add, setQty } = useCart();
  const item = items.find((i) => i.id === product.id);
  const qty = item?.qty ?? 0;
  const off = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="group flex flex-col rounded-2xl bg-card shadow-card overflow-hidden border border-border/60 transition hover:-translate-y-0.5 hover:shadow-elevated">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative aspect-square flex items-center justify-center overflow-hidden"
        style={{ background: product.bg }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <span className="text-6xl drop-shadow-sm">{product.emoji}</span>
        )}
        {off > 0 && (
          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
            {off}% off
          </span>
        )}
      </Link>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <Link to="/product/$id" params={{ id: product.id }} className="block">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{product.unit}</p>
        </Link>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-foreground">₹{product.price}</span>
            {product.mrp && (
              <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
            )}
          </div>
          {qty === 0 ? (
            <button
              onClick={() => add(product.id)}
              className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-lg bg-primary text-primary-foreground">
              <button
                onClick={() => setQty(product.id, qty - 1)}
                className="p-1.5"
                aria-label="Decrease"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="text-xs font-bold w-5 text-center">{qty}</span>
              <button
                onClick={() => setQty(product.id, qty + 1)}
                className="p-1.5"
                aria-label="Increase"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
