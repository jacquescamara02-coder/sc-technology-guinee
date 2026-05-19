import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Star,
  ChevronDown,
  Check,
  Shield,
  Truck,
} from "lucide-react";
import {
  productImages,
  productReviews,
  averageRating,
  formatGNF,
} from "@/lib/data";
import { useStorefrontProduct, useRelatedProducts } from "@/lib/storefront";
import { useAdminData } from "@/lib/admin-store";
import { useCart } from "@/lib/cart-store";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/product/$productId")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const product = useStorefrontProduct(productId);
  const adminProduct = useAdminData((s) => s.products.find((p) => p.id === productId));
  const add = useCart((s) => s.add);

  const images = useMemo(() => {
    if (!adminProduct) return [] as string[];
    // Convert admin images (urls or gradients) into CSS background-image values
    const list = adminProduct.images.map((img) =>
      img.startsWith("data:") || img.startsWith("http") ? `url(${img})` : img,
    );
    return list.length > 0 ? list : product ? productImages(product) : [];
  }, [adminProduct, product]);

  const reviews = useMemo(() => (product ? productReviews(product) : []), [product]);
  const { avg, count } = useMemo(
    () => (product ? averageRating(product) : { avg: 0, count: 0 }),
    [product],
  );
  const related = useRelatedProducts(product ?? ({} as never), 8);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [descOpen, setDescOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  if (!product || !adminProduct) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        Produit introuvable.
      </div>
    );
  }

  const inStock = product.stock > 0;

  const specs = [
    { label: "Marque", value: adminProduct.brand },
    { label: "Référence", value: adminProduct.sku || adminProduct.id.toUpperCase() },
    ...adminProduct.specs
      .filter((s) => s.key || s.value)
      .map((s) => ({ label: s.key || "Spécification", value: s.value })),
    { label: "Garantie", value: "12 mois constructeur" },
    {
      label: "Disponibilité",
      value: product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock",
    },
  ];

  const description =
    adminProduct.description?.trim() ||
    "Produit de qualité disponible chez SC TECHNOLOGIE. Livraison sur Conakry et toute la Guinée. Paiement à la livraison disponible.";

  const scrollTo = (i: number) => {
    setActiveImg(i);
    galleryRef.current?.scrollTo({ left: galleryRef.current.clientWidth * i, behavior: "smooth" });
  };

  const handleAdd = () => {
    if (!inStock) return;
    add(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    add(product, qty);
    navigate({ to: "/checkout" });
  };

  return (
    <div className="pb-32">
      <div className="px-4 pt-3">
        <Breadcrumbs
          items={[
            { label: "Catégories", to: "/categories" },
            { label: product.category, to: `/categories/${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="relative mt-3">
        <div
          ref={galleryRef}
          onScroll={(e) => {
            const w = e.currentTarget.clientWidth;
            setActiveImg(Math.round(e.currentTarget.scrollLeft / w));
          }}
          className="flex aspect-square w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((bg, i) => (
            <div
              key={i}
              className="relative aspect-square w-full shrink-0 snap-center bg-cover bg-center"
              style={{ backgroundImage: bg }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
            </div>
          ))}
        </div>

        {product.badge && (
          <span
            className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              product.badge === "Promo"
                ? "bg-destructive text-destructive-foreground"
                : product.badge === "Nouveau"
                ? "bg-success text-success-foreground"
                : "bg-warning text-warning-foreground"
            }`}
          >
            {product.badge}
          </span>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={() => scrollTo(Math.max(0, activeImg - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-background/70 text-foreground backdrop-blur transition active:scale-90"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollTo(Math.min(images.length - 1, activeImg + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-background/70 text-foreground backdrop-blur transition active:scale-90"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    activeImg === i ? "w-6 bg-primary" : "w-1.5 bg-foreground/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((bg, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-16 w-16 shrink-0 rounded-xl border-2 bg-cover bg-center transition ${
                activeImg === i ? "border-primary" : "border-border"
              }`}
              style={{ backgroundImage: bg }}
              aria-label={`Voir image ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div className="space-y-4 px-4 pt-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              {product.brand}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Réf: {adminProduct.sku || product.id.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground">{product.name}</h1>
          {count > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= Math.round(avg) ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
                  />
                ))}
              </div>
              <span className="font-semibold text-foreground">{avg.toFixed(1)}</span>
              <span className="text-muted-foreground">({count} avis)</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{formatGNF(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatGNF(product.oldPrice)}</span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                inStock ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
              }`}
            >
              <Check className="h-3 w-3" /> {inStock ? `En stock (${product.stock} disponibles)` : "Rupture de stock"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
          <span className="text-sm font-semibold text-foreground">Quantité</span>
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground"
              aria-label="Diminuer"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(Math.max(1, product.stock), q + 1))}
              className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground"
              aria-label="Augmenter"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <section>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Caractéristiques techniques
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {specs.map((row, i) => (
              <div
                key={`${row.label}-${i}`}
                className={`grid grid-cols-[1fr_1.4fr] gap-3 px-4 py-2.5 text-sm ${
                  i % 2 === 0 ? "bg-surface/40" : ""
                }`}
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Description</h2>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className={`whitespace-pre-line text-sm leading-relaxed text-foreground/90 ${descOpen ? "" : "line-clamp-3"}`}>
              {description}
            </p>
            {description.length > 180 && (
              <button
                onClick={() => setDescOpen((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
              >
                {descOpen ? "Voir moins" : "Voir plus"}
                <ChevronDown className={`h-3.5 w-3.5 transition ${descOpen ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3">
            <Truck className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs font-semibold text-foreground">Livraison</div>
              <div className="text-[10px] text-muted-foreground">Toute la Guinée</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xs font-semibold text-foreground">Garantie 12 mois</div>
              <div className="text-[10px] text-muted-foreground">Constructeur</div>
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Avis clients ({reviews.length})
            </h2>
            <div className="space-y-2">
              {reviews.map((r) => (
                <article key={r.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{r.author}</div>
                      <div className="text-[10px] text-muted-foreground">{r.date}</div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-foreground/90">{r.comment}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Produits similaires
            </h2>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {related.map((p) => (
                <div key={p.id} className="w-40 shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-[calc(56px+env(safe-area-inset-bottom))] z-30 border-t border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-md gap-2 px-4 py-3">
          <button
            onClick={handleBuyNow}
            disabled={!inStock}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-transparent text-sm font-bold text-primary transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Zap className="h-4 w-4" /> Acheter maintenant
          </button>
          <button
            onClick={handleAdd}
            disabled={!inStock}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" /> Ajouté !
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" /> Ajouter au panier
              </>
            )}
          </button>
        </div>
      </div>

      <Link to="/cart" className="hidden" />
    </div>
  );
}
