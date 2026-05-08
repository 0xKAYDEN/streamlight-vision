import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Plus, RotateCcw } from "lucide-react";
import { resetCatalog } from "@/lib/catalog-store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [{ title: "Admin — ThunderStream" }],
  }),
});

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="px-4 md:px-8 py-8">
      <div className="bg-gradient-hero absolute top-0 inset-x-0 h-72 -z-10 opacity-60" />
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
          Control room
        </h1>
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">CMS · Local</span>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-white/10 text-foreground" }}
            className="inline-flex items-center gap-2 rounded-md glass px-3 py-2 text-xs hover:bg-white/10 transition"
          >
            <LayoutGrid className="size-3.5" /> Titles
          </Link>
          <Link
            to="/admin/titles/$id"
            params={{ id: "new" }}
            activeProps={{ className: path.endsWith("/new") ? "bg-gradient-brand text-white shadow-glow" : "" }}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-3 py-2 text-xs font-medium text-white shadow-glow hover:opacity-95 transition"
          >
            <Plus className="size-3.5" /> New title
          </Link>
          <button
            onClick={() => {
              if (confirm("Reset the catalog to default seed data? Your local edits will be lost.")) {
                resetCatalog();
              }
            }}
            className="inline-flex items-center gap-2 rounded-md glass px-3 py-2 text-xs hover:bg-white/10 transition"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
