# Security

## Review, November 2026

The bot ran BEST::CTF 2024 registration. Before linking it from my CV I reviewed it for secrets in the code and history and for who can reach admin functions. The review was AI-assisted (Claude Code); findings were checked against the code.

### Fixed

| Area | Problem | Fix |
|---|---|---|
| Admin access | The admin panel opened on a "secret" command that is visible in this public repository | `/admin` works only for chat ids in `ADMIN_CHAT_IDS` |
| Broadcast | "Send to all" took the next message from any chat, so another user's text could go to every participant | Only the admin who started the broadcast can supply the text |

No secrets were found in the code or history.
