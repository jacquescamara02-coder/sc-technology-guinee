import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Check, Truck, CreditCard, ClipboardCheck } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatGNF } from "@/lib/data";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

const CITIES = [
  "Conakry",
  "Labé",
  "Kankan",
  "N'Zérékoré",
  "Kindia",
  "Faranah",
  "Mamou",
  "Siguiri",
  "Boké",
  "Coyah",
  "Autre",
] as const;

const TVA_RATE = 0.18;

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  notes: string;
}

interface Errors {
  [k: string]: string | undefined;
}

const STEPS = [
  { id: 1, label: "Livraison", icon: Truck },
  { id: 2, label: "Paiement", icon: CreditCard },
  { id: 3, label: "Confirmation", icon: ClipboardCheck },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const subtotal = items.reduce((a, i) => a + i.qty * i.product.price, 0);
  const tva = Math.round(subtotal * TVA_RATE);
  const total = subtotal + tva;

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "+224 ",
    email: "",
    city: "",
    district: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-xl font-bold text-foreground">Votre panier est vide</h1>
        <p className="text-sm text-muted-foreground">Ajoutez des produits pour passer commande.</p>
        <Link
          to="/"
          className="mt-3 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          Continuer mes achats
        </Link>
      </div>
    );
  }

  const setField = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (form.fullName.trim().length < 3) e.fullName = "Nom complet requis (min. 3 caractères)";
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!/^224\d{8,9}$/.test(phoneDigits)) e.phone = "Téléphone invalide (format +224 XXX XXX XXX)";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.city) e.city = "Sélectionnez une ville";
    if (form.district.trim().length < 2) e.district = "Quartier requis";
    if (form.address.trim().length < 5) e.address = "Adresse complète requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    // Step 2 (paiement) not implemented yet — just go back to cart with a confirmation
    alert("Informations enregistrées. L'étape Paiement sera disponible prochainement.");
    navigate({ to: "/cart" });
  };

  return (
    <div className="space-y-4 px-4 py-4 pb-32">
      {/* Header w/ back */}
      <div className="flex items-center gap-2">
        <Link
          to="/cart"
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground"
          aria-label="Retour au panier"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Commander</h1>
      </div>

      {/* Progress bar */}
      <ol className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const active = s.id === 1;
          const Icon = s.icon;
          return (
            <li key={s.id} className="flex flex-1 items-center gap-2">
              <div className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-full border-2 ${
                    active
                      ? "border-primary bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Informations de livraison
            </h2>

            <Field label="Nom complet" error={errors.fullName}>
              <input
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                placeholder="Mamadou Diallo"
                maxLength={100}
                className={inputCls(errors.fullName)}
              />
            </Field>

            <Field label="Téléphone" error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+224 6XX XX XX XX"
                inputMode="tel"
                maxLength={20}
                className={inputCls(errors.phone)}
              />
            </Field>

            <Field label="Email (optionnel)" error={errors.email}>
              <input
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="vous@exemple.com"
                type="email"
                maxLength={120}
                className={inputCls(errors.email)}
              />
            </Field>

            <Field label="Ville" error={errors.city}>
              <div className="relative">
                <select
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  className={`${inputCls(errors.city)} appearance-none pr-9`}
                >
                  <option value="">Sélectionnez votre ville</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </Field>

            <Field label="Quartier / Commune" error={errors.district}>
              <input
                value={form.district}
                onChange={(e) => setField("district", e.target.value)}
                placeholder="Kaloum, Ratoma, Matam..."
                maxLength={80}
                className={inputCls(errors.district)}
              />
            </Field>

            <Field label="Adresse complète" error={errors.address}>
              <input
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="Rue, numéro, point de repère"
                maxLength={200}
                className={inputCls(errors.address)}
              />
            </Field>

            <Field label="Instructions spéciales (optionnel)">
              <textarea
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Étage, horaires, indications utiles..."
                rows={3}
                maxLength={400}
                className={`${inputCls()} resize-none`}
              />
            </Field>
          </section>

          {/* Mobile collapsible summary */}
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
                <span className="text-base font-bold text-primary">{formatGNF(total)}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${summaryOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
            {summaryOpen && (
              <div className="border-t border-border p-4">
                <SummaryContent items={items} subtotal={subtotal} tva={tva} total={total} />
              </div>
            )}
          </section>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98]"
          >
            Continuer vers le paiement <ChevronRight className="h-4 w-4" />
          </button>
        </form>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-3 rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Votre commande</h2>
            <SummaryContent items={items} subtotal={subtotal} tva={tva} total={total} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
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
            <div className="relative h-12 w-12 shrink-0 rounded-lg" style={{ backgroundImage: product.image }}>
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {qty}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="line-clamp-1 text-xs font-semibold text-foreground">{product.name}</div>
              <div className="text-[10px] text-muted-foreground">{product.brand}</div>
            </div>
            <div className="text-xs font-bold text-foreground">{formatGNF(product.price * qty)}</div>
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
      <div className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-[11px] text-success">
        <Check className="h-3.5 w-3.5" /> Paiement à la livraison disponible
      </div>
    </div>
  );
}

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-muted-foreground" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}
