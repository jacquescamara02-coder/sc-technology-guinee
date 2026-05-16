import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-store";
import logoUrl from "@/assets/sc-logo.png";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAuthed, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthed) navigate({ to: "/admin/dashboard" });
  }, [isAuthed, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(email, password)) {
      navigate({ to: "/admin/dashboard" });
    } else {
      setError("Identifiants incorrects. Vérifiez l'email et le mot de passe.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-white shadow-xl shadow-blue-600/10 border border-slate-200 mb-5 p-2">
            <img
              src={logoUrl}
              alt="SC TECHNOLOGY"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SC TECHNOLOGY <span className="text-blue-600">Admin</span></h1>
          <p className="text-sm text-slate-500 mt-1.5">Espace réservé à l'administration</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200 p-8 border border-slate-200"
        >
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@techshopgn.com"
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
          <div className="relative mb-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Se connecter
          </button>

          <p className="text-xs text-slate-400 mt-6 text-center">
            Démo : admin@techshopgn.com / Admin2024!
          </p>
        </form>

        <Link to="/" className="block text-center text-sm text-slate-500 hover:text-slate-700 mt-6">
          ← Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
