import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useCart, saveOrder, type Order } from "@/lib/store";
import { useCatalog } from "@/lib/data";
import { calcTotals } from "./cart";
import { MapPin, CreditCard, Wallet, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — OCEANIX" }] }),
  component: Checkout,
});

function Checkout() {
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const { getProduct } = useCatalog();
  const totals = calcTotals(items, getProduct);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <AppShell title="Checkout" back>
        <div className="p-8 text-center">
          <p>Your cart is empty.</p>
          <Link to="/" className="text-primary font-bold">
            Browse products
          </Link>
        </div>
      </AppShell>
    );
  }

  const useLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(
          `Detected location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        );
      },
      () => setErr("Couldn't access location. Enter address manually.")
    );
  };

  const place = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!name.trim() || name.trim().length < 2) return setErr("Enter your name.");
    if (!/^\d{10}$/.test(phone)) return setErr("Enter a valid 10-digit phone.");
    if (address.trim().length < 8) return setErr("Enter a complete address.");
    if (!/^\d{6}$/.test(pin)) return setErr("Enter a valid 6-digit pincode.");
    if (!agree) return setErr("Please accept the terms to continue.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const order: Order = {
      id: `OCX${Date.now().toString().slice(-8)}`,
      createdAt: Date.now(),
      items: items.map((i) => {
        const p = getProduct(i.id)!;
        return { id: i.id, qty: i.qty, name: p.name, price: p.price };
      }),
      ...totals,
      address: `${address}, ${pin}`,
      payment,
      status: "placed",
    };
    saveOrder(order);
    clear();
    navigate({ to: "/order-success/$orderId", params: { orderId: order.id } });
  };

  return (
    <AppShell title="Checkout" back hideBottom>
      <form onSubmit={place} className="px-4 py-4 space-y-5 pb-32">
        <Section title="Delivery address" icon={<MapPin className="size-4" />}>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Full name" value={name} onChange={setName} placeholder="Jane Doe" />
            <Field
              label="Phone"
              value={phone}
              onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))}
              placeholder="98765 43210"
              type="tel"
            />
          </div>
          <Field
            label="Address"
            value={address}
            onChange={setAddress}
            placeholder="House / flat, street, area"
            textarea
          />
          <div className="flex gap-2">
            <Field
              label="Pincode"
              value={pin}
              onChange={(v) => setPin(v.replace(/\D/g, "").slice(0, 6))}
              placeholder="560001"
            />
            <button
              type="button"
              onClick={useLocation}
              className="self-end px-3 py-2.5 rounded-xl border-2 border-primary text-primary text-xs font-bold whitespace-nowrap"
            >
              Use my location
            </button>
          </div>
        </Section>

        <Section title="Payment method" icon={<Wallet className="size-4" />}>
          <div className="grid grid-cols-2 gap-2">
            <PayOption
              active={payment === "cod"}
              onClick={() => setPayment("cod")}
              icon={<Wallet className="size-5" />}
              title="Cash on delivery"
              subtitle="Pay when it arrives"
            />
            <PayOption
              active={payment === "online"}
              onClick={() => setPayment("online")}
              icon={<CreditCard className="size-5" />}
              title="Online payment"
              subtitle="UPI / Card (mock)"
            />
          </div>
        </Section>

        <Section title="Order summary">
          <div className="text-sm space-y-1">
            <Row label={`Items (${items.reduce((s, i) => s + i.qty, 0)})`} value={`₹${totals.subtotal}`} />
            <Row
              label="Delivery"
              value={totals.delivery === 0 ? "FREE" : `₹${totals.delivery}`}
            />
            <Row label="Taxes" value={`₹${totals.tax}`} />
            <div className="border-t border-border my-2" />
            <Row label="Total" value={`₹${totals.total}`} bold />
          </div>
        </Section>

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 size-4 accent-[var(--primary)]"
          />
          I agree to the Terms & Conditions and Privacy Policy.
        </label>

        {err && <p className="text-sm text-destructive">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="fixed bottom-0 left-0 right-0 mx-auto max-w-screen-md w-[calc(100%-2rem)] mb-4 py-3.5 rounded-xl gradient-hero text-primary-foreground font-bold shadow-elevated disabled:opacity-60"
        >
          {loading ? "Placing order…" : `Place order · ₹${totals.total}`}
        </button>
      </form>
    </AppShell>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-card border border-border shadow-card p-4 space-y-3">
      <h2 className="font-bold text-sm flex items-center gap-1.5">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full px-3 py-2.5 rounded-xl border-2 border-input focus:border-primary outline-none text-sm font-medium bg-background";
  return (
    <label className="block">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={2}
          className={cls + " mt-1 resize-none"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className={cls + " mt-1"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

function PayOption({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left p-3 rounded-xl border-2 transition ${
        active ? "border-primary bg-primary/5" : "border-border bg-background"
      }`}
    >
      <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center mb-2">
        {icon}
      </div>
      <p className="font-bold text-sm">{title}</p>
      <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      {active && <CheckCircle2 className="absolute top-2 right-2 size-4 text-primary" />}
    </button>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-black text-base" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
