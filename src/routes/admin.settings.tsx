import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Facebook, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminData } from "@/lib/admin-store";
import { formatGNF } from "@/lib/data";
import { simulateFacebookTest } from "@/lib/facebook";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, updateSettings } = useAdminData();
  const [s, setS] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(s);
    setSaved(true);
    toast.success("Paramètres enregistrés");
    setTimeout(() => setSaved(false), 2500);
  };

  const testConnection = async () => {
    setTesting(true);
    const ok = await simulateFacebookTest(s.facebookPageId, s.facebookToken);
    setTesting(false);
    if (ok) toast.success("Connexion Facebook réussie ✅");
    else toast.error("Connexion impossible — vérifiez l'ID et le token");
  };

  return (
    <form onSubmit={save} className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Paramètres</h2>
        <p className="text-sm text-slate-500 mt-0.5">Informations de la boutique</p>
      </div>

      <Section title="Informations générales">
        <Field label="Nom de la boutique">
          <input
            value={s.storeName}
            onChange={(e) => setS({ ...s, storeName: e.target.value })}
            className="adm-input"
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Email de contact">
            <input
              type="email"
              value={s.contactEmail}
              onChange={(e) => setS({ ...s, contactEmail: e.target.value })}
              className="adm-input"
            />
          </Field>
          <Field label="Téléphone (+224)">
            <input
              value={s.contactPhone}
              onChange={(e) => setS({ ...s, contactPhone: e.target.value })}
              className="adm-input"
            />
          </Field>
        </div>
        <Field label="WhatsApp Support">
          <input
            value={s.whatsapp}
            onChange={(e) => setS({ ...s, whatsapp: e.target.value })}
            className="adm-input"
          />
        </Field>
      </Section>

      <Section title="Frais de livraison par ville (GNF)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Ville</th>
                <th className="text-left px-3 py-2 font-medium">Frais (GNF)</th>
                <th className="text-left px-3 py-2 font-medium w-32">Aperçu</th>
              </tr>
            </thead>
            <tbody>
              {s.deliveryFees.map((d, i) => (
                <tr key={d.city} className="border-t border-slate-100">
                  <td className="px-3 py-2">{d.city}</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      value={d.fee}
                      onChange={(e) =>
                        setS({
                          ...s,
                          deliveryFees: s.deliveryFees.map((x, idx) =>
                            idx === i ? { ...x, fee: Number(e.target.value) } : x,
                          ),
                        })
                      }
                      className="adm-input"
                    />
                  </td>
                  <td className="px-3 py-2 text-slate-500 text-xs">{formatGNF(d.fee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-[#1877F2] text-white flex items-center justify-center">
            <Facebook className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Intégration Facebook</h3>
            <p className="text-xs text-slate-500">Publiez automatiquement vos produits sur votre page</p>
          </div>
        </div>
        <Field label="ID de la page Facebook">
          <input
            value={s.facebookPageId}
            onChange={(e) => setS({ ...s, facebookPageId: e.target.value })}
            placeholder="123456789"
            className="adm-input"
          />
        </Field>
        <Field label="Token d'accès (Page Access Token)">
          <input
            type="password"
            value={s.facebookToken}
            onChange={(e) => setS({ ...s, facebookToken: e.target.value })}
            placeholder="EAAB..."
            className="adm-input"
          />
        </Field>
        <div>
          <button
            type="button"
            onClick={testConnection}
            disabled={testing}
            className="inline-flex items-center gap-2 text-sm border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-lg disabled:opacity-60"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Tester la connexion
          </button>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-sm font-medium text-slate-900">Publier automatiquement les nouveaux produits</p>
            <p className="text-xs text-slate-500">Chaque nouveau produit sera publié sur la page Facebook</p>
          </div>
          <button
            type="button"
            onClick={() => setS({ ...s, facebookAutoPublish: !s.facebookAutoPublish })}
            className={
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors " +
              (s.facebookAutoPublish ? "bg-blue-600" : "bg-slate-300")
            }
          >
            <span
              className={
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform " +
                (s.facebookAutoPublish ? "translate-x-6" : "translate-x-1")
              }
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          <Save className="h-4 w-4" /> Enregistrer les paramètres
        </button>
        {saved && (
          <span className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Paramètres enregistrés ✓
          </span>
        )}
      </div>

      <style>{`.adm-input{width:100%;padding:0.5rem 0.75rem;border:1px solid rgb(203 213 225);border-radius:0.5rem;font-size:0.875rem;background:white;color:rgb(15 23 42)}.adm-input:focus{outline:none;box-shadow:0 0 0 2px rgb(59 130 246);border-color:transparent}`}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
