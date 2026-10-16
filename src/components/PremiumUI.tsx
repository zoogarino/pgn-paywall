import { useEffect, type ReactNode } from "react";
import { Check, ArrowLeft, X, Star } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { COPY, features, alertsTag, type PlanId, type OfferSettings, type PremiumAccent } from "@/lib/paywall-config";
import { toast } from "sonner";
export function Action({ className = "", ...props }: ButtonProps) {
  return <Button variant="ghost" className={`h-auto whitespace-normal hover:bg-transparent hover:text-inherit ${className}`} {...props} />;
}
export function Primary(props: ButtonProps) { return <Action {...props} className={`btn-cta w-full ${props.className ?? ""}`} />; }
export function Back({ onBack, title }: { onBack: () => void; title: string }) {
  return <div className="flex items-center gap-3"><Action aria-label="Back to menu" onClick={onBack} className="h-11 w-11 shrink-0 rounded-full bg-pgn-dark p-0 text-on-dark"><ArrowLeft /></Action><h1 className="text-[22px] leading-tight text-terracotta">{title}</h1></div>;
}
export function PremiumStar({ accent, large = false }: { accent: PremiumAccent; large?: boolean }) {
  return <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-full ${large ? "h-20 w-20" : "h-8 w-8"} ${accent === "gold" ? "bg-gold-gradient" : "bg-terracotta"}`}><Star className={`${large ? "h-10 w-10" : "h-4 w-4"} fill-on-dark text-on-dark`} /></span>;
}
export function Checklist({ plan, settings, extras = [], dark = false }: { plan: PlanId; settings: OfferSettings; extras?: string[]; dark?: boolean }) {
  return <ul className="mt-4 space-y-2.5 text-sm">{[...features(plan, settings), ...extras].map(item => <li key={item} className="flex items-start gap-2"><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${dark ? "bg-on-dark/20 text-on-dark" : "bg-terracotta text-on-dark"}`}><Check className="h-3 w-3" /></span><span className="min-w-0">{item}{item.startsWith("Live location alerts") && alertsTag(settings.alerts) && <span className="ml-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] text-warm-brown bg-sand">{alertsTag(settings.alerts)}</span>}</span></li>)}</ul>;
}
export function Restore() { return <Action className="min-h-9 px-1 text-xs text-link underline" onClick={() => toast("No previous purchases found (simulated)")}>{COPY.restore}</Action>; }
export function PurchaseLinks() { return <div className="flex flex-wrap items-center justify-center gap-x-3"><Restore />{[COPY.terms, COPY.privacy, COPY.eula].map(label => <a className="py-2 text-xs text-link underline" href="#" key={label}>{label}</a>)}</div>; }
export function Sheet({ children, onDismiss, label, neutral = false }: { children: ReactNode; onDismiss: () => void; label: string; neutral?: boolean }) {
  useEffect(() => { const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onDismiss(); }; document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler); }, [onDismiss]);
  return <div className="absolute inset-0 z-30 flex items-end bg-pgn-dark/50" onClick={onDismiss}><section role="dialog" aria-modal="true" aria-label={label} className={`relative max-h-[90%] w-full overflow-y-auto rounded-t-2xl p-5 pb-6 ${neutral ? "bg-ctl-panel text-ctl-ink" : "bg-on-dark text-navy"}`} onClick={e => e.stopPropagation()}><Action aria-label="Dismiss sheet" className="absolute right-2 top-2 h-9 w-9 p-0 text-pgn-muted" onClick={onDismiss}><X /></Action><div className="mx-auto mb-5 h-1 w-10 rounded-full bg-warm-border" />{children}</section></div>;
}
export function Toggle({ label, on, onChange, color = "bg-terracotta" }: { label: string; on: boolean; onChange: (v: boolean) => void; color?: string }) {
  return <Action role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative h-7 w-12 shrink-0 rounded-full p-0 ${on ? color : "bg-toggle-off"}`}><span className={`absolute top-0.5 h-6 w-6 rounded-full bg-on-dark shadow-card transition-all motion-reduce:transition-none ${on ? "left-[22px]" : "left-0.5"}`} /></Action>;
}
