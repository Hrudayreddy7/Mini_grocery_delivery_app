import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useCart } from "@/lib/store";
import { useCatalog, type Product } from "@/lib/data";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — OCEANIX" }] }),
  component: CartPage,
});

export function calcTotals(
  items: { id: string; qty: number }[],
  getProduct: (id: string) => Product | undefined
) {
  const subtotal = items.reduce((s, i) => s + (getProduct(i.id)?.price ?? 0) * i.qty, 0);
  const delivery = subtotal === 0 || subtotal >= 199 ? 0 : 25;
  const tax = Math.round(subtotal * 0.05);
  return { subtotal, delivery, tax, total: subtotal + delivery + tax };
}

function CartPage() {
  const navigate = useNavigate();
  const { items, setQty, remove } = useCart();
  const { getProduct } = useCatalog();
  const totals = calcTotals(items, getProduct);

  if (items.length === 0) {
    return (
      <AppShell title="Your Cart">
        <div className="px-6 py-16 flex flex-col items-center text-center gap-4">
          <div className="size-24 rounded-full bg-muted grid place-items-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add some essentials to get started.
            </p>
          </div>
          <Link
            to="/"
            className="px-5 py-3 rounded-xl gradient-hero text-primary-foreground font-bold shadow-elevated"
          >
            Start shopping
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Your Cart">
      <div className="px-4 py-4 space-y-3">
        {items.map((i) => {
          const p = getProduct(i.id);
          if (!p) return null;
          return (
            <div
              key={i.id}
              className="flex gap-3 items-center p-3 rounded-2xl bg-card border border-border shadow-card"
            >
              <div
                className="size-16 rounded-xl grid place-items-center text-3xl shrink-0"
                style={{ background: p.bg }}
              >
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold leading-tight truncate">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.unit}</p>
                <p className="text-sm font-bold mt-1">₹{p.price * i.qty}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => remove(i.id)}
                  className="text-muted-foreground hover:text-destructive p-1"
                  aria-label="Remove"
                >
                  <Trash2 className="size-4" />
                </button>
                <div className="flex items-center gap-1 rounded-lg bg-primary text-primary-foreground">
                  <button onClick={() => setQty(i.id, i.qty - 1)} className="p-1.5">
                    <Minus className="size-3.5" />
                  </button>
                  <span className="text-xs font-bold w-5 text-center">{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)} className="p-1.5">
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bill */}
        <div className="rounded-2xl bg-card border border-border shadow-card p-4 space-y-2 mt-4">
          <h3 className="font-bold mb-2">Bill summary</h3>
          <Row label="Subtotal" value={`₹${totals.subtotal}`} />
          <Row
            label="Delivery"
            value={totals.delivery === 0 ? "FREE" : `₹${totals.delivery}`}
            highlight={totals.delivery === 0}
          />
          <Row label="Taxes (5%)" value={`₹${totals.tax}`} />
          <div className="border-t border-border my-2" />
          <Row label="Total" value={`₹${totals.total}`} bold />
        </div>
      </div>

      <div className="sticky bottom-14 px-4 pb-3">
        <button
          onClick={() => navigate({ to: "/checkout" })}
          className="w-full py-3.5 rounded-xl gradient-hero text-primary-foreground font-bold shadow-elevated active:scale-[0.98]"
        >
          Proceed to checkout · ₹{totals.total}
        </button>
      </div>
    </AppShell>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "font-black text-base" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span className={highlight ? "text-success font-bold" : ""}>{value}</span>
    </div>
  );
}
