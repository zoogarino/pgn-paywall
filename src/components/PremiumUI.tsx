import { useEffect, type ReactNode } from "react";
import { Check, Clock, ArrowLeft, X, Star, ChevronRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { COPY, STATUS_COPY, featureDestination, type SuccessDestination, featureGroups, type FeatureItem, type PlanId, type OfferSettings } from "@/lib/paywall-config";
import { toast } from "sonner";
export function Action({ className = "", ...props }: ButtonProps) {
  return <Button variant="ghost" className={`h-auto whitespace-normal hover:bg-transparent hover:text-inherit ${className}`} {...props} />;
}
export function Primary(props: ButtonProps) { return <Action {...props} className={`btn-cta w-full ${props.className ?? ""}`} />; }
export function Back({ onBack, title }: { onBack: () => void; title: string }) {
  return <div className="flex items-center gap-3"><Action aria-label="Back to menu" onClick={onBack} className="h-11 w-11 shrink-0 rounded-full bg-pgn-dark p-0 text-on-dark"><ArrowLeft /></Action><h1 className="text-[22px] leading-tight text-terracotta">{title}</h1></div>;
}
export function PremiumStar({ large = false }: { large?: boolean }) {
  return <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-full bg-gold-gradient ${large ? "h-20 w-20" : "h-8 w-8"}`}><Star className={`${large ? "h-10 w-10" : "h-4 w-4"} fill-on-dark text-on-dark`} /></span>;
}
function Item({ item, dark, coming = false, onOpen }: { item: FeatureItem; dark: boolean; coming?: boolean; onOpen?: (d: SuccessDestination) => void }) {
  const dest = !coming && onOpen ? featureDestination(item.id) : null;
  const icon = coming ? <Clock className="mt-0.5 h-5 w-5 shrink-0 text-warm-brown" /> : <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${dark ? "bg-on-dark/20 text-on-dark" : "bg-terracotta text-on-dark"}`}><Check className="h-3 w-3" /></span>;
  const text = <span className={`min-w-0 flex-1 ${coming ? "text-pgn-muted" : ""}`}><span>{item.name}</span>{item.tag && <span className="ml-1.5 inline-block rounded bg-sand px-1.5 py-0.5 text-[10px] text-warm-brown">{item.tag}</span>}{item.desc && <span className={`block text-xs ${dark ? "text-on-dark/80" : "text-pgn-muted"}`}>{item.desc}</span>}</span>;
  if (!dest || !onOpen) return <li className="flex items-start gap-2">{icon}{text}</li>;
  return <li><button type="button" onClick={() => onOpen(dest)} className="flex min-h-11 w-full items-start gap-2 rounded-lg py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{icon}{text}<ChevronRight aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-pgn-muted" /></button>
    {item.id === "rental_discount" && <button type="button" onClick={() => onOpen("rental")} className="ml-7 min-h-11 text-sm text-link underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{STATUS_COPY.rentalLink}</button>}</li>;
}
export function Checklist({ plan, settings, extras = [], dark = false, onOpen }: { plan: PlanId; settings: OfferSettings; extras?: string[]; dark?: boolean; onOpen?: (d: SuccessDestination) => void }) {
  const groups = featureGroups(plan, settings);
  const label = `mt-4 text-[11px] uppercase tracking-wide ${dark ? "text-on-dark/80" : "text-warm-brown"}`;
  const sections = [{ items: groups.included, title: COPY.includedToday, coming: false, open: onOpen }, { items: groups.early, title: COPY.earlyAccess, coming: false, open: undefined }, { items: groups.coming, title: COPY.comingSoon, coming: true, open: undefined }];
  return <div>{sections.filter(section => section.items.length > 0).map(section => <div key={section.title}><p className={label}>{section.title}</p><ul className="mt-2 space-y-2.5 text-sm">{section.items.map(item => <Item key={item.name} item={item} dark={dark} coming={section.coming} onOpen={section.open} />)}</ul></div>)}{extras.length > 0 && <ul className="mt-4 space-y-1.5 text-sm">{extras.map(e => <li key={e}>{e}</li>)}</ul>}</div>;
}
export function Restore() { return <Action className="min-h-9 px-1 text-xs text-link underline" onClick={() => toast("No previous purchases found (simulated)")}>{COPY.restore}</Action>; }
export function PurchaseLinks() { return <div className="flex flex-wrap items-center justify-center gap-x-3"><Restore />{[COPY.terms, COPY.privacy, COPY.eula].map(label => <a className="py-2 text-xs text-link underline" href="#" key={label}>{label}</a>)}</div>; }
export function Sheet({ children, onDismiss, label, neutral = false }: { children: ReactNode; onDismiss: () => void; label: string; neutral?: boolean }) {
  useEffect(() => { const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onDismiss(); }; document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler); }, [onDismiss]);
  return <div className="absolute inset-0 z-30 flex items-end bg-pgn-dark/50" onClick={onDismiss}><section role="dialog" aria-modal="true" aria-label={label} className={`relative max-h-[90%] w-full overflow-y-auto rounded-t-2xl p-5 pb-6 ${neutral ? "bg-ctl-panel text-ctl-ink" : "bg-on-dark text-navy"}`} onClick={e => e.stopPropagation()}><Action aria-label="Dismiss sheet" className="absolute right-2 top-2 h-9 w-9 p-0 text-pgn-muted" onClick={onDismiss}><X /></Action><div className="mx-auto mb-5 h-1 w-10 rounded-full bg-warm-border" />{children}</section></div>;
}
// Shared switch: a plain button so hover/focus styles never hide the track colour or knob.
export function Toggle({ label, on, onChange, color = "bg-terracotta", disabled = false }: { label: string; on: boolean; onChange: (v: boolean) => void; color?: string; disabled?: boolean }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={disabled} onClick={() => onChange(!on)} className={`relative inline-block h-7 w-12 shrink-0 rounded-full disabled:cursor-not-allowed disabled:opacity-50 ${on ? color : "bg-toggle-off"}`}><span aria-hidden="true" className={`absolute top-0.5 block h-6 w-6 rounded-full bg-on-dark shadow-card transition-[left] motion-reduce:transition-none ${on ? "left-[22px]" : "left-0.5"}`} /></button>;
}
