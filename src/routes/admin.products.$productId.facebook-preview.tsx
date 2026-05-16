import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Copy, Send, RefreshCw, Loader2, ThumbsUp, MessageCircle, Share2, Facebook } from "lucide-react";
import { toast } from "sonner";
import { useAdminData } from "@/lib/admin-store";
import { generateFacebookCaption, simulateFacebookPublish } from "@/lib/facebook";

export const Route = createFileRoute("/admin/products/$productId/facebook-preview")({
  component: FacebookPreviewPage,
});

function FacebookPreviewPage() {
  const { productId } = Route.useParams();
  const product = useAdminData((s) => s.products.find((p) => p.id === productId));
  const settings = useAdminData((s) => s.settings);
  const [publishing, setPublishing] = useState(false);

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

  const caption = generateFacebookCaption(product);
  const alreadyPublished = !!product.facebookPostedAt;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      toast.success("Texte copié dans le presse-papiers");
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    await simulateFacebookPublish(product);
    setPublishing(false);
  };

  const image = product.images[0] ?? "";
  const isImg = image.startsWith("data:") || image.startsWith("http");

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Produits
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Facebook className="h-6 w-6 text-[#1877F2]" /> Aperçu Facebook
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Voici comment votre produit apparaîtra sur la page Facebook
        </p>
      </div>

      {/* Facebook-style post preview */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold">
            {settings.storeName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 truncate">{settings.storeName}</p>
            <p className="text-xs text-slate-500">À l'instant · 🌍</p>
          </div>
        </div>
        <div className="px-4 pb-3 text-sm text-slate-800 whitespace-pre-line">{caption}</div>
        <div className="aspect-square bg-slate-100">
          {isImg ? (
            <img src={image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full" style={{ background: image || "#e2e8f0" }} />
          )}
        </div>
        <div className="border-t border-slate-100 px-4 py-2 flex items-center justify-around text-slate-600 text-sm">
          <button className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-50">
            <ThumbsUp className="h-4 w-4" /> J'aime
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-50">
            <MessageCircle className="h-4 w-4" /> Commenter
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-50">
            <Share2 className="h-4 w-4" /> Partager
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Copy className="h-4 w-4" /> Copier le texte
        </button>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="inline-flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#1565d8] text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {publishing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Publication…
            </>
          ) : alreadyPublished ? (
            <>
              <RefreshCw className="h-4 w-4" /> Republier
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Publier maintenant
            </>
          )}
        </button>
        {alreadyPublished && (
          <span className="text-xs text-slate-500 self-center">
            Dernière publication : {new Date(product.facebookPostedAt!).toLocaleString("fr-FR")}
          </span>
        )}
      </div>
    </div>
  );
}
