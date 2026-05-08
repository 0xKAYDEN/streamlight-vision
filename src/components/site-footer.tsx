import { Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="px-4 md:px-8 py-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center size-6 rounded-md bg-gradient-brand">
            <Zap className="size-3.5 text-white fill-white" />
          </span>
          <span className="text-foreground font-medium">ThunderStream</span>
          <span>· {t("footer.tag")}</span>
        </div>
        <div className="flex gap-6">
          <a className="hover:text-foreground transition" href="#">{t("footer.pricing")}</a>
          <a className="hover:text-foreground transition" href="#">{t("footer.changelog")}</a>
          <a className="hover:text-foreground transition" href="#">{t("footer.contact")}</a>
          <a className="hover:text-foreground transition" href="#">{t("footer.docs")}</a>
        </div>
      </div>
    </footer>
  );
}
