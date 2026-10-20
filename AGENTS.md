<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep all Premium offer settings, prices, feature eligibility, and billing copy in `src/lib/paywall-config.ts`; shared derivation prevents inconsistent purchase claims.
- Premium screens are an in-phone simulated flow on the index route, with reusable controls and a separate mock map module; no real purchases, notification registrations or rental submissions occur.
- Map filters are React state cleared on loss of Premium access; free search and pin details never pass through a purchase gate.

- Derive paywall and active checklist groups from one feature catalogue and configured ordering; status and plan eligibility must stay consistent across screens.
