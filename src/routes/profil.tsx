import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
  Heart,
  Package,
  Settings,
  Facebook,
  MessageCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useState } from "react";
import { toast } from "sonner";
import { ThemePicker } from "@/components/ThemePicker";
import { useOrders } from "@/lib/orders-store";

export const Route = createFileRoute("/profil")({
  component: ProfilePage,
});

interface ProfileState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  notifications: boolean;
  update: (patch: Partial<Omit<ProfileState, "update" | "signOut">>) => void;
  signOut: () => void;
}

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      fullName: "RDIALLO",
      email: "rdiallo2045@gmail.com",
      phone: "+224 610-95-38-38",
      address: "",
      district: "",
      city: "Conakry",
      notifications: true,
      update: (patch) => set((s) => ({ ...s, ...patch })),
      signOut: () =>
        set({
          fullName: "RDIALLO",
          email: "rdiallo2045@gmail.com",
          phone: "+224 610-95-38-38",
          address: "",
          district: "",
          city: "Conakry",
          notifications: true,
        }),
    }),
    {
      name: "sc-profile",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as never),
      ),
    },
  ),
);

interface Item {
  icon: LucideIcon;
  label: string;
  hint?: string;
  to?: string;
  href?: string;
  action?: "edit" | "address" | "notifications" | "help";
}

