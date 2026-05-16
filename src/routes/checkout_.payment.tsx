import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Check,
  Truck,
  CreditCard,
  ClipboardCheck,
  Lock,
  Smartphone,
  Loader2,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatGNF } from "@/lib/data";
import {
  useOrders,
  generateOrderId,
  type PaymentMethod,
  type Order,
} from "@/lib/orders-store";

export const Route = createFileRoute("/checkout_/payment")({
  component: PaymentPage,
});

const TVA_RATE = 0.18;
const STEPS = [
  { id: 1, label: "Livraison", icon: Truck, status: "done" as const },
  { id: 2, label: "Paiement", icon: CreditCard, status: "active" as const },
  { id: 3, label: "Confirmation", icon: ClipboardCheck, status: "todo" as const },
];

function PaymentPage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);
  const delivery = useOrders((s) => s.delivery);
  const addOrder = useOrders((s) => s.addOrder);

  const subtotal = items.reduce((a, i) => a + i.qty * i.product.price, 0);
  const tva = Math.round(subtotal * TVA_RATE);
  const total = subtotal + tva;

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("orange_money");
  const [submitting, setSubmitting] = useState(false);

  // Orange Money
  const [omPhone, setOmPhone] = useState("+224 ");
  // Card
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cardBrand = useMemo<"visa" | "mastercard" | null>(() => {
    const d = cardNumber.replace(/\D/g, "");
    if (d.startsWith("4")) return "visa";
    if (/^(5[1-5]|2[2-7])/.test(d)) return "mastercard";
    return null;
  }, [cardNumber]);

  if (items.length === 0 || !delivery) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-xl font-bold text-foreground">
          {items.length === 0
            ? "Votre panier est vide"
            : "Informations de livraison manquantes"}
        </h1>
        <Link
          to={items.length === 0 ? "/" : "/checkout"}
          className="mt-3 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          {items.length === 0 ? "Continuer mes achats" : "Reprendre la livraison"}
        </Link>
      </div>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (method === "orange_money") {
      const digits = omPhone.replace(/\D/g, "");
      if (!/^224\d{8,9}$/.test(digits))
        e.omPhone = "Numéro Orange invalide (+224 6X XX XX XX)";
    } else {
      const num = cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(num)) e.cardNumber = "Numéro de carte invalide";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExp))
        e.cardExp = "Date invalide (MM/AA)";
      if (!/^\d{3,4}$/.test(cardCvv)) e.cardCvv = "CVV invalide";
      if (cardName.trim().length < 3) e.cardName = "Nom requis";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onPay = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));

    const order: Order = {
      id: generateOrderId(),
      createdAt: Date.now(),
      status: "received",
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        brand: i.product.brand,
        image: i.product.image,
        qty: i.qty,
        price: i.product.price,
      })),
      subtotal,
      tva,
      total,
      delivery,
      payment:
        method === "orange_money"
          ? { method, label: "Orange Money", masked: omPhone.trim() }
          : {
              method,
              label: cardBrand === "mastercard" ? "Mastercard" : "Visa",
              masked: `•••• ${cardNumber.replace(/\D/g, "").slice(-4)}`,
            },
    };

    addOrder(order);
    clearCart();
    setSubmitting(false);
    navigate({ to: "/order-success", search: { id: order.id } });
  };

  return (
    <div className="space-y-4 px-4 py-4 pb-32">
      <div className="flex items-center gap-2">
        <Link
          to="/checkout"
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground"
          aria-label="Retour à la livraison"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Paiement</h1>
      </div>

      {/* Progress */}
      <ol className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = s.status === "done";
          const active = s.status === "active";
          return (
            <li key={s.id} className="flex flex-1 items-center gap-2">
              <div className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-full border-2 ${
                    active
                      ? "border-primary bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
                      : done
                      ? "border-success bg-success/15 text-success"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    active
                      ? "text-primary"
                      : done
                      ? "text-success"
                      : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {/* Method selector */}
          <div className="grid gap-2 sm:grid-cols-2">
            <MethodCard
              selected={method === "orange_money"}
              onClick={() => setMethod("orange_money")}
              accent="#FF6600"
              title="Orange Money"
              subtitle="Paiement mobile sécurisé"
              icon={<Smartphone className="h-5 w-5" />}
            />
            <MethodCard
              selected={method === "card"}
              onClick={() => setMethod("card")}
              accent="hsl(var(--primary))"
              title="Carte bancaire"
              subtitle="Visa / Mastercard"
              icon={<CreditCard className="h-5 w-5" />}
            />
          </div>

          {/* Forms */}
          {method === "orange_money" ? (
            <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FF6600] text-base font-black text-white">
                  O
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Orange Money</div>
                  <div className="text-[11px] text-muted-foreground">
                    Paiement validé sur votre téléphone
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-foreground">
                  Numéro Orange Money
                </span>
                <input
                  value={omPhone}
                  onChange={(e) => setOmPhone(e.target.value)}
                  placeholder="+224 6X XX XX XX"
                  inputMode="tel"
                  maxLength={20}
                  className={inputCls(errors.omPhone)}
                />
                {errors.omPhone && (
                  <span className="mt-1 block text-[11px] text-destructive">
                    {errors.omPhone}
                  </span>
                )}
              </label>

              <div className="rounded-xl border border-[#FF6600]/30 bg-[#FF6600]/10 p-3 text-[12px] text-foreground">
                Vous recevrez une demande de confirmation sur votre téléphone Orange.
              </div>

              <ol className="space-y-2 text-xs text-muted-foreground">
                {[
                  "Entrez votre numéro Orange Money",
                  "Validez la demande sur votre téléphone",
                  "Commande confirmée automatiquement",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#FF6600] text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : (
            <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
              {/* Live card preview */}
              <div
                className="relative mx-auto h-48 w-full max-w-sm [perspective:1000px]"
                onClick={() => setFlipped((f) => !f)}
              >
                <div
                  className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                    flipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* Front */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[image:var(--gradient-primary)] p-5 text-primary-foreground shadow-[var(--shadow-glow)] [backface-visibility:hidden]">
                    <div className="flex items-center justify-between">
                      <div className="h-7 w-10 rounded-md bg-yellow-300/90 shadow-inner" />
                      <CardBrandLogo brand={cardBrand} />
                    </div>
                    <div className="font-mono text-lg tracking-[0.2em]">
                      {(cardNumber || "•••• •••• •••• ••••").padEnd(19, " ")}
                    </div>
                    <div className="flex items-end justify-between text-[11px]">
                      <div>
                        <div className="opacity-70">Titulaire</div>
                        <div className="font-semibold uppercase tracking-wider">
                          {cardName || "VOTRE NOM"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="opacity-70">Expire</div>
                        <div className="font-semibold">{cardExp || "MM/AA"}</div>
                      </div>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 flex flex-col rounded-2xl bg-slate-900 p-5 text-primary-foreground shadow-[var(--shadow-glow)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="-mx-5 mt-3 h-10 bg-black" />
                    <div className="mt-4 flex items-center justify-end">
                      <div className="flex h-9 flex-1 items-center justify-end rounded bg-white/90 px-3 font-mono text-sm tracking-widest text-slate-900">
                        {cardCvv || "•••"}
                      </div>
                    </div>
                    <div className="mt-auto self-end">
                      <CardBrandLogo brand={cardBrand} />
                    </div>
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-foreground">
                  Numéro de carte
                </span>
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  onFocus={() => setFlipped(false)}
                  placeholder="XXXX XXXX XXXX XXXX"
                  inputMode="numeric"
                  maxLength={19}
                  className={inputCls(errors.cardNumber)}
                />
                {errors.cardNumber && (
                  <span className="mt-1 block text-[11px] text-destructive">
                    {errors.cardNumber}
                  </span>
                )}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-foreground">
                    Expiration
                  </span>
                  <input
                    value={cardExp}
                    onChange={(e) => setCardExp(formatExp(e.target.value))}
                    onFocus={() => setFlipped(false)}
                    placeholder="MM/AA"
                    inputMode="numeric"
                    maxLength={5}
                    className={inputCls(errors.cardExp)}
                  />
                  {errors.cardExp && (
                    <span className="mt-1 block text-[11px] text-destructive">
                      {errors.cardExp}
                    </span>
                  )}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-foreground">
                    CVV
                  </span>
                  <input
                    value={cardCvv}
                    onChange={(e) =>
                      setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                    placeholder="•••"
                    inputMode="numeric"
                    maxLength={4}
                    className={inputCls(errors.cardCvv)}
                  />
                  {errors.cardCvv && (
                    <span className="mt-1 block text-[11px] text-destructive">
                      {errors.cardCvv}
                    </span>
                  )}
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-foreground">
                  Nom du titulaire
                </span>
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  onFocus={() => setFlipped(false)}
                  placeholder="MAMADOU DIALLO"
                  maxLength={40}
                  className={inputCls(errors.cardName)}
                />
                {errors.cardName && (
                  <span className="mt-1 block text-[11px] text-destructive">
                    {errors.cardName}
                  </span>
                )}
              </label>
            </section>
          )}

          {/* Mobile summary */}
          <section className="rounded-2xl border border-border bg-card lg:hidden">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3"
            >
              <span className="text-sm font-semibold text-foreground">
                Récapitulatif ({items.length} article{items.length > 1 ? "s" : ""})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-primary">
                  {formatGNF(total)}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition ${
                    summaryOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
            {summaryOpen && (
              <div className="border-t border-border p-4">
                <SummaryContent
                  items={items}
                  subtotal={subtotal}
                  tva={tva}
                  total={total}
                />
              </div>
            )}
          </section>

          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-success" /> Paiement 100% sécurisé SSL
          </div>

          <button
            onClick={onPay}
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98] disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Traitement en cours…
              </>
            ) : (
              <>Confirmer et payer {formatGNF(total)}</>
            )}
          </button>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-3 rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Votre commande
            </h2>
            <SummaryContent items={items} subtotal={subtotal} tva={tva} total={total} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function MethodCard({
  selected,
  onClick,
  title,
  subtitle,
  icon,
  accent,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
        selected
          ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div
        className="grid h-10 w-10 place-items-center rounded-xl text-white"
        style={{ background: accent }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-foreground">{title}</div>
        <div className="text-[11px] text-muted-foreground">{subtitle}</div>
      </div>
      <div
        className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
          selected ? "border-primary bg-primary text-primary-foreground" : "border-border"
        }`}
      >
        {selected && <Check className="h-3 w-3" />}
      </div>
    </button>
  );
}

function CardBrandLogo({ brand }: { brand: "visa" | "mastercard" | null }) {
  if (brand === "visa")
    return (
      <span className="rounded bg-white/95 px-2 py-1 text-xs font-black italic text-[#1A1F71]">
        VISA
      </span>
    );
  if (brand === "mastercard")
    return (
      <div className="flex items-center">
        <span className="-mr-2 h-6 w-6 rounded-full bg-[#EB001B]" />
        <span className="h-6 w-6 rounded-full bg-[#F79E1B] mix-blend-screen" />
      </div>
    );
  return (
    <div className="flex items-center gap-1 opacity-70">
      <span className="rounded bg-white/30 px-1.5 py-0.5 text-[9px] font-bold">VISA</span>
      <span className="rounded bg-white/30 px-1.5 py-0.5 text-[9px] font-bold">MC</span>
    </div>
  );
}

function formatCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function inputCls(error?: string) {
  return `h-11 w-full rounded-xl border bg-surface px-3 text-sm text-foreground outline-none transition focus:ring-2 ${
    error
      ? "border-destructive focus:border-destructive focus:ring-destructive/30"
      : "border-border focus:border-primary focus:ring-primary/30"
  }`;
}

function SummaryContent({
  items,
  subtotal,
  tva,
  total,
}: {
  items: ReturnType<typeof useCart.getState>["items"];
  subtotal: number;
  tva: number;
  total: number;
}) {
  return (
    <div className="space-y-3">
      <ul className="space-y-2.5">
        {items.map(({ product, qty }) => (
          <li key={product.id} className="flex items-center gap-3">
            <div
              className="relative h-12 w-12 shrink-0 rounded-lg"
              style={{ backgroundImage: product.image }}
            >
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-xs font-semibold text-foreground">
                {product.name}
              </div>
              <div className="text-[10px] text-muted-foreground">{product.brand}</div>
            </div>
            <div className="text-xs font-bold text-foreground">
              {formatGNF(product.price * qty)}
            </div>
          </li>
        ))}
      </ul>
      <div className="space-y-1.5 border-t border-border pt-3 text-sm">
        <Row label="Sous-total" value={formatGNF(subtotal)} />
        <Row label="Livraison" value="À calculer" muted />
        <Row label="TVA (18%)" value={formatGNF(tva)} />
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-semibold text-foreground">TOTAL</span>
        <span className="text-xl font-bold text-primary">{formatGNF(total)}</span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-muted-foreground" : "font-medium text-foreground"}>
        {value}
      </span>
    </div>
  );
}
