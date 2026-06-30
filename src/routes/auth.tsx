import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/store";
import { ShoppingBag, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — OCEANIX" },
      { name: "description", content: "Sign in to OCEANIX for 10-minute grocery delivery." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validPhone = /^\+?\d{10,12}$/.test(phone.replace(/\s/g, ""));

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validPhone) {
      setError("Enter a valid 10-digit number.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setStep("otp");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    if (otp === "1234") {
      login(phone);
      navigate({ to: "/" });
    } else {
      setError("Invalid OTP. Try 1234.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="relative gradient-hero text-primary-foreground px-6 pt-12 pb-16 overflow-hidden">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 -left-10 size-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative mx-auto max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="size-10 rounded-2xl bg-white/15 backdrop-blur grid place-items-center font-black text-lg">
              O
            </div>
            <span className="font-black text-xl tracking-tight">OCEANIX</span>
          </div>
          <h1 className="text-3xl font-black leading-tight max-w-xs">
            Delivering essentials, exploring possibilities.
          </h1>
          <p className="mt-3 text-primary-foreground/80 text-sm max-w-sm">
            Groceries at your door in under 10 minutes.
          </p>
          <div className="mt-6 flex gap-3 text-xs">
            <Pill icon={<Zap className="size-3.5" />} label="10-min delivery" />
            <Pill icon={<Sparkles className="size-3.5" />} label="Fresh daily" />
            <Pill icon={<ShoppingBag className="size-3.5" />} label="Best prices" />
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="flex-1 -mt-8 px-4 pb-8">
        <div className="mx-auto max-w-md bg-card rounded-3xl shadow-elevated border border-border p-6">
          {step === "phone" ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Welcome 👋</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your mobile number to continue
                </p>
              </div>
              <div className="flex items-stretch rounded-xl border-2 border-input focus-within:border-primary transition overflow-hidden">
                <span className="px-3 grid place-items-center bg-muted text-sm font-semibold text-muted-foreground border-r border-input">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98765 43210"
                  className="flex-1 px-3 py-3 bg-transparent outline-none text-base font-medium"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={loading || !validPhone}
                className="w-full py-3.5 rounded-xl gradient-hero text-primary-foreground font-bold tracking-wide disabled:opacity-50 transition active:scale-[0.98] shadow-elevated"
              >
                {loading ? "Sending OTP…" : "Send OTP"}
              </button>
              <p className="text-xs text-center text-muted-foreground">
                By continuing you agree to our Terms & Privacy Policy.
              </p>
            </form>
          ) : (
            <form onSubmit={verify} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Verify OTP</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sent to +91 {phone}.{" "}
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="text-primary font-semibold underline-offset-2 hover:underline"
                  >
                    Change
                  </button>
                </p>
              </div>
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  className="w-full px-4 py-4 rounded-xl border-2 border-input focus:border-primary transition outline-none text-center text-2xl font-black tracking-[0.5em]"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Hint: use <span className="font-bold text-foreground">1234</span>
                </p>
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length !== 4}
                className="w-full py-3.5 rounded-xl gradient-hero text-primary-foreground font-bold tracking-wide disabled:opacity-50 transition active:scale-[0.98] shadow-elevated"
              >
                {loading ? "Verifying…" : "Verify & Continue"}
              </button>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] font-semibold">
      {icon}
      {label}
    </span>
  );
}
