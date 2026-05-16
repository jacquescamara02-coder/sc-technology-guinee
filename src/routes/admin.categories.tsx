import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useAdminData } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
  } = useAdminData();
  const [newCat, setNewCat] = useState("");
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingSub, setEditingSub] = useState<string | null>(null);
  const [editingSubName, setEditingSubName] = useState("");
  const [newSubByCat, setNewSubByCat] = useState<Record<string, string>>({});

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Catégories</h2>
        <p className="text-sm text-slate-500 mt-0.5">Gérez les catégories et sous-catégories de votre catalogue</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-2">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="Nom de la nouvelle catégorie"
          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            if (newCat.trim()) {
              addCategory(newCat.trim());
              setNewCat("");
            }
          }}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 flex items-center gap-3 border-b border-slate-100">
              {editingCat === c.id ? (
                <>
                  <input
                    value={editingCatName}
                    onChange={(e) => setEditingCatName(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md"
                  />
                  <IconBtn
                    onClick={() => {
                      updateCategory(c.id, editingCatName);
                      setEditingCat(null);
                    }}
                    color="green"
                  >
                    <Check className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn onClick={() => setEditingCat(null)}>
                    <X className="h-4 w-4" />
                  </IconBtn>
                </>
              ) : (
                <>
                  <h3 className="flex-1 font-semibold">{c.name}</h3>
                  <span className="text-xs text-slate-500">
                    {c.subcategories.length} sous-cat.
                  </span>
                  <IconBtn
                    onClick={() => {
                      setEditingCat(c.id);
                      setEditingCatName(c.name);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn
                    onClick={() => {
                      if (confirm(`Supprimer la catégorie "${c.name}" ?`)) deleteCategory(c.id);
                    }}
                    color="red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </>
              )}
            </div>
            <div className="px-5 py-3 space-y-2">
              {c.subcategories.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-sm">
                  {editingSub === `${c.id}/${s.id}` ? (
                    <>
                      <input
                        value={editingSubName}
                        onChange={(e) => setEditingSubName(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md"
                      />
                      <IconBtn
                        onClick={() => {
                          updateSubcategory(c.id, s.id, editingSubName);
                          setEditingSub(null);
                        }}
                        color="green"
                      >
                        <Check className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn onClick={() => setEditingSub(null)}>
                        <X className="h-4 w-4" />
                      </IconBtn>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 pl-3 text-slate-700">— {s.name}</span>
                      <IconBtn
                        onClick={() => {
                          setEditingSub(`${c.id}/${s.id}`);
                          setEditingSubName(s.name);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn
                        onClick={() => {
                          if (confirm(`Supprimer "${s.name}" ?`)) deleteSubcategory(c.id, s.id);
                        }}
                        color="red"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconBtn>
                    </>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <input
                  value={newSubByCat[c.id] ?? ""}
                  onChange={(e) =>
                    setNewSubByCat({ ...newSubByCat, [c.id]: e.target.value })
                  }
                  placeholder="Nouvelle sous-catégorie"
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-md"
                />
                <button
                  onClick={() => {
                    const v = (newSubByCat[c.id] ?? "").trim();
                    if (v) {
                      addSubcategory(c.id, v);
                      setNewSubByCat({ ...newSubByCat, [c.id]: "" });
                    }
                  }}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 px-2"
                >
                  <Plus className="h-3.5 w-3.5" /> Ajouter
                </button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
            Aucune catégorie. Créez la première ci-dessus.
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color?: "red" | "green";
}) {
  const c =
    color === "red"
      ? "text-red-600 hover:bg-red-50"
      : color === "green"
        ? "text-emerald-600 hover:bg-emerald-50"
        : "text-slate-500 hover:bg-slate-100";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 w-8 flex items-center justify-center rounded-md ${c}`}
    >
      {children}
    </button>
  );
}
