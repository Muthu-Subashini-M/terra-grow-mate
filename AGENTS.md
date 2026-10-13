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

## Application architecture
- Keep preliminary soil recommendation logic in a pure browser-safe module with unit tests, separate from the dashboard presentation, so recommendations remain independently verifiable.
- Keep this single-workspace application at the index route; use global semantic CSS tokens and shared UI controls for consistent presentation.
- Treat soil outputs as preliminary screening, not laboratory measurements or fertilizer prescriptions, because these four inputs cannot establish agronomic certainty.
