import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAdminData } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/products/$productId/edit")({
  component: EditProductPage,
});

function EditProductPage() {
  const { productId } = Route.useParams();
  const product = useAdminData((s) => s.products.find((p) => p.id === productId));

  if (!product) {
    return (
      <div className="max-w-md text-center mx-auto py-16">
        <p className="text-slate-600">Produit introuvable.</p>
        <Link to="/admin/products" className="text-blue-600 hover:underline mt-2 inline-block">
          ← Retour aux produits
        </Link>
      </div>
    );
  }

  return <ProductForm initial={product} />;
}
