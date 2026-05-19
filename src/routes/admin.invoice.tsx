import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Printer, Save } from "lucide-react";
import { toast } from "sonner";
import { useAdminData } from "@/lib/admin-store";
import { useOrders, generateOrderId, type Order } from "@/lib/orders-store";
import { formatGNF } from "@/lib/data";

export const Route = createFileRoute("/admin/invoice")({
  component: ManualInvoicePage,
});

interface LineItem {
  id: string;
  productId?: string;
  name: string;
  qty: number;
  price: number;
}

function ManualInvoicePage() {
  const { products, settings } = useAdminData();
  const addOrder = useOrders((s) => s.addOrder);

  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    district: "",
    city: "Conakry",
  });
  const [paymentLabel, setPaymentLabel] = useState("Espèces");
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), name: "", qty: 1, price: 0 },
  ]);
  const [tvaRate, setTvaRate] = useState(Math.round((settings.vatRate ?? 0.18) * 100));

  const subtotal = items.reduce((a, i) => a + i.qty * i.price, 0);
  const tva = Math.round((subtotal * tvaRate) / 100);
  const total = subtotal + tva;

  const productOptions = useMemo(
    () => products.filter((p) => p.active),
    [products],
  );

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const removeItem = (id: string) =>
    setItems((arr) => (arr.length > 1 ? arr.filter((i) => i.id !== id) : arr));
  const addItem = () =>
    setItems((arr) => [...arr, { id: crypto.randomUUID(), name: "", qty: 1, price: 0 }]);
  const pickProduct = (id: string, productId: string) => {
    const p = products.find((pp) => pp.id === productId);
    if (!p) return;
    updateItem(id, { productId, name: p.name, price: p.price });
  };

  const validate = () => {
    if (!customer.fullName.trim()) return "Le nom du client est requis";
    if (!customer.phone.trim()) return "Le téléphone du client est requis";
    const valid = items.every((i) => i.name.trim() && i.qty > 0 && i.price >= 0);
    if (!valid) return "Chaque ligne doit avoir un produit, une quantité et un prix";
    return null;
  };

  const buildOrder = (): Order => ({
    id: generateOrderId(),
    createdAt: Date.now(),
    status: "received",
    items: items.map((i) => ({
      id: i.productId ?? i.id,
      name: i.name,
      brand: "",
      image: "",
      qty: i.qty,
      price: i.price,
    })),
    subtotal,
    tva,
    total,
    delivery: {
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      district: customer.district,
      city: customer.city,
      note: "Facture manuelle",
    },
    payment: { method: "card", label: paymentLabel, masked: "—" },
  });

  const saveOrder = () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    addOrder(buildOrder());
    toast.success("Facture enregistrée dans les commandes");
  };

  const printInvoice = () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    const order = buildOrder();
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = order.items
      .map(
        (i) =>
          `<tr><td>${escape(i.name)}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">${formatGNF(i.price)}</td><td style="text-align:right">${formatGNF(i.price * i.qty)}</td></tr>`,
      )
      .join("");
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Facture ${order.id}</title>
      <style>
      body{font-family:system-ui,Segoe UI,Roboto;padding:32px;color:#0f172a;max-width:780px;margin:auto}
      .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:24px}
      .brand{font-size:24px;font-weight:800;letter-spacing:-0.02em}
      .sub{color:#475569;font-size:12px}
      h2{margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#475569}
      table{width:100%;border-collapse:collapse;margin-top:8px}
      th,td{padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:left;font-size:13px}
      th{background:#f8fafc;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#475569}
      .totals{margin-top:16px;margin-left:auto;width:300px}
      .totals .row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px}
      .totals .grand{border-top:2px solid #0f172a;font-weight:800;font-size:16px;padding-top:10px;margin-top:6px}
      .pay{margin-top:24px;padding:12px;background:#f8fafc;border-radius:8px;font-size:12px}
      .foot{margin-top:32px;text-align:center;color:#64748b;font-size:11px}
      </style></head><body>
      <div class="head">
        <div>
          <div class="brand">SC TECHNOLOGIE</div>
          <div class="sub">${escape(settings.address)}</div>
          <div class="sub">${escape(settings.contactPhone)} • ${escape(settings.contactEmail)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:18px;font-weight:700">FACTURE</div>
          <div class="sub">N° ${order.id}</div>
          <div class="sub">${new Date(order.createdAt).toLocaleDateString("fr-FR")}</div>
        </div>
      </div>

      <h2>Client</h2>
      <div style="font-size:13px;line-height:1.5">
        <strong>${escape(customer.fullName)}</strong><br/>
        ${escape(customer.phone)}${customer.email ? " • " + escape(customer.email) : ""}<br/>
        ${escape(customer.address)}${customer.district ? ", " + escape(customer.district) : ""}, ${escape(customer.city)}
      </div>

      <h2>Détails</h2>
      <table>
        <thead><tr><th>Produit</th><th style="text-align:center">Qté</th><th style="text-align:right">PU</th><th style="text-align:right">Total</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="totals">
        <div class="row"><span>Sous-total HT</span><strong>${formatGNF(subtotal)} GNF</strong></div>
        <div class="row"><span>TVA (${tvaRate}%)</span><strong>${formatGNF(tva)} GNF</strong></div>
        <div class="row grand"><span>Total TTC</span><span>${formatGNF(total)} GNF</span></div>
      </div>

      <div class="pay">
        <strong>Mode de paiement :</strong> ${escape(paymentLabel)}<br/>
        <strong>Orange Money marchand :</strong> 610-95-38-38 • SC TECHNOLOGIE
      </div>

      <div class="foot">Merci de votre confiance — SC TECHNOLOGIE • Guinée</div>
      <script>window.print()</script>
      </body></html>`);
    w.document.close();
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Nouvelle facture</h2>
          <p className="text-sm text-slate-500 mt-0.5">Créez une facture client directement et imprimez-la</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={saveOrder}
            className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg"
          >
            <Save className="h-4 w-4" /> Enregistrer
          </button>
          <button
            onClick={printInvoice}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            <Printer className="h-4 w-4" /> Imprimer
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-slate-900">Client</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Nom complet *" value={customer.fullName} onChange={(v) => setCustomer({ ...customer, fullName: v })} />
          <Input label="Téléphone *" value={customer.phone} onChange={(v) => setCustomer({ ...customer, phone: v })} placeholder="+224 …" />
          <Input label="Email" value={customer.email} onChange={(v) => setCustomer({ ...customer, email: v })} />
          <Input label="Ville" value={customer.city} onChange={(v) => setCustomer({ ...customer, city: v })} />
          <Input label="Adresse" value={customer.address} onChange={(v) => setCustomer({ ...customer, address: v })} />
          <Input label="Quartier" value={customer.district} onChange={(v) => setCustomer({ ...customer, district: v })} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Articles</h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="h-4 w-4" /> Ajouter une ligne
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-2 py-2 text-left font-medium">Produit / Désignation</th>
                <th className="px-2 py-2 text-right font-medium w-24">Qté</th>
                <th className="px-2 py-2 text-right font-medium w-40">Prix unit. (GNF)</th>
                <th className="px-2 py-2 text-right font-medium w-32">Total</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-t border-slate-100 align-top">
                  <td className="px-2 py-2 space-y-1.5">
                    <select
                      value={i.productId ?? ""}
                      onChange={(e) => pickProduct(i.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                    >
                      <option value="">— Sélectionner un produit (ou saisir libre) —</option>
                      {productOptions.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input
                      value={i.name}
                      onChange={(e) => updateItem(i.id, { name: e.target.value, productId: undefined })}
                      placeholder="Désignation"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-sm"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number" min={1}
                      value={i.qty}
                      onChange={(e) => updateItem(i.id, { qty: Math.max(1, Number(e.target.value)) })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-sm text-right"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number" min={0}
                      value={i.price}
                      onChange={(e) => updateItem(i.id, { price: Math.max(0, Number(e.target.value)) })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-sm text-right"
                    />
                  </td>
                  <td className="px-2 py-2 text-right font-semibold whitespace-nowrap">
                    {formatGNF(i.qty * i.price)}
                  </td>
                  <td className="px-2 py-2">
                    <button onClick={() => removeItem(i.id)} className="text-slate-400 hover:text-red-600 p-1.5">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-slate-900">Paiement</h3>
          <select
            value={paymentLabel}
            onChange={(e) => setPaymentLabel(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option>Espèces</option>
            <option>Orange Money</option>
            <option>Carte bancaire</option>
            <option>Virement</option>
            <option>À crédit</option>
          </select>
          <div className="text-xs text-slate-500">
            Orange Money marchand : <strong className="text-[#FF6600]">610-95-38-38</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
          <h3 className="font-semibold text-slate-900 mb-1">Total</h3>
          <Row label="Sous-total HT" value={`${formatGNF(subtotal)} GNF`} />
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              TVA
              <input
                type="number" min={0} max={100}
                value={tvaRate}
                onChange={(e) => setTvaRate(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="mx-1 w-12 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right"
              />
              %
            </span>
            <span className="font-medium">{formatGNF(tva)} GNF</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-base font-bold">
            <span>Total TTC</span>
            <span className="text-blue-700">{formatGNF(total)} GNF</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-700 mb-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function escape(s: string) {
  return (s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
