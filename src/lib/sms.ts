const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_FROM; // e.g. "+46123456789" or alphanumeric like "LeadTrack"
const NOTIFY_PHONE = process.env.NOTIFY_PHONE; // Phone number to receive notifications (E.164 format)

export async function sendSMS(to: string, body: string): Promise<{ ok: boolean; error?: string }> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM) {
    console.warn("[LeadWidget] Twilio not configured — skipping SMS");
    return { ok: false, error: "Twilio not configured" };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  const params = new URLSearchParams({
    From: TWILIO_FROM,
    To: to,
    Body: body,
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[LeadWidget] Twilio SMS error:", res.status, errText);
      return { ok: false, error: `Twilio ${res.status}` };
    }

    return { ok: true };
  } catch (e) {
    console.error("[LeadWidget] SMS send failed:", e);
    return { ok: false, error: String(e) };
  }
}

export async function notifyCallbackSMS(details: {
  name?: string;
  phone?: string;
  pageUrl?: string;
}) {
  if (!NOTIFY_PHONE) {
    console.warn("[LeadWidget] NOTIFY_PHONE not set — skipping SMS notification");
    return;
  }

  const name = details.name || "okänd";
  const phone = details.phone || "okänt nummer";
  const body = `Ny callback från ${name} — ${phone}. Ring tillbaka inom 30 sek.`;

  await sendSMS(NOTIFY_PHONE, body);
}
