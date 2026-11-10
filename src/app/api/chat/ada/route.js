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
    const { messages = [], userRole = 'tenant' } = body;
    const latestUserMsg = messages[messages.length - 1]?.content || '';
    const lower = latestUserMsg.toLowerCase();

    const inventory = await getInventory();

    // 1. EXTORTION ALERT INTERCEPT
    const extortionKeywords = ['gate pass fee', 'inspection fee', 'fuel money', 'send money before', 'pay to view', 'account number for viewing', '3,000', '5,000', 'registration fee'];
    const isExtortionFlag = extortionKeywords.some((kw) => lower.includes(kw));

    if (isExtortionFlag) {
      return NextResponse.json({
        reply: `⛔ **HOLD IT RIGHT THERE! DO NOT SEND ANY MONEY!**\n\n*Na pure street agent scam be that!* On RentBridge, physical inspections are strictly **100% FREE (₦0.00)** across Lagos, Abuja, Port Harcourt, and Enugu.\n\nNo genuine landlord or verified caretaker on this platform is permitted to demand gate fees, fuel allowance, or registration money.\n\n🚨 **What you should do right now:**\n1. Do not transfer a single kobo.\n2. Go to your **[Inspections Dashboard](/dashboard/inspections)** and click the red **"Report Extortion"** button.\n3. Our Citadel Compliance Desk will immediately freeze the listing and blacklist that telephone number. Your money dey safe with you!`,
        action: 'REPORT_EXTORTION',
        properties: [],
      });
    }

    // 2. CHECK IF GEMINI API KEY IS CONFIGURED
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
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
          // Find matching properties referenced
          const matchedProps = inventory.filter((p) => 
            generatedText.toLowerCase().includes(p.title.toLowerCase()) ||
            lower.includes(p.city) ||
            lower.includes((p.neighborhood || '').toLowerCase())
          ).slice(0, 3);

          return NextResponse.json({
            reply: generatedText,
            properties: matchedProps,
          });
        }
      } catch (geminiErr) {
        console.warn('[Ada Gemini Call Warning]:', geminiErr.message);
      }
    }

    // 3. INTELLIGENT LOCAL NIGERIAN REAL ESTATE ENGINE (FALLBACK / LOCAL DEV)
    // A. City / Neighborhood Search Intent
    let matchedProps = [];
    let replyText = '';

    if (lower.includes('lekki') || lower.includes('ikoyi') || lower.includes('lagos')) {
      matchedProps = inventory.filter((p) => p.city === 'lagos').slice(0, 3);
      replyText = `**Lagos Housing Advisory with Ada:**\n\nLooking for a home on the Island or Mainland? Here are genuine, 100% verified listings from direct property owners in Lagos. No street agents, and zero flood surprises:\n\n* **Lekki Phase 1 / Admiralty Way:** We strictly vet compound road access and drainage so you don't face waterlogged compounds in July.\n* **Ikoyi Waterfront:** High-end, 24/7 serviced security and steady power.\n\nCheck out these verified options below with **₦0 agent commission** guaranteed. Click any card to book a 100% free physical inspection!`;
    } else if (lower.includes('abuja') || lower.includes('wuse') || lower.includes('gwarinpa') || lower.includes('maitama')) {
      matchedProps = inventory.filter((p) => p.city === 'abuja').slice(0, 3);
      replyText = `**Abuja Real Estate Advisory with Ada:**\n\nAbuja rental space moves fast, especially around Wuse 2, Maitama, and Gwarinpa. The big advantage on RentBridge? **You deal direct with owners or retained SAN legal custodians** — nobody is adding 10% agent commission or 10% legal fee on top of your rent.\n\nHere are direct Abuja options ready for free physical viewing:`;
    } else if (lower.includes('port harcourt') || lower.includes('ph') || lower.includes('gra')) {
      matchedProps = inventory.filter((p) => p.city === 'ph').slice(0, 3);
      replyText = `**Port Harcourt Direct Housing with Ada:**\n\nLooking for a secure spot in PH (Old GRA, GRA Phase 2, or Peter Odili)? On RentBridge, all Port Harcourt listings feature confirmed perimeter walls, compound gates, and direct contact with verified landlords.\n\nHere are verified PH listings ready for ₦0 viewing fee inspections:`;
    } else if (lower.includes('enugu') || lower.includes('independence layout')) {
      matchedProps = inventory.filter((p) => p.city === 'enugu').slice(0, 3);
      replyText = `**Enugu Real Estate with Ada:**\n\n*Nno nu!* Looking around Independence Layout or New Haven? Our Enugu listings are verified directly with property owners and authorized estate lawyers with zero middleman interference.\n\nHere are available listings in Enugu:`;
    } else if (lower.includes('how does') || lower.includes('inspection') || lower.includes('viewing') || lower.includes('gate pass')) {
      replyText = `**How Physical Inspections & Gate Passes Work on RentBridge:**\n\n1. **Browse & Pick a Slot:** Find any verified house in Lagos, Abuja, PH, or Enugu and select your preferred viewing day.\n2. **Direct Custodian Handshake:** The verified owner, caretaker, or lawyer confirms your appointment.\n3. **Official Gate Pass Code:** You instantly receive an official pass code (e.g. \`RB-8492\`) on your dashboard, WhatsApp, and email.\n4. **₦0 Viewing Fee Guaranteed:** Show your pass at the compound gate and inspect the house for free. If anybody asks for transport money or gate fees, report them immediately and we freeze their account!\n\nWould you like me to find properties in your preferred city?`;
    } else if (lower.includes('list') || lower.includes('landlord') || lower.includes('owner') || lower.includes('caretaker')) {
      replyText = `**Listing on RentBridge (Direct Landlords, Caretakers & Legal Counsel):**\n\n*Welcome, Chief!* Listing on RentBridge is 100% direct with 0% platform commission taken from your rent.\n\n**Phase 1 Verification Protocol:**\n* Upload **12+ photos** (residential) or **17+ photos** (commercial) showing the tarred access road, compound gate, and interior walkthrough.\n* Submit your proof of custody (Governor's Consent, C of O, or Retained Legal Custody deed).\n* Once verified by our compliance officer, your property goes live with the **Verified Custodian Badge**.\n\nReady to list? Click **[List Property](/dashboard/properties/new)** to start your draft!`;
    } else if (lower.includes('lawyer') || lower.includes('c of o') || lower.includes('deed') || lower.includes('title')) {
      replyText = `**Title Verification & Legal Custody Protocol:**\n\nRentBridge works closely with retained legal counsel and estate administrators. For legal custodians, we verify:\n\n* Certified True Copy (CTC) of Certificate of Occupancy or Registered Deed of Assignment\n* Registered Power of Attorney or Letters of Administration\n* Supreme Court Enrollment Number (SCN) or NBA Practicing Bar Seal\n\nThis guarantees prospective tenants that title custody is clean, litigation-free, and directly authorized.`;
    } else {
      matchedProps = inventory.slice(0, 2);
      replyText = `Hello! I'm **Ada from RentBridge** — your personal real estate concierge and anti-agent guide.\n\nWhether you are a **Tenant** looking for a clean, flood-free home with ₦0 viewing fees, or a **Landlord / Caretaker / Lawyer** looking to list directly without roadside agent inflation, I dey here for you!\n\nAsk me anything about:\n* Neighborhood rental costs (Lagos, Abuja, PH, Enugu)\n* Finding flood-free houses with 24/7 power\n* How our official compound Gate Pass works\n* Phase 1 title & photo verification\n\nHow can I help you today?`;
    }

    return NextResponse.json({
      reply: replyText,
      properties: matchedProps,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

