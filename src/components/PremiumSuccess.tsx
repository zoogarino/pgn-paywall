import { useState } from "react";
import { ChevronDown, Clock, Leaf, X } from "lucide-react";
import { Action, PremiumStar, Primary, Restore, Toggle } from "@/components/PremiumUI";
import { COPY, NOTIFICATION_FEATURES, SUCCESS_COPY, TRIP_PASS_PLANNED_NOTE, successContinuation, successDetails, successPlanned, type NotificationState, type SuccessPurchase } from "@/lib/paywall-config";

export function PremiumSuccess({ purchase, notified, onNotify, onClose, onContinue, onManage }: {
  purchase: SuccessPurchase; notified: NotificationState;
  onNotify: (key: keyof NotificationState, on: boolean) => void;
  onClose: () => void; onContinue: () => void; onManage: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const details = successDetails(purchase);
  const planned = successPlanned(purchase);
  return <section aria-label={details.headline} className="flex h-full min-h-0 flex-col text-pgn-dark">
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-4">
      {/* After a purchase there is no "back" to the paywall. */}
      <Action aria-label={SUCCESS_COPY.close} onClick={onClose} className="h-11 w-11 rounded-full bg-pgn-dark p-0 text-on-dark"><X /></Action>
      <div className="mt-3 flex flex-col items-center text-center">
        <div className="success-celebration rounded-full"><PremiumStar large /></div>
        <h1 className="mt-4 text-2xl leading-tight text-terracotta">{details.headline}</h1>
        <p className="mt-2 text-sm leading-snug text-pgn-dark">{details.thanks}</p>
      </div>
      <section aria-label={SUCCESS_COPY.yourPlan} className="mt-5 rounded-lg border border-warm-border bg-on-dark p-4">
        <h2 className="text-sm text-warm-brown">{SUCCESS_COPY.yourPlan}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2"><p className="font-display text-lg font-bold leading-tight">{details.name}</p>{details.badge && <span className="rounded bg-gold-gradient px-2 py-1 text-[11px]">{details.badge}</span>}</div>
        <p className="mt-3 text-base leading-snug">{details.billing}</p>
        {details.tip && <p className="mt-3 text-sm leading-snug">{details.tip}</p>}
        {purchase.plan !== "trip_pass" && <Action onClick={onManage} className="mt-1 min-h-11 px-0 text-sm text-link underline">{COPY.manageRenewal}</Action>}
      </section>
      {planned.length > 0 && <div className="mt-4 border-y border-warm-border">
        <Action aria-expanded={expanded} aria-controls="success-planned" onClick={() => setExpanded(!expanded)} className="min-h-11 w-full justify-between px-0 text-sm text-warm-brown">{SUCCESS_COPY.planned}<ChevronDown className={`h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} /></Action>
        {expanded && <><ul id="success-planned" className="space-y-4 pb-4">{planned.map(feature => {
          const notification = NOTIFICATION_FEATURES.find(item => item.feature === feature.id);
          if (!notification) return null;
          return <li key={feature.id} className="flex items-start gap-2 text-pgn-muted">
            <Clock className="mt-1 h-5 w-5 shrink-0 text-warm-brown" />
            <div className="min-w-0 flex-1"><p className="text-sm">{feature.name}{feature.tag && <span className="ml-2 inline-block rounded bg-sand px-1.5 py-0.5 text-[10px] text-warm-brown">{feature.tag}</span>}</p><p className="mt-1 text-xs leading-snug">{feature.desc}</p>
              <div className="mt-2 flex items-center justify-between gap-2"><span className="text-xs">{notified[notification.key] ? COPY.notified : COPY.notify}</span>
                {/* Emergency Assistance now has a Notify me toggle here; confirm with the team. */}
                <Toggle label={SUCCESS_COPY.notifyLabel(feature.name)} on={notified[notification.key]} onChange={on => onNotify(notification.key, on)} />
              </div>
            </div>
          </li>;
        })}</ul>{purchase.plan === "trip_pass" && <p className="pb-4 text-xs text-pgn-muted">{TRIP_PASS_PLANNED_NOTE}</p>}</>}
      </div>}
      <div className="mt-4 flex items-start gap-2"><Leaf className="mt-0.5 h-4 w-4 shrink-0 text-warm-brown" /><p className="text-xs leading-relaxed text-pgn-muted">{COPY.conservation}</p></div>
    </div>
    <footer className="shrink-0 border-t border-warm-border bg-parchment px-4 pb-2 pt-3"><Primary onClick={onContinue}>{successContinuation(purchase).label}</Primary><div className="text-center"><Restore /></div></footer>
  </section>;
}