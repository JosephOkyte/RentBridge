import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';
import { PROPERTIES, CITIES } from '../../../../data/properties';

// Master System Prompt for Ada from RentBridge
const ADA_SYSTEM_PROMPT = `
You are "Ada from RentBridge", the official AI Housing Concierge & Anti-Agent Shield for RentBridge Nigeria.

### Your Identity & Personality:
- You are a sharp, warm, authoritative, and street-smart Nigerian real estate professional.
- You speak with the confidence of an experienced real estate insider who genuinely cares about protecting Nigerians from extortion and landlord/tenant headaches.
- Your language is polished, articulate English, naturally sprinkled with authentic Nigerian housing terminology and tasteful Nigerian Pidgin/broken English where it adds warmth, emphasis, or reassurance (e.g. "No shaking at all", "Make street agent no go run you street", "Zero viewing fee means zero kobo, no story").

### Nigerian Real Estate Vocabulary You Understand Intimately:
- "Self-contain", "mini-flat", "BQ" (Boys' Quarters), "serviced duplex", "terrace", "penthouse".
- "Prepaid meter", "Band A feeder", "generator hours", "inverter backup", "water treatment plant".
- "Estate service charge", "caution deposit", "agreement & legal", "total move-in package".
- "Governor's Consent", "Certificate of Occupancy (C of O)", "Deed of Assignment", "Probate Grant", "Power of Attorney".
- Lagos flood realities: Knowing elevated areas (e.g., higher Lekki phases, parts of Ikoyi) vs waterlogged zones during rainy season.
- Cities covered: Lagos, Abuja, Port Harcourt, and Enugu only.

### How You Advise the 4 Roles:
1. TENANT:
   - Guide them to verified homes with direct custodians.
   - Emphasize the ₦0 INSPECTION FEE GUARANTEE: Viewings are 100% free. Never pay gate pass fees, transport money, or registration fees.
   - Clarify total move-in cost: Annual Rent + Caution Deposit + Service Charge + strictly 0% Agent Fee.
2. LANDLORD:
   - Advise on setting realistic, competitive annual rent without adding 10% agent inflation.
   - Explain how RentBridge brings vetted tenants directly without middleman delays.
3. RESIDENT CARETAKER:
   - Guide them on compound gate access, issuing automated Gate Pass Codes (RB-XXXX), and alerting estate security.
4. LEGAL COUNSEL / LAWYER:
   - Discuss title deed audits, Phase 1 compliance, Certified True Copies (CTC), and proof of legal custody.

### 🚨 Anti-Extortion Sentinel Trigger:
- If a user mentions someone asking for inspection money, gate pass fee, fuel money, or bank transfer before viewing, IMMEDIATELY switch to protective guardian mode:
  "⛔ HOLD IT RIGHT THERE! DO NOT SEND ANY MONEY! Na pure scam be that. Physical inspections on RentBridge are 100% FREE (₦0.00). Report them immediately to our Citadel Anti-Fraud Desk so we can freeze their listing!"

### Grounding Rule:
- ONLY recommend real properties located in Lagos, Abuja, Port Harcourt, or Enugu that exist in RentBridge inventory.
- Always quote exact amounts and remind users of the ₦0 agent commission.
`;

/**
 * Fetch all verified active properties from Supabase + local catalog
 */
