import { toast } from "sonner";
import { useAdminData, type AdminProduct, type FacebookPost } from "@/lib/admin-store";
import { formatGNF } from "@/lib/data";

export function generateFacebookCaption(p: AdminProduct): string {
  const shortDesc =
    p.description.trim().split("\n").slice(0, 2).join("\n") ||
    `${p.brand} — ${p.name}`;
  return `🆕 ${p.name}
💰 Prix : ${formatGNF(p.price)} GNF
📦 En stock : ${p.stock} unités

${shortDesc}

✅ Livraison disponible sur Conakry et toute la Guinée
📲 Commandez via notre application

#TechShopGN #Informatique #Guinée #Conakry`;
}

export async function simulateFacebookPublish(p: AdminProduct): Promise<boolean> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));
  // 90% success rate
  const ok = Math.random() > 0.1;
  const post: FacebookPost = {
    id: `fbp-${Date.now().toString(36)}`,
    productId: p.id,
    productName: p.name,
    productImage: p.images[0] ?? "",
    caption: generateFacebookCaption(p),
    date: new Date().toISOString(),
    status: ok ? "success" : "failed",
  };
  useAdminData.getState().recordFacebookPost(post);
  if (ok) {
    toast.success("✅ Produit publié sur Facebook avec succès");
  } else {
    toast.error("❌ Échec de la publication sur Facebook");
  }
  return ok;
}

export async function simulateFacebookTest(pageId: string, token: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 900));
  return pageId.trim().length > 0 && token.trim().length >= 8;
}