function ProfilePage() {
  const profile = useProfile();
  const ordersCount = useOrders((s) => s.orders.length);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<null | "edit" | "address" | "help">(null);

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const groups: { title: string; items: Item[] }[] = [
    {
      title: "Compte",
      items: [
        { icon: User, label: "Informations personnelles", hint: profile.email, action: "edit" },
        {
          icon: MapPin,
          label: "Adresse de livraison",
          hint: profile.address ? `${profile.address}, ${profile.city}` : profile.city,
          action: "address",
        },
        { icon: Package, label: "Mes commandes", hint: `${ordersCount} commande(s)`, to: "/orders" },
        { icon: CreditCard, label: "Moyens de paiement", hint: "Orange Money · Carte", to: "/checkout" },
      ],
    },
    {
      title: "Préférences",
      items: [
        { icon: Heart, label: "Mes favoris", to: "/vedette" },
        {
          icon: Bell,
          label: "Notifications",
          hint: profile.notifications ? "Activées" : "Désactivées",
          action: "notifications",
        },
        { icon: Shield, label: "Sécurité & confidentialité", action: "help" },
      ],
    },
    {
      title: "Boutique",
      items: [
        { icon: Settings, label: "Espace administrateur", to: "/admin" },
        { icon: Facebook, label: "Page Facebook", href: "https://fb.me/8TeLA81zv" },
        { icon: MessageCircle, label: "Contacter sur WhatsApp", href: "https://wa.me/224610953838" },
      ],
    },
    {
      title: "Aide",
      items: [{ icon: HelpCircle, label: "Centre d'aide", action: "help" }],
    },
  ];

  const handleItemClick = (it: Item) => {
    if (it.to) navigate({ to: it.to });
    else if (it.href) window.open(it.href, "_blank");
    else if (it.action === "edit") setOpenModal("edit");
    else if (it.action === "address") setOpenModal("address");
    else if (it.action === "help") setOpenModal("help");
    else if (it.action === "notifications") {
      profile.update({ notifications: !profile.notifications });
      toast.success(
        profile.notifications ? "Notifications désactivées" : "Notifications activées",
      );
    }
  };

  return (
    <div className="space-y-5 px-4 py-4">
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-2xl font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
            {initials || "R"}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-foreground">{profile.fullName}</h1>
            <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-primary">Client SC TECHNOLOGIE</p>
          </div>
          <button
            onClick={() => setOpenModal("edit")}
            className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-[11px] font-semibold text-foreground hover:bg-accent"
          >
            Modifier
          </button>
        </div>
      </div>

      <ThemePicker />

      {groups.map((g) => (
        <section key={g.title}>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {g.title}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {g.items.map((it, idx) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.label}
                  onClick={() => handleItemClick(it)}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-accent ${
                    idx > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-surface-elevated text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{it.label}</div>
                    {it.hint && (
                      <div className="truncate text-[11px] text-muted-foreground">{it.hint}</div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <button
        onClick={() => {
          profile.signOut();
          toast.success("Vous êtes déconnecté");
        }}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 text-sm font-semibold text-destructive transition hover:bg-destructive/15"
      >
        <LogOut className="h-4 w-4" /> Se déconnecter
      </button>

      <p className="pb-4 text-center text-[11px] text-muted-foreground">
        SC TECHNOLOGIE • v1.0.0
      </p>

      {openModal === "edit" && (
        <EditProfileModal
          onClose={() => setOpenModal(null)}
          initial={{ fullName: profile.fullName, email: profile.email, phone: profile.phone }}
          onSave={(d) => {
            profile.update(d);
            toast.success("Profil mis à jour");
            setOpenModal(null);
          }}
        />
      )}

      {openModal === "address" && (
        <EditAddressModal
          onClose={() => setOpenModal(null)}
          initial={{ address: profile.address, district: profile.district, city: profile.city }}
          onSave={(d) => {
            profile.update(d);
            toast.success("Adresse enregistrée");
            setOpenModal(null);
          }}
        />
      )}

      {openModal === "help" && (
        <HelpModal onClose={() => setOpenModal(null)} />
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 sm:items-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl bg-card p-5 shadow-2xl sm:rounded-3xl">
        <h3 className="mb-4 text-base font-bold text-foreground">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function EditProfileModal({
  initial,
  onSave,
  onClose,
}: {
  initial: { fullName: string; email: string; phone: string };
  onSave: (d: { fullName: string; email: string; phone: string }) => void;
  onClose: () => void;
}) {
  const [d, setD] = useState(initial);
  return (
    <Modal title="Informations personnelles" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Nom complet">
          <input value={d.fullName} onChange={(e) => setD({ ...d, fullName: e.target.value })} className="profile-input" />
        </Field>
        <Field label="Email">
          <input type="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} className="profile-input" />
        </Field>
        <Field label="Téléphone">
          <input value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} className="profile-input" />
        </Field>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border bg-surface-elevated py-2.5 text-sm font-semibold text-foreground">Annuler</button>
          <button onClick={() => onSave(d)} className="flex-1 rounded-xl bg-[image:var(--gradient-primary)] py-2.5 text-sm font-bold text-primary-foreground">Enregistrer</button>
        </div>
      </div>
      <style>{`.profile-input{width:100%;padding:0.55rem 0.75rem;border-radius:0.65rem;background:hsl(var(--background));border:1px solid hsl(var(--border));color:hsl(var(--foreground));font-size:0.875rem}`}</style>
    </Modal>
  );
}

function EditAddressModal({
  initial,
  onSave,
  onClose,
}: {
  initial: { address: string; district: string; city: string };
  onSave: (d: { address: string; district: string; city: string }) => void;
  onClose: () => void;
}) {
  const [d, setD] = useState(initial);
  return (
    <Modal title="Adresse de livraison" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Adresse">
          <input value={d.address} onChange={(e) => setD({ ...d, address: e.target.value })} placeholder="Rue, immeuble…" className="profile-input" />
        </Field>
        <Field label="Quartier">
          <input value={d.district} onChange={(e) => setD({ ...d, district: e.target.value })} placeholder="Kaloum, Ratoma…" className="profile-input" />
        </Field>
        <Field label="Ville">
          <input value={d.city} onChange={(e) => setD({ ...d, city: e.target.value })} className="profile-input" />
        </Field>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border bg-surface-elevated py-2.5 text-sm font-semibold text-foreground">Annuler</button>
          <button onClick={() => onSave(d)} className="flex-1 rounded-xl bg-[image:var(--gradient-primary)] py-2.5 text-sm font-bold text-primary-foreground">Enregistrer</button>
        </div>
      </div>
      <style>{`.profile-input{width:100%;padding:0.55rem 0.75rem;border-radius:0.65rem;background:hsl(var(--background));border:1px solid hsl(var(--border));color:hsl(var(--foreground));font-size:0.875rem}`}</style>
    </Modal>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Besoin d'aide ?" onClose={onClose}>
      <div className="space-y-3 text-sm text-foreground">
        <p>Notre équipe SC TECHNOLOGIE est disponible 7j/7 pour vous accompagner.</p>
        <div className="space-y-2">
          <a href="tel:+224610953838" className="flex items-center justify-between rounded-xl border border-border bg-surface-elevated px-4 py-3">
            <span className="font-medium">Appeler</span>
            <span className="text-primary font-semibold">610-95-38-38</span>
          </a>
          <a href="https://wa.me/224610953838" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-surface-elevated px-4 py-3">
            <span className="font-medium">WhatsApp</span>
            <span className="text-[#25D366] font-semibold">Envoyer un message</span>
          </a>
          <a href="mailto:contact@sctechnology.gn" className="flex items-center justify-between rounded-xl border border-border bg-surface-elevated px-4 py-3">
            <span className="font-medium">Email</span>
            <span className="text-primary font-semibold">contact@sctechnology.gn</span>
          </a>
        </div>
        <button onClick={onClose} className="mt-2 w-full rounded-xl border border-border bg-surface-elevated py-2.5 text-sm font-semibold text-foreground">Fermer</button>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
