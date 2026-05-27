# LeadTrackBack

An embeddable lead capture widget — chat, callback, and contact form. Plug into any website with one script tag.

## Embed

```html
<script src="https://leadtrackback.vercel.app/widget/leadwidget.js"
  data-company="Your Company"
  data-color="#FF6B35"></script>
```

That's it. The widget renders a floating button in the bottom-right corner. Clicking it opens a panel with three tabs:

- **Chatt** — Scripted AI assistant (designed for Claude API integration later)
- **Ring** — Callback request: visitor leaves their number, you get notified and call them back
- **Formulär** — Contact form with name, email, phone, and message

## Configuration

All configuration is done via `data-` attributes on the script tag.

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-company` | `"Purasu"` | Company name shown in the widget header |
| `data-color` | `"#FF6B35"` | Brand color (hex) used for buttons, accents, and FAB |
| `data-greeting` | `"Hej! Hur kan vi hjälpa dig?"` | First message shown in the chat |
| `data-position` | `"right"` | Either `"right"` or `"left"` |
| `data-lang` | `"sv"` | `"sv"` for Swedish or `"en"` for English |
| `data-api` | (auto) | Override the backend API base URL |

## How leads are captured

When a visitor submits a callback or form:

1. **HubSpot** — A contact is created (or updated if email/phone matches an existing one) with `lead_source: "Callback Widget"` or `lead_source: "Contact Form Widget"`
2. **Email notification** — A summary email is sent to your configured address via Resend, with a "Ring tillbaka" CTA linking to `tel:` for callback leads
3. **Server log** — Each request is also logged to Vercel function logs for debugging

## API Endpoints

All endpoints are CORS-enabled and accept JSON.

- `POST /api/widget/chat` — `{ message }` → `{ reply }`
- `POST /api/widget/callback` — `{ name, phone, pageUrl, pageTitle }` → creates HubSpot contact + sends email
- `POST /api/widget/lead` — `{ name, email, phone, message, pageUrl, pageTitle }` → creates HubSpot contact + sends email

## Environment Variables

Set these in Vercel → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `HUBSPOT_PRIVATE_APP_TOKEN` | Yes (for HubSpot sync) | Private app token from HubSpot → Settings → Integrations → Private Apps |
| `RESEND_API_KEY` | Yes (for email) | API key from [resend.com](https://resend.com) |
| `NOTIFY_EMAIL` | No | Where to send lead emails (defaults to `nils@purasu.se`) |
| `WIDGET_ALLOWED_ORIGINS` | No | Comma-separated list of allowed origins. Default: `*` (all) |

SMS notifications use Twilio. The default Twilio trial account works for testing — you'll just need to verify your own phone number first. For production, buy a Swedish phone number from Twilio (around $1/month + ~$0.05 per SMS) or set up an alphanumeric Sender ID if you only need outbound SMS.

| Variable | Required | Description |
|----------|----------|-------------|
| `TWILIO_ACCOUNT_SID` | For SMS | Twilio Account SID from https://console.twilio.com |
| `TWILIO_AUTH_TOKEN` | For SMS | Twilio Auth Token from the same dashboard |
| `TWILIO_FROM` | For SMS | Twilio phone number to send from (E.164 like `+46xxxxxxxxxx`) or alphanumeric Sender ID (e.g. `LeadTrack`) |
| `NOTIFY_PHONE` | For SMS | Your phone number to receive callback alerts (E.164 format, e.g. `+46701234567`) |

## HubSpot CMS Embed

The widget works on HubSpot CMS sites. Either:

1. Paste the script tag into your template footer just before `{{ standard_footer_includes }}`, or
2. Use the ready-made custom module at `/widget/hubspot-module.html` which exposes `module.company_name`, `module.brand_color`, and `module.greeting_text` as HubSpot fields

If your HubSpot portal enforces a Content Security Policy, whitelist `leadtrackback.vercel.app` in `script-src`.

## Deploy to Vercel

```bash
npm install
vercel --prod
```

Connect your HubSpot and Resend credentials via Vercel environment variables, and you're done.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/widget/test.html](http://localhost:3000/widget/test.html) to see the demo.

## License

MIT