async function getInventory() {
  let combined = [...PROPERTIES];
  try {
    const adminClient = createAdminClient();
    const { data: dbProps } = await adminClient
      .from('properties')
      .select('*')
      .eq('status', 'active');

    if (dbProps && dbProps.length > 0) {
      const formatted = dbProps.map((p) => ({
        id: p.id,
        title: p.title,
        type: p.category || 'residential',
        propertyKind: p.property_kind || p.propertyKind || 'Vacant Unit',
        city: (p.city || '').toLowerCase(),
        cityName: p.city || 'Nigeria',
        neighborhood: p.neighborhood || p.address,
        address: p.address,
        priceYearly: p.annual_rent || p.priceYearly,
        cautionDeposit: p.caution_deposit || 0,
        serviceCharge: p.service_charge || 0,
        agentFee: 0,
        bedrooms: p.bedrooms || 3,
        bathrooms: p.bathrooms || 3,
        image: p.image_url || '/images/hero-lagos-duplex.jpg',
        lister: {
          type: p.lister_role || 'landlord',
          name: p.lister_name || 'Verified Custodian',
          phone: p.lister_phone || '',
          whatsapp: (p.lister_phone || '').replace(/[^\d]/g, ''),
        },
        description: p.description || '',
      }));
      combined = [...formatted, ...combined];
    }
  } catch (err) {
    console.warn('[Ada Knowledge Engine] Using catalog properties fallback:', err.message);
  }
  return combined;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages = [], userRole = 'tenant', sessionId: clientSessionId } = body;
    const latestUserMsg = messages[messages.length - 1]?.content || '';
    const sessionId = clientSessionId || `rb-session-${Date.now()}`;

    // 1. CONNECT TO LIVE N8N ADA CHAT WEBHOOK
    const n8nWebhookUrl = process.env.N8N_ADA_CHAT_WEBHOOK_URL || 'https://prime-tech-hub.duckdns.org/webhook/d3f23217-8418-4818-8f4f-78b5e96eccf1/chat';
    if (n8nWebhookUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45-second timeout for multi-turn AI reasoning

        const n8nRes = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Instance-Id': '4d4454ab1a160976f8a649b7bc30ef8de30092b186cddb5439635bf4e49a2f27',
          },
          body: JSON.stringify({
            action: 'sendMessage',
            sessionId: sessionId,
            chatInput: latestUserMsg,
            metadata: {
              role: userRole,
            },
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (n8nRes.ok) {
          const n8nData = await n8nRes.json();
          const replyText = n8nData.output || n8nData.text || n8nData.reply || (typeof n8nData === 'string' ? n8nData : null);

          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              source: 'n8n-live-webhook',
            });
          }
        } else {
          console.warn('[Ada n8n Webhook Error]: status', n8nRes.status);
        }
      } catch (n8nErr) {
        console.warn('[Ada n8n Webhook Warning]:', n8nErr.message);
      }
    }

    // 2. CHECK IF GEMINI API KEY IS CONFIGURED (CONVERSATIONAL AI FALLBACK)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const inventory = await getInventory();
        const inventoryContext = inventory.map((p) => 
          `ID: ${p.id} | ${p.title} in ${p.neighborhood}, ${p.cityName} | Rent: ₦${p.priceYearly?.toLocaleString()} | Caution: ₦${p.cautionDeposit?.toLocaleString()} | Service: ₦${p.serviceCharge?.toLocaleString()} | Agent Fee: ₦0 | Custodian: ${p.lister?.name} (${p.lister?.type}) | Features: ${p.features?.join(', ')}`
        ).join('\n');

        const geminiMessages = [
          {
            role: 'user',
            parts: [{ text: `${ADA_SYSTEM_PROMPT}\n\nCURRENT VERIFIED RENTBRIDGE INVENTORY:\n${inventoryContext}\n\nUSER'S CURRENT ROLE: ${userRole}` }]
          },
          {
            role: 'model',
            parts: [{ text: "Understood! I am Ada from RentBridge. I'm ready to guide, advise, and protect users with street-smart Nigerian insight, legal clarity, and strict zero-agent rules." }]
          },
          ...messages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }))
        ];

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: geminiMessages,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            }
          }),
        });

        const geminiData = await geminiRes.json();
        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText) {
          return NextResponse.json({
            reply: generatedText,
            source: 'gemini-conversational',
          });
        }
      } catch (geminiErr) {
        console.warn('[Ada Gemini Call Warning]:', geminiErr.message);
      }
    }

    // 3. RESPONSIVE CONVERSATIONAL FALLBACK (NEVER RETURN HARDCODED MARKETING BLOCKS)
    return NextResponse.json({
      reply: "I'm right here with you! I experienced a momentary network delay reaching the knowledge engine. Could you please send that again or let me know what kind of apartment you are looking for in Lagos, Abuja, or Port Harcourt?",
      source: 'conversational-fallback',
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

