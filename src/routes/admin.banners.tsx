import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useAdminData, type HeroSlide } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/banners")({
  component: BannersPage,
});

function BannersPage() {
  const settings = useAdminData((s) => s.settings);
  const { addHeroSlide, updateHeroSlide, deleteHeroSlide, moveHeroSlide, updateSettings } =
    useAdminData();
  const [draft, setDraft] = useState<Omit<HeroSlide, "id">>({
    title: "",
    subtitle: "",
    cta: "Découvrir",
    badge: "Offre limitée",
    link: "/vedette",
    hue: 260,
    active: true,
  });

  const handleAdd = () => {
    if (!draft.title.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    addHeroSlide(draft);
    setDraft({ title: "", subtitle: "", cta: "Découvrir", badge: "Offre limitée", link: "/vedette", hue: 260, active: true });
    toast.success("Bannière ajoutée");
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold">Bannières d'accueil</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Gérez le carrousel affiché en haut de la page d'accueil
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Lecture automatique</p>
            <p className="text-xs text-slate-500">Le carrousel défile toutes les 4,5 secondes</p>
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ heroAutoplay: !settings.heroAutoplay })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.heroAutoplay ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.heroAutoplay ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold">Ajouter une bannière</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Titre *" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
          <Input label="Sous-titre" value={draft.subtitle} onChange={(v) => setDraft({ ...draft, subtitle: v })} />
          <Input label="Texte du bouton" value={draft.cta} onChange={(v) => setDraft({ ...draft, cta: v })} />
          <Input
            label="Lien (ex: /vedette, /categories/laptops)"
            value={draft.link ?? ""}
            onChange={(v) => setDraft({ ...draft, link: v })}
          />
          <Input
            label="Badge (ex: Offre limitée)"
            value={draft.badge ?? ""}
            onChange={(v) => setDraft({ ...draft, badge: v })}
          />
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Teinte de fond ({draft.hue}°)
            </label>
            <input
              type="range"
              min={0}
              max={360}
              value={draft.hue ?? 260}
              onChange={(e) => setDraft({ ...draft, hue: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <ImageUploader
            value={draft.image}
            onChange={(img) => setDraft({ ...draft, image: img })}
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-slate-700">
          Bannières existantes ({settings.heroSlides.length})
        </h3>
        {settings.heroSlides.map((s, idx) => {
          const isImg = s.image && (s.image.startsWith("data:") || s.image.startsWith("http"));
          const bg = isImg
            ? `url(${s.image}) center/cover`
            : `linear-gradient(135deg, oklch(0.28 0.10 ${s.hue ?? 260}), oklch(0.50 0.22 ${(s.hue ?? 260) + 10}))`;
          return (
            <div key={s.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="h-32 relative" style={{ background: bg }}>
                {isImg && <div className="absolute inset-0 bg-black/30" />}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <p className="text-white font-bold drop-shadow">{s.title}</p>
                  <p className="text-white/90 text-xs drop-shadow">{s.subtitle}</p>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Titre" value={s.title} onChange={(v) => updateHeroSlide(s.id, { title: v })} />
                <Input label="Sous-titre" value={s.subtitle} onChange={(v) => updateHeroSlide(s.id, { subtitle: v })} />
                <Input label="Texte du bouton" value={s.cta} onChange={(v) => updateHeroSlide(s.id, { cta: v })} />
                <Input label="Lien" value={s.link ?? ""} onChange={(v) => updateHeroSlide(s.id, { link: v })} />
                <ImageUploader
                  value={s.image}
                  onChange={(img) => updateHeroSlide(s.id, { image: img })}
                />
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Teinte ({s.hue ?? 260}°)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={s.hue ?? 260}
                    onChange={(e) => updateHeroSlide(s.id, { hue: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={s.active}
                    onChange={(e) => updateHeroSlide(s.id, { active: e.target.checked })}
                  />
                  Active
                </label>
                <div className="ml-auto flex gap-1">
                  <button
                    onClick={() => moveHeroSlide(s.id, "up")}
                    disabled={idx === 0}
                    className="h-8 w-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveHeroSlide(s.id, "down")}
                    disabled={idx === settings.heroSlides.length - 1}
                    className="h-8 w-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer "${s.title}" ?`)) deleteHeroSlide(s.id);
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {settings.heroSlides.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
            Aucune bannière. Créez la première ci-dessus.
          </div>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function ImageUploader({
  value,
  onChange,
}: {
  value?: string;
  onChange: (img: string | undefined) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const isImg = value && (value.startsWith("data:") || value.startsWith("http"));
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">Image de fond (optionnelle)</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="inline-flex items-center gap-1.5 text-xs border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-lg"
        >
          {isImg ? <ImageIcon className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
          {isImg ? "Changer" : "Téléverser"}
        </button>
        {isImg && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
          >
            <X className="h-3.5 w-3.5" /> Retirer
          </button>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = () => onChange(r.result as string);
            r.readAsDataURL(f);
          }}
        />
      </div>
    </div>
  );
}
