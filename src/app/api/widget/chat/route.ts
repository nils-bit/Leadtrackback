import { optionsResponse, jsonResponse } from "../cors";

// TODO: This file is structured so the scripted RESPONSES array can later be
// swapped for a real Claude API call inside the POST handler below. The
// `generateReply()` helper isolates matching logic — replace its body with an
// `anthropic.messages.create({...})` call (passing `message` plus page context)
// when moving from scripted replies to AI-powered responses.

type ScriptedResponse = { pattern: RegExp; reply: string };

// Patterns are matched against a lowercased, trimmed input. Order matters:
// the most specific patterns come first, generic catch-alls come last. When
// several patterns match, we pick the longest/most specific one (see
// `generateReply` below) — but ordering still acts as a tiebreaker.
const RESPONSES: ScriptedResponse[] = [
  // --- Pricing ---------------------------------------------------------------
  {
    pattern: /fri offert|gratis offert|free quote|kostnadsfri/,
    reply:
      "Ja, vi tar fram en kostnadsfri offert! Lämna dina kontaktuppgifter i formuläret så hör vi av oss inom kort.",
  },
  {
    pattern: /är det dyrt|för dyrt|är ni dyra|expensive/,
    reply:
      "Vi anpassar omfattningen efter din budget — det finns alltid en variant som passar. Lämna dina uppgifter i formuläret så pratar vi om upplägg.",
  },
  {
    pattern: /gratis|free trial|kostar inget/,
    reply:
      "Första samtalet är alltid gratis. Klicka på Ring-fliken så bokar vi in en kort kostnadsfri genomgång!",
  },
  {
    pattern: /offert|prislapp|hur mycket kostar|vad kostar|kostnad|pris|hur mycket/,
    reply:
      "Priset beror på projektets omfattning. Lämna dina uppgifter i formuläret så återkommer vi med en skräddarsydd offert.",
  },

  // --- Demo / try it ---------------------------------------------------------
  {
    pattern: /boka demo|book a demo|see it work|hands.?on|demo|prova på|testa|try it|prova/,
    reply:
      "Gärna! Vi visar verktyget live i ett 20-minuters möte. Klicka på Ring-fliken eller lämna dina uppgifter i formuläret så bokar vi in en demo.",
  },

  // --- Booking a meeting -----------------------------------------------------
  {
    pattern: /boka möte|schedule a call|book a call|calendly|möte|träffas|meeting/,
    reply:
      "Absolut, vi tar gärna ett möte! Lämna dina uppgifter i formuläret så skickar vi en kalenderlänk, eller använd Ring-fliken så ringer vi upp.",
  },

  // --- Integrations ----------------------------------------------------------
  {
    pattern: /hubspot/,
    reply:
      "Ja, HubSpot är vår specialitet — implementation, migrering och optimering. Vill du att vi visar hur det skulle fungera hos er?",
  },
  {
    pattern: /salesforce/,
    reply:
      "Vi integrerar gärna mot Salesforce, inklusive synk mot HubSpot eller andra system. Lämna dina uppgifter så går vi igenom upplägget.",
  },
  {
    pattern: /pipedrive/,
    reply:
      "Ja, vi jobbar med Pipedrive — både rena implementationer och migreringar till andra CRM. Lämna dina kontaktuppgifter i formuläret så hör vi av oss.",
  },
  {
    pattern: /slack/,
    reply:
      "Vi kopplar gärna in Slack-notiser från CRM, formulär eller pipelines. Hör av dig via formuläret så skissar vi på en lösning.",
  },
  {
    pattern: /integration|integrationer|integration with/,
    reply:
      "Vi integrerar mot de flesta CRM, marketing- och dataplattformar. Berätta vilket system i formuläret så återkommer vi med ett förslag.",
  },

  // --- Hours & availability --------------------------------------------------
  {
    pattern: /jobbar ni helger|öppet på helger|weekends|helger/,
    reply:
      "Vi svarar främst på vardagar, men brådskande ärenden hanteras även på helger. Lämna dina uppgifter så hör vi av oss snarast.",
  },
  {
    pattern: /öppettider|när är ni öppna|vardagar|opening hours/,
    reply:
      "Vi har öppet vardagar 08–17. Lämna ett meddelande utanför kontorstid så återkommer vi första vardagen.",
  },

  // --- Location --------------------------------------------------------------
  {
    pattern: /göteborg|gothenburg/,
    reply:
      "Vi finns i Göteborg och tar gärna ett fysiskt möte. Lämna dina uppgifter i formuläret så bokar vi in en träff!",
  },
  {
    pattern: /stockholm/,
    reply:
      "Vi har kunder i Stockholm och kan ses både digitalt och på plats. Hör av dig via formuläret så bokar vi in ett möte.",
  },
  {
    pattern: /malmö|malmo/,
    reply:
      "Vi jobbar med kunder i Malmö och hela Skåne. Lämna dina uppgifter i formuläret så återkommer vi.",
  },
  {
    pattern: /var finns ni|var sitter ni|var ligger|kontor|adress|location|sweden|sverige/,
    reply:
      "Vi sitter i Sverige och jobbar med kunder i hela Norden, både på plats och digitalt. Vill du att vi ringer upp?",
  },

  // --- Response time / turnaround --------------------------------------------
  {
    pattern: /hur snabbt|when do you reply|response time|turnaround|leveranstid|hur lång tid/,
    reply:
      "Vi svarar normalt inom någon timme på vardagar. Lämna dina kontaktuppgifter i formuläret så hör vi av oss direkt.",
  },

  // --- Languages -------------------------------------------------------------
  {
    pattern: /do you speak|engelska|english|language|språk/,
    reply:
      "Ja, vi pratar både svenska och engelska. Skriv på det språk du föredrar så svarar vi på samma!",
  },
  {
    pattern: /svenska/,
    reply: "Ja, vi pratar svenska — fortsätt gärna här i chatten!",
  },

  // --- Privacy / GDPR --------------------------------------------------------
  {
    pattern: /gdpr|privacy|integritet|persondata|säker|secure|säkerhet/,
    reply:
      "Vi följer GDPR och hanterar all kunddata med tydliga avtal och kryptering. Vill du veta mer? Lämna dina uppgifter i formuläret så skickar vi vår policy.",
  },

  // --- Refund / cancel -------------------------------------------------------
  {
    pattern: /säga upp|säg upp|refund|cancel|avsluta avtal|pengar tillbaka/,
    reply:
      "Vi har inga bindningstider — du kan avsluta när du vill. Lämna dina uppgifter i formuläret så reder vi ut det snabbt.",
  },

  // --- Support / help --------------------------------------------------------
  {
    pattern: /fungerar inte|doesn'?t work|broken|fel|issue|bug|problem/,
    reply:
      "Tråkigt att höra! Beskriv gärna problemet i formuläret med dina kontaktuppgifter — så hör en av oss av sig direkt.",
  },
  {
    pattern: /support|hjälp|help/,
    reply:
      "Absolut! Ställ din fråga här, ring oss via Ring-fliken eller lämna ett meddelande i formuläret så återkommer vi.",
  },

  // --- About company / team --------------------------------------------------
  {
    pattern: /grundare|founders|vd|ceo/,
    reply:
      "Vi är ett litet team av grundare och konsulter med lång erfarenhet av HubSpot och digital försäljning. Vill du veta mer? Lämna dina uppgifter i formuläret.",
  },
  {
    pattern: /vilka är ni|who are you|om oss|about us|about|team/,
    reply:
      "Vi är ett konsultteam som hjälper B2B-företag med CRM, hemsida och digital försäljning. Lämna dina uppgifter i formuläret så berättar vi mer!",
  },

  // --- Services / what we do -------------------------------------------------
  {
    pattern: /vad gör ni|vad erbjuder ni|tjänster|services|what do you do|what can you do|expertise|expertis/,
    reply:
      "Vi hjälper B2B-företag med HubSpot, hemsidor, integrationer och digital försäljning. Vill du höra mer? Lämna dina uppgifter eller klicka på Ring.",
  },
  {
    pattern: /hemsida|website|sajt|webbplats|crm/,
    reply:
      "Vi bygger hemsidor och sätter upp CRM som faktiskt levererar leads. Vill du veta hur vi skulle jobba med just er?",
  },

  // --- Phone / callback ------------------------------------------------------
  {
    pattern: /ring upp|ring mig|callback|call me|ringa|telefon/,
    reply:
      "Klicka på Ring-fliken nedan och lämna ditt telefonnummer — vi ringer upp inom kort!",
  },

  // --- Small talk: how are you ----------------------------------------------
  {
    pattern: /hur är läget|hur går det|hur mår du|how are you|how's it going/,
    reply: "Tack, bra! Hur kan jag hjälpa dig idag?",
  },

  // --- Yes / positive --------------------------------------------------------
  {
    pattern: /^(ja|japp|jepp|jajemen|yes|yep|yeah|exakt|perfekt|perfect|absolut)\b/,
    reply:
      "Toppen! Lämna dina kontaktuppgifter i formuläret eller klicka på Ring så hör vi av oss direkt.",
  },

  // --- No / negative ---------------------------------------------------------
  {
    pattern: /^(nej tack|nej|nope|no thanks|no)\b/,
    reply:
      "Inga problem! Du är välkommen tillbaka när som helst — eller lämna dina uppgifter i formuläret om du ändrar dig.",
  },

  // --- Goodbye ---------------------------------------------------------------
  {
    pattern: /hej då|hejdå|vi hörs|vi ses|see you|bye|farväl|ha det bra/,
    reply: "Tack för att du hörde av dig — ha det fint! Vi finns här när du behöver oss.",
  },

  // --- Thank you -------------------------------------------------------------
  {
    pattern: /tack så mycket|tusen tack|thanks a lot|thank you so much|cheers|tack|thanks|thank you/,
    reply: "Tack själv! Hör gärna av dig igen om du har fler frågor.",
  },

  // --- Greetings -------------------------------------------------------------
  {
    pattern: /god morgon|god kväll|good morning|good evening/,
    reply: "Hej och välkommen! Vad kan jag hjälpa dig med?",
  },
  {
    pattern: /hej|hallå|tjena|tja|tjenare|yo|hi|hello|hey/,
    reply: "Hej! Vad kan jag hjälpa dig med idag?",
  },
];

const DEFAULT_REPLY =
  "Jag är en enkel assistent och förstod inte just den frågan. Det enklaste är att lämna dina kontaktuppgifter i formuläret eller klicka på Ring för callback — då hör en människa av sig direkt!";

function generateReply(rawMessage: string): string {
  const message = rawMessage.toLowerCase().trim();

  // Collect all matches, then prefer the most specific (longest pattern source).
  // If only one matches we still get correct behaviour; ties resolve by order.
  let best: { reply: string; specificity: number } | null = null;

  for (const { pattern, reply } of RESPONSES) {
    if (pattern.test(message)) {
      const specificity = pattern.source.length;
      if (!best || specificity > best.specificity) {
        best = { reply, specificity };
      }
    }
  }

  return best ? best.reply : DEFAULT_REPLY;
}

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return jsonResponse({ error: "message required" }, request, 400);
    }

    // TODO: Replace `generateReply` with a Claude API call for AI-powered
    // responses, e.g.:
    //   const reply = await generateAIResponse(message, pageContext);
    const reply = generateReply(message);

    return jsonResponse({ reply }, request);
  } catch {
    return jsonResponse({ error: "invalid request" }, request, 400);
  }
}
