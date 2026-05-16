import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    const authed = useAdminAuth.getState().isAuthed;
    throw redirect({ to: authed ? "/admin/dashboard" : "/admin/login" });
  },
});
