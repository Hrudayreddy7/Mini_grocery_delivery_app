import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingCart, User, Search, MapPin } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { useCart, useAuth } from "@/lib/store";

export function TopBar({ title, back }: { title?: string; back?: boolean }) {
  const navigate = useNavigate();
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-screen-md px-4 h-14 flex items-center gap-3">
        {back ? (
          <button
            onClick={() => navigate({ to: ".." as any })}
            className="size-9 -ml-2 grid place-items-center rounded-full hover:bg-muted"
            aria-label="Back"
          >
            <span className="text-xl">‹</span>
          </button>
        ) : (
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-xl gradient-hero grid place-items-center text-primary-foreground font-black text-sm">
              O
            </div>
            <span className="font-black tracking-tight text-lg">OCEANIX</span>
          </Link>
        )}
        {title && <h1 className="font-bold flex-1 truncate">{title}</h1>}
        {!title && (
          <div className="flex-1 hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 text-accent" />
            <span className="font-medium text-foreground">Delivery in 10 min</span>
          </div>
        )}
        <Link
          to="/cart"
          className="relative size-9 grid place-items-center rounded-full hover:bg-muted"
          aria-label="Cart"
        >
          <ShoppingCart className="size-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold grid place-items-center">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { pathname } = useLocation();
  const { count } = useCart();
  const tabs: Array<{
    to: "/" | "/categories" | "/cart" | "/profile";
    label: string;
    icon: typeof Home;
    exact?: boolean;
    badge?: number;
  }> = [
    { to: "/", label: "Home", icon: Home, exact: true },
    { to: "/categories", label: "Categories", icon: LayoutGrid },
    { to: "/cart", label: "Cart", icon: ShoppingCart, badge: count },
    { to: "/profile", label: "Profile", icon: User },
  ];
  return (
    <nav className="sticky bottom-0 z-30 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="mx-auto max-w-screen-md grid grid-cols-4">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                {t.badge ? (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-accent text-accent-foreground text-[9px] font-bold grid place-items-center">
                    {t.badge}
                  </span>
                ) : null}
              </div>
              {t.label}
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({
  children,
  title,
  back,
  hideBottom,
}: {
  children: ReactNode;
  title?: string;
  back?: boolean;
  hideBottom?: boolean;
}) {
  const { phone } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!phone) navigate({ to: "/auth" });
  }, [phone, navigate]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar title={title} back={back} />
      <main className="flex-1 mx-auto w-full max-w-screen-md">{children}</main>
      {!hideBottom && <BottomNav />}
    </div>
  );
}

export { Search };
