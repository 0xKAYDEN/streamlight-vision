import { Zap, Github, Twitter, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-white/5 relative overflow-hidden">
      <div className="bg-gradient-hero absolute inset-x-0 -top-24 h-48 opacity-40 -z-10" />
      <div className="px-4 md:px-8 pt-12 pb-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center size-7 rounded-md bg-gradient-brand shadow-glow">
              <Zap className="size-4 text-white fill-white" />
            </span>
            <span className="text-foreground font-semibold tracking-tight">
              Thunder<span className="text-gradient-brand">Stream</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">{t("footer.tag")}</p>
          <div className="mt-4 flex gap-2">
            <SocialBtn href="#" label="Twitter"><Twitter className="size-3.5" /></SocialBtn>
            <SocialBtn href="#" label="GitHub"><Github className="size-3.5" /></SocialBtn>
            <SocialBtn href="#" label="Telegram"><Send className="size-3.5" /></SocialBtn>
          </div>
        </div>
        <FooterCol heading="Product" items={[
          { label: t("footer.pricing"), href: "#" },
          { label: t("footer.changelog"), href: "#" },
          { label: t("footer.docs"), href: "#" },
        ]} />
        <FooterCol heading="Company" items={[
          { label: t("footer.contact"), href: "#" },
          { label: "Brand", href: "#" },
          { label: "Careers", href: "#" },
        ]} />
        <FooterCol heading="Legal" items={[
          { label: "Terms", href: "#" },
          { label: "Privacy", href: "#" },
          { label: "DMCA", href: "#" },
        ]} />
      </div>
      <div className="border-t border-white/5 px-4 md:px-8 py-5 text-xs text-muted-foreground flex flex-col md:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} ThunderStream. All rights reserved.</span>
        <span>Built with electric violet ⚡</span>
      </div>
    </footer>
  );
}

function FooterCol({ heading, items }: { heading: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3">{heading}</div>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.label}>
            <a href={it.href} className="text-muted-foreground hover:text-foreground transition">{it.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="size-8 grid place-items-center rounded-md glass hover:bg-white/10 hover:text-foreground text-muted-foreground transition"
    >
      {children}
    </a>
  );
}
