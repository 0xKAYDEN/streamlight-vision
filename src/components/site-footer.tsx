import { Zap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="px-4 md:px-8 py-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center size-6 rounded-md bg-gradient-brand">
            <Zap className="size-3.5 text-white fill-white" />
          </span>
          <span className="text-foreground font-medium">ThunderStream</span>
          <span>· Premium Streaming. Lightning Fast.</span>
        </div>
        <div className="flex gap-6">
          <a className="hover:text-foreground transition" href="#">Pricing</a>
          <a className="hover:text-foreground transition" href="#">Changelog</a>
          <a className="hover:text-foreground transition" href="#">Contact</a>
          <a className="hover:text-foreground transition" href="#">Docs</a>
        </div>
      </div>
    </footer>
  );
}
