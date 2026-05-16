import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { X, Plus, Upload, Trash2 } from "lucide-react";
import {
  useAdminData,
  generateProductId,
  type AdminProduct,
} from "@/lib/admin-store";
import { simulateFacebookPublish } from "@/lib/facebook";

interface Props {
  initial?: AdminProduct;
}

const emptyProduct = (): AdminProduct => ({
  id: generateProductId(),
  name: "",
  brand: "",
  category: "",
  subcategory: "",
  price: 0,
  stock: 0,
  sku: "",
  description: "",
  specs: [{ key: "", value: "" }],
  images: [],
  active: true,
  publishFacebook: false,
});

export function ProductForm({ initial }: Props) {
  const navigate = useNavigate();
  const { categories, addProduct, updateProduct } = useAdminData();
  const [p, setP] = useState<AdminProduct>(initial ?? emptyProduct());
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (initial) setP(initial);
  }, [initial]);

  const cat = categories.find((c) => c.id === p.category);
  const subs = cat?.subcategories ?? [];

  const set = <K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) =>
    setP((prev) => ({ ...prev, [key]: value }));

  const addSpecRow = () => set("specs", [...p.specs, { key: "", value: "" }]);
  const removeSpecRow = (i: number) =>
    set(
      "specs",
      p.specs.filter((_, idx) => idx !== i),
    );
  const updateSpec = (i: number, field: "key" | "value", v: string) =>
    set(
      "specs",
      p.specs.map((s, idx) => (idx === i ? { ...s, [field]: v } : s)),
    );

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = 8 - p.images.length;
    const arr = Array.from(files).slice(0, remaining);
    Promise.all(
      arr.map(
        (f) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(f);
          }),
      ),
    ).then((urls) => set("images", [...p.images, ...urls]));
  };

  const removeImage = (i: number) =>
    set(
      "images",
      p.images.filter((_, idx) => idx !== i),
    );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p.name || !p.category || !p.subcategory) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    const isNew = !initial;
    if (initial) {
      updateProduct(p.id, p);
    } else {
      addProduct(p);
    }
    const auto = useAdminData.getState().settings.facebookAutoPublish;
    if (p.publishFacebook || (isNew && auto)) {
      void simulateFacebookPublish(p);
    }
    navigate({ to: "/admin/products" });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold">
          {initial ? "Modifier le produit" : "Nouveau produit"}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {initial ? p.name : "Ajoutez un produit à votre catalogue"}
        </p>
      </div>

      <Section title="Informations générales">
        <Field label="Nom du produit *">
          <input
            value={p.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className="input"
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Catégorie *">
            <select
              value={p.category}
              onChange={(e) => {
                set("category", e.target.value);
                set("subcategory", "");
              }}
              required
              className="input"
            >
              <option value="">— Choisir —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sous-catégorie *">
            <select
              value={p.subcategory}
              onChange={(e) => set("subcategory", e.target.value)}
              required
              disabled={!cat}
              className="input"
            >
              <option value="">— Choisir —</option>
              {subs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Marque">
            <input
              value={p.brand}
              onChange={(e) => set("brand", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="SKU / Référence">
            <input
              value={p.sku}
              onChange={(e) => set("sku", e.target.value)}
              className="input"
            />
          </Field>
        </div>
        <Field label="Description">
          <textarea
            value={p.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            className="input resize-none"
          />
        </Field>
      </Section>

      <Section title="Caractéristiques techniques">
        <div className="space-y-2">
          {p.specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={s.key}
                onChange={(e) => updateSpec(i, "key", e.target.value)}
                placeholder="Ex : Processeur"
                className="input flex-1"
              />
              <input
                value={s.value}
                onChange={(e) => updateSpec(i, "value", e.target.value)}
                placeholder="Ex : Intel i7-12700H"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={() => removeSpecRow(i)}
                className="h-10 w-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecRow}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mt-2"
          >
            <Plus className="h-4 w-4" /> Ajouter une ligne
          </button>
        </div>
      </Section>

      <Section title="Images (jusqu'à 8)">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={
            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors " +
            (dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 hover:border-slate-400 bg-slate-50")
          }
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-6 w-6 text-slate-400 mx-auto" />
          <p className="text-sm text-slate-600 mt-2">
            Glissez-déposez ou cliquez pour téléverser
          </p>
          <p className="text-xs text-slate-400 mt-0.5">PNG, JPG jusqu'à 8 images</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        {p.images.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-4">
            {p.images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                {img.startsWith("data:") || img.startsWith("http") ? (
                  <img src={img} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full" style={{ background: img }} />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white/90 text-slate-700 flex items-center justify-center hover:bg-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Prix et stock">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Prix (GNF)">
            <input
              type="number"
              min={0}
              value={p.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Stock disponible">
            <input
              type="number"
              min={0}
              value={p.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
              className="input"
            />
          </Field>
        </div>
      </Section>

      <Section title="Statut & publication">
        <div className="space-y-3">
          <Toggle
            label="Produit actif"
            description="Visible dans la boutique"
            value={p.active}
            onChange={(v) => set("active", v)}
          />
          <Toggle
            label="Publier sur Facebook"
            description="Publication automatique (à configurer)"
            value={p.publishFacebook}
            onChange={(v) => set("publishFacebook", v)}
          />
        </div>
      </Section>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          Enregistrer le produit
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/products" })}
          className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-5 py-2.5 rounded-lg"
        >
          Annuler
        </button>
      </div>

      <style>{`.input{width:100%;padding:0.5rem 0.75rem;border:1px solid rgb(203 213 225);border-radius:0.5rem;font-size:0.875rem;background:white;color:rgb(15 23 42)}.input:focus{outline:none;border-color:transparent;box-shadow:0 0 0 2px rgb(59 130 246)}`}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
      <h3 className="font-semibold text-slate-900">{title}</h3>
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

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors " +
          (value ? "bg-blue-600" : "bg-slate-300")
        }
      >
        <span
          className={
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform " +
            (value ? "translate-x-6" : "translate-x-1")
          }
        />
      </button>
    </div>
  );
}
