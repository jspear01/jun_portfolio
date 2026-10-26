# Jun’s hybrid assistant

The homepage works without a build step, including file previews. Topic buttons and exact common-question matches use public facts in `chat-knowledge.js` without network requests. Other questions only use Groq when the visitor checks the AI option. Each AI question is standalone: conversation history is not sent. Responses render as text, never HTML.

## Connect the free services

1. Create a Groq account at https://console.groq.com and keep it on the Free plan. Create an API key there. Never paste it into chat, frontend code, or GitHub.
2. Create a Cloudflare account and keep Workers on the Free plan. Install Node.js if needed.
3. In this repository’s `worker` directory run `npx wrangler login` and finish Cloudflare authorization in your browser.
4. Check `wrangler.jsonc`: ALLOWED_ORIGINS must equal the portfolio’s actual origin (no path or trailing slash). The default is https://jspear01.github.io. Confirm the selected model is available on your Groq Free account; change GROQ_MODEL if needed.
5. Run `npx wrangler secret put GROQ_API_KEY` and enter your key at the private terminal prompt. Then run `npx wrangler deploy`.
6. Copy the resulting HTTPS workers.dev URL, append `/chat`, and set window.JUN_CHAT_ENDPOINT in `chat-config.js` to that public URL. There is no secret in this URL.
7. Preview and test before pushing the frontend to GitHub Pages. Test topic buttons, AI opt-in, an unfamiliar question, an unrelated question, and unavailable-service fallback. A file:// preview supports FAQs only; test AI from the allowed HTTPS origin or explicitly add a localhost origin for development (remove before deployment).

## Costs and safeguards

No database, vector store, paid fallback, or paid-plan enrollment is included. Free account status is a provider-side setting: code cannot prevent charges if you later upgrade those accounts. Keep both services on their free plans. When quotas fail, the UI keeps its instant-answer topics available.

The Worker allows five requests per IP per minute using Cloudflare’s rate-limit binding. These are approximate per-location limits, NOT a hard global daily allowance or security boundary. Origin checks restrict normal browser use but are not authentication; scripted attackers can spoof Origin. For heavier abuse add Turnstile before increasing quotas. Request sizes, question length, output length and timeouts are bounded; no automatic retries.

Only public portfolio facts are sent to Groq. Our code does not persist chats or log message bodies, but providers process requests under their own policies. Review https://console.groq.com/docs/your-data before launch. Prompt instructions reduce hallucinations, not eliminate them. Test real model answers before publishing.

Update public facts in `chat-knowledge.js`, then redeploy both the static site and Worker to keep them aligned. Run backend checks with `node --test worker/worker.test.mjs`.

References: https://console.groq.com/docs/text-chat and https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
